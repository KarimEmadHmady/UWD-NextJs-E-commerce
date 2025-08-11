"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/common/card/card"
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import RevealOnScroll from "@/components/common/RevealOnScroll"

/**
 * LoginPage component - Provides a login form for users to authenticate and access their account.
 * Handles form submission, loading state, and error display.
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const locale = pathname.split("/")[1] || "en";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, registrationError, registrationLoading } = useAuth();
  const { notify } = useNotifications();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !redirected) {
      setRedirected(true);
      const from = searchParams.get('from');
      if (from === 'checkout') {
        router.push(`/${locale}/checkout`);
      } else if (document.referrer && !document.referrer.includes('/login')) {
        // إذا كان هناك referrer (الصفحة السابقة) وليس صفحة تسجيل الدخول نفسها
        window.location.href = document.referrer;
      } else {
        router.push('/account');
      }
    }
  }, [isAuthenticated, router, searchParams, locale, redirected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      notify('error', 'Please enter your email/phone and password');
      return;
    }
    await login({ username, password });
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
                <Label htmlFor="username">Email or Phone</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="your@example.com or 01xxxxxxxxx"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <Link href="#" className="text-sm text-red-600 hover:underline text-right block">
                  Forgot password?
                </Link>
              </div>
              {registrationError && (
                <div className="text-red-600 text-sm text-center font-bold">{registrationError}</div>
              )}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-3" disabled={registrationLoading}>
                {registrationLoading ? (
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
            <Link href="/register" className="text-red-600 hover:underline ml-1">
              Sign Up
            </Link>
          </CardFooter>
        </Card>
      </main>
      </RevealOnScroll>
    </div>
  )
}
