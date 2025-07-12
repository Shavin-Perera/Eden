"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  })
  const [formError, setFormError] = useState<string | null>(null)
  const { signIn, signUp, isLoading, error } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null)
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { isLogin, form })
    setFormError(null)
    try {
      if (isLogin) {
        console.log('Attempting sign in...')
        await signIn(form.email, form.password)
        console.log('Sign in successful')
        onOpenChange(false)
      } else {
        if (form.password !== form.confirmPassword) {
          setFormError("Passwords do not match")
          return
        }
        console.log('Attempting sign up...')
        await signUp({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        })
        console.log('Sign up successful')
        onOpenChange(false)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setFormError(err.message || "Authentication failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-light">
            {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required autoComplete="given-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required autoComplete="family-name" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required autoComplete={isLogin ? "current-password" : "new-password"} />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required autoComplete="new-password" />
              </div>
            )}
            {(formError || error) && (
              <div className="text-red-600 text-sm text-center">{formError || error}</div>
            )}
            <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
              {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "SIGN IN" : "CREATE ACCOUNT")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setFormError(null)
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
