"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";
import { useParams } from 'next/navigation';

export function WobbleCardDemo() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const isArabic = locale === 'ar';
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full my-10 dir-ltr" style={{
      direction: 'ltr'
    }}>
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-red-800 min-h-[500px] lg:min-h-[300px]"
        className="bg-yellow-400"
      >
        <div className="max-w-xs ">
          <h2 className="text-right text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            {isArabic ? 'اكتشف أفضل الشاورما والوجبات السريعة' : 'Discover the Best Shawarma and Fast Food'}
          </h2>
          <p className="mt-4 text-right text-base/6 text-neutral-200">
            {isArabic ? 'استمتع بمذاق الشاورما الأصيل مع الخبز الطازج والخضروات الطازجة. توصيل سريع لباب منزلك!' : 'Enjoy authentic shawarma taste with fresh bread and vegetables. Fast delivery to your door!'}
          </p>
        </div>
        <img
          src="/برجر-كبير-باربكيو-removebg-preview.png"
          width={500}
          height={500}
          alt={isArabic ? "صورة شاورما لذيذة" : "Delicious Shawarma Image"}
          className="absolute -right-4 lg:-right-[20%] grayscale filter -bottom-5 object-contain rounded-2xl"
        />
        {/* Yellow star above the image */}
        <img
          src="/star-yellow.png"
          width={60}
          height={60}
          alt={isArabic ? "نجمة صفراء" : "Yellow Star"}
          className="absolute -left-6 top-8 w-16 h-16 opacity-80 transform rotate-12 z-10"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80 text-right text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          {isArabic ? 'عروض يومية على جميع أنواع الشاورما' : 'Daily Offers on All Shawarma Types'}
        </h2>
        <p className="mt-4 max-w-[26rem] text-right text-base/6 text-neutral-200">
          {isArabic ? 'استمتع بخصومات خاصة على الشاورما والدجاج واللحم. تحقق من العروض الجديدة كل يوم!' : 'Enjoy special discounts on shawarma, chicken, and beef. Check new offers every day!'}
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] bg-green-800">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-right text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            {isArabic ? 'اطلب الآن واحصل على توصيل سريع وسهل' : 'Order Now and Get Fast, Easy Delivery'}
          </h2>
          <p className="mt-4 max-w-[26rem] text-right text-base/6 text-neutral-200">
            {isArabic ? 'اختر شاورما روكسي المفضلة لديك، أضفها إلى سلة التسوق، وادفع إلكترونياً أو عند الاستلام. سعادتك هدفنا!' : 'Choose your favorite Roxy Shawarma, add to cart, and pay online or on delivery. Your happiness is our goal!'}
          </p>
        </div>
        <img
          src="/DSC05685.jpg"
          width={500}
          height={500}
          alt={isArabic ? "صورة روكسي شاورما" : "Roxy Shawarma Image"}
          className="absolute -right-0 md:-right-[40%] lg:-right-[20%] -bottom-15 object-contain "
        />
        {/* Green star below the image */}
        <img
          src="/Star_Green.png"
          width={60}
          height={60}
          alt={isArabic ? "نجمة خضراء" : "Green Star"}
          className="absolute -left-6 bottom-8 w-16 h-16 opacity-80 transform -rotate-12 z-10"
        />
      </WobbleCard>
    </div>
  );
}
