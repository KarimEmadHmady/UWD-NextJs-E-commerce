"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, CheckCircle, LogIn } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/common/card/card"
import LocationStep from '@/components/checkout/location-step';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { LocationData } from '@/services/authService';

/**
 * RegisterPage component - Provides a registration form for new users to create an account.
 * Handles form submission, validation, and loading state.
 */
export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(true); // Shows immediately
  const [location, setLocation] = useState<LocationData | null>(null);
  const [showOutOfCoverageModal, setShowOutOfCoverageModal] = useState(false);
  const searchParams = useSearchParams();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const locale = pathname.split("/")[1] || "en";
  const { notify } = useNotifications();
  
  // Redux auth state
  const {
    checkLocation,
    registerUser,
    login, // <-- أضف هذا
    locationCheckLoading,
    locationCheckError,
    registrationLoading,
    registrationError,
    registrationSuccess,
    clearLocationError,
    clearRegistrationError
  } = useAuth();

  const didRedirect = useRef(false);

  // Monitor Redux state changes
  useEffect(() => {
    if (locationCheckError) {
      if (
        locationCheckError.toLowerCase().includes('outside our service area') ||
        locationCheckError.toLowerCase().includes('out of coverage')
      ) {
        setShowOutOfCoverageModal(true);
        // تجاهل الإشعار، سيظهر البوب أب فقط
        clearLocationError();
        return;
      }
      notify('error', locationCheckError);
      clearLocationError();
    }
  }, [locationCheckError, notify, clearLocationError]);

  useEffect(() => {
    console.log('registrationError changed:', registrationError);
    if (registrationError) {
      console.log('Showing registration error:', registrationError);
      notify('error', registrationError);
      clearRegistrationError();
    }
  }, [registrationError, notify, clearRegistrationError]);

  useEffect(() => {
    if (registrationSuccess && !didRedirect.current) {
      didRedirect.current = true;
      notify('success', 'Registration successful! Logging you in...');
      // سجل دخول المستخدم تلقائيًا
      (async () => {
        try {
          await login({ username: email, password }); // استخدم object كما هو معرف في useAuth
          const from = searchParams.get('from');
          if (from === 'checkout') {
            router.push(`/${locale}/checkout`);
          } else {
            router.push(`/${locale}/`);
          }
        } catch (e) {
          notify('error', 'Login after registration failed. Please login manually.');
          router.push(`/${locale}/login`);
        }
      })();
    }
  }, [registrationSuccess, router, locale, searchParams, notify, email, password, login]);

  const handleLocationSet = async (loc: LocationData) => {
    try {
      // Check location using Redux
      const result = await checkLocation(loc);
      
      // Debug: Log the result
      console.log('Location check result:', result);
      
      if (result.meta.requestStatus === 'fulfilled') {
        setLocation(loc);
        setShowLocationModal(false);
        setShowOutOfCoverageModal(false);
      } else {
        // The error will be handled by the useEffect that monitors locationCheckError
        setShowLocationModal(true);
        setShowOutOfCoverageModal(true);
        setLocation(null);
      }
    } catch (error) {
      console.error('Location check error:', error);
      setShowLocationModal(true);
      setShowOutOfCoverageModal(true);
      setLocation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) {
      notify('error', 'Please select your location first!');
      setShowLocationModal(true);
      return;
    }
    if (password !== confirmPassword) {
      notify('error', 'Passwords do not match!');
      return;
    }
    
    try {
      // Check location again before registration
      const locationResult = await checkLocation(location);
      
      // Debug: Log the location result
      console.log('Location check in submit:', locationResult);
      
      if (locationResult.meta.requestStatus !== 'fulfilled') {
        // The error will be handled by the useEffect that monitors locationCheckError
        setShowLocationModal(true);
        return;
      }
      
      // Register user
      const registrationResult = await registerUser({
        username: name,
        email,
        password,
        phone_number: phoneNumber,
        city,
        states,
        lat: location.latitude,
        long: location.longitude,
        address: location.address,
        address_1: location.address // أضف هذا
      });
      
      // Debug: Log the registration result
      console.log('Registration result:', registrationResult);
      
      // The success/error will be handled by the useEffect hooks
      
    } catch (error) {
      console.error('Submit error:', error);
      notify('error', 'An error occurred during registration, please try again');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-[#eee] h-auto"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg max-w-[95%] sm:w-[70%] p-6 relative h-auto my-10 "
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                onClick={() => setShowLocationModal(false)}
                aria-label="Close"
                disabled={!location || locationCheckLoading}
              >
                <X className="w-6 h-6" />
              </button>
              <LocationStep 
                onLocationSet={handleLocationSet} 
                initialLocation={location || undefined} 
                isChecking={locationCheckLoading}
                forceOutOfCoverageModal={showOutOfCoverageModal}
                onCloseOutOfCoverageModal={() => setShowOutOfCoverageModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Create an Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join us and start exploring our amazing products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone_number"
                    type="text"
                    placeholder="01xxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="states">District/Area</Label>
                <div className="relative">
                  <Input
                    id="states"
                    type="text"
                    placeholder="District/Area"
                    value={states}
                    onChange={(e) => setStates(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              {location && (
                <div className="bg-teal-50 rounded-lg p-3 mb-2 text-xs text-gray-700">
                  <b>Location:</b> {location.address} <br />
                  <span>Lat: {location.latitude?.toFixed(5)}, Lng: {location.longitude?.toFixed(5)}</span>
                </div>
              )}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 py-3" disabled={registrationLoading}>
                {registrationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Register
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 hover:underline ml-1">
              Login
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
