"use client"

import { useState, useEffect } from "react";
import { MapPin, Navigation, Check, Loader2 } from "lucide-react";
import { Button } from "../common/Button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card";
import { Input } from "@/components/common/input/input";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationStepProps {
  onLocationSet: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

// مكون الخريطة التفاعلية (يتم تحميله ديناميكياً لدعم SSR)
const MapWithMarker = dynamic(() => import("./ManualMap"), { ssr: false });

export default function LocationStep({ onLocationSet, initialLocation }: LocationStepProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualLatLng, setManualLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [manualLoading, setManualLoading] = useState(false);

  // حالة الموقع التلقائي (currentLocation) + marker
  const [currentMarker, setCurrentMarker] = useState<{lat: number, lng: number} | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [currentReverseLoading, setCurrentReverseLoading] = useState(false);

  // حالة العنوان اليدوي: العنوان النصي الناتج من reverse geocoding
  const [manualReverseAddress, setManualReverseAddress] = useState<string>("");
  const [manualReverseLoading, setManualReverseLoading] = useState(false);

  // عند mount، إذا كان initialLocation موجود، املأ currentLocation
  useEffect(() => {
    if (initialLocation) setCurrentLocation(initialLocation);
  }, [initialLocation]);

  // عند جلب الموقع التلقائي، حدث marker والعنوان
  useEffect(() => {
    if (currentLocation) {
      setCurrentMarker({ lat: currentLocation.latitude, lng: currentLocation.longitude });
      setCurrentAddress(currentLocation.address);
    }
  }, [currentLocation]);

  // عند تغيير marker في الموقع التلقائي، نفذ reverse geocoding
  useEffect(() => {
    const fetchAddress = async () => {
      if (currentMarker) {
        setCurrentReverseLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentMarker.lat}&lon=${currentMarker.lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setCurrentAddress(data.display_name);
          } else {
            setCurrentAddress(`Lat: ${currentMarker.lat.toFixed(4)}, Lng: ${currentMarker.lng.toFixed(4)}`);
          }
        } catch {
          setCurrentAddress(`Lat: ${currentMarker.lat.toFixed(4)}, Lng: ${currentMarker.lng.toFixed(4)}`);
        }
        setCurrentReverseLoading(false);
      }
    };
    if (currentMarker && (currentMarker.lat !== currentLocation?.latitude || currentMarker.lng !== currentLocation?.longitude)) {
      fetchAddress();
    }
  }, [currentMarker]);

  // عند تغيير manualLatLng، نفذ reverse geocoding
  useEffect(() => {
    const fetchManualAddress = async () => {
      if (manualLatLng) {
        setManualReverseLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${manualLatLng.lat}&lon=${manualLatLng.lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setManualReverseAddress(data.display_name);
          } else {
            setManualReverseAddress(`Lat: ${manualLatLng.lat.toFixed(4)}, Lng: ${manualLatLng.lng.toFixed(4)}`);
          }
        } catch {
          setManualReverseAddress(`Lat: ${manualLatLng.lat.toFixed(4)}, Lng: ${manualLatLng.lng.toFixed(4)}`);
        }
        setManualReverseLoading(false);
      }
    };
    if (manualLatLng) {
      fetchManualAddress();
    }
  }, [manualLatLng]);

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

  const searchManualLocation = async () => {
    setManualError(null);
    setManualLatLng(null);
    if (!manualAddress.trim()) {
      setManualError("Please enter your address");
      return;
    }
    setManualLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualAddress)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setManualLatLng({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        setManualError("Location not found. Try a more specific address.");
      }
    } catch {
      setManualError("Failed to fetch location. Try again.");
    }
    setManualLoading(false);
  };

  // أعد تعريف دالة تأكيد الموقع الحالي
  const confirmLocation = () => {
    if (currentLocation) {
      onLocationSet(currentLocation);
    }
  };

  // عند التأكيد، أرسل الإحداثيات والعنوان الحالي
  const confirmCurrentMarker = () => {
    if (currentMarker && currentAddress) {
      onLocationSet({ latitude: currentMarker.lat, longitude: currentMarker.lng, address: currentAddress });
    }
  };

  // عند التأكيد، أرسل العنوان الناتج من reverse geocoding
  const confirmManualAddress = () => {
    if (!manualLatLng) {
      setManualError("Please search and select a valid location");
      return;
    }
    setManualError(null);
    onLocationSet({ address: manualReverseAddress || manualAddress.trim(), latitude: manualLatLng.lat, longitude: manualLatLng.lng });
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-600" />
            Enter Address Manually
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input
              value={manualAddress}
              onChange={e => setManualAddress(e.target.value)}
              placeholder="Enter your delivery address"
            />
            <Button onClick={searchManualLocation} className="bg-pink-600 hover:bg-pink-700 px-3" disabled={manualLoading}>
              {manualLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find your location"}
            </Button>
          </div>
          {manualError && <p className="text-red-500 text-sm mb-2">{manualError}</p>}
          {manualLatLng && (
            <div className="mb-2 w-full h-[280px] rounded overflow-hidden">
              <MapWithMarker
                lat={manualLatLng.lat}
                lng={manualLatLng.lng}
                onChange={(lat: number, lng: number) => setManualLatLng({ lat, lng })}
              />
              <p className="font-medium text-gray-900">
                {manualReverseLoading ? "Loading address..." : manualReverseAddress}
              </p>
              <p className="text-xs text-gray-500 mt-1">Lat: {manualLatLng.lat.toFixed(5)}, Lng: {manualLatLng.lng.toFixed(5)}</p>
            </div>
          )}
          <Button
            onClick={confirmManualAddress}
            className="w-full bg-pink-600 hover:bg-pink-700"
            disabled={!manualLatLng}
          >
            Confirm Manual Address
          </Button>
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
              {/* خريطة تفاعلية مع marker */}
              <div className="mb-2 w-full h-[220px] rounded overflow-hidden">
                <MapWithMarker
                  lat={currentMarker?.lat || currentLocation.latitude}
                  lng={currentMarker?.lng || currentLocation.longitude}
                  onChange={(lat: number, lng: number) => setCurrentMarker({ lat, lng })}
                />
              </div>
              <p className="font-medium text-gray-900">
                {currentReverseLoading ? "Loading address..." : currentAddress}
              </p>
              <p className="text-sm text-gray-500">
                Coordinates: {(currentMarker?.lat || currentLocation.latitude).toFixed(4)}, {(currentMarker?.lng || currentLocation.longitude).toFixed(4)}
              </p>
            </div>
            <Button onClick={confirmCurrentMarker} className="w-full bg-green-600 hover:bg-green-700">
              Confirm This Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
