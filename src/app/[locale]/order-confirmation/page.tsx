"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Package, Truck, MapPin, Calendar, Download, Share2, ArrowRight, Facebook, MessageCircle ,ShoppingCart} from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Badge } from "@/components/common/Badge/Badge"
import { useCheckout } from '@/hooks/useCheckout';
import { useOrders } from '@/hooks/useOrders';
import RevealOnScroll from '@/components/common/RevealOnScroll';

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { orders } = useOrders();
  const latestOrder = orders && orders.length > 0 ? orders[0] : null;

  if (!latestOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className=" p-8 rounded-xl text-center max-w-md w-full">
        <ShoppingCart className="mx-auto mb-4 w-16 h-16 text-pink-500" />

          <h2 className="text-2xl font-bold mb-2 text-gray-900">No order found</h2>
          <p className="text-gray-600 mb-6">You have not placed any order yet.</p>
          <Button onClick={() => router.push('/shop')} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full text-lg font-semibold shadow">
            Go Shopping Now
          </Button>
        </div>
      </div>
    );
  }

  const orderItems = latestOrder.items;
  const orderSummary = {
    subtotal: orderItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
    shipping: latestOrder.shippingMethod === 'Express' ? 100 : latestOrder.shippingMethod === 'Standard' ? 50 : 0,
    tax: orderItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) * 0.08,
    total: latestOrder.total,
  };

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  useEffect(() => {
    // Simulate order processing
    const timer = setTimeout(() => {
      // Order confirmed
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const [showShare, setShowShare] = useState(false);
  const [showTrackMsg, setShowTrackMsg] = useState(false);

  // دالة تحميل الملخص كنص
  const handleDownload = () => {
    const lines = [
      `Order #${latestOrder.id}`,
      `Date: ${new Date(latestOrder.createdAt).toLocaleString()}`,
      `Address: ${latestOrder.address}`,
      `Shipping: ${latestOrder.shippingMethod}`,
      `Payment: ${latestOrder.paymentMethod}`,
      '',
      'Items:',
      ...orderItems.map(item => `- ${item.name} x${item.quantity} = E.L ${(item.price * (item.quantity || 1)).toFixed(2)}`),
      '',
      `Subtotal: ${formatPrice(orderSummary.subtotal)}`,
      `Shipping: ${orderSummary.shipping === 0 ? 'Free' : formatPrice(orderSummary.shipping)}`,
      `Tax: ${formatPrice(orderSummary.tax)}`,
      `Total: ${formatPrice(orderSummary.total)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${latestOrder.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // دالة مشاركة عبر واتساب أو فيسبوك
  const shareText = encodeURIComponent(`Order #${latestOrder.id}\nTotal: ${formatPrice(orderSummary.total)}\nThank you for your order!`);
  const whatsappUrl = `https://wa.me/?text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=&quote=${shareText}`;

  return (
    <RevealOnScroll alwaysAnimate>
      <div className="min-h-screen bg-gray-50">


        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sweets Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-4">Thank you for your order. Your delicious sweets are being prepared!</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Order #{latestOrder.id}</span>
              <span>•</span>
              <span>Estimated delivery: Soon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                        <p className="text-sm text-gray-600">We've received your sweets order and are preparing it for you!</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Processing</Badge>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Order placed: {new Date(latestOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Truck className="w-4 h-4" />
                      <span>Expected delivery: Soon</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Delivering to: {latestOrder.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Sweets Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image || item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover bg-gray-50 rounded-xl border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 relative">
                <Button onClick={() => { setShowTrackMsg(true); setTimeout(() => setShowTrackMsg(false), 2000); }} className="flex-1 text-black  hover:bg-gray-50 border-[1px] border-gray-200 cursor-pointer border-inputborder-input">
                  <Package className="w-4 h-4 mr-2 text-black" />
                  Track Sweets Order
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowShare(v => !v)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Sweets Order
                </Button>
                {showShare && (
                  <div className="absolute top-14 right-0 min-w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20 flex flex-col gap-2 animate-fade-in">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition"
                    >
                      <MessageCircle className="w-5 h-5 text-green-500 " />
                      <span className="font-medium text-black">WhatsApp</span>
                    </a>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-black">Facebook</span>
                    </a>
                  </div>
                )}
                {showTrackMsg && (
                  <div className="absolute top-14 left-0 bg-pink-50 border border-pink-200 text-pink-700 px-4 py-2 rounded shadow text-sm z-10">
                    Order tracking is under development!
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Sweets Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderSummary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{latestOrder.shippingMethod ? latestOrder.shippingMethod : (orderSummary.shipping === 0 ? "Free Delivery" : formatPrice(orderSummary.shipping))}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>{formatPrice(orderSummary.tax)}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(orderSummary.total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                        <span>You'll receive an order confirmation by email soon</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                        <span>We'll notify you when your sweets are out for delivery</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                        <span>Enjoy your fresh and delicious sweets!</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => router.push("/shop")} className="w-full mt-6 bg-pink-600 hover:bg-pink-700">
                    Order More Sweets
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  )
}
