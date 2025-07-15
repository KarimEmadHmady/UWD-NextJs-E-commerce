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
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', street: '', city: '', region: '', country: '', notes: ''
  });
  const handleAddressFormChange = (e: any) => setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  const handleAddAddress = () => {
    add({
      id: Date.now().toString(),
      userId: userRedux?.id || 'guest',
      ...addressForm,
      isDefault: addresses.length === 0,
    });
    setShowAddressForm(false);
    setAddressForm({ name: '', phone: '', street: '', city: '', region: '', country: '', notes: '' });
  };

  const user = {
    name: "Karim Emad",
    email: "karim.emad@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "May 2022",
    totalOrders: 7,
    totalSpent: 32450.75,
  }

  const recentOrders = [
    {
      id: "ORD-2025-000789",
      date: "July 10, 2025",
      status: "Delivered",
      total: 8999.00,
      items: 2,
    },
    {
      id: "ORD-2025-000788",
      date: "June 22, 2025",
      status: "Processing",
      total: 4999.50,
      items: 1,
    },
    {
      id: "ORD-2025-000787",
      date: "June 1, 2025",
      status: "Shipped",
      total: 2999.99,
      items: 1,
    },
  ]

  const { items: wishlistItems } = useWishlist();

  const formatPrice = (price: number) => {
    return `EGP ${price.toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-pink-100 text-pink-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

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
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.totalOrders}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(user.totalSpent)}</p>
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
                    {recentOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                          <p className="text-sm text-gray-600">{order.items} items</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="font-semibold text-gray-900 mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent cursor-pointer">
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
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                      <Package className="w-4 h-4 mr-3" />
                      Track an Order
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                      <Heart className="w-4 h-4 mr-3" />
                      View Wishlist
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                      <MapPin className="w-4 h-4 mr-3" />
                      Manage Addresses
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-3" />
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
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
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                          <p className="text-sm text-gray-600">
                            {order.items} items • {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Button variant="outline" size="sm" className="bg-transparent cursor-pointer">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                          <Button className="w-full bg-pink-600 hover:bg-pink-700 cursor-pointer">
                            Add to Cart
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent cursor-pointer">
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
                    <div key={addr.id} className="p-4 border border-gray-200 rounded-lg flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{addr.name}</p>
                        <p className="text-gray-600">{addr.street}</p>
                        <p className="text-gray-600">{addr.city}, {addr.region}</p>
                        <p className="text-gray-600">{addr.country}</p>
                        <p className="text-gray-500 text-xs">{addr.phone}</p>
                        {addr.notes && <p className="text-gray-400 text-xs">{addr.notes}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {addr.isDefault && <Badge className="mb-1">Default</Badge>}
                        {!addr.isDefault && <Button size="sm" variant="outline" className="text-xs mb-1" onClick={() => setDefault(addr.id)}>Set Default</Button>}
                        <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => remove(addr.id)}>Delete</Button>
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
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-pink-600 text-white" onClick={handleAddAddress}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
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
    </div>
  )
}








// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { User, Package, Heart, Settings, MapPin, CreditCard, Bell, Shield, LogOut,  Home, ChevronRight } from "lucide-react"
// import { Button } from "@/components/common/Button/Button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar/avatar"
// import { Badge } from "@/components/common/Badge/Badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs/tabs"
// import { useUser } from '@/hooks/useUser';

// export default function AccountPage() {
//   const [activeTab, setActiveTab] = useState("overview")
//   const router = useRouter();
//   const { user, isAuthenticated, loading, error, logout } = useUser();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, loading, router]);

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Loading...</div>;
//   }
//   if (error) {
//     return <div className="min-h-screen flex items-center justify-center text-xl text-red-600 font-bold">{error}</div>;
//   }
//   if (!user) {
//     return null;
//   }

//   // بيانات وهمية للأقسام الأخرى (يمكن ربطها لاحقاً)
//   const recentOrders = [];
//   const wishlistItems = [];
//   const formatPrice = (price: number) => `EGP ${price}`;
//   const getStatusColor = (status: string) => "bg-gray-100 text-gray-800";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Breadcrumbs */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <nav className="flex items-center space-x-2 text-sm">
//             <Home className="w-4 h-4 text-gray-400" />
//             <ChevronRight className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-600">Profile</span>
//           </nav>
//         </div>
//       </div>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-6 mb-6">
//             <Avatar className="w-20 h-20">
//               <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
//               <AvatarFallback className="text-xl">
//                 {user.name
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
//               <p className="text-gray-600">{user.email}</p>
//               {/* <p className="text-sm text-gray-500">Member since {user.joinDate}</p> */}
//               <Button variant="outline" className="mt-2" onClick={logout}>
//                 <LogOut className="w-4 h-4 mr-2" /> Logout
//               </Button>
//             </div>
//           </div>
//           {/* Quick Stats (بيانات وهمية مؤقتة) */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
//                     <Package className="w-6 h-6 text-pink-600" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-gray-900">0</p>
//                     <p className="text-sm text-gray-600">Total Orders</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                     <CreditCard className="w-6 h-6 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-gray-900">{formatPrice(0)}</p>
//                     <p className="text-sm text-gray-600">Total Spent</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                     <Heart className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-gray-900">0</p>
//                     <p className="text-sm text-gray-600">Wishlist Items</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//         {/* Tabs (محتوى وهمي مؤقت) */}
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 text-gray-900 cursor-pointer">
//             <TabsTrigger value="overview" className="data-[state=active]:text-black">Overview</TabsTrigger>
//             <TabsTrigger value="orders" className="data-[state=active]:text-black">Orders</TabsTrigger>
//             <TabsTrigger value="wishlist" className="data-[state=active]:text-black">Wishlist</TabsTrigger>
//             <TabsTrigger value="addresses" className="data-[state=active]:text-black">Addresses</TabsTrigger>
//             <TabsTrigger value="settings" className="data-[state=active]:text-black">Settings</TabsTrigger>
//           </TabsList>
//           <TabsContent value="overview" className="mt-6 ">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Recent Orders */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Orders</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {/* لا توجد طلبات حالياً */}
//                     <div className="text-gray-500 text-center">No recent orders.</div>
//                   </div>
//                   <Button variant="outline" className="w-full mt-4 bg-transparent cursor-pointer">
//                     View All Orders
//                   </Button>
//                 </CardContent>
//               </Card>
//               {/* Quick Actions */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Quick Actions</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
//                       <Package className="w-4 h-4 mr-3" />
//                       Track an Order
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
//                       <Heart className="w-4 h-4 mr-3" />
//                       View Wishlist
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
//                       <MapPin className="w-4 h-4 mr-3" />
//                       Manage Addresses
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
//                       <CreditCard className="w-4 h-4 mr-3" />
//                       Payment Methods
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
//                       <Settings className="w-4 h-4 mr-3" />
//                       Account Settings
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//           {/* باقي التابات محتوى وهمي */}
//         </Tabs>
//       </div>
//     </div>
//   )
// }
