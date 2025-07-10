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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = async (provider: "google" | "facebook") => {
    // Simulate authentication
    const mockUser: User = {
      id: "1",
      name: provider === "google" ? "John Doe" : "Jane Smith",
      email: provider === "google" ? "john@gmail.com" : "jane@facebook.com",
      avatar: "/placeholder.svg?height=40&width=40",
    }
    setUser(mockUser)
  }

  const signOut = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
