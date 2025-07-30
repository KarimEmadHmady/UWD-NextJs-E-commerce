import React, { useState, useEffect } from 'react';
import { Input } from './input';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "Phone Number",
  className = "",
  error,
  disabled = false,
  required = false,
  name = "phone"
}) => {
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);

  // فلديشن رقم الهاتف المصري
  const validatePhone = (phone: string): boolean => {
    // يجب أن يكون 11 رقم ويبدأ بـ 01
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  // معالجة التغيير
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // إزالة أي حروف غير أرقام
    inputValue = inputValue.replace(/[^0-9]/g, '');
    
    // تحديد الطول الأقصى بـ 11 رقم
    if (inputValue.length > 11) {
      inputValue = inputValue.slice(0, 11);
    }
    
    // إضافة 01 تلقائياً إذا لم يبدأ بها
    if (inputValue.length > 0 && !inputValue.startsWith('01')) {
      if (inputValue.startsWith('1')) {
        inputValue = '0' + inputValue;
      } else if (!inputValue.startsWith('0')) {
        inputValue = '01' + inputValue;
      }
    }
    
    onChange(inputValue);
    
    // فلديشن
    if (touched) {
      setIsValid(validatePhone(inputValue));
    }
  };

  // معالجة التركيز
  const handleFocus = () => {
    setTouched(true);
    if (value) {
      setIsValid(validatePhone(value));
    }
  };

  // معالجة فقدان التركيز
  const handleBlur = () => {
    setTouched(true);
    setIsValid(validatePhone(value));
  };

  // فلديشن عند تغيير القيمة
  useEffect(() => {
    if (touched && value) {
      setIsValid(validatePhone(value));
    }
  }, [value, touched]);

  // رسالة الخطأ
  const getErrorMessage = () => {
    if (!touched) return '';
    if (!value && required) return 'Phone number is required';
    if (value && !isValid) return 'Phone number must be 11 digits starting with 01';
    return error || '';
  };

  const errorMessage = getErrorMessage();
  const hasError = errorMessage && touched;

  return (
    <div className="w-full">
      <Input
        type="tel"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`${className} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
        disabled={disabled}
        required={required}
        maxLength={11}
      />
      {hasError && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}; 