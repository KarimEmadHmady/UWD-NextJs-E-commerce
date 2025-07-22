"use client"

import Link from "next/link"

import { Card, CardContent } from "@/components/common/card/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-400 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your data.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 text-gray-700">
          <Card>
            <CardContent className="p-6 md:p-8 lg:p-10 prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to [Your Company Name]! We are committed to protecting your privacy and ensuring the security of
                your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard
                your information when you visit our website [Your Website URL] and use our services.
              </p>
              <p>
                By accessing or using our Service, you signify that you have read, understood, and agree to our
                collection, storage, use, and disclosure of your personal information as described in this Privacy
                Policy and our Terms & Conditions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
              <p>We collect various types of information in connection with the services we provide, including:</p>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1. Personal Information</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Contact Information:</strong> Name, email address, postal address, phone number.
                </li>
                <li>
                  <strong>Account Information:</strong> Username, password, purchase history.
                </li>
                <li>
                  <strong>Payment Information:</strong> Credit card details (processed by secure third-party payment
                  processors), billing address.
                </li>
                <li>
                  <strong>Demographic Information:</strong> Age, gender, preferences.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2. Non-Personal Information</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Usage Data:</strong> IP address, browser type, operating system, pages visited, time spent on
                  pages, referring URLs.
                </li>
                <li>
                  <strong>Device Information:</strong> Device type, unique device identifiers.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies:</strong> Information collected through cookies, web
                  beacons, and similar technologies.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide, operate, and maintain our Service.</li>
                <li>To process your orders and manage your account.</li>
                <li>To improve, personalize, and expand our Service.</li>
                <li>To understand and analyze how you use our Service.</li>
                <li>To develop new products, services, features, and functionality.</li>
                <li>To communicate with you, including for customer service, updates, and marketing.</li>
                <li>To detect and prevent fraud.</li>
                <li>To comply with legal obligations.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
              <p>We may share your information with third parties in the following situations:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Service Providers:</strong> With third-party vendors, consultants, and other service providers
                  who perform services on our behalf.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale
                  of company assets, financing, or acquisition of all or a portion of our business to another company.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by
                  public authorities.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose
                  with your consent.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement reasonable security measures designed to protect your information from unauthorized access,
                use, alteration, and disclosure. However, no internet transmission is entirely secure, and we cannot
                guarantee the absolute security of your data.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Data Protection Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>The right to access, update, or delete the information we have on you.</li>
                <li>The right of rectification.</li>
                <li>The right to object.</li>
                <li>The right of restriction.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent.</li>
              </ul>
              <p>To exercise any of these rights, please contact us using the details below.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain
                information. Cookies are files with a small amount of data which may include an anonymous unique
                identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                sent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>By email: privacy@email.com</li>
                <li>
                  By visiting this page on our website:{" "}
                  <Link href="/contact" className="text-teal-600 hover:underline">
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
