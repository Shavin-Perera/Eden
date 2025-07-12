"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  isEmailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  signOut: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user on mount (if session exists)
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.firstName + " " + data.user.lastName,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            isEmailVerified: data.user.isEmailVerified,
          })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: signIn called with email:', email)
    setIsLoading(true)
    setError(null)
    try {
      console.log('AuthProvider: Making API call to /api/auth/signin')
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      console.log('AuthProvider: API response status:', res.status)
      const data = await res.json()
      console.log('AuthProvider: API response data:', data)
      if (!res.ok) throw new Error(data.error || "Login failed")
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.firstName + " " + data.user.lastName,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        isEmailVerified: data.user.isEmailVerified,
      })
      console.log('AuthProvider: User set successfully')
    } catch (err: any) {
      console.error('AuthProvider: signIn error:', err)
      setError(err.message || "Login failed")
      setUser(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    console.log('AuthProvider: signUp called with data:', { ...data, password: '[REDACTED]' })
    setIsLoading(true)
    setError(null)
    try {
      console.log('AuthProvider: Making API call to /api/auth/signup')
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      console.log('AuthProvider: Signup API response status:', res.status)
      const result = await res.json()
      console.log('AuthProvider: Signup API response data:', result)
      if (!res.ok) throw new Error(result.error || "Signup failed")
      // Optionally auto-login after signup
      console.log('AuthProvider: Auto-login after signup')
      await signIn(data.email, data.password)
    } catch (err: any) {
      console.error('AuthProvider: signUp error:', err)
      setError(err.message || "Signup failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
