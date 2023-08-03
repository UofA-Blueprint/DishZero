import React, { createContext, useContext, useEffect, useState } from 'react'
import {auth, provider} from '../firebase.tsx'
import { getIdToken, signInWithPopup } from 'firebase/auth'
import axios from 'axios'
import { config } from '../config.ts'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'



const AuthContext = createContext<any>(null)

export function useAuth() {
        return useContext(AuthContext)
}

type User = {
    id: string,
    role: string,
    email: string
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState<User|null>(null)
    const [sessionToken, setSessionToken] = useState<string|null>(() => {
        let cookie = Cookies.get('session-token')
        return cookie ? cookie : null
    })
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        if (loading) {
            updateCookie()
        }
    }, [])

    async function updateCookie() {
        if (loading) {
            setLoading(false)
        }

        try {
            let response = await axios.get(
                `${config.serverUrl}/api/users/session`,
                {
                    headers: {
                    "x-api-key" : config.apiKey,
                    "session-token": sessionToken
                    }
                }
               )
            
            let data = response.data.user
            if (response && response.status === 200) {
                console.log('setting current user')
                console.log(data)
                setCurrentUser({
                    id: data.id,
                    role: data.role,
                    email: data.email
                })
                navigate('/home')
            } else {    
                console.log('no token found or something')
                logout()
            }
        } catch (error: any) {
            console.error('Failed to call authentication. e ');
            console.error(error);
            if (error.response.status === 401) {
                console.log('user unauthorised')
                logout()
                navigate('/login')
            }
        }

    }

    async function login() {
        try{
            let credentials = await signInWithPopup(auth, provider)
            console.log(credentials)
            console.log(credentials.user)
            let idToken = await getIdToken(credentials.user)
            
            let res = await axios.post(
              `${config.serverUrl}/api/auth/login/`,
              {idToken : idToken},
              {
                  headers: {
                    "x-api-key" : config.apiKey
                  }
              }
             )
      
            let data = res.data
            console.log('data is', data)
            console.log('session is', data.session)
            setSessionToken(data.session)
            Cookies.set('session-token', data.session)
            setCurrentUser({
                ...data.user
            })
            console.log('logged in')
            
            navigate('/home')
        } catch (error : any) {
            console.log(error)
            return null
        }
    }

    async function logout() {
        setSessionToken(null)
        setCurrentUser(null)
        Cookies.remove('session-token')
        navigate('/login')
    }

    const value = {
        currentUser,
        sessionToken,
        login,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
                {!loading && children}
        </AuthContext.Provider>
    )
}