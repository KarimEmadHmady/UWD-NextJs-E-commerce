import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/card/card";
import { Input } from "../common/input/input";
import { PhoneInput } from "../common/input/phone-input";
import { Button } from "../common/Button/Button";

interface CustomerInfoStepProps {
  onCustomerInfoSet: (info: any, shippingMethod: string) => void;
  initialInfo?: any;
  initialShippingMethod?: string;
}

export default function CustomerInfoStep({ onCustomerInfoSet, initialInfo, initialShippingMethod }: CustomerInfoStepProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    region: '',
    notes: '',
  });
  const [shippingMethod, setShippingMethod] = useState('');
  const [formError, setFormError] = useState('');

  // عند mount أو تغيير initialInfo/initialShippingMethod، املأ state
  useEffect(() => {
    if (initialInfo) setForm(initialInfo);
    if (initialShippingMethod) setShippingMethod(initialShippingMethod);
  }, [initialInfo, initialShippingMethod]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setForm({ ...form, phone: value });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!form.phone || form.phone.length !== 11 || !form.phone.startsWith('01')) {
      setFormError('Phone must be 11 digits starting with 01');
      return;
    }
    if (!form.street.trim() || !form.city.trim() || !form.region.trim()) {
      setFormError('Street, City, and Region are required');
      return;
    }
    if (!shippingMethod) {
      setFormError('Please select a shipping method');
      return;
    }
    setFormError('');
    onCustomerInfoSet(form, shippingMethod);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Information & Shipping</h2>
        <p className="text-gray-600">Enter your details and choose a shipping method</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">

            <Button
              variant={shippingMethod === 'Standard' ? 'default' : 'outline'}
              className={shippingMethod === 'Standard' ? 'bg-red-600 text-white' : ''}
              onClick={() => setShippingMethod('Standard')}
            >
              Standard Delivery (E.L 50, 3-5 days)
            </Button>
            <Button
              variant={shippingMethod === 'Pickup in Store' ? 'default' : 'outline'}
              className={shippingMethod === 'Pickup in Store' ? 'bg-red-600 text-white' : ''}
              onClick={() => setShippingMethod('Pickup in Store')}
            >
              Pickup in Store 
            </Button>
            <Button
              variant={shippingMethod === 'Dine in' ? 'default' : 'outline'}
              className={shippingMethod === 'Dine in' ? 'bg-red-600 text-white' : ''}
              onClick={() => setShippingMethod('Dine in')}
            >
              Dine in
            </Button>
          </div>
          {shippingMethod === 'Pickup in Store' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-red-800 text-[12px]">
              📍 Thanks for choosing pickup in store! Your order will be ready for collection one hour after confirmation <br />
              ⚠️ Kindly wait at least one hour before coming to pick it up in store.
            </div>
          )}
        </CardContent>
      </Card>
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">Continue to Payment</Button>
      <Card>
        <CardHeader>
          <CardTitle>Customer Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input id="name" placeholder="Full Name" value={form.name} onChange={handleFormChange} required />
            <PhoneInput
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="Phone Number"
              required
            />
            <Input id="street" placeholder="Street" value={form.street} onChange={handleFormChange} required />
            <Input id="city" placeholder="City" value={form.city} onChange={handleFormChange} required />
            <Input id="region" placeholder="Region" value={form.region} onChange={handleFormChange} required />
            <Input id="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleFormChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 