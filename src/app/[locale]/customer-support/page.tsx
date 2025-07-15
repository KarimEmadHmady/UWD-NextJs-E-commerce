"use client"

import Link from "next/link"
import { Mail, Phone, MessageCircle, HelpCircle, MapPin } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent } from "@/components/common/card/card"

export default function CustomerSupportPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours.",
      details: "support@email.com",
      link: "mailto:support@email.com",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our customer service team.",
      details: "+20 115-5666-555 (Mon-Fri, 9 AM - 5 PM EST)",
      link: "tel:+20",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our online support agents.",
      details: "Available during business hours",
      link: "#", // Link to live chat widget
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      description: "Schedule an appointment for in-person assistance.",
      details: "123 cairo, Suite 100, City, State, ",
      link: "#", // Link to map or appointment booking
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ]

  const commonIssues = [
    { title: "Order Tracking", description: "Track your recent orders and check delivery status." },
    { title: "Returns & Refunds", description: "Information on how to return items and get refunds." },
    { title: "Product Information", description: "Details about our products and specifications." },
    { title: "Payment Issues", description: "Troubleshooting payment failures and billing questions." },
    { title: "Account Management", description: "Help with managing your account details and preferences." },
    { title: "Technical Support", description: "Assistance with website issues or technical problems." },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-400 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Support</h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              We're here to help you with any questions or issues you may have.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Contact Methods */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How Can We Help You?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <method.icon className={`w-8 h-8 ${method.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    <Link href={method.link} className="text-pink-600 hover:underline text-sm font-medium">
                      {method.details}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Common Issues */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Common Support Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commonIssues.map((issue, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ and Contact Form Links */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our comprehensive FAQ section or send us a direct message.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 text-lg">
                <Link href="/faq">Visit FAQ</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-pink-600 text-pink-600 hover:bg-pink-50 py-3 px-8 text-lg"
              >
                <Link href="/contact">Send a Message</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
