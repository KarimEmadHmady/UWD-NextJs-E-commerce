"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle, ShoppingCart, User, Package, Home, Store, Clock, AlertCircle, Info, Phone, Mail, Building, Globe, Navigation, Search, Edit2, Plus, Minus, Calendar, Shield, Gift, Star, Heart, Settings, LogOut, UserCheck, MapPinOff, CheckCircle2, XCircle, HelpCircle, FileText, Receipt, Banknote, Wallet, QrCode, Smartphone, Monitor, Printer, Camera, Headphones, Wifi, Battery, Zap, Target, Compass, Globe2, Pin, LocateIcon, Route, Navigation2, Car, Bike, Plane, Ship, Train, Bus, Rocket, Satellite, Telescope, Microscope, Binoculars, Video, Music, Gamepad2, BookOpen, Newspaper, File, Folder, Database, Server, Cloud, Lock, Unlock, Key, Eye, EyeOff, Bell, BellOff, Volume2, VolumeX, Mic, MicOff, Speaker, Radio, Tv, Laptop, Tablet, Watch, Activity, BarChart3, TrendingUp, TrendingDown, DollarSign, Euro, Bitcoin, Coins, PiggyBank, Wallet2, Clipboard, ClipboardCheck, ClipboardList, ClipboardX, Clock2, Timer, Hourglass, Calculator } from "lucide-react"
import LocationStep from "@/components/checkout/location-step"
import ShippingStep from "@/components/checkout/shipping-step"
import { Button } from "@/components/common/Button/Button"
import CustomButton from "@/components/common/Button/CustomButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"
import { useDispatch } from 'react-redux';
import { setAddress, setShippingMethod, setPaymentMethod, setReview } from '@/redux/features/checkout/checkoutSlice';
import { useCheckout } from '@/hooks/useCheckout';
import { useCart } from '@/hooks/useCart';
import CustomerInfoStep from '@/components/checkout/customer-info-step';
import useOrders from '@/hooks/useOrders';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/user/userSelectors';
import { clearCart } from '@/redux/features/cart/cartSlice';
import { useAddress } from '@/hooks/useAddress';
import { useEffect } from 'react';
import RevealOnScroll from "@/components/common/RevealOnScroll"
import { usePathname } from "next/navigation"
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import AddressSelector from '@/components/checkout/address-selector';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import AddressEditModal from '@/components/checkout/address-edit-modal';
import { Edit } from 'lucide-react';
import { selectSessionRedeemedRewards, selectLoyaltyPoints } from '@/redux/features/loyalty/loyaltySelectors';
import { addPoints, attachOrderIdToCurrentRedeemed } from '@/redux/features/loyalty/loyaltySlice';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { selectUser as selectAuthUser } from '@/redux/features/auth/authSelectors';
import { setActiveUser } from '@/redux/features/loyalty/loyaltySlice';

import type { LocationData, ShippingOption } from '@/types';

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
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const { orders, createOrder } = useOrders();
  const { isAuthenticated, user, checkLocation, locationCheckError, clearLocationError, locationCheckLoading, userLatLong } = useAuth();
  const { addresses, defaultAddress, add: addAddress } = useAddress();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { notify } = useNotifications();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  // استخرج refetch من useUserAddresses
  const { addresses: backendAddresses, loading: addressesLoading, refetch } = useUserAddresses(token);
  const [editAddress, setEditAddress] = useState<any>(null);
  const [showOutOfCoverageModal, setShowOutOfCoverageModal] = useState(false);

  const redeemedRewards = useReduxSelector(selectSessionRedeemedRewards);
  const currentPoints = useReduxSelector(selectLoyaltyPoints);
  const authUser = useReduxSelector(selectAuthUser);
  const reduxDispatch = useReduxDispatch();
  useEffect(() => {
    const uid = (authUser && (authUser.id || (authUser as any).user_id || authUser.email)) || 'guest';
    reduxDispatch(setActiveUser(String(uid)));
  }, [reduxDispatch, authUser]);

  // إعداد بيانات العميل الافتراضية من بيانات اليوزر
  const defaultCustomerInfo = user ? {
    name: user.name || user.username || '',
    phone: user.phone_number || '',
    street: user.addresses?.[0]?.address_1 || user.adresses?.[0]?.address_1 || user.address || '',
    city: user.city || user.addresses?.[0]?.city || user.adresses?.[0]?.city || '',
    region: user.states || user.addresses?.[0]?.state || user.adresses?.[0]?.state || '',
    notes: '',
  } : undefined;

  // Monitor location check errors
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
    shippingMethod === 'Pickup in Store' ||
    shippingMethod === 'Dine in'
  ) shippingCost = 0;
  else if (
    shippingMethod === 'overnight' ||
    shippingMethod === 'Overnight Shipping'
  ) shippingCost = 150;
  else shippingCost = 0;
  // Apply loyalty rewards (discount and free shipping)
  const loyaltyDiscount = redeemedRewards
    .filter(r => r.type === 'discount')
    .reduce((sum, r) => {
      const treatAsPercent = typeof r.isPercent === 'boolean' ? r.isPercent : (r.id === 'discount10' || r.id === 'discount25')
      const raw = treatAsPercent ? ((r.value || 0) / 100) * subtotal : (r.value || 0);
      return sum + raw;
    }, 0);
  const loyaltyDiscountCapped = loyaltyDiscount; // no cap, user asked for exact percent
  const hasFreeShipping = redeemedRewards.some(r => r.type === 'freeShipping');
  if (hasFreeShipping) {
    shippingCost = 0;
  }
  const total = Math.max(0, subtotal - loyaltyDiscountCapped) + tax + shippingCost;

  const orderSummary = {
    subtotal: Math.max(0, subtotal - loyaltyDiscountCapped),
    tax,
    shipping: shippingCost,
    total,
  }

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  // Helper for Arabic translation
  const isArabic = locale === 'ar';

  const steps = [
    { number: 1, title: isArabic ? 'تسجيل الدخول' : 'Login', icon: UserCheck, completed: isAuthenticated },
    { number: 2, title: isArabic ? 'الموقع' : 'Location', icon: MapPin, completed: !!location },
    { number: 3, title: isArabic ? 'معلومات العميل والشحن' : 'Customer Info & Shipping', icon: Truck, completed: !!customerInfo && !!shippingMethod },
    { number: 4, title: isArabic ? 'الدفع' : 'Payment', icon: CreditCard, completed: !!paymentMethod },
    { number: 5, title: isArabic ? 'مراجعة الطلب' : 'Review', icon: CheckCircle, completed: !!review },
  ];
  const canGoToStep = (stepNum: number) => {
    if (stepNum === 1) return true;
    if (stepNum === 2) return isAuthenticated;
    if (stepNum === 3) return isAuthenticated && !!location;
    if (stepNum === 4) return isAuthenticated && !!location && !!customerInfo && !!shippingMethod;
    if (stepNum === 5) return isAuthenticated && !!location && !!customerInfo && !!shippingMethod && !!paymentMethod;
    return false;
  };

  const handleLocationSet = async (loc: any) => {
    try {
      // Check location using Redux
      const result = await checkLocation(loc);
      
     
      
      if (result.meta.requestStatus === 'fulfilled') {
        setLocation(loc);
        setCurrentStep(3);
      } else {
        // The error will be handled by the useEffect that monitors locationCheckError
        setLocation(null);
      }
    } catch (error) {
      console.error('Location check error:', error);
      setLocation(null);
    }
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

  useEffect(() => {
    if (isAuthenticated && currentStep === 1) {
      setCurrentStep(2); // تخطي خطوة تسجيل الدخول
    }
  }, [isAuthenticated, currentStep]);

  useEffect(() => {
    if (!isAuthenticated && currentStep !== 1) {
      setCurrentStep(1);
    }
  }, [isAuthenticated, currentStep]);

  useEffect(() => {
    if (isAuthenticated && userLatLong && !location) {
      setLocation({
        latitude: userLatLong.lat,
        longitude: userLatLong.long,
        address: user?.addresses?.[0]?.address_1 || user?.adresses?.[0]?.address_1 || '',
      });
    }
  }, [isAuthenticated, userLatLong, location, user]);

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
    const newOrderId = Date.now().toString();
    const rewardsWithOrderId = (redeemedRewards || []).map(r => ({ ...r, orderId: newOrderId }));
    const order = {
      id: newOrderId,
      userId: user?.id || 'guest',
      items: cartItems,
      total: orderSummary.total,
      shippingMethod,
      paymentMethod,
      address: location?.address || '',
      status: 'processing',
      createdAt: new Date().toISOString(),
      subtotal: orderSummary.subtotal,
      shipping: orderSummary.shipping,
      tax: orderSummary.tax,
      redeemedRewards: rewardsWithOrderId,
    };
    // اربط مكافآت الجلسة الحالية بالأوردر في الستور
    try { reduxDispatch(attachOrderIdToCurrentRedeemed(order.id)); } catch {}
    createOrder(order);
    dispatch(setReview(reviewData));
    // Award loyalty points based on current tier and subtotal before discounts
    try {
      const tiers = [
        { name: 'Bronze', minPoints: 0, multiplier: 0.5 },
        { name: 'Silver', minPoints: 500, multiplier: 0.5 },
        { name: 'Gold', minPoints: 1500, multiplier: 1.0 },
        { name: 'Platinum', minPoints: 3000, multiplier: 1.5 },
        { name: 'Diamond', minPoints: 5000, multiplier: 2.0 },
      ];
      const tier = tiers.reduce((acc, t) => (currentPoints >= t.minPoints ? t : acc));
      const pointsEarned = Math.floor(subtotal * tier.multiplier);
      reduxDispatch(addPoints(pointsEarned));
      reduxDispatch(attachOrderIdToCurrentRedeemed(order.id));
    } catch {}
    dispatch(clearCart());
    router.push('/order-confirmation');
  }

  // معالجة user.adresses وتوحيدها كـ array
  let rawAdresses: any[] = [];
  if (Array.isArray(user?.adresses)) {
    rawAdresses = user.adresses;
  } else if (user?.adresses && typeof user.adresses === 'object') {
    rawAdresses = [user.adresses];
  } // else: []

  const normalizedAdresses = rawAdresses.flatMap(addr => {
    if (typeof addr === 'object' && !Array.isArray(addr)) {
      const keys = Object.keys(addr);
      if (keys.length === 1 && typeof addr[keys[0]] === 'object') {
        return [{ id: keys[0], ...addr[keys[0]] }];
      }
      return [{ ...addr, id: addr.id || Date.now().toString() }];
    }
    return [];
  });
  const uniqueAdresses = normalizedAdresses.filter((addr, idx, arr) =>
    idx === arr.findIndex(a => (a.id && a.id === addr.id) || (a.address_1 && a.address_1 === addr.address_1))
  );
  const allAddresses = backendAddresses || [];
  
  const mappedAddresses = allAddresses.filter((addr, idx, arr) => {
    if (addr.id) {
      return idx === arr.findIndex(a => a.id === addr.id);
    }
    
    if (addr.latitude && addr.longitude) {
      return idx === arr.findIndex(a => 
        a.latitude === addr.latitude && 
        a.longitude === addr.longitude
      );
    }
    
    if (addr.address_1) {
      return idx === arr.findIndex(a => a.address_1 === addr.address_1);
    }
    
    return true;
  });
  const hasDefault = mappedAddresses.some(addr => addr.isDefault);
  if (!hasDefault && mappedAddresses.length > 0) {
    mappedAddresses[0].isDefault = true;
  }
  useEffect(() => {
    if (currentStep === 2 && mappedAddresses.length > 0 && !selectedAddress) {
      const def = mappedAddresses.find(a => a.isDefault) || mappedAddresses[0];
      setSelectedAddress(def);
      setLocation({ latitude: def.latitude, longitude: def.longitude, address: def.address_1 });
      // Call onSelect logic to sync AddressSelector UI
      // (simulate user selection)
    }
    // eslint-disable-next-line
  }, [currentStep, mappedAddresses.length]);

  // Helper to extract city/region from address_1 if not present
  function extractCityRegion(address: string) {
    if (!address) return { city: '', region: '' };
    const parts = address.split(',').map(s => s.trim()).filter(Boolean);
    return {
      region: parts[2] || '',
      city: parts[3] || '',
    };
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      if (!user) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl text-red-500 font-bold mb-4">
              {isArabic ? 'يرجى تسجيل الدخول أو إنشاء حساب' : 'Please Login or Register'}
            </h2>
            <p className="mb-6 text-gray-600">
              {isArabic ? 'يجب تسجيل الدخول للمتابعة في عملية الشراء.' : 'You must be logged in to continue checkout.'}
            </p>
            <div className="flex gap-4">
              <button onClick={() => router.push(`/${locale}/login?from=checkout`)} className="bg-red-600 text-white px-6 py-2 rounded cursor-pointer flex items-center gap-2 hover:bg-red-700 transition-colors">
                <UserCheck className="w-4 h-4" />
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </button>
              <button onClick={() => router.push(`/${locale}/register?from=checkout`)} className="bg-gray-200 text-gray-900 px-6 py-2 rounded cursor-pointer flex items-center gap-2 hover:bg-gray-300 transition-colors">
                <User className="w-4 h-4" />
                {isArabic ? 'إنشاء حساب' : 'Register'}
              </button>
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
        return <>
          {addressesLoading && <div className="text-center text-gray-500 py-4">{isArabic ? 'جاري تحميل العناوين...' : 'Loading addresses...'}</div>}
          <AddressSelector
            addresses={allAddresses}
            selectedId={selectedAddress?.id || ''}
            onAddAddress={async (addr) => {
              // أضف العنوان في الباك إند فقط (إذا كان هناك API)، ثم اعمل refetch
              if (typeof refetch === 'function') {
                await refetch();
              }
            }}
            onSelect={(addr) => {
              setLocation({
                latitude: addr.latitude,
                longitude: addr.longitude,
                address: addr.address_1,
              });
              setSelectedAddress(addr);
            }}
            defaultAddressId={defaultAddress?.id}
            user={user}
            token={token}
            renderAddressActions={(addr) => (
              <Button variant="ghost" size="icon" className="absolute cursor-pointer" onClick={() => setEditAddress(addr)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            forceOutOfCoverageModal={showOutOfCoverageModal}
            onCloseOutOfCoverageModal={() => setShowOutOfCoverageModal(false)}
          />
          {editAddress && (
            <AddressEditModal
              address={editAddress}
              token={token}
              onClose={() => setEditAddress(null)}
              onSave={refetch}
              forceOutOfCoverageModal={showOutOfCoverageModal}
              onCloseOutOfCoverageModal={() => setShowOutOfCoverageModal(false)}
            />
          )}
          <div className="mt-6 flex justify-end">
            <CustomButton
              onClick={() => {
                if (!selectedAddress) return;
                setCustomerInfo(null);
                setCurrentStep(3);
              }}
              className="px-8 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed pb-[20px]"
              type="button"
            >
              {isArabic ? 'متابعة' : 'Continue'}
            </CustomButton>
          </div>
        </>;
      case 3:
        // Autofill logic for CustomerInfoStep
        let initialInfo = customerInfo;
        if (!initialInfo && selectedAddress) {
          const city = selectedAddress.city || extractCityRegion(selectedAddress.address_1).city;
          const region = selectedAddress.region || selectedAddress.state || extractCityRegion(selectedAddress.address_1).region;
          initialInfo = {
            name: selectedAddress.name || selectedAddress.first_name || '',
            phone: selectedAddress.phone || '',
            street: selectedAddress.street || selectedAddress.address_1 || '',
            city,
            region,
            notes: selectedAddress.notes || '',
          };
        } else if (!initialInfo) {
          initialInfo = defaultCustomerInfo;
        }
        return <CustomerInfoStep
          onCustomerInfoSet={handleCustomerInfoSet}
          initialInfo={initialInfo}
          initialShippingMethod={shippingMethod || undefined}
          continueLabel={isArabic ? 'متابعة' : 'Continue'}
        />;
      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
             <RevealOnScroll alwaysAnimate>
            <div className="text-center mb-8">
              <CreditCard className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{isArabic ? 'معلومات الدفع' : 'Payment Information'}</h2>
              <p className="text-gray-600">{isArabic ? 'أدخل بيانات الدفع لإكمال الطلب' : 'Enter your payment details to complete the order'}</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-600" />
                  {isArabic ? 'تفاصيل الدفع' : 'Payment Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-900">
                <div className="flex flex-col gap-4">
                  <Button onClick={() => handlePaymentSelect('card')} className={`w-full flex items-center gap-2 ${paymentMethod === 'card' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600'}`}>
                    <CreditCard className="w-4 h-4" />
                    {isArabic ? 'الدفع بالبطاقة' : 'Pay by Card'}
                  </Button>
                  <Button onClick={() => handlePaymentSelect('cash')} className={`w-full flex items-center gap-2 ${paymentMethod === 'cash' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600'}`}>
                    <Banknote className="w-4 h-4" />
                    {isArabic ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </Button>
                  <Button onClick={() => handlePaymentSelect('Payment in store')} className={`w-full flex items-center gap-2 ${paymentMethod === 'Payment in store' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600'}`}>
                    <Store className="w-4 h-4" />
                    {isArabic ? 'الدفع في المتجر' : 'Payment in store'}
                  </Button>
                </div>
                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="number" placeholder={isArabic ? 'رقم البطاقة (16 رقم)' : 'Card Number (16 digits)'} value={cardDetails.number} onChange={handleCardInput} maxLength={16} className="pl-10" />
                    </div>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input id="expiry" placeholder={isArabic ? 'MM/YY' : 'MM/YY'} value={cardDetails.expiry} onChange={handleCardInput} maxLength={5} className="pl-10" />
                      </div>
                      <div className="relative flex-1">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input id="cvv" placeholder={isArabic ? 'CVV' : 'CVV'} value={cardDetails.cvv} onChange={handleCardInput} maxLength={3} className="pl-10" />
                      </div>
                    </div>
                    {cardError && <div className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {cardError}
                    </div>}
                    <Button onClick={handleCardContinue} className="w-full bg-red-600 hover:bg-red-700 text-white mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {isArabic ? 'متابعة للمراجعة' : 'Continue to Review'}
                    </Button>
                  </div>
                )}
                {paymentMethod !== 'card' && (
                  <Button onClick={() => setCurrentStep(5)} className="w-full bg-red-600 hover:bg-red-700 text-white mt-[100px] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {isArabic ? 'متابعة للمراجعة' : 'Continue to Review'}
                  </Button>
                )}
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full mt-2 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {isArabic ? 'رجوع' : 'Back'}
                </Button>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{isArabic ? 'مراجعة الطلب' : 'Review Your Order'}</h2>
              <p className="text-gray-600">{isArabic ? 'يرجى مراجعة تفاصيل طلبك قبل إتمام الشراء' : 'Please review your order details before placing the order'}</p>
            </div>
            {/* Order Review */}
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'ملخص الطلب' : 'Order Summary'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-900">
                {/* بيانات العميل والموقع */}
                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    {isArabic ? 'معلومات العميل' : 'Customer Info'}
                  </h4>
                  {customerInfo && (
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-500" />
                        <b>{isArabic ? 'الاسم:' : 'Name:'}</b> {customerInfo.name}
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <b>{isArabic ? 'الهاتف:' : 'Phone:'}</b> {customerInfo.phone}
                      </li>
                      <li className="flex items-center gap-2">
                        <Building className="w-3 h-3 text-gray-500" />
                        <b>{isArabic ? 'المدينة:' : 'City:'}</b> {customerInfo.city}
                      </li>
                    </ul>
                  )}
                  {location && (
                    <ul className="text-sm text-gray-700 space-y-1 mt-2">
                      <li className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <b>{isArabic ? 'العنوان:' : 'Address:'}</b> {location.address}
                      </li>
                    </ul>
                  )}
                  <ul className="text-sm text-gray-700 space-y-1 mt-2">
                    <li className="flex items-center gap-2">
                      <Truck className="w-3 h-3 text-gray-500" />
                      <b>{isArabic ? 'طريقة الشحن:' : 'Shipping Method:'}</b> {shippingMethod}
                    </li>
                    <li className="flex items-center gap-2">
                      <CreditCard className="w-3 h-3 text-gray-500" />
                      <b>{isArabic ? 'طريقة الدفع:' : 'Payment Method:'}</b> {paymentMethod}
                    </li>
                  </ul>
                </div>
                {/* ملخص الطلب */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      {isArabic ? 'الإجمالي الفرعي' : 'Subtotal'}
                    </span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      {isArabic ? `الشحن (${shippingMethod})` : `Shipping (${shippingMethod})`}
                    </span>
                    <span>{formatPrice(orderSummary.shipping)}</span>
                  </div>
                  {loyaltyDiscountCapped > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-green-500" />
                        {isArabic ? 'خصم (نقاط الولاء)' : 'Discount (Loyalty)'}
                      </span>
                      <span>-{formatPrice(loyaltyDiscountCapped)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-gray-500" />
                      {isArabic ? 'الضريبة' : 'Tax'}
                    </span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold items-center">
                    <span className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-red-600" />
                      {isArabic ? 'الإجمالي الكلي' : 'Total'}
                    </span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    {isArabic ? 'المنتجات' : 'Products'}
                  </h4>
                  <ul className="space-y-2">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm items-center">
                        <span className="flex items-center gap-2">
                          <Package className="w-3 h-3 text-gray-500" />
                          {item.name} x{item.quantity || 1}
                        </span>
                        <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <CustomButton onClick={() => handleReview({})} className="w-full mt-4 pb-[20px]">{isArabic ? 'إتمام الطلب' : 'Place Order'}</CustomButton>
                <CustomButton onClick={() => setCurrentStep(4)} className="w-full mt-2 pb-[20px]">{isArabic ? 'رجوع' : 'Back'}</CustomButton>
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
          <ShoppingCart className="mx-auto mb-4 w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{isArabic ? 'سلة التسوق فارغة' : 'Your cart is empty'}</h2>
          <p className="text-gray-600 mb-6">{isArabic ? 'لا يمكنك المتابعة بدون منتجات في السلة.' : "You can't proceed to checkout without any products in your cart."}</p>
          <CustomButton onClick={() => router.push('/shop')} className=" text-white px-6 py-2 rounded-full font-semibold pb-[20px]">
            {isArabic ? 'تسوق الآن' : 'Go Shopping Now'}
          </CustomButton>
        </div>
        </RevealOnScroll>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {isPlacingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-red-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-red-700 font-semibold">Placing your order...</span>
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isArabic ? 'إتمام الشراء' : 'Checkout'}</h1>
              <p className="text-gray-600">{isArabic ? 'أكمل عملية الشراء' : 'Complete your purchase'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Steps - Mobile: Bottom, Desktop: Left */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  {isArabic ? 'تقدم عملية الشراء' : 'Checkout Progress'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        currentStep === step.number
                          ? "bg-red-50 border border-red-200"
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
                            ? "bg-red-600 text-white"
                            : step.completed
                              ? "bg-green-600 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {step.completed ? "✓" : step.number}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        {step.icon && <step.icon className="w-4 h-4 text-gray-500" />}
                        <p
                          className={`font-medium ${
                            currentStep === step.number
                              ? "text-red-900"
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
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-red-600" />
                    {isArabic ? 'إجمالي الطلب' : 'Order Total'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        {isArabic ? 'الإجمالي الفرعي' : 'Subtotal'}
                      </span>
                      <span>{formatPrice(orderSummary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        {isArabic ? 'الشحن' : 'Shipping'}
                      </span>
                      <span>{formatPrice(orderSummary.shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-500" />
                        {isArabic ? 'الضريبة' : 'Tax'}
                      </span>
                      <span>{formatPrice(orderSummary.tax)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold items-center">
                      <span className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-red-600" />
                        {isArabic ? 'الإجمالي الكلي' : 'Total'}
                      </span>
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
