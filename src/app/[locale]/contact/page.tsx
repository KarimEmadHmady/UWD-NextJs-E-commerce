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
{ name: "فرع مصر الجديدة", address: "٢٥ شارع الحجاز، مصر الجديدة، القاهرة", lat: 30.0910, lng: 31.3220 },
{ name: "فرع الدقي", address: "١٢ شارع التحرير، الدقي، الجيزة", lat: 30.0370, lng: 31.2118 },
{ name: "فرع التجمع الخامس", address: "٩٠ شارع التسعين الجنوبي، التجمع الخامس، القاهرة الجديدة", lat: 30.0109, lng: 31.4372 },

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
      title: "زورونا في مطعم روكسي",
      details: ["الدقى", "مصر الجديدة", "التجمع"],
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Phone,
      title: "اتصل بنا",
      details: ["+20 115-123-4567", "يومياً 9 صباحاً - 11 مساءً"],
      color: "text-green-600",
      bgColor: "bg-green-100",
    },

    {
      icon: Clock,
      title: "مواعيد العمل",
      details: ["طوال الأسبوع: 9 ص - 11 م", "الجمعة: 2 م - 11 م"],
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "الدردشة مع فريق روكسي",
      description: "تواصل معنا مباشرة لأي استفسار أو طلب شورما.",
      action: "ابدأ الدردشة",
      available: true,
    },
    {
      icon: HeadphonesIcon,
      title: "اتصل بمطعم روكسي",
      description: "تحدث مع فريق خدمة العملاء لدينا.",
      action: "اتصل الآن",
      available: true,
    },
    {
      icon: Mail,
      title: "أرسل بريد إلكتروني",
      description: "راسلنا لطلبات الشركات أو الملاحظات.",
      action: "إرسال بريد",
      available: true,
    },
    {
      icon: Users,
      title: "مجتمع روكسي",
      description: "انضم لمجتمع محبي روكسي وشارك تجربتك.",
      action: "زيارة المنتدى",
      available: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
    <WorldMapDemo />
     <RevealOnScroll>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* معلومات التواصل */}
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
          {/* نموذج التواصل */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">راسلنا</CardTitle>
                <p className="text-gray-600">املأ البيانات وسيتواصل معك فريق روكسي في أقرب وقت.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="اكتب اسمك"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">الموضوع *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="كيف يمكننا مساعدتك؟"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="من فضلك اكتب تفاصيل استفسارك..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 py-3">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* طرق تواصل أخرى */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">طرق أخرى للتواصل مع مطعم روكسي</h2>
              <p className="text-gray-600 mb-6">
                اختر وسيلة التواصل المناسبة لك. فريقنا جاهز للرد على أي استفسار أو طلب.
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

            {/* الأسئلة الشائعة */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-red-900 mb-2">الأسئلة الشائعة</h3>
                <p className="text-red-700 text-sm mb-4">اعثر على إجابات سريعة لأكثر الأسئلة شيوعاً.</p>
                <Button variant="outline" className="bg-transparent border-red-300 text-red-700 hover:bg-red-100">
                  عرض الأسئلة الشائعة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* خريطة الفروع */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>مواقع فروع مطعم روكسي</CardTitle>
              <p className="text-gray-600">تفضل بزيارة أقرب فرع لطلب الشاورما أو الاستلام من المطعم.</p>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="flex-1 min-h-[350px] h-[350px]">
                  <MapWithMarkers branches={branches} />
                </div>
                <div className="w-full md:w-72 max-h-[350px] overflow-y-auto border-l md:pl-4">
                  <h4 className="font-semibold mb-2 text-gray-900">فروعنا</h4>
                  {branches.map((branch, idx) => (
                    <div key={idx} className="mb-4 pb-2 border-b last:border-b-0">
                      <b className="text-red-700">{branch.name}</b><br />
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
