"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../common/Button/Button";
import { Input } from "../common/input/input";
import { PhoneInput } from "../common/input/phone-input";
import dynamic from "next/dynamic";
import { updateAddressService } from '@/services/addressService';
import { X, Search, MapPin, User, Phone, Mail, Building, Globe, Navigation } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Label } from "../common/label/label";
import OutOfCoverageModal from "../common/ui/OutOfCoverageModal";
import { useLocale } from "next-intl";

const MapWithMarker = dynamic(() => import("./ManualMap"), { ssr: false });

export default function AddressEditModal({ address, onClose, onSave, token, forceOutOfCoverageModal = false, onCloseOutOfCoverageModal }: {
  address: any,
  onClose: () => void,
  onSave?: (updated: any) => void,
  token: string,
  forceOutOfCoverageModal?: boolean,
  onCloseOutOfCoverageModal?: () => void,
}) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  const { checkLocation, locationCheckLoading } = useAuth();
  const defaultCoords = { latitude: 30.0444, longitude: 31.2357, address: "Cairo, Egypt" };
  const lat = Number(address.lat ?? address.latitude);
  const lng = Number(address.long ?? address.longitude);
  const hasValidLatLng = !isNaN(lat) && !isNaN(lng);
  const initialLoc = hasValidLatLng
    ? { latitude: lat, longitude: lng, address: address.address_1 || address.street || '' }
    : defaultCoords;
  const [mapLoc, setMapLoc] = useState(initialLoc);
  // عند تهيئة الفورم، إذا لم يوجد first_name/last_name لكن يوجد name، قسم name تلقائياً
  const nameParts = (address.name || '').split(' ');
  const initialFirstName = address.first_name || nameParts[0] || '';
  const initialLastName = address.last_name || nameParts.slice(1).join(' ') || '';
  const [form, setForm] = useState({
    name: address.name || '',
    phone: address.phone || '',
    label: address.label || '',
    city: address.city || '',
    region: address.region || '',
    country: address.country || 'EG',
    email: address.email || '',
    first_name: initialFirstName,
    last_name: initialLastName,
    address_1: address.address_1 || address.street || '',
    latitude: initialLoc.latitude,
    longitude: initialLoc.longitude,
  });
  const [manualAddress, setManualAddress] = useState(initialLoc.address);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [locationCheckMsg, setLocationCheckMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showOutOfCoverageModal, setShowOutOfCoverageModal] = useState(false);

  // احفظ العنوان الأصلي عند فتح المودال
  const originalAddress = initialLoc.address;

  // Debounce suggestions
  useEffect(() => {
    if (!manualAddress || manualAddress.length < 3) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const isArabic = /^[\u0600-\u06FF]/.test(manualAddress.trim());
        const lang = isArabic ? 'ar' : 'en';
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=eg&accept-language=${lang}&q=${encodeURIComponent(manualAddress)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
      setSuggestLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [manualAddress]);

  // Check location coverage when mapLoc changes
  useEffect(() => {
    if (!mapLoc.latitude || !mapLoc.longitude) return;
    setLocationCheckMsg('');
    setShowOutOfCoverageModal(false);
    (async () => {
      const result = await checkLocation({
        latitude: mapLoc.latitude,
        longitude: mapLoc.longitude,
        address: mapLoc.address,
      });
      if (result.meta?.requestStatus === 'fulfilled') {
        setLocationCheckMsg(isArabic ? '✔️ هذا العنوان ضمن نطاق خدماتنا.' : '✔️ This address is within our service area.');
      } else {
        setLocationCheckMsg(isArabic ? '❌ هذا العنوان خارج نطاق خدماتنا.' : '❌ This address is outside our service area.');
        setShowOutOfCoverageModal(true);
      }
    })();
  }, [mapLoc.latitude, mapLoc.longitude, mapLoc.address, isArabic]);

  const handleMapChange = (lat: number, lng: number) => {
    setMapLoc(loc => ({ ...loc, latitude: lat, longitude: lng }));
    setForm(f => ({ ...f, latitude: lat, longitude: lng }));
  };

  const handleManualSelect = (s: any) => {
    setManualAddress(s.display_name);
    setSuggestions([]);
    setMapLoc(loc => ({ ...loc, latitude: parseFloat(s.lat), longitude: parseFloat(s.lon), address: s.display_name }));
    setForm(f => ({ ...f, latitude: parseFloat(s.lat), longitude: parseFloat(s.lon), address_1: s.display_name }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError(isArabic ? "متصفحك لا يدعم تحديد الموقع الجغرافي" : "Geolocation is not supported by this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            address = data.display_name;
          }
        } catch {}
        setMapLoc({ latitude, longitude, address });
        setForm(f => ({ ...f, latitude, longitude, address_1: address }));
        setManualAddress(address);
      },
      (error) => {
        setError(isArabic ? "فشل في الحصول على الموقع من المتصفح" : "Failed to get location from browser");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleConfirmLocation = async () => {
    setError('');
    setShowOutOfCoverageModal(false);
    const result = await checkLocation({
      latitude: mapLoc.latitude,
      longitude: mapLoc.longitude,
      address: mapLoc.address,
    });
    if (result.meta?.requestStatus === 'fulfilled') {
      setLocationCheckMsg(isArabic ? '✔️ هذا العنوان ضمن نطاق خدماتنا.' : '✔️ This address is within our service area.');
    } else {
      setLocationCheckMsg(isArabic ? '❌ هذا العنوان خارج نطاق خدماتنا.' : '❌ This address is outside our service area.');
      setShowOutOfCoverageModal(true);
    }
  };

  const handleSave = async () => {
    if (!mapLoc.latitude || !mapLoc.longitude || locationCheckMsg.startsWith('❌')) {
      setError(isArabic ? 'يرجى اختيار موقع صحيح ضمن نطاق خدماتنا!' : 'Please select a valid location within our service area!');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        id: address.id,
        label: form.label,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        address_1: mapLoc.address,
        address_2: '',
        city: form.city,
        region: form.region,
        country: form.country,
        lat: form.latitude,
        long: form.longitude,
      };
      await updateAddressService(payload, token);
      // إذا كان هناك name في العنوان الأصلي، حدثه ليكون دمج first_name و last_name
      const updated = {
        ...address,
        ...form,
        address_1: mapLoc.address,
        latitude: form.latitude,
        longitude: form.longitude,
      };
      if ('name' in address) {
        updated.name = `${form.first_name} ${form.last_name}`.trim();
      }
      if (onSave) onSave(updated);
      onClose();
    } catch (e: any) {
      setError(isArabic ? (e.message || 'فشل في تحديث العنوان') : (e.message || 'Failed to update address'));
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] relative flex flex-col">
        {/* Header - Fixed */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={onClose} aria-label={isArabic ? "إغلاق" : "Close"}>
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 pr-8">
            <MapPin className="w-5 h-5 text-red-600" />
            {isArabic ? 'تعديل العنوان' : 'Edit Address'}
          </h2>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Personal Information Section */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {isArabic ? 'الاسم الأول' : 'First Name'}
                </Label>
                <Input 
                  placeholder={isArabic ? "الاسم الأول" : "First Name"} 
                  value={form.first_name} 
                  onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {isArabic ? 'الاسم الأخير' : 'Last Name'}
                </Label>
                <Input 
                  placeholder={isArabic ? "الاسم الأخير" : "Last Name"} 
                  value={form.last_name} 
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-red-500" />
                  {isArabic ? 'رقم الهاتف' : 'Phone'}
                </Label>
                <PhoneInput
                  value={form.phone}
                  onChange={(value) => setForm(f => ({ ...f, phone: value }))}
                  placeholder={isArabic ? "رقم الهاتف" : "Phone"}
                  required
                />
              </div>
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-red-500" />
                  {isArabic ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <Input 
                  placeholder={isArabic ? "البريد الإلكتروني" : "Email"} 
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                />
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="p-3 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 text-sm mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {isArabic ? 'تفاصيل العنوان' : 'Address Details'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {isArabic ? 'التسمية' : 'Label'}
                </Label>
                <Input 
                  placeholder={isArabic ? "مثال: المنزل، العمل" : "e.g., Home, Work"} 
                  value={form.label} 
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-green-500" />
                  {isArabic ? 'المدينة' : 'City'}
                </Label>
                <Input 
                  placeholder={isArabic ? "المدينة" : "City"} 
                  value={form.city} 
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-green-500" />
                  {isArabic ? 'المنطقة' : 'Region'}
                </Label>
                <Input 
                  placeholder={isArabic ? "المنطقة" : "Region"} 
                  value={form.region} 
                  onChange={e => setForm(f => ({ ...f, region: e.target.value }))} 
                />
              </div>
            </div>
          </div>

          {/* Location Search Section */}
          <div className="p-3 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {isArabic ? 'البحث عن العنوان' : 'Address Search'}
            </h3>
            <div className="relative mb-3">
              <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder={isArabic ? "اكتب عنوانك بالتفصيل..." : "Type your address in detail..."}
                className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-black border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-lg shadow-sm`}
                autoComplete="off"
              />
              {suggestLoading && (
                <div className={`absolute ${isArabic ? 'left-3' : 'right-3'} top-2 text-xs text-gray-400`}>
                  {isArabic ? 'جاري البحث...' : 'Searching...'}
                </div>
              )}
              {/* تظهر الاقتراحات فقط إذا المستخدم غير العنوان */}
              {manualAddress !== originalAddress && suggestions.length > 0 && (
                <ul className="absolute left-0 top-full z-[9999] bg-white border-2 border-orange-200 w-full max-h-48 overflow-auto rounded-lg shadow-lg mt-1">
                  {suggestions.map(s => (
                    <li
                      key={s.place_id}
                      className="p-2 hover:bg-orange-50 cursor-pointer text-sm font-medium text-gray-800 border-b border-orange-100 last:border-b-0"
                      onClick={() => handleManualSelect(s)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="truncate">{s.display_name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Button 
                type="button" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2" 
                onClick={handleGetLocation}
              >
                <Navigation className="w-4 h-4" />
                {isArabic ? 'احصل على موقعي' : 'Get My Location'}
              </Button>
            </div>
          </div>

          {/* Map Section */}
          <div className="p-3 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {isArabic ? 'الخريطة والموقع' : 'Map & Location'}
            </h3>
            <div className="mb-2">
              <MapWithMarker lat={mapLoc.latitude} lng={mapLoc.longitude} onChange={handleMapChange} />
              {/* <div className="mt-2 text-xs text-gray-700 text-center">
                {isArabic ? 'خط العرض' : 'Lat'}: {mapLoc.latitude?.toFixed(5)}, {isArabic ? 'خط الطول' : 'Lng'}: {mapLoc.longitude?.toFixed(5)}
              </div> */}
            </div>
          </div>

          {/* Status Messages */}
          {locationCheckMsg && (
            <div
              className={`text-sm p-2 rounded-lg ${
                locationCheckMsg.startsWith('✔️')
                  ? 'text-green-700 bg-green-50 border border-green-200'
                  : 'text-red-600 bg-red-50 border border-red-200'
              }`}
            >
              {locationCheckMsg}
            </div>
          )}
          {error && <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-sm font-semibold" 
            onClick={handleSave} 
            loading={saving} 
            disabled={locationCheckMsg.startsWith('❌') || locationCheckLoading}
          >
            {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التغييرات' : 'Save Changes')}
          </Button>
        </div>
      </div>
      {(showOutOfCoverageModal || forceOutOfCoverageModal) && (
          <OutOfCoverageModal onClose={() => {
              setShowOutOfCoverageModal(false);
              if (onCloseOutOfCoverageModal) {
                onCloseOutOfCoverageModal();
              }
            }}/>     
       )}
    </div>
  );
} 

