"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  signIn: (provider: "google" | "facebook") => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (provider: "google" | "facebook") => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with real authentication
      // This is a mock authentication system for demonstration purposes
      // In production, integrate with:
      // - NextAuth.js for OAuth providers
      // - Custom JWT-based authentication
      // - Secure session management
      
      console.warn('⚠️ Using mock authentication - replace with real auth in production')
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: "1",
        name: provider === "google" ? "John Doe" : "Jane Smith",
        email: provider === "google" ? "john@gmail.com" : "jane@facebook.com",
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setUser(mockUser)
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    // TODO: Implement proper session cleanup
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
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
