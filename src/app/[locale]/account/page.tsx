"use client"

import { useState } from "react"
import { User, Package, Heart, Settings, MapPin, CreditCard, Bell, Shield, LogOut,  Home, ChevronRight, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar/avatar"
import { Badge } from "@/components/common/Badge/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs/tabs"
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useAddress } from '@/hooks/useAddress';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/auth/authSelectors';
import { useWishlist } from '@/hooks/useWishlist';
import RevealOnScroll from "@/components/common/RevealOnScroll"
import LocationStep from '@/components/checkout/location-step';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import useOrders from '@/hooks/useOrders';
import { useNotifications } from '@/hooks/useNotifications';
import type { CartProduct, WishlistItem, Order, Address } from '@/types';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { Input } from "@/components/common/input/input";
import { PhoneInput } from "@/components/common/input/phone-input";
import { useAuth } from '@/hooks/useAuth';
import { addAddressService } from '@/services/addressService';
import AddressEditModal from '@/components/checkout/address-edit-modal';
import { Edit } from 'lucide-react';
import { Label } from "@/components/common/label/label";
import OutOfCoverageModal from '@/components/common/ui/OutOfCoverageModal';
import { CustomButton } from "@/components/common/Button"
import LoyaltyPanel, { LoyaltyReward } from "@/components/loyalty/LoyaltyPanel"
import { availableRewards as defaultRewards } from "@/components/loyalty/rewardsData"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveUser } from '@/redux/features/loyalty/loyaltySlice';
import { selectLoyaltyPoints, selectRedeemedRewards } from '@/redux/features/loyalty/loyaltySelectors';
import { unredeemReward, clearRedeemed } from '@/redux/features/loyalty/loyaltySlice';

/**
 * AccountPage component - Displays the user's profile, stats, recent orders, wishlist, addresses, and settings in tabbed sections.
 * Handles address management, tab switching, and user info display.
 */
export default function AccountPage() {
  const router = useRouter();
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [activeTab, setActiveTab] = useState("overview")
  const { start, stop } = useGlobalLoading();
  const { addresses, defaultAddress, add, update, remove, setDefault } = useAddress();
  const userRedux = useSelector(selectUser);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showOutOfCoverageModal, setShowOutOfCoverageModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', street: '', city: '', region: '', country: '', notes: '', location: null as null | { address: string, latitude: number, longitude: number }, label: ''
  });


  const handleLocationSet = async (loc: any) => {
    setLocationCheckMsg("");
    setNewLocation(null);
    if (!loc) return;
    
    const result = await checkLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
    });
    
    if (result.meta?.requestStatus === 'fulfilled') {
      setLocationCheckMsg('✔️ This address is within our service area.');
      setNewLocation(loc);
      setAddressForm((prev) => ({ ...prev, location: loc }));
    } else {
      setLocationCheckMsg('❌ This address is outside our service area.');
      setNewLocation(null);
      setAddressForm((prev) => ({ ...prev, location: null }));
      setShowOutOfCoverageModal(true);
    }
  };

  const user = userRedux || {
    name: "Guest User",
    username: "Guest User",
    email: "guest@example.com",
    phone_number: "",
  };
  const dispatch = useDispatch();
  useEffect(() => {
    // Sync loyalty slice with current user id (or guest)
    const uid = (userRedux && (userRedux.id || (userRedux as any).user_id || userRedux.email)) || 'guest';
    dispatch(setActiveUser(String(uid)));
  }, [dispatch, userRedux]);
  
  const userAvatar = "/placeholder.svg?height=100&width=100";

  const { orders } = useOrders();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlist();
  const { addItem: addCartItem, toggle: toggleCart, addCustomItem } = useCart();
  const { notify } = useNotifications();

  const formatPrice = (price: number) => {
    return `EGP ${price.toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    // Using types from organized types folder

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const { addresses: backendAddresses, loading: addressesLoading, refetch } = useUserAddresses(token);

  const allAddresses: Address[] = backendAddresses || [];

  const { checkLocation, locationCheckLoading, logout } = useAuth();
  const [locationCheckMsg, setLocationCheckMsg] = useState('');
  const [newLocation, setNewLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [defaultAddressId, setDefaultAddressId] = useState(() => {
    const firstDefault = allAddresses.find(a => a.isDefault)?.id;
    return firstDefault || allAddresses[0]?.id || '';
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [editAddress, setEditAddress] = useState<Address | null>(null);

  // Helper to parse city and state from address string
  function parseCityStateFromAddress(address: string) {
    const parts = address.split(',').map(s => s.trim());
    return {
      region: parts[2] || '', // After second comma
      city: parts[3] || '', // After third comma
    };
  }

  const [editName, setEditName] = useState(user.name || user.username || "");
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <RevealOnScroll alwaysAnimate>
       {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{isArabic ? 'الملف الشخصي' : 'Profile'}</span>
          </nav>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={editAvatar} alt={editName || "User"} />
              <AvatarFallback className="text-xl">
                {(editName || "User").split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{editName}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.phone_number && (
                <p className="text-sm text-gray-500">{user.phone_number}</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    <p className="text-sm text-gray-600">{isArabic ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSpent)}</p>
                    <p className="text-sm text-gray-600">{isArabic ? 'إجمالي الإنفاق' : 'Total Spent'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                    <p className="text-sm text-gray-600">{isArabic ? 'منتجات المفضلة' : 'Wishlist Items'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent px-0 mb-2 lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:px-0 lg:mb-0 text-gray-900 cursor-pointer ">
            <TabsTrigger value="overview" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base flex items-center gap-2">
              <svg className="w-4 h-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {isArabic ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base flex items-center gap-2">
              <Package className="w-4 h-4 hidden lg:block" />
              {isArabic ? 'الطلبات' : 'Orders'}
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base flex items-center gap-2">
              <Heart className="w-4 h-4 hidden lg:block" />
              {isArabic ? 'المفضلة' : 'Wishlist'}
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 hidden lg:block" />
              {isArabic ? 'العناوين' : 'Addresses'}
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base flex items-center gap-2">
              <svg className="w-4 h-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isArabic ? 'نفاط الولاء' : 'Loyalty'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base flex items-center gap-2">
              <Settings className="w-4 h-4 hidden lg:block" />
              {isArabic ? 'الإعدادات' : 'Settings'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="loyalty" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'نقاط الولاء' : 'Your Loyalty'}</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const points = useSelector(selectLoyaltyPoints);
                  const redeemed = useSelector(selectRedeemedRewards);
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-900">
                          <div className="text-sm text-gray-600">{isArabic ? 'النقاط الحالية' : 'Current Points'}</div>
                          <div className="text-2xl font-bold">{points.toLocaleString()} {isArabic ? 'نقطة' : 'pts'}</div>
                        </div>
                        <div className="flex gap-2">
                          {redeemed.length > 0 && (
                            <Button variant="outline" className="bg-transparent cursor-pointer" onClick={() => dispatch(clearRedeemed())}>{isArabic ? 'مسح السجل' : 'Clear History'}</Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">{isArabic ? 'المكافآت المستبدلة' : 'Redeemed Rewards'}</h4>
                        {redeemed.length === 0 ? (
                          <div className="text-gray-500">{isArabic ? 'لا يوجد مكافآت مستبدلة بعد.' : 'No rewards redeemed yet.'}</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {redeemed.map((r) => (
                              <div key={r.id} className="border rounded-lg p-4 bg-white flex gap-3 items-center">
                                <img
                                  src={(typeof r.image === 'string' && r.image.startsWith('http')) ? r.image : (r.image || '/placeholder.svg')}
                                  alt={r.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{r.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {isNaN(Date.parse(r.redeemedAt)) ? '' : new Date(r.redeemedAt).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-gray-600">{isArabic ? 'التكلفة:' : 'Cost:'} {r.pointsCost} {isArabic ? 'نقطة' : 'pts'}</div>
                                  {r.orderId && (
                                    <div className="text-xs text-gray-600">{isArabic ? 'طلب:' : 'Order:'} #{r.orderId}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="mt-6 ">
              <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isArabic ? 'الولاء' : 'Loyalty'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoyaltyPanel
                    subtotal={orders.reduce((s: number, o: any) => s + (o.total || 0), 0)}
                    availableRewards={defaultRewards}
                    onRewardRedeemed={(reward: LoyaltyReward) => {
                      if (reward.type === 'product' && reward.productId) {
                        addCustomItem({
                          id: reward.productId,
                          name: reward.productName || reward.name,
                          description: '',
                          price: reward.productPrice ?? 0,
                          images: reward.image ? [reward.image] : [],
                          category: 'Reward',
                          rating: 0,
                          stock: 1,
                          brand: '',
                          tags: ['reward'],
                        }, 1);
                      }
                    }}
                    allowCancel={false}
                    showRedeemButtons={false}
                  />
                </CardContent>
            </Card>
              </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>{isArabic ? 'الطلبات الأخيرة' : 'Recent Orders'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-sm text-gray-600">{isArabic ? `${order.items.length} منتج` : `${order.items.length} items`}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="font-semibold text-gray-900 mt-1">EGP {order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent cursor-pointer" onClick={() => {
                    setActiveTab('orders');
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}>
                    {isArabic ? 'عرض كل الطلبات' : 'View All Orders'}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{isArabic ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" onClick={() => setActiveTab('wishlist')}>
                      <Heart className="w-4 h-4 mr-3" />
                      {isArabic ? 'عرض المفضلة' : 'View Wishlist'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" onClick={() => setActiveTab('addresses')}>
                      <MapPin className="w-4 h-4 mr-3" />
                      {isArabic ? 'إدارة العناوين' : 'Manage Addresses'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" onClick={() => setActiveTab('settings')}>
                      <Settings className="w-4 h-4 mr-3" />
                      {isArabic ? 'إعدادات الحساب' : 'Account Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'سجل الطلبات' : 'Order History'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-sm text-gray-600">
                            {isArabic ? `${order.items.length} منتج • EGP ${order.total.toFixed(2)}` : `${order.items.length} items • EGP ${order.total.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Button variant="outline" size="sm" className="bg-transparent cursor-pointer" onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}>
                          {isArabic ? 'عرض التفاصيل' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Order Details Modal */}
            <AnimatePresence>
              {showOrderDetails && selectedOrder && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                >
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative"
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                      onClick={() => setShowOrderDetails(false)}
                      aria-label="Close"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl text-black font-bold mb-2">{isArabic ? `طلب رقم #${selectedOrder.id}` : `Order #${selectedOrder.id}`}</h2>
                    <div className="mb-2 text-sm text-gray-600">{isArabic ? 'التاريخ:' : 'Date:'} {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</div>
                    <div className="mb-2 text-sm text-gray-600">{isArabic ? 'الحالة:' : 'Status:'} <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></div>
                    <div className="mb-2 text-sm text-gray-600">{isArabic ? 'الدفع:' : 'Payment:'} {selectedOrder.paymentMethod}</div>
                    <div className="mb-2 text-sm text-gray-600">{isArabic ? 'الشحن:' : 'Shipping:'} {selectedOrder.shippingMethod}</div>
                    <div className="mb-2 text-sm text-gray-600">{isArabic ? 'العنوان:' : 'Address:'} {selectedOrder.address}</div>
                    <div className="mb-4 text-sm text-gray-600">{isArabic ? 'الإجمالي:' : 'Total:'} <b>EGP {selectedOrder.total.toFixed(2)}</b></div>
                    <div className="mb-2 text-black font-semibold">{isArabic ? 'المنتجات:' : 'Products:'}</div>
                    <ul className="mb-2 text-black space-y-2">
                      {selectedOrder.items.map((item: any) => (
                        <li key={item.id} className="flex justify-between text-sm border-b pb-1">
                          <span>{item.name} x{item.quantity}</span>
                          <span>EGP {(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'المفضلة' : 'My Wishlist'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-gray-500 text-center col-span-3">{isArabic ? 'قائمة المفضلة فارغة.' : 'Your wishlist is empty.'}</div>
                  ) : (
                    wishlistItems.map((item: any) => {
                      // Convert ItemType to CartProduct
                      const product: CartProduct = {
                        id: Number(item.id),
                        name: item.name,
                        description: '', 
                        price: item.price,
                        images: item.images || [],
                        category: '', 
                        rating: 0, 
                        stock: 1, 
                        brand: '', 
                        tags: [], 
                      };
                      return (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-40 h-40 mx-auto object-cover bg-gray-50 rounded-xl border mb-4"
                          />
                          <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-lg font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>
                          <div className="space-y-2">
                            <Button className="w-full bg-red-600 hover:bg-red-700 cursor-pointer" onClick={() => { addCartItem(product, 1); removeWishlistItem(Number(item.id)); toggleCart(); }}>
                              {isArabic ? 'أضف إلى السلة' : 'Add to Cart'}
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={() => removeWishlistItem(Number(item.id))}>
                              {isArabic ? 'إزالة' : 'Remove'}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'العناوين المحفوظة' : 'Saved Addresses'}</CardTitle>
              </CardHeader>
              <CardContent>
                {addressesLoading && <div className="text-center text-gray-500 py-4">{isArabic ? 'جاري تحميل العناوين...' : 'Loading addresses...'}</div>}
                <div className="flex justify-end mb-4">
                 <CustomButton className="pb-[20px] cursor-pointer border-none outline-none" onClick={() => setShowLocationModal(true)}>
                    {isArabic ? '+ إضافة عنوان جديد' : '+ Add New Address'}
                  </CustomButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allAddresses.length === 0 && !addressesLoading && (
                    <div className="text-gray-500 col-span-3 text-center">{isArabic ? 'لا يوجد عناوين.' : 'No addresses found.'}</div>
                  )}
                  {allAddresses.map((addr, idx) => {
                    const isDefault = defaultAddressId === addr.id;
                    return (
                      <div
                        key={addr.id || idx}
                        className={`relative bg-white rounded-2xl shadow-sm hover:shadow-lg border transition-shadow duration-200 p-6 flex flex-col gap-2 ${isDefault ? 'border-red-600 ring-2 ring-red-200' : 'border-gray-200'}`}
                        style={{ minHeight: 180 }}
                      >
                        {isDefault && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10">{isArabic ? 'افتراضي' : 'Default'}</span>
                        )}
                        {addr.label && (
                          <span className="absolute -top-2 -left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10 shadow">{addr.label}</span>
                        )}
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 cursor-pointer" onClick={() => setEditAddress(addr)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <div className="flex flex-col mb-1">
                          <span className="text-xl font-bold text-gray-900">{addr.name || addr.first_name || '-'}</span>
                          {addr.email && (
                            <span className="text-xs text-gray-400 mt-0 mb-0">{addr.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
                          <Phone className="w-4 h-4 text-red-400" />
                          <span className="font-medium">{addr.phone || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="break-words">{addr.address_1 || addr.street || '-'}</span>
                        </div>
                        <div className="flex gap-2 text-gray-500 text-xs mt-2">
                          <span>{addr.city || '-'}</span>
                          <span>|</span>
                          <span>{addr.region || addr.state || '-'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            {/* Modal for adding new address */}
                          {showLocationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="bg-white rounded-lg shadow-lg sm:w-[70%] w-[95%] h-[100%] overflow-y-auto p-6 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                    onClick={() => setShowLocationModal(false)}
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">{isArabic ? 'إضافة عنوان جديد' : 'Add New Address'}</h2>
                  <LocationStep
                    onLocationSet={async (loc) => {
                      setLocationCheckMsg("");
                      setNewLocation(null);
                      if (!loc) return;
                      const result = await checkLocation({
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        address: loc.address,
                      });
                      if (result.meta?.requestStatus === 'fulfilled') {
                        setLocationCheckMsg('✔️ This address is within our service area.');
                        setNewLocation(loc);
                        setAddressForm((prev) => ({ ...prev, location: loc }));
                      } else {
                        setLocationCheckMsg('❌ This address is outside our service area.');
                        setNewLocation(null);
                        setAddressForm((prev) => ({ ...prev, location: null }));
                        setShowOutOfCoverageModal(true);
                      }
                    }}
                    forceOutOfCoverageModal={showOutOfCoverageModal}
                    onCloseOutOfCoverageModal={() => setShowOutOfCoverageModal(false)}
                  />
                  {locationCheckMsg && (
                    <div
                      className={`mt-2 text-sm ${
                        locationCheckMsg.startsWith('✔️')
                          ? 'text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2'
                          : 'text-red-600'
                      }`}
                    >
                      {locationCheckMsg}
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <Label className="text-xs mb-1">Label</Label>
                      <Input
                        name="label"
                        placeholder="Label (e.g. Home, Work)"
                        value={addressForm.label || ''}
                        onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">Phone</Label>
                      <PhoneInput
                        value={addressForm.phone || ''}
                        onChange={(value) => setAddressForm({ ...addressForm, phone: value })}
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">First Name</Label>
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">Last Name</Label>
                      <Input
                        name="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">Email</Label>
                      <Input
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">Region</Label>
                      <Input
                        name="region"
                        placeholder="Region"
                        value={addressForm.region || ''}
                        onChange={e => setAddressForm({ ...addressForm, region: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-4 w-full bg-red-600 text-white cursor-pointer"
                    onClick={async () => {
                      if (!newLocation) {
                        notify('error', 'Please select a valid location within our service area!');
                        return;
                      }
                      if (!firstName || !lastName || !email || !addressForm.label || !addressForm.phone) {
                        notify('error', 'Please fill all required fields!');
                        return;
                      }
                      const { city, region } = parseCityStateFromAddress(newLocation.address);
                      const payload = {
                        label: addressForm.label,
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        phone: addressForm.phone,
                        address_1: newLocation.address,
                        address_2: '',
                        city,
                        region,
                        country: 'EG',
                        lat: newLocation.latitude,
                        long: newLocation.longitude,
                      };
                      try {
                        if (!token) {
                          notify('error', 'You must be logged in to add an address!');
                          return;
                        }
                        const apiRes = await addAddressService(payload, token);
                        if (typeof refetch === 'function') {
                          await refetch();
                        }
                        setShowLocationModal(false);
                        setAddressForm({ name: '', phone: '', street: '', city: '', region: '', country: '', notes: '', location: null, label: '' });
                        setLocationCheckMsg('');
                        setNewLocation(null);
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                      } catch (e: any) {
                        notify('error', e.message || 'Failed to save address!');
                      }
                    }}
                    disabled={locationCheckLoading}
                  >
                    {locationCheckLoading ? 'Checking...' : 'Save Address'}
                  </Button>
                </div>
              </div>
            )}
            {/* Edit Modal */}
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
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isArabic ? 'إعدادات الحساب' : 'Account Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <form
                      className="space-y-4"
                      onSubmit={e => {
                        e.preventDefault();
                        setIsEditingProfile(false);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img src={editAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
                        <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 text-black">
                          {isArabic ? 'تغيير الصورة' : 'Change Photo'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = ev => setEditAvatar(ev.target?.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-900">{isArabic ? 'الاسم' : 'Name'}</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-red-600 text-white">{isArabic ? 'حفظ' : 'Save'}</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-4 mb-4">
                      <img src={editAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
                      <div>
                        <div className="font-bold text-lg text-gray-900">{editName}</div>
                        <Button variant="outline" className="mt-2" onClick={() => setIsEditingProfile(true)}>{isArabic ? 'تعديل الملف الشخصي' : 'Edit Profile'}</Button>
                      </div>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-transparent cursor-pointer"
                    onClick={() => router.push('/terms-conditions')}
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Out of Coverage Modal */}
      {showOutOfCoverageModal && (
        <OutOfCoverageModal onClose={() => setShowOutOfCoverageModal(false)} />
      )}
      
      </RevealOnScroll>
    </div>
  )
}






