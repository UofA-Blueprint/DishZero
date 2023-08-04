import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../firebase.tsx";
import { getIdToken, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { config } from "../config.ts";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  role: string;
  email: string;
};

type AuthContextValue = {
  currentUser: User | null;
  sessionToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// default values to avoid type errors
const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  sessionToken: null,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    let cookie = Cookies.get("session-token");
    return cookie ? cookie : null;
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      updateCookie();
    }
  }, []);

  async function updateCookie() {
    console.log('running update cookie')
    if (loading) {
      setLoading(false);
    }

    try {
      let response = await axios.get(`${config.serverUrl}/api/users/session`, {
        headers: {
          "x-api-key": config.apiKey,
          "session-token": sessionToken,
        },
      });

      let data = response.data.user;
      if (response && response.status === 200) {
        console.log("setting current user");
        console.log(data);
        setCurrentUser({
          id: data.id,
          role: data.role,
          email: data.email,
        });
      } else {
        console.log("no token found or something");
        logout();
      }
    } catch (error: any) {
      console.error("Failed to call authentication. e ");
      console.error(error);
      if (error.response.status === 401) {
        console.log("user unauthorised");
        logout();
      }
    }
  }

  async function login() {
    try {
      let credentials = await signInWithPopup(auth, provider);
      console.log("credentials ", credentials);
      console.log("firebase user", credentials.user);
      let idToken = await getIdToken(credentials.user);

      if (!credentials.user.email?.match("@ualberta.ca")) {
        credentials.user?.delete();
        alert("Please login with your University of Alberta CCID");
        logout()
        return
      }

      let res = await axios.post(
        `${config.serverUrl}/api/auth/login/`,
        { idToken: idToken },
        {
          headers: {
            "x-api-key": config.apiKey,
          },
        }
      );

      let data = res.data;
      console.log("data is", data);
      console.log("session is", data.session);
      setSessionToken(data.session);
      Cookies.set("session-token", data.session);
      setCurrentUser({
        ...data.user,
      });
      console.log("logged in");

      navigate("/home");
    } catch (error: any) {
      console.log(error);
      logout();
      navigate("/login");
    }
  }

  async function logout() {
    auth.signOut()
    setSessionToken(null);
    setCurrentUser(null);
    Cookies.remove("session-token");
    navigate("/login");
  }

  const value = {
    currentUser,
    sessionToken,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
