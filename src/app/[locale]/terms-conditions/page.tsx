"use client"

import Link from "next/link"

import { Card, CardContent } from "@/components/common/card/card"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-400 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 text-gray-700">
          <Card>
            <CardContent className="p-6 md:p-8 lg:p-10 prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to [Your Company Name]! These Terms & Conditions ("Terms") govern your use of our website [Your
                Website URL] and the services provided therein. By accessing or using our Service, you agree to be bound
                by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of [Your Company Name] and its licensors. Our trademarks and trade dress may not be used in
                connection with any product or service without the prior written consent of [Your Company Name].
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us with information that is accurate, complete, and
                current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password, whether your password is with our Service or a third-party
                service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Prohibited Conduct</h2>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Using the Service for any illegal purpose or in violation of any local, state, national, or
                  international law.
                </li>
                <li>
                  Violating, or encouraging others to violate, any right of a third party, including by infringing or
                  misappropriating any third-party intellectual property right.
                </li>
                <li>Interfering with security-related features of the Service.</li>
                <li>Making unsolicited offers or advertisements to other users of the Service.</li>
                <li>
                  Attempting to collect personal information about other users or third parties without their consent.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Disclaimers</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
                basis. The Service is provided without warranties of any kind, whether express or implied, including,
                but not limited to, implied warranties of merchantability, fitness for a particular purpose,
                non-infringement or course of performance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall [Your Company Name], nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct
                or content of any third party on the Service; (iii) any content obtained from the Service; and (iv)
                unauthorized access, use or alteration of your transmissions or content, whether based on warranty,
                contract, tort (including negligence) or any other legal theory, whether or not we have been informed of
                the possibility of such damage, and even if a remedy set forth herein is found to have failed of its
                essential purpose.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without
                regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days' notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>By email: legal@email.com</li>
                <li>
                  By visiting this page on our website:{" "}
                  <Link href="/contact" className="text-red-600 hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
