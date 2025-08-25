import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/card/card";
import { Input } from "../common/input/input";
import { PhoneInput } from "../common/input/phone-input";
import { Button } from "../common/Button/Button";
import { Truck, Store, Utensils, User as UserIcon, CheckCircle } from "lucide-react";

interface CustomerInfoStepProps {
  onCustomerInfoSet: (info: any, shippingMethod: string) => void;
  initialInfo?: any;
  initialShippingMethod?: string;
  continueLabel?: string;
  onShippingSelected?: (method: string) => void;
}

export default function CustomerInfoStep({ onCustomerInfoSet, initialInfo, initialShippingMethod, continueLabel, onShippingSelected }: CustomerInfoStepProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
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
      setFormError(isArabic ? 'الاسم مطلوب' : 'Name is required');
      return;
    }
    if (!form.phone || form.phone.length !== 11 || !form.phone.startsWith('01')) {
      setFormError(isArabic ? 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01' : 'Phone must be 11 digits starting with 01');
      return;
    }
    if (!form.street.trim() || !form.city.trim() || !form.region.trim()) {
      setFormError(isArabic ? 'الشارع، المدينة، والمنطقة مطلوبة' : 'Street, City, and Region are required');
      return;
    }
    if (!shippingMethod) {
      setFormError(isArabic ? 'يرجى اختيار طريقة الشحن' : 'Please select a shipping method');
      return;
    }
    setFormError('');
    // Notify parent about the chosen shipping method so it can run side-effects (e.g., branch modal)
    if (onShippingSelected) onShippingSelected(shippingMethod);
    onCustomerInfoSet(form, shippingMethod);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{isArabic ? 'معلومات العميل والشحن' : 'Customer Information & Shipping'}</h2>
        <p className="text-gray-600">{isArabic ? 'أدخل بياناتك واختر طريقة الشحن' : 'Enter your details and choose a shipping method'}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-600" />
              {isArabic ? 'طريقة الشحن' : 'Shipping Method'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              variant={shippingMethod === 'Standard' ? 'default' : 'outline'}
              className={shippingMethod === 'Standard' ? 'bg-red-600 text-white' : ''}
              onClick={() => { setShippingMethod('Standard'); }}
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                {isArabic ? 'توصيل عادي (50 جنيه، 3-5 أيام)' : 'Standard Delivery (E.L 50, 3-5 days)'}
              </span>
            </Button>
            <Button
              variant={shippingMethod === 'Pickup in Store' ? 'default' : 'outline'}
              className={shippingMethod === 'Pickup in Store' ? 'bg-red-600 text-white' : ''}
              onClick={() => { setShippingMethod('Pickup in Store'); }}
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                {isArabic ? 'استلام من المتجر' : 'Pickup in Store'}
              </span>
            </Button>
            <Button
              variant={shippingMethod === 'Dine in' ? 'default' : 'outline'}
              className={shippingMethod === 'Dine in' ? 'bg-red-600 text-white' : ''}
              onClick={() => { setShippingMethod('Dine in'); }}
            >
              <span className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                {isArabic ? 'تناول في المطعم' : 'Dine in'}
              </span>
            </Button>
          </div>
          {shippingMethod === 'Pickup in Store' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-red-800 text-[12px]">
              {isArabic ? (
                <>
                  📍 شكرًا لاختيارك الاستلام من المتجر! سيكون طلبك جاهزًا للاستلام بعد ساعة من التأكيد<br />
                  ⚠️ يرجى الانتظار ساعة على الأقل قبل الحضور للاستلام من المتجر.
                </>
              ) : (
                <>
                  📍 Thanks for choosing pickup in store! Your order will be ready for collection one hour after confirmation <br />
                  ⚠️ Kindly wait at least one hour before coming to pick it up in store.
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
        <span className="flex items-center justify-center gap-2 w-full">
          <CheckCircle className="w-4 h-4" />
          {continueLabel ? continueLabel : (isArabic ? 'متابعة إلى الدفع' : 'Continue to Payment')}
        </span>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-red-600" />
              {isArabic ? 'معلومات العميل' : 'Customer Info'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input id="name" placeholder={isArabic ? 'الاسم بالكامل' : 'Full Name'} value={form.name} onChange={handleFormChange} required />
            <PhoneInput
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder={isArabic ? 'رقم الهاتف' : 'Phone Number'}
              required
            />
            <Input id="street" placeholder={isArabic ? 'الشارع' : 'Street'} value={form.street} onChange={handleFormChange} required />
            <Input id="city" placeholder={isArabic ? 'المدينة' : 'City'} value={form.city} onChange={handleFormChange} required />
            <Input id="region" placeholder={isArabic ? 'المنطقة' : 'Region'} value={form.region} onChange={handleFormChange} required />
            <Input id="notes" placeholder={isArabic ? 'ملاحظات (اختياري)' : 'Notes (optional)'} value={form.notes} onChange={handleFormChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 