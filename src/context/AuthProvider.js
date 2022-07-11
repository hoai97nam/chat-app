import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { auth } from "../firebase/config";
import {Spin} from 'antd'


export const AuthContext = createContext()
export default function AuthProvider({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)


    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoURL} = user
                setUser({
                    displayName, email, uid, photoURL
                })
                setIsLoading(false)
                navigate('/')
                return;
            }
            
            setIsLoading(false)
            navigate('/login')
        })

        return () => {
            unsubscribe()
        }
    }, [navigate])

    return (
        <AuthContext.Provider value={{user}}>
            {isLoading ? <Spin/> : children}
        </AuthContext.Provider>
    )
}
