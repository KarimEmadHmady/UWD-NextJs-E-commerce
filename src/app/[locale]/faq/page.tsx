"use client"

import Link from "next/link"

import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/common/accordion/accordion"

/**
 * FAQPage component - Displays frequently asked questions and answers for the e-commerce site.
 * Provides a searchable list of common questions and support contact.
 */
export default function FAQPage() {
  const faqItems = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our products, add desired items to your cart, and proceed to checkout. Follow the steps to provide shipping and payment information to complete your purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and other local payment options as available in your region.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive an email with a tracking number and a link to track your package. You can also track your order from your account dashboard.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Products must be unused, in their original packaging, and in the same condition that you received them. Please visit our Returns & Refunds section for full details.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we offer international shipping to many countries. Shipping costs and delivery times vary depending on the destination. You can see the exact costs at checkout.",
    },
    {
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking on the 'Sign Up' or 'Register' link in the top right corner of our website. Fill in the required details and follow the instructions.",
    },
    {
      question: "Can I change or cancel my order after it's placed?",
      answer:
        "We process orders quickly, so changes or cancellations may not always be possible. Please contact our customer support immediately if you need to modify your order.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@yourcompany.com, by phone at +1 (800) 123-4567, or through our live chat feature on the website.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-400 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Find quick answers to the most common questions about our products and services.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">Your Questions, Answered</CardTitle>
              <p className="text-gray-600">Browse through our FAQs or use the search bar to find specific answers.</p>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-pink-600">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
            <p className="text-lg text-gray-600 mb-6">Our support team is ready to assist you.</p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 text-lg">
              <Link href="/customer-support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
