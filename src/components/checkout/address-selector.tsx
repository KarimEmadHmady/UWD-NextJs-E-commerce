import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/card/card';
import { Button } from '@/components/common/Button/Button';
import LocationStep from './location-step';
import { Input } from '../common/input/input';
import { addAddressService, AddressPayload } from '@/services/addressService';
import { useAuth } from '@/hooks/useAuth';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  country: string;
  notes?: string;
  isDefault?: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  address_1?: string;
  label?: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  onAddAddress: (address: Address) => void;
  onSelect: (address: Address) => void;
  defaultAddressId?: string;
  user?: any;
  token?: string;
  selectedId?: string;
}

export default function AddressSelector({ addresses, onAddAddress, onSelect, defaultAddressId, user, token, selectedId }: AddressSelectorProps) {
  const [showAdd, setShowAdd] = useState(false);
  // Remove internal selectedId state, use prop instead
  // const [selectedId, setSelectedId] = useState(defaultAddressId || addresses[0]?.id || '');
  const [label, setLabel] = useState('');
  const [phone, setPhone] = useState('');
  const [newLocation, setNewLocation] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [locationCheckMsg, setLocationCheckMsg] = useState('');
  const { checkLocation, locationCheckLoading } = useAuth();

  // عند اختيار موقع جديد من الماب
  const handleLocationSet = async (loc: any) => {
    setLocationCheckMsg('');
    setError('');
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
    } else {
      setLocationCheckMsg('❌ This address is outside our service area.');
      setNewLocation(null);
    }
  };

  const handleSave = async () => {
    if (!newLocation || !label || !phone) return;
    setSaving(true);
    setError('');
    try {
      if (!token || !user) throw new Error('You must be logged in to add an address');
      // إعداد البيانات حسب الـ schema
      const payload: AddressPayload = {
        label,
        first_name: user.name || user.username || '',
        last_name: '',
        email: user.email || '',
        phone,
        address_1: newLocation.address,
        address_2: '',
        city: newLocation.city || '',
        state: newLocation.region || '',
        country: 'EG',
        lat: newLocation.latitude,
        long: newLocation.longitude,
      };
      const apiRes = await addAddressService(payload, token);
      // backend يعيد العنوان الجديد
      const newAddr: Address = {
        id: apiRes.id?.toString() || Date.now().toString(),
        name: payload.first_name,
        phone: payload.phone,
        street: payload.address_1,
        city: payload.city,
        region: payload.state,
        country: payload.country,
        notes: '',
        latitude: payload.lat,
        longitude: payload.long,
        address_1: payload.address_1,
        label: payload.label,
        isDefault: addresses.length === 0,
      };
      onAddAddress(newAddr);
      setShowAdd(false);
      setLabel('');
      setPhone('');
      setNewLocation(null);
      setSaving(false);
      onSelect(newAddr);
    } catch (e: any) {
      setError(e.message || 'Failed to add address');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black">Select Address</h2>
        <Button onClick={() => setShowAdd(true)} variant="outline">Add New Address</Button>
      </div>
      {/* قائمة العناوين */}
      {addresses.length === 0 && (
        <div className="text-gray-700 text-center font-semibold">No addresses found. Please add a new address.</div>
      )}
      <div className="flex flex-col space-y-3">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`relative w-full bg-white rounded-xl p-3 shadow-sm border transition-all duration-150 cursor-pointer min-h-[80px] ${selectedId === addr.id ? 'border-teal-600' : 'border-gray-200'}`}
            onClick={() => { onSelect(addr); }}
          >
            {/* صف أعلى البطاقة: label يسار و Default يمين */}
            <div className="flex flex-row justify-between items-center mb-2">
              {addr.label ? (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold shadow border border-blue-200 z-20">
                  {addr.label}
                </span>
              ) : <span />}
              {addr.isDefault && (
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200 z-20">Default</span>
              )}
            </div>
            {/* بيانات العنوان + الراديو */}
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="text-black font-semibold text-base leading-tight">{addr.name}</div>
                <div className="text-black text-sm leading-tight">{addr.address_1}</div>
                <div className="text-black text-xs leading-tight">{addr.city} - {addr.region} {addr.country && `- ${addr.country}`}</div>
              </div>
              <div className="flex flex-col items-end justify-between min-w-[90px] h-[67px]">
                <div className="text-black text-sm font-medium mb-1">{addr.phone}</div>
                <input
                  type="radio"
                  checked={selectedId === addr.id}
                  onChange={() => { onSelect(addr); }}
                  className="w-4 h-4 rounded-full border-2 border-teal-600 focus:ring-2 focus:ring-teal-400 pointer-events-none appearance-none bg-white checked:bg-teal-600 checked:border-teal-600 transition-all duration-150 mt-1"
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* إضافة عنوان جديد */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAdd(false); setLabel(''); setNewLocation(null); setError(''); setLocationCheckMsg(''); setPhone(''); }} />
          {/* modal */}
          <div className="relative bg-white rounded-xl p-6 shadow-lg md:max-w-[60%] w-full z-50">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => { setShowAdd(false); setLabel(''); setNewLocation(null); setError(''); setLocationCheckMsg(''); setPhone(''); }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="font-semibold mb-2 text-black">Add New Address</h3>
            <div className="flex gap-2 mb-2 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black">Label</label>
                <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Home, Work, Family..." className="text-black" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black">Phone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="text-black" />
              </div>
            </div>
            <LocationStep onLocationSet={handleLocationSet} initialLocation={undefined} isChecking={locationCheckLoading} />
            {locationCheckMsg && <div className={`mt-2 text-sm ${locationCheckMsg.includes('✔️') ? 'text-green-600' : 'text-red-600'}`}>{locationCheckMsg}</div>}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <div className="flex gap-2 mt-3">
              <Button onClick={handleSave} disabled={!label || !newLocation || !phone || saving} className="bg-teal-600 text-white">Save Address</Button>
              <Button variant="outline" onClick={() => { setShowAdd(false); setLabel(''); setNewLocation(null); setError(''); setLocationCheckMsg(''); setPhone(''); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 