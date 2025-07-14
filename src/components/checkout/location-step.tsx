// "use client"

// import { useState } from "react"
// import { MapPin, Navigation, Search, Check } from "lucide-react"
// import { Button } from "../common/Button/Button"
// import { Input } from "../common/input/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"

// interface LocationData {
//   latitude: number
//   longitude: number
//   address: string
//   city: string
//   country: string
// }

// interface LocationStepProps {
//   onLocationSet: (location: LocationData) => void
// }

// export default function LocationStep({ onLocationSet }: LocationStepProps) {
//   const [isGettingLocation, setIsGettingLocation] = useState(false)
//   const [manualAddress, setManualAddress] = useState("")
//   const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
//   const [locationError, setLocationError] = useState<string | null>(null)

//   const getCurrentLocation = () => {
//     setIsGettingLocation(true)
//     setLocationError(null)

//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by this browser")
//       setIsGettingLocation(false)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords

//         try {
//           // Simulate reverse geocoding API call
//           await new Promise((resolve) => setTimeout(resolve, 1500))

//           const locationData: LocationData = {
//             latitude,
//             longitude,
//             address: "123 Main Street, Downtown",
//             city: "New York",
//             country: "United States",
//           }

//           setCurrentLocation(locationData)
//           setIsGettingLocation(false)
//         } catch (error) {
//           setLocationError("Failed to get address details")
//           setIsGettingLocation(false)
//         }
//       },
//       (error) => {
//         let errorMessage = "Failed to get location"
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = "Location access denied by user"
//             break
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = "Location information unavailable"
//             break
//           case error.TIMEOUT:
//             errorMessage = "Location request timed out"
//             break
//         }
//         setLocationError(errorMessage)
//         setIsGettingLocation(false)
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 60000,
//       },
//     )
//   }

//   const handleManualAddress = () => {
//     if (!manualAddress.trim()) return

//     // Simulate geocoding API call
//     const locationData: LocationData = {
//       latitude: 40.7128,
//       longitude: -74.006,
//       address: manualAddress,
//       city: "New York",
//       country: "United States",
//     }

//     setCurrentLocation(locationData)
//   }

//   const confirmLocation = () => {
//     if (currentLocation) {
//       onLocationSet(currentLocation)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div className="text-center mb-8">
//         <MapPin className="w-16 h-16 text-pink-600 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Delivery Location</h2>
//         <p className="text-gray-600">We need your location to calculate shipping costs and delivery time</p>
//       </div>

//       {/* Auto Location Detection */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Navigation className="w-5 h-5 text-pink-600" />
//             Use Current Location
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-600 mb-4">Allow us to detect your current location automatically</p>
//           <Button
//             onClick={getCurrentLocation}
//             disabled={isGettingLocation}
//             className="w-full bg-pink-600 hover:bg-pink-700"
//           >
//             {isGettingLocation ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Getting Location...
//               </>
//             ) : (
//               <>
//                 <MapPin className="w-4 h-4 mr-2" />
//                 Get My Location
//               </>
//             )}
//           </Button>
//           {locationError && <p className="text-red-500 text-sm mt-2">{locationError}</p>}
//         </CardContent>
//       </Card>

//       {/* Manual Address Input */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Search className="w-5 h-5 text-gray-600" />
//             Enter Address Manually
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2">
//             <Input
//               type="text"
//               placeholder="Enter your full address"
//               value={manualAddress}
//               onChange={(e) => setManualAddress(e.target.value)}
//               className="flex-1"
//             />
//             <Button onClick={handleManualAddress} variant="outline" disabled={!manualAddress.trim()}>
//               Search
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Location Confirmation */}
//       {currentLocation && (
//         <Card className="border-green-200 bg-green-50">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-green-800">
//               <Check className="w-5 h-5" />
//               Location Found
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2 mb-4">
//               <p className="font-medium text-gray-900">{currentLocation.address}</p>
//               <p className="text-gray-600">
//                 {currentLocation.city}, {currentLocation.country}
//               </p>
//               <p className="text-sm text-gray-500">
//                 Coordinates: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
//               </p>
//             </div>
//             <Button onClick={confirmLocation} className="w-full bg-green-600 hover:bg-green-700">
//               Confirm This Location
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {/* Popular Locations */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Popular Delivery Areas</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//             {["Manhattan, NY", "Brooklyn, NY", "Queens, NY", "Bronx, NY"].map((area) => (
//               <Button
//                 key={area}
//                 variant="outline"
//                 onClick={() => {
//                   setManualAddress(area)
//                   handleManualAddress()
//                 }}
//                 className="justify-start bg-transparent"
//               >
//                 <MapPin className="w-4 h-4 mr-2" />
//                 {area}
//               </Button>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import { MapPin, Navigation, Search, Check } from "lucide-react"
import { Button } from "../common/Button/Button"
import { Input } from "../common/input/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"

interface LocationData {
  latitude: number
  longitude: number
  address: string
  city: string
  country: string
}

interface LocationStepProps {
  onLocationSet: (location: LocationData) => void
}

export default function LocationStep({ onLocationSet }: LocationStepProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [manualAddress, setManualAddress] = useState("")
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          await new Promise((resolve) => setTimeout(resolve, 1500))

          const locationData: LocationData = {
            latitude,
            longitude,
            address: "Tahrir Street, Downtown",
            city: "Cairo",
            country: "Egypt",
          }

          setCurrentLocation(locationData)
          setIsGettingLocation(false)
        } catch (error) {
          setLocationError("Failed to get address details")
          setIsGettingLocation(false)
        }
      },
      (error) => {
        let errorMessage = "Failed to get location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const handleManualAddress = () => {
    if (!manualAddress.trim()) return

    const locationData: LocationData = {
      latitude: 30.0444,
      longitude: 31.2357,
      address: manualAddress,
      city: "Cairo",
      country: "Egypt",
    }

    setCurrentLocation(locationData)
  }

  const confirmLocation = () => {
    if (currentLocation) {
      onLocationSet(currentLocation)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-pink-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Delivery Location</h2>
        <p className="text-gray-600">We need your location to calculate shipping costs and delivery time</p>
      </div>

      {/* Auto Location Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-pink-600" />
            Use Current Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Allow us to detect your current location automatically</p>
          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            {isGettingLocation ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Get My Location
              </>
            )}
          </Button>
          {locationError && <p className="text-red-500 text-sm mt-2">{locationError}</p>}
        </CardContent>
      </Card>

      {/* Manual Address Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-600" />
            Enter Address Manually
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your full address"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleManualAddress} variant="outline" disabled={!manualAddress.trim()}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Location Confirmation */}
      {currentLocation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              Location Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="font-medium text-gray-900">{currentLocation.address}</p>
              <p className="text-gray-600">
                {currentLocation.city}, {currentLocation.country}
              </p>
              <p className="text-sm text-gray-500">
                Coordinates: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </p>
            </div>
            <Button onClick={confirmLocation} className="w-full bg-green-600 hover:bg-green-700">
              Confirm This Location
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Popular Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Delivery Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Nasr City", "Zamalek", "Maadi", "New Cairo"].map((area) => (
              <Button
                key={area}
                variant="outline"
                onClick={() => {
                  setManualAddress(area)
                  handleManualAddress()
                }}
                className="justify-start bg-transparent"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {area}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
