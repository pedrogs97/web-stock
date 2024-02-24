import { User } from '@prisma/client'
import { createContext, useEffect, useMemo, useState } from 'react'


interface AuthContextProps {
    user?: User
    login?: (user: User) => void
    logout?: () => Promise<void>
    isAuthenticated?: boolean
}

const AuthContext = createContext<AuthContextProps>({})


export function AuthProvider(props: any) {
    const [user, setUser] = useState<User>(null)

    useEffect(() => {
        fetch('/api/baseData')
    }, [])

    function login(user: User): void {
        setUser(user)
    }

    async function logout() {
        setUser(null)
    }

    const isAuthenticated = useMemo(() => !!user, [user])


    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated,
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContext