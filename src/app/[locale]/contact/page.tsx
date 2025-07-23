"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, HeadphonesIcon, Users } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Textarea } from "@/components/common/textarea/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Label } from "@/components/common/label/label"
import RevealOnScroll from "@/components/common/RevealOnScroll"
import { useNotifications } from '@/hooks/useNotifications';
import dynamic from 'next/dynamic';
import { WorldMapDemo } from "@/components/common/ui/WorldMapDemo";

const branches = [
  { name: "Downtown Branch", address: "15 Dessert Ave, Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Alexandria Branch", address: "22 Sweet St, Alexandria", lat: 31.2001, lng: 29.9187 },
  { name: "Giza Branch", address: "8 Cake Road, Giza", lat: 30.0131, lng: 31.2089 },
  { name: "Mansoura Branch", address: "77 Sugar Blvd, Mansoura", lat: 31.0364, lng: 31.3807 },
  { name: "Tanta Branch", address: "5 Candy St, Tanta", lat: 30.7865, lng: 31.0004 },
];

const MapWithMarkers = dynamic(() => import("@/components/common/ui/MapWithMarkers"), { ssr: false });

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { notify } = useNotifications();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
    // Show success message
    notify('success', 'Message sent successfully!')
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Sweets Shop",
      details: ["15 Dessert Avenue", "Sweet City", "Egypt"],
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      icon: Phone,
      title: "Call the Sweets Shop",
      details: ["+20 115-123-4567", "Everyday 9AM-11PM"],
      color: "text-green-600",
      bgColor: "bg-green-100",
    },

    {
      icon: Clock,
      title: "Sweets Shop Hours",
      details: ["Everyday: 9AM - 11PM", "Friday: 2PM - 11PM"],
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Chat with Sweets Team",
      description: "Chat with our sweets experts in real-time for any inquiry or order.",
      action: "Start Sweets Chat",
      available: true,
    },
    {
      icon: HeadphonesIcon,
      title: "Call Sweets Shop",
      description: "Speak directly with our sweets specialists.",
      action: "Call Sweets Shop",
      available: true,
    },
    {
      icon: Mail,
      title: "Email the Sweets Shop",
      description: "Send us your sweets questions or custom order requests.",
      action: "Send Sweets Email",
      available: true,
    },
    {
      icon: Users,
      title: "Sweets Lovers Community",
      description: "Join our community of sweets lovers and share your experience.",
      action: "Visit Sweets Forum",
      available: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
    <WorldMapDemo />
     <RevealOnScroll>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className={`w-8 h-8 ${info.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message about Sweets</CardTitle>
                <p className="text-gray-600">Fill out the form below and our sweets team will get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your inquiry in detail..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 py-3">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Ways to Contact the Sweets Shop</h2>
              <p className="text-gray-600 mb-6">
                Choose the support option that works best for your sweets needs. Our team is available to help you with any sweets order or inquiry!
              </p>
            </div>

            <div className="space-y-4">
              {supportOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <option.icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                        <Button variant="outline" size="sm" disabled={!option.available} className="bg-transparent">
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Link */}
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-teal-900 mb-2">Frequently Asked Sweets Questions</h3>
                <p className="text-teal-700 text-sm mb-4">Find quick answers to common sweets questions in our FAQ section.</p>
                <Button variant="outline" className="bg-transparent border-teal-300 text-teal-700 hover:bg-teal-100">
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Find Our Sweets Shop Locations</CardTitle>
              <p className="text-gray-600">Visit any of our branches for in-person orders, tastings, and support.</p>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-1 min-h-[350px] h-[350px]">
                  <MapWithMarkers branches={branches} />
                </div>
                <div className="w-full md:w-72 max-h-[350px] overflow-y-auto border-l md:pl-4">
                  <h4 className="font-semibold mb-2 text-gray-900">Our Branches</h4>
                  {branches.map((branch, idx) => (
                    <div key={idx} className="mb-4 pb-2 border-b last:border-b-0">
                      <b className="text-teal-700">{branch.name}</b><br />
                      <span className="text-sm text-gray-600">{branch.address}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </RevealOnScroll>
    </div>
  )
}
