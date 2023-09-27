import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../firebase.tsx";
import { getIdToken, signInWithPopup } from "firebase/auth";
import axios from "axios";
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
    const cookie = Cookies.get("session-token");
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
    // only run once on app start to get information about the current user
    // will run again if current user logs out
    if (currentUser !== null) {
      if (loading) {
        setLoading(false);
      }
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/users/session`,
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
          },
        }
      );

      const data = response.data.user;
      if (response && response.status === 200) {
        // if it gets here then current user should be null
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
      console.error("Failed to call authentication.");
      console.error(error);
      if (error.response.status === 401) {
        console.log("user unauthorised");
        logout();
      }
    }

    if (loading) {
      setLoading(false);
    }
  }

  async function login() {
    try {
      const credentials = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(credentials.user);

      if (!credentials.user.email?.match("@ualberta.ca")) {
        credentials.user?.delete();
        alert("Please login with your University of Alberta CCID");
        logout();
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/auth/login/`,
        { idToken: idToken },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
          },
        }
      );

      const { data } = res;
      // TODO remove later
      setSessionToken(data.session);
      Cookies.set("session-token", data.session);
      const newUser = data?.user;
      if (newUser !== currentUser) {
        setCurrentUser({
          ...data.user,
        });
      }

      navigate("/home");
    } catch (error: any) {
      console.log(error);
      logout();
      navigate("/login");
    }
  }

  async function logout() {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/api/auth/logout/`,
      {},
      {
        headers: {
          "x-api-key": `${process.env.REACT_APP_API_KEY}`,
          "session-token": sessionToken
        },
      }
    );
    auth.signOut();
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
