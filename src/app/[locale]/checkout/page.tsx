"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle, ShoppingCart } from "lucide-react"
import LocationStep from "@/components/checkout/location-step"
import ShippingStep from "@/components/checkout/shipping-step"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"
import { useDispatch } from 'react-redux';
import { setAddress, setShippingMethod, setPaymentMethod, setReview } from '@/redux/features/checkout/checkoutSlice';
import { useCheckout } from '@/hooks/useCheckout';
import { useCart } from '@/hooks/useCart';
import CustomerInfoStep from '@/components/checkout/customer-info-step';
import { useOrders } from '@/hooks/useOrders';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/user/userSelectors';
import { clearCart } from '@/redux/features/cart/cartSlice';
import { useAddress } from '@/hooks/useAddress';
import { useEffect } from 'react';
import RevealOnScroll from "@/components/common/RevealOnScroll"
import { usePathname } from "next/navigation"

interface LocationData {
  latitude: number
  longitude: number
  address: string
  city: string
  country: string
}

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

/**
 * CheckoutPage component - Manages the multi-step checkout process including location, shipping, payment, and review.
 * Handles form state, order creation, and navigation between steps.
 */
export default function CheckoutPage() {
  const router = useRouter()
  const pathname = usePathname();
  // استخراج locale من أول جزء في المسار
  const locale = pathname.split("/")[1] || "en";
  const dispatch = useDispatch();
  const { address, shippingMethod, paymentMethod, review } = useCheckout();
  const { items: cartItems } = useCart();
  const [currentStep, setCurrentStep] = useState(1)
  // بيانات فورم البطاقة
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [cardError, setCardError] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const { createOrder } = useOrders();
  const user = useSelector(selectUser);
  const { addresses, defaultAddress, add: addAddress } = useAddress();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // حساب subtotal من السلة
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * 0.08; // مثال: 8% ضريبة
  let shippingCost = 0;
  if (
    shippingMethod === 'Express' ||
    shippingMethod === 'express' ||
    shippingMethod === 'Express Shipping'
  ) shippingCost = 100;
  else if (
    shippingMethod === 'Standard' ||
    shippingMethod === 'standard' ||
    shippingMethod === 'Standard Shipping'
  ) shippingCost = 50;
  else if (
    shippingMethod === 'Pickup in Store' ||
    shippingMethod === 'Payment in store' ||
    shippingMethod === 'Pickup' ||
    shippingMethod === 'Pickup in Store'
  ) shippingCost = 0;
  else if (
    shippingMethod === 'overnight' ||
    shippingMethod === 'Overnight Shipping'
  ) shippingCost = 150;
  else shippingCost = 0;
  const total = subtotal + tax + shippingCost;

  const orderSummary = {
    subtotal,
    tax,
    shipping: shippingCost,
    total,
  }

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  const steps = [
    { number: 1, title: "Authentication", icon: null, completed: !!user },
    { number: 2, title: "Location", icon: MapPin, completed: !!location },
    { number: 3, title: "Customer Info & Shipping", icon: Truck, completed: !!customerInfo && !!shippingMethod },
    { number: 4, title: "Payment", icon: CreditCard, completed: !!paymentMethod },
    { number: 5, title: "Review", icon: CheckCircle, completed: !!review },
  ];
  const canGoToStep = (stepNum: number) => {
    if (stepNum === 1) return true;
    if (stepNum === 2) return !!user;
    if (stepNum === 3) return !!user && !!location;
    if (stepNum === 4) return !!user && !!location && !!customerInfo && !!shippingMethod;
    if (stepNum === 5) return !!user && !!location && !!customerInfo && !!shippingMethod && !!paymentMethod;
    return false;
  };

  const handleLocationSet = (loc: any) => {
    setLocation(loc);
    setCurrentStep(3); // بدلاً من 2
  };

  const handleShippingSelect = (option: any) => {
    dispatch(setShippingMethod(option.name));
    setCurrentStep(3);
  }

  const handlePaymentSelect = (method: 'card' | 'cash' | 'Payment in store') => {
    dispatch(setPaymentMethod(method));
    setCardError('');
    setCardDetails({ number: '', expiry: '', cvv: '' });
    if (method !== 'card') setCurrentStep(4);
  };

  useEffect(() => {
    if (!customerInfo && defaultAddress) {
      setCustomerInfo({
        name: defaultAddress.name,
        phone: defaultAddress.phone,
        street: defaultAddress.street,
        city: defaultAddress.city,
        region: defaultAddress.region,
        notes: defaultAddress.notes || '',
        country: defaultAddress.country || '',
      });
    }
    // تعيين اللوكيشن الافتراضي إذا كان موجوداً
    if (!location && defaultAddress && defaultAddress.latitude && defaultAddress.longitude && defaultAddress.address) {
      setLocation({
        latitude: defaultAddress.latitude,
        longitude: defaultAddress.longitude,
        address: defaultAddress.address,
      });
    }
  }, [defaultAddress]);

  const handleCustomerInfoSet = (info: any, shipping: string) => {
    setCustomerInfo(info);
    dispatch(setShippingMethod(shipping));
    // أضف العنوان الجديد للـ addressSlice إذا لم يكن موجوداً
    const exists = addresses.some(addr =>
      addr.name === info.name &&
      addr.phone === info.phone &&
      addr.street === info.street &&
      addr.city === info.city &&
      addr.region === info.region
    );
    if (!exists) {
      addAddress({
        id: Date.now().toString(),
        userId: user?.id || 'guest',
        name: info.name,
        phone: info.phone,
        street: info.street,
        city: info.city,
        region: info.region,
        country: info.country || '',
        notes: info.notes || '',
        isDefault: addresses.length === 0, // أول عنوان يصبح افتراضي
      });
    }
    if (shipping === 'Pickup in Store') {
      dispatch(setPaymentMethod('Payment in store'));
      setCurrentStep(4); // انتقل مباشرة للريفيو
    } else {
      setCurrentStep(4); // انتقل لمرحلة الدفع
    }
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ ...cardDetails, [e.target.id]: e.target.value });
  };

  const handleCardContinue = () => {
    // تحقق من صحة بيانات البطاقة
    if (!/^\d{16}$/.test(cardDetails.number)) {
      setCardError('Card number must be 16 digits');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      setCardError('Expiry must be MM/YY');
      return;
    }
    if (!/^\d{3}$/.test(cardDetails.cvv)) {
      setCardError('CVV must be 3 digits');
      return;
    }
    setCardError('');
    setCurrentStep(5); // انتقل للريفيو
  };

  const handleReview = (reviewData: any) => {
    setIsPlacingOrder(true);
    // بناء بيانات الأوردر
    const order = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      items: cartItems,
      total: orderSummary.total,
      shippingMethod,
      paymentMethod,
      address: location?.address || '',
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    createOrder(order);
    dispatch(setReview(reviewData));
    dispatch(clearCart());
    router.push('/order-confirmation');
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      if (!user) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-bold mb-4">Please Login or Register</h2>
            <p className="mb-6 text-gray-600">You must be logged in to continue checkout.</p>
            <div className="flex gap-4">
              <button onClick={() => router.push(`/${locale}/login?from=checkout`)} className="bg-teal-600 text-white px-6 py-2 rounded">Login</button>
              <button onClick={() => router.push(`/${locale}/register?from=checkout`)} className="bg-gray-200 text-gray-900 px-6 py-2 rounded">Register</button>
            </div>
          </div>
        );
      } else {
        setCurrentStep(2);
        return null;
      }
    }
    switch (currentStep) {
      case 2:
        return <LocationStep onLocationSet={handleLocationSet} initialLocation={location || undefined} />;
      case 3:
        return <CustomerInfoStep onCustomerInfoSet={handleCustomerInfoSet} initialInfo={customerInfo || undefined} initialShippingMethod={shippingMethod || undefined} />;
      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
             <RevealOnScroll alwaysAnimate>
            <div className="text-center mb-8">
              <CreditCard className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
              <p className="text-gray-600">Enter your payment details to complete the order</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-900">
                <div className="flex flex-col gap-4">
                  <Button onClick={() => handlePaymentSelect('card')} className={`w-full ${paymentMethod === 'card' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}>Pay by Card</Button>
                  <Button onClick={() => handlePaymentSelect('cash')} className={`w-full ${paymentMethod === 'cash' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}>Cash on Delivery</Button>
                  <Button onClick={() => handlePaymentSelect('Payment in store')} className={`w-full ${paymentMethod === 'Payment in store' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}>Payment in store</Button>
                </div>
                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <Input id="number" placeholder="Card Number (16 digits)" value={cardDetails.number} onChange={handleCardInput} maxLength={16} />
                    <div className="flex gap-4">
                      <Input id="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardInput} maxLength={5} />
                      <Input id="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleCardInput} maxLength={3} />
                    </div>
                    {cardError && <div className="text-red-500 text-sm">{cardError}</div>}
                    <Button onClick={handleCardContinue} className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2">Continue to Review</Button>
                  </div>
                )}
                {paymentMethod !== 'card' && (
                  <Button onClick={() => setCurrentStep(5)} className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-4">Continue to Review</Button>
                )}
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full mt-2">Back</Button>
              </CardContent>
            </Card>
            </RevealOnScroll>
          </div>
        )
      case 5:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <RevealOnScroll alwaysAnimate>
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
              <p className="text-gray-600">Please review your order details before placing the order</p>
            </div>
            {/* Order Review */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-900">
                {/* بيانات العميل والموقع */}
                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold mb-1">Customer Info</h4>
                  {customerInfo && (
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><b>Name:</b> {customerInfo.name}</li>
                      <li><b>Phone:</b> {customerInfo.phone}</li>
                      <li><b>Address:</b> {customerInfo.address}</li>
                      <li><b>City:</b> {customerInfo.city}</li>
                      <li><b>Country:</b> {customerInfo.country}</li>
                    </ul>
                  )}
                  {location && (
                    <ul className="text-sm text-gray-700 space-y-1 mt-2">
                      <li><b>Location:</b> {location.address}</li>
                    </ul>
                  )}
                  <ul className="text-sm text-gray-700 space-y-1 mt-2">
                    <li><b>Shipping Method:</b> {shippingMethod}</li>
                    <li><b>Payment Method:</b> {paymentMethod}</li>
                  </ul>
                </div>
                {/* ملخص الطلب */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({shippingMethod})</span>
                    <span>{formatPrice(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Products</h4>
                  <ul className="space-y-2">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity || 1}</span>
                        <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => handleReview({})}
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                >
                  Place Order
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(4)} className="w-full mt-2">Back</Button>
              </CardContent>
            </Card>
            </RevealOnScroll>
          </div>
        )
      default:
        return null
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <RevealOnScroll>
        <div className=" p-8 rounded-xl text-center max-w-md w-full">
          <ShoppingCart className="mx-auto mb-4 w-16 h-16 text-teal-500" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">You can't proceed to checkout without any products in your cart.</p>
          <Button onClick={() => router.push('/shop')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full font-semibold shadow">
            Go Shopping Now
          </Button>
        </div>
        </RevealOnScroll>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isPlacingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-teal-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-teal-700 font-semibold">Placing your order...</span>
          </div>
        </div>
      )}
      <RevealOnScroll>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Steps - Mobile: Bottom, Desktop: Left */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle>Checkout Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        currentStep === step.number
                          ? "bg-teal-50 border border-teal-200"
                          : step.completed
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50"
                      } ${canGoToStep(step.number) ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-60'}`}
                      onClick={() => {
                        if (canGoToStep(step.number)) setCurrentStep(step.number);
                      }}
                      title={canGoToStep(step.number) ? `Go to ${step.title}` : 'Complete previous steps first'}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === step.number
                            ? "bg-teal-600 text-white"
                            : step.completed
                              ? "bg-green-600 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {step.completed ? "✓" : step.number}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            currentStep === step.number
                              ? "text-teal-900"
                              : step.completed
                                ? "text-green-900"
                                : "text-gray-600"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-gray-900">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Total</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderSummary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(orderSummary.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(orderSummary.tax)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(orderSummary.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Content - Mobile: Top, Desktop: Right */}
          <div className="order-1 lg:order-2 lg:col-span-3">{renderStepContent()}</div>
        </div>
      </div>
      </RevealOnScroll>
    </div>
  )
}
