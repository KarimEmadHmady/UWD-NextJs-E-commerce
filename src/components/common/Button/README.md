# CustomButton Component

كومبوننت زر مخصص مع خلفية `btn.png` قابل لإعادة الاستخدام في جميع أنحاء الموقع.

## المميزات

- ✅ خلفية مخصصة باستخدام صورة `btn.png`
- ✅ أحجام مختلفة (صغير، متوسط، كبير)
- ✅ أنواع مختلفة (أساسي، ثانوي، مخطط)
- ✅ دعم الروابط الداخلية
- ✅ حالات مختلفة (عادي، معطل، إرسال)
- ✅ تأثيرات حركية (hover, active, focus)
- ✅ قابل للتخصيص عبر className
- ✅ دعم كامل للوصول (accessibility)

## كيفية الاستخدام

### استيراد الكومبوننت

```tsx
import CustomButton from '@/components/common/Button/CustomButton';
// أو
import { CustomButton } from '@/components/common/Button';
```

### أمثلة أساسية

```tsx
// زر بسيط
<CustomButton onClick={handleClick}>
  انقر هنا
</CustomButton>

// زر مع رابط
<CustomButton href="/shop">
  اذهب للمتجر
</CustomButton>

// زر بحجم كبير
<CustomButton size="lg" onClick={handleClick}>
  زر كبير
</CustomButton>
```

## الخصائص (Props)

| الخاصية | النوع | الافتراضي | الوصف |
|---------|-------|-----------|-------|
| `children` | ReactNode | - | محتوى الزر (مطلوب) |
| `href` | string | - | رابط للانتقال إليه |
| `onClick` | function | - | دالة عند النقر |
| `type` | 'button' \| 'submit' \| 'reset' | 'button' | نوع الزر |
| `disabled` | boolean | false | تعطيل الزر |
| `className` | string | '' | classes إضافية |
| `variant` | 'primary' \| 'secondary' \| 'outline' | 'primary' | نمط الزر |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | حجم الزر |

## الأحجام

- **sm**: 40px ارتفاع، 120px عرض
- **md**: 48px ارتفاع، 140px عرض  
- **lg**: 56px ارتفاع، 160px عرض

## الأنواع

- **primary**: خط أزرق للتركيز
- **secondary**: خط رمادي للتركيز
- **outline**: خط أخضر للتركيز

## أمثلة متقدمة

```tsx
// زر معطل
<CustomButton disabled>
  زر معطل
</CustomButton>

// زر إرسال
<CustomButton type="submit" variant="primary" size="lg">
  إرسال الطلب
</CustomButton>

// زر مع classes مخصصة
<CustomButton 
  className="shadow-lg hover:shadow-xl"
  onClick={handleSubmit}
>
  تأكيد الطلب
</CustomButton>
```

## صفحة التجربة

يمكنك زيارة `/button-demo` لرؤية جميع أنواع الأزرار في العمل.

## ملاحظات

- الصورة `btn.png` يجب أن تكون في مجلد `public`
- الكومبوننت يدعم التمرير بالكيبورد (Tab, Enter, Space)
- يمكن تخصيص الألوان عبر CSS variables
- الكومبوننت متوافق مع Next.js Link للتنقل الداخلي


كيفية الاستخدام:
// زر بسيط
<CustomButton onClick={handleClick}>
  انقر هنا
</CustomButton>

// زر مع رابط
<CustomButton href="/shop">
  اذهب للمتجر
</CustomButton>

// زر بحجم مختلف
<CustomButton size="lg" onClick={handleClick}>
  زر كبير
</CustomButton>

// زر معطل
<CustomButton disabled>
  زر معطل
</CustomButton>