import React, { useState, useEffect } from "react";
import { Button } from "../common/Button/Button";
import { Input } from "../common/input/input";
import dynamic from "next/dynamic";
import { updateAddressService } from '@/services/addressService';
import { X, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Label } from "../common/label/label";
import OutOfCoverageModal from "../common/ui/OutOfCoverageModal";

const MapWithMarker = dynamic(() => import("./ManualMap"), { ssr: false });

export default function AddressEditModal({ address, onClose, onSave, token, forceOutOfCoverageModal = false, onCloseOutOfCoverageModal }: {
  address: any,
  onClose: () => void,
  onSave?: (updated: any) => void,
  token: string,
  forceOutOfCoverageModal?: boolean,
  onCloseOutOfCoverageModal?: () => void,
}) {
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
    (async () => {
      const result = await checkLocation({
        latitude: mapLoc.latitude,
        longitude: mapLoc.longitude,
        address: mapLoc.address,
      });
      if (result.meta?.requestStatus === 'fulfilled') {
        setLocationCheckMsg('✔️ This address is within our service area.');
      } else {
        setLocationCheckMsg('❌ This address is outside our service area.');
      }
    })();
  }, [mapLoc.latitude, mapLoc.longitude, mapLoc.address]);

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
      setError("Geolocation is not supported by this browser");
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
        setError("Failed to get location from browser");
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
      setLocationCheckMsg('✔️ This address is within our service area.');
    } else {
      setLocationCheckMsg('❌ This address is outside our service area.');
      setShowOutOfCoverageModal(true);
    }
  };

  const handleSave = async () => {
    if (!mapLoc.latitude || !mapLoc.longitude || locationCheckMsg.startsWith('❌')) {
      setError('Please select a valid location within our service area!');
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
      setError(e.message || 'Failed to update address');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative my-4">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={onClose} aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold mb-2 text-gray-900">Edit Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-2">
          <div>
            <Label className="text-xs mb-1">Label</Label>
            <Input placeholder="Label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs mb-1">First Name</Label>
            <Input placeholder="First Name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs mb-1">Last Name</Label>
            <Input placeholder="Last Name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs mb-1">Phone</Label>
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs mb-1">Email</Label>
            <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs mb-1">City</Label>
            <Input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs mb-1">Region</Label>
            <Input placeholder="Region" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} />
          </div>
        </div>
        {/* حقل البحث عن العنوان */}
        <div className="mb-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <Input
            value={manualAddress}
            onChange={e => setManualAddress(e.target.value)}
            placeholder="Search for your address..."
            className="w-full pl-8 text-black border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-lg shadow-sm"
            autoComplete="off"
          />
          {suggestLoading && <div className="absolute right-2 top-2 text-xs text-gray-400">Loading...</div>}
          {/* تظهر الاقتراحات فقط إذا المستخدم غير العنوان */}
          {manualAddress !== originalAddress && suggestions.length > 0 && (
            <ul className="absolute left-0 top-full z-[9999] bg-white border w-full max-h-72 overflow-auto rounded shadow-lg mt-1">
              {suggestions.map(s => (
                <li
                  key={s.place_id}
                  className="p-2 hover:bg-teal-100 cursor-pointer text-sm font-medium text-gray-800"
                  onClick={() => handleManualSelect(s)}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <Button type="button" className="bg-teal-500 text-white px-3 py-1 rounded text-xs" onClick={handleGetLocation}>
            Get My Location
          </Button>
        </div>
        <div className="mb-2">
          <MapWithMarker lat={mapLoc.latitude} lng={mapLoc.longitude} onChange={handleMapChange} />
          <div className="mt-1 text-xs text-gray-700">Lat: {mapLoc.latitude?.toFixed(5)}, Lng: {mapLoc.longitude?.toFixed(5)}</div>
        </div>
        {locationCheckMsg && <div className={`mb-2 text-xs ${locationCheckMsg.startsWith('✔️') ? 'text-green-600' : 'text-red-600'}`}>{locationCheckMsg}</div>}
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}

        <Button className="w-full bg-teal-600 text-white py-2 text-sm" onClick={handleSave} loading={saving} disabled={locationCheckMsg.startsWith('❌') || locationCheckLoading}>
          Save Changes
        </Button>
      </div>
      {(showOutOfCoverageModal || forceOutOfCoverageModal) && (
        <OutOfCoverageModal onClose={onCloseOutOfCoverageModal || (() => setShowOutOfCoverageModal(false))} />
      )}
    </div>
  );
} 