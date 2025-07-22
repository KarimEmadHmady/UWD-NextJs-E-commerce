"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/common/card/card"
import { useUser } from '@/hooks/useUser';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import RevealOnScroll from "@/components/common/RevealOnScroll"

/**
 * LoginPage component - Provides a login form for users to authenticate and access their account.
 * Handles form submission, loading state, and error display.
 */
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isAuthenticated, loading, error } = useUser();
  const { start, stop } = useGlobalLoading();

  useEffect(() => {
    if (isAuthenticated) {
      stop();
      router.push("/account");
    }
  }, [isAuthenticated, router, stop]);

  useEffect(() => {
    if (loading) {
      start();
    } else {
      stop();
    }
  }, [loading, start, stop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RevealOnScroll>
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
                <Link href="#" className="text-sm text-teal-600 hover:underline text-right block">
                  Forgot password?
                </Link>
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center font-bold">{error}</div>
              )}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 py-3" disabled={loading}>
                {loading ? (
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
            <Link href="/register" className="text-teal-600 hover:underline ml-1">
              Sign Up
            </Link>
          </CardFooter>
        </Card>
      </main>
      </RevealOnScroll>
    </div>
  )
}
