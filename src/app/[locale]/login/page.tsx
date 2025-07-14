"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/common/card/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call for login
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)

    // For demonstration, redirect to homepage on successful login
    if (email === "test@example.com" && password === "password") {
      alert("Login successful!")
      router.push("/")
    } else {
      alert("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Login to Your Account</CardTitle>
            <CardDescription className="text-gray-600">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <Link href="#" className="text-sm text-blue-600 hover:underline text-right block">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline ml-1">
              Sign Up
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
