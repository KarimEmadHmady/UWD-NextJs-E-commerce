"use client"

import { useState } from "react"
import { User, Package, Heart, Settings, MapPin, CreditCard, Bell, Shield, LogOut,  Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar/avatar"
import { Badge } from "@/components/common/Badge/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs/tabs"
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useAddress } from '@/hooks/useAddress';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/user/userSelectors';
import { useWishlist } from '@/hooks/useWishlist';
import RevealOnScroll from "@/components/common/RevealOnScroll"
import LocationStep from '@/components/checkout/location-step';
import LocationStepCheckout from '@/components/checkout/location-step-checkout';
import ManualMap from '@/components/checkout/ManualMap';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import useOrders from '@/hooks/useOrders';
import { useNotifications } from '@/hooks/useNotifications';
import type { Product } from '@/types/product';
import AddressSelector from '@/components/checkout/address-selector';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { Input } from "@/components/common/input/input";
import { useAuth } from '@/hooks/useAuth';

/**
 * AccountPage component - Displays the user's profile, stats, recent orders, wishlist, addresses, and settings in tabbed sections.
 * Handles address management, tab switching, and user info display.
 */
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { start, stop } = useGlobalLoading();
  const { addresses, defaultAddress, add, update, remove, setDefault } = useAddress();
  const userRedux = useSelector(selectUser);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', street: '', city: '', region: '', country: '', notes: '', location: null as null | { address: string, latitude: number, longitude: number }, label: ''
  });
  const handleAddressFormChange = (e: any) => setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const handleEditAddress = (addr: any) => {
    setAddressForm({
      name: addr.name || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      region: addr.region || '',
      country: addr.country || '',
      notes: addr.notes || '',
      location: addr.latitude && addr.longitude && addr.address ? {
        address: addr.address,
        latitude: addr.latitude,
        longitude: addr.longitude
      } : null,
      label: addr.label || '',
    });
    setEditAddressId(addr.id);
    setShowAddressForm(true);
  };
  const handleAddOrEditAddress = () => {
    if (!addressForm.location) {
      notify('error', 'Please select your location!');
      return;
    }
    if (editAddressId) {
      // تعديل عنوان موجود
      update({
        id: String(editAddressId),
        userId: String(userRedux?.id || 'guest'),
        ...addressForm,
        address: addressForm.location.address,
        latitude: addressForm.location.latitude,
        longitude: addressForm.location.longitude,
        isDefault: false,
      });
      setEditAddressId(null);
    } else {
      // إضافة عنوان جديد
      add({
        id: Date.now().toString(),
        userId: userRedux?.id?.toString() || 'guest',
        name: addressForm.name || '',
        phone: addressForm.phone || '',
        street: addressForm.street || addressForm.location?.address || '',
        city: addressForm.city || '',
        region: addressForm.region || '',
        country: addressForm.country || '',
        notes: addressForm.notes || '',
        isDefault: allAddresses.length === 0,
        address: addressForm.location?.address || '',
        latitude: addressForm.location?.latitude,
        longitude: addressForm.location?.longitude,
        label: addressForm.label || '',
      });
    }
    setShowAddressForm(false);
    setAddressForm({ name: '', phone: '', street: '', city: '', region: '', country: '', notes: '', location: null, label: '' });
  };
  const handleLocationSet = (loc: any) => {
    setAddressForm((prev) => ({ ...prev, location: loc }));
    setShowLocationModal(false);
  };

  const user = {
    name: "Karim Emad",
    email: "karim.emad@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "May 2025",
    totalOrders: 7,
    totalSpent: 3150,
  }

  const { orders } = useOrders();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlist();
  const { addItem: addCartItem, toggle: toggleCart } = useCart();
  const { notify } = useNotifications();

  const formatPrice = (price: number) => {
    return `EGP ${price.toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-teal-100 text-teal-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, o: OrderType) => sum + (o.total || 0), 0);

  // Types for orders and items

  type WishlistItemType = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    images?: string[];
  };

  type OrderType = {
    id: string;
    createdAt: string;
    items: WishlistItemType[];
    total: number;
    status: string;
    paymentMethod?: string;
    shippingMethod?: string;
    address?: string;
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const { addresses: backendAddresses, loading: addressesLoading } = useUserAddresses(token);

  const allAddresses = [
    ...(backendAddresses || []),
    ...addresses.map(addr => ({
      ...addr,
      address_1: addr.address || addr.street || '',
      label: (addr as any).label || 'Address',
      country: addr.country || '',
      latitude: typeof addr.latitude === 'number' ? addr.latitude : 0,
      longitude: typeof addr.longitude === 'number' ? addr.longitude : 0,
    })),
  ];

  const { checkLocation, locationCheckLoading } = useAuth();
  const [locationCheckMsg, setLocationCheckMsg] = useState('');
  const [newLocation, setNewLocation] = useState<any>(null);

  const [defaultAddressId, setDefaultAddressId] = useState(() => {
    const firstDefault = allAddresses.find(a => a.isDefault)?.id;
    return firstDefault || allAddresses[0]?.id || '';
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <RevealOnScroll alwaysAnimate>
       {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Profile</span>
          </nav>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
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
                    <p className="text-sm text-gray-600">Total Spent</p>
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
                    <p className="text-sm text-gray-600">Wishlist Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent px-0 mb-2 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible lg:px-0 lg:mb-0 text-gray-900 cursor-pointer ">
            <TabsTrigger value="overview" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base ">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base ">Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base">Wishlist</TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base">Addresses</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:text-black min-w-max text-[10px] md:text-base">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order: OrderType) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">{order.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="font-semibold text-gray-900 mt-1">EGP {order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent cursor-pointer" onClick={() => setActiveTab('orders')}>
                    View All Orders
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" onClick={() => setActiveTab('wishlist')}>
                      <Heart className="w-4 h-4 mr-3" />
                      View Wishlist
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" onClick={() => setActiveTab('addresses')}>
                      <MapPin className="w-4 h-4 mr-3" />
                      Manage Addresses
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" onClick={() => setActiveTab('settings')}>
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: OrderType) => (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} items • EGP {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Button variant="outline" size="sm" className="bg-transparent cursor-pointer" onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* بوب أب تفاصيل الأوردر */}
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
                    <h2 className="text-2xl text-black font-bold mb-2">Order #{selectedOrder.id}</h2>
                    <div className="mb-2 text-sm text-gray-600">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                    <div className="mb-2 text-sm text-gray-600">Status: <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></div>
                    <div className="mb-2 text-sm text-gray-600">Payment: {selectedOrder.paymentMethod}</div>
                    <div className="mb-2 text-sm text-gray-600">Shipping: {selectedOrder.shippingMethod}</div>
                    <div className="mb-2 text-sm text-gray-600">Address: {selectedOrder.address}</div>
                    <div className="mb-4 text-sm text-gray-600">Total: <b>EGP {selectedOrder.total.toFixed(2)}</b></div>
                    <div className="mb-2 text-black font-semibold">Products:</div>
                    <ul className="mb-2 text-black space-y-2">
                      {selectedOrder.items.map((item: WishlistItemType) => (
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
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-gray-500 text-center col-span-3">Your wishlist is empty.</div>
                  ) : (
                    wishlistItems.map((item: any) => {
                      // تحويل ItemType إلى Product
                      const product: Product = {
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
                            src={item.images?.[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-40 h-40 mx-auto object-cover bg-gray-50 rounded-xl border mb-4"
                          />
                          <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-lg font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>
                          <div className="space-y-2">
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => { addCartItem(product, 1); removeWishlistItem(Number(item.id)); toggleCart(); }}>
                              Add to Cart
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={() => removeWishlistItem(Number(item.id))}>
                              Remove
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
                <CardTitle>Saved Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                {addressesLoading && <div className="text-center text-gray-500 py-4">Loading addresses...</div>}
                <div className="flex justify-end mb-4">
                  <Button className="bg-teal-600 text-white" onClick={() => setShowLocationModal(true)}>
                    + Add New Address
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allAddresses.length === 0 && !addressesLoading && (
                    <div className="text-gray-500 col-span-3 text-center">No addresses found.</div>
                  )}
                  {allAddresses.map((addr, idx) => {
                    const isDefault = defaultAddressId === addr.id;
                    return (
                      <div
                        key={addr.id || idx}
                        className={`relative border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 ${isDefault ? 'border-teal-600 ring-2 ring-teal-200' : 'border-gray-200'}`}
                      >
                        {isDefault && (
                          <span className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full z-10">Default</span>
                        )}
                        {addr.label && (
                          <span className="absolute -top-2 -left-3 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full z-10">{addr.label}</span>
                        )}
                        <div className="font-semibold text-lg text-gray-900">{addr.name || addr.first_name || '-'}</div>
                        <div className="text-gray-700 text-sm">{addr.phone || '-'}</div>
                        <div className="text-gray-700 text-sm break-words">{addr.address_1 || addr.street || '-'}</div>
                        <div className="flex gap-2 text-gray-500 text-xs mt-1">
                          <span>{addr.city || '-'}</span>
                          <span>|</span>
                          <span>{addr.region || addr.state || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="radio"
                            name="default-address"
                            checked={isDefault}
                            onChange={() => setDefaultAddressId(addr.id)}
                            className="accent-teal-600 w-4 h-4"
                            id={`default-radio-${addr.id}`}
                          />
                          <label htmlFor={`default-radio-${addr.id}`} className="text-xs text-gray-700 select-none">
                            Set as default
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            {/* Modal for adding new address */}
            {showLocationModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-lg sm:w-[70%] w-[95%] p-6 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                    onClick={() => setShowLocationModal(false)}
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Address</h2>
                  <LocationStep
                    onLocationSet={async (loc) => {
                      setLocationCheckMsg('');
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
                      }
                    }}
                  />
                  {locationCheckMsg && <div className={`mt-2 text-sm ${locationCheckMsg.startsWith('✔️') ? 'text-green-600' : 'text-red-600'}`}>{locationCheckMsg}</div>}
                  <div className="mt-4 flex flex-col gap-2">
                    <Input
                      name="label"
                      placeholder="Label (e.g. Home, Work)"
                      value={addressForm.label || ''}
                      onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                    />
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      value={addressForm.phone || ''}
                      onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                    />
                  </div>
                  <Button
                    className="mt-4 w-full bg-teal-600 text-white"
                    onClick={() => {
                      if (!newLocation) {
                        notify('error', 'Please select a valid location within our service area!');
                        return;
                      }
                      add({
                        id: Date.now().toString(),
                        userId: userRedux?.id?.toString() || 'guest',
                        name: addressForm.name || '',
                        phone: addressForm.phone || '',
                        street: addressForm.street || newLocation.address || '',
                        city: addressForm.city || '',
                        region: addressForm.region || '',
                        country: addressForm.country || '',
                        notes: addressForm.notes || '',
                        isDefault: allAddresses.length === 0,
                        address: newLocation.address || '',
                        latitude: newLocation.latitude,
                        longitude: newLocation.longitude,
                        label: addressForm.label || '',
                      });
                      setShowLocationModal(false);
                      setAddressForm({ name: '', phone: '', street: '', city: '', region: '', country: '', notes: '', location: null, label: '' });
                      setLocationCheckMsg('');
                      setNewLocation(null);
                    }}
                    disabled={locationCheckLoading}
                  >
                    {locationCheckLoading ? 'Checking...' : 'Save Address'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                    <User className="w-4 h-4 mr-3" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                    <Bell className="w-4 h-4 mr-3" />
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                    <Shield className="w-4 h-4 mr-3" />
                    Privacy & Security
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </RevealOnScroll>
    </div>
  )
}






