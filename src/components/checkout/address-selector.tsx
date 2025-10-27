import { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import CustomButton from '@/components/common/Button/CustomButton';
import LocationStep from './location-step';
import { Input } from '../common/input/input';
import { PhoneInput } from '../common/input/phone-input';
import { addAddressService, AddressPayload } from '@/services/addressService';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from 'next-intl';
import { MapPin, Plus, Tag, Phone, User, Mail } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

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
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  onAddAddress: (address: Address) => void;
  onSelect: (address: Address) => void;
  defaultAddressId?: string;
  user?: any;
  token?: string;
  selectedId?: string;
  renderAddressActions?: (address: Address) => React.ReactNode;
  forceOutOfCoverageModal?: boolean;
  onCloseOutOfCoverageModal?: () => void;
}

// Helper to parse city and state from address string
function parseCityStateFromAddress(address: string) {
  const parts = address.split(',').map(s => s.trim());
  return {
    region: parts[2] || '', // بعد ثاني فاصلة
    city: parts[3] || '', // بعد ثالث فاصلة
  };
}

export default function AddressSelector({ addresses, onAddAddress, onSelect, defaultAddressId, user, token, selectedId, renderAddressActions, forceOutOfCoverageModal = false, onCloseOutOfCoverageModal }: AddressSelectorProps) {
  const locale = useLocale();
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
  // const { t, i18n } = useTranslation();
  // const locale = i18n.language;

  // State for new address fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

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
    if (!newLocation || !label || !phone || !firstName || !lastName || !email) return;
    setSaving(true);
    setError("");
    try {
      if (!token || !user) throw new Error('You must be logged in to add an address');
      // استخراج city و state من العنوان
      const { city, region } = parseCityStateFromAddress(newLocation.address);
      // إعداد البيانات حسب الـ schema
      const payload: AddressPayload = {
        label,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address_1: newLocation.address,
        address_2: '',
        city,
        region,
        country: 'EG',
        lat: newLocation.latitude,
        long: newLocation.longitude,
      };
      const apiRes = await addAddressService(payload, token);
      // backend يعيد العنوان الجديد
      const newAddr: Address = {
        id: apiRes.id?.toString() || Date.now().toString(),
        name: `${firstName} ${lastName}`.trim(),
        phone: payload.phone,
        street: payload.address_1,
        city: payload.city,
        region: payload.region, // بدلاً من payload.state
        country: payload.country,
        notes: '',
        latitude: payload.lat,
        longitude: payload.long,
        address_1: payload.address_1,
        label: payload.label,
        isDefault: addresses.length === 0,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
      };
      onAddAddress(newAddr);
      setShowAdd(false);
      setLabel('');
      setPhone('');
      setNewLocation(null);
      setSaving(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      onSelect(newAddr);
    } catch (e: any) {
      setError(e.message || 'Failed to add address');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          تحديد عنوان
        </h2>
        <CustomButton onClick={() => setShowAdd(true)} className="cursor-pointer pb-[20px] border-none outline-none flex items-center gap-2 ">
        اضافة عنوان جديد +
        </CustomButton>
      </div>
      {/* قائمة العناوين */}
      {addresses.length === 0 && (
        <div className="text-gray-700 text-center font-semibold">No addresses found. Please add a new address.</div>
      )}
      <div className="flex flex-col space-y-3">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`relative w-full bg-white rounded-xl p-3 shadow-sm border transition-all duration-150 cursor-pointer min-h-[80px] ${selectedId === addr.id ? 'border-red-600' : 'border-gray-200'}`}
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
            {renderAddressActions && (
              <div className={`absolute bottom-[40px] ${locale === 'ar' ? 'left-[70px]' : 'right-[70px]'} cursor-pointer`}>
                {renderAddressActions(addr)}
              </div>
            )}
            {/* بيانات العنوان + الراديو */}
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="text-black font-semibold text-base leading-tight flex items-center gap-2">
                  {selectedId === addr.id && (
                    <MapPin className="w-4 h-4 text-red-600" />
                  )}
                  {addr.name || `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || '-'}
                </div>
                <div className="text-black text-sm leading-tight">{addr.address_1}</div>
                <div className="text-black text-xs leading-tight">{addr.city} - {addr.region} {addr.country && `- ${addr.country}`}</div>
              </div>
              <div className="flex flex-col items-end justify-between min-w-[90px] h-[67px]">
                <div className="text-black text-sm font-medium mb-1">{addr.phone}</div>
                <input
                  type="radio"
                  checked={selectedId === addr.id}
                  onChange={() => { onSelect(addr); }}
                  className="w-4 h-4 rounded-full border-2 border-red-600 focus:ring-2 focus:ring-red-400 pointer-events-none appearance-none bg-white checked:bg-red-600 checked:border-red-600 transition-all duration-150 mt-1"
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
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAdd(false); setLabel(''); setNewLocation(null); setError(''); setLocationCheckMsg(''); setPhone(''); setFirstName(''); setLastName(''); setEmail(''); }} />
          {/* modal */}
          <div className="relative bg-white rounded-xl p-6 shadow-lg md:max-w-[60%] w-full z-50 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => { setShowAdd(false); setLabel(''); setNewLocation(null); setError(''); setLocationCheckMsg(''); setPhone(''); setFirstName(''); setLastName(''); setEmail(''); }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="font-semibold mb-2 text-black text-center text-2xl font-bold mb-5">Add New Address</h3>
            <LocationStep onLocationSet={handleLocationSet} initialLocation={undefined} isChecking={locationCheckLoading} forceOutOfCoverageModal={forceOutOfCoverageModal} onCloseOutOfCoverageModal={onCloseOutOfCoverageModal} />
            {locationCheckMsg && (
              <div
                className={`mt-2 text-sm ${
                  locationCheckMsg.includes('✔️')
                    ? 'text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2'
                    : 'text-red-600'
                }`}
              >
                {locationCheckMsg}
              </div>
            )}
            <div className="flex gap-2 mb-2 items-center my-7">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-600" />
                  Label
                </label>
                <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Home, Work, Family..." className="text-black" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-600" />
                  Phone
                </label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 mb-2 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" />
                  First Name
                </label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="text-black" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" />
                  Last Name
                </label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="text-black" />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                Email
              </label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="text-black" />
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <div className="flex gap-2 mt-3">
              <Button onClick={handleSave} disabled={!label || !newLocation || !phone || !firstName || !lastName || !email || saving} className="bg-red-600 text-white">Save Address</Button>
              <Button variant="outline" onClick={() => { setShowAdd(false); setLabel(''); setNewLocation(null); setError(''); setLocationCheckMsg(''); setPhone(''); setFirstName(''); setLastName(''); setEmail(''); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 