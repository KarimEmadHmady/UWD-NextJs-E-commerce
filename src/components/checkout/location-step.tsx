"use client"

import { useState, useEffect } from "react";
import { MapPin, Navigation, Check } from "lucide-react";
import { Button } from "../common/Button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationStepProps {
  onLocationSet: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

export default function LocationStep({ onLocationSet, initialLocation }: LocationStepProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // عند mount، إذا كان initialLocation موجود، املأ currentLocation
  useEffect(() => {
    if (initialLocation) setCurrentLocation(initialLocation);
  }, [initialLocation]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // جلب العنوان النصي من Nominatim
        let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            address = data.display_name;
          }
        } catch (e) {
          // احتفظ بالعنوان الافتراضي إذا فشل الطلب
        }
        setCurrentLocation({ latitude, longitude, address });
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const confirmLocation = () => {
    if (currentLocation) {
      onLocationSet(currentLocation);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-pink-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Delivery Location</h2>
        <p className="text-gray-600">We need your location to calculate shipping costs and delivery time</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-pink-600" />
            Use Current Location
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <p className="text-sm text-gray-500">
                Coordinates: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </p>
              {/* خريطة Google Maps */}
              <div className="mt-2">
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
            </div>
            <Button onClick={confirmLocation} className="w-full bg-green-600 hover:bg-green-700">
              Confirm This Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
