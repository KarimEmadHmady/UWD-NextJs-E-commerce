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
import ManualMap from '@/components/checkout/ManualMap';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/hooks/useNotifications';

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
    name: '', phone: '', street: '', city: '', region: '', country: '', notes: '',
    location: null as null | { address: string, latitude: number, longitude: number }
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
      } : null
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
        id: editAddressId,
        userId: userRedux?.id || 'guest',
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
        userId: userRedux?.id || 'guest',
        ...addressForm,
        address: addressForm.location.address,
        latitude: addressForm.location.latitude,
        longitude: addressForm.location.longitude,
        isDefault: addresses.length === 0,
      });
    }
    setShowAddressForm(false);
    setAddressForm({ name: '', phone: '', street: '', city: '', region: '', country: '', notes: '', location: null });
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

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
                    {orders.slice(0, 3).map((order) => (
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
                  {orders.map((order) => (
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
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-gray-500 text-center col-span-3">Your wishlist is empty.</div>
                  ) : (
                    wishlistItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <img
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-40 h-40 mx-auto object-cover bg-gray-50 rounded-xl border mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>
                        <div className="space-y-2">
                          <Button className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => { addCartItem(item, 1); removeWishlistItem(item.id); toggleCart(); }}>
                            Add to Cart
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={() => removeWishlistItem(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
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
                <div className="space-y-4">
                  <>
                  {addresses.length === 0 && <div className="text-gray-500 text-center">No addresses saved yet.</div>}
                  {addresses.map(addr => (
                    <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-gray-200 mb-5">
                    <div key={addr.id} className="p-4 border border-gray-200 rounded-lg flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{addr.name}</p>
                        <p className="text-gray-600">{addr.street}</p>
                        <p className="text-gray-600">{addr.city}, {addr.region}</p>
                        <p className="text-gray-600">{addr.country}</p>
                        <p className="text-gray-500 text-xs">{addr.phone}</p>

                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {addr.isDefault && <Badge className="mb-1">Default</Badge>}
                        {!addr.isDefault && <Button size="sm" variant="outline" className="text-xs mb-1" onClick={() => setDefault(addr.id)}>Set Default</Button>}
                        <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => remove(addr.id)}>Delete</Button>
                        <Button size="sm" variant="outline" className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleEditAddress(addr)}>Edit</Button>
                      </div>
                    </div>
                    <div>
                                              {addr.notes && <p className="text-gray-400 text-xs">{addr.notes}</p>}
                        {addr.address && (
                          <div className="mt-2 text-xs text-gray-600 bg-teal-50 rounded p-2">
                            <b>Location:</b> {addr.address}<br />
                            {addr.latitude && addr.longitude && (
                              <span>Lat: {addr.latitude.toFixed(5)}, Lng: {addr.longitude.toFixed(5)}</span>
                            )}
                          </div>
                        )}
                        {addr.latitude && addr.longitude && (
                          <div className="mt-2 w-full h-[120px] rounded overflow-hidden">
                            <ManualMap lat={addr.latitude} lng={addr.longitude} onChange={()=>{}} />
                          </div>
                        )}
                    </div>
                    </div>
                  ))}
                  </>
                  {showAddressForm && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        <input name="name" placeholder="Name" value={addressForm.name} onChange={handleAddressFormChange} className="border rounded px-2 py-1 bg-gray-100 placeholder-gray-500 text-gray-900" />
                        <input name="phone" placeholder="Phone" value={addressForm.phone} onChange={handleAddressFormChange} className="border rounded px-2 py-1 bg-gray-100 placeholder-gray-500 text-gray-900" />
                        <input name="street" placeholder="Street" value={addressForm.street} onChange={handleAddressFormChange} className="border rounded px-2 py-1 bg-gray-100 placeholder-gray-500 text-gray-900" />
                        <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressFormChange} className="border rounded px-2 py-1 bg-gray-100 placeholder-gray-500 text-gray-900" />
                        <input name="region" placeholder="Region" value={addressForm.region} onChange={handleAddressFormChange} className="border rounded px-2 py-1 bg-gray-100 placeholder-gray-500 text-gray-900" />
                        <input name="country" placeholder="Country" value={addressForm.country} onChange={handleAddressFormChange} className="border rounded px-2 py-1 bg-gray-100 placeholder-gray-500 text-gray-900" />
                        <input name="notes" placeholder="Notes (optional)" value={addressForm.notes} onChange={handleAddressFormChange} className="border rounded px-2 py-1 col-span-2 bg-gray-100 placeholder-gray-500 text-gray-900" />
                      </div>
                      {/* LocationStep يظهر دائماً */}
                      <div className="mb-2">
                        <LocationStep onLocationSet={(loc) => setAddressForm((prev) => ({ ...prev, location: loc }))} initialLocation={addressForm.location || undefined} />
                      </div>
                      {addressForm.location && (
                        <div className="bg-teal-50 rounded-lg p-2 mb-2 text-xs text-gray-700">
                          <b>Location:</b> {addressForm.location.address} <br />
                          <span>Lat: {addressForm.location.latitude?.toFixed(5)}, Lng: {addressForm.location.longitude?.toFixed(5)}</span>
                        </div>
                      )}
                      <div className="flex gap-2 mb-2">
                        <Button size="sm" className="bg-teal-600 text-white" onClick={handleAddOrEditAddress}>{editAddressId ? 'Save Changes' : 'Save'}</Button>
                        <Button size="sm" variant="outline" onClick={() => { setShowAddressForm(false); setEditAddressId(null); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
                  <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={() => setShowAddressForm(true)}>
                    Add New Address
                  </Button>
                </div>
              </CardContent>
            </Card>
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






