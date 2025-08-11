"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full my-10">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-red-800 min-h-[500px] lg:min-h-[300px]"
        className="bg-yellow-400"
      >
        <div className="max-w-xs ">
          <h2 className="text-right text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            اكتشف أفضل الشاورما والوجبات السريعة
          </h2>
          <p className="mt-4 text-right text-base/6 text-neutral-200">
            استمتع بمذاق الشاورما الأصيل مع الخبز الطازج والخضروات الطازجة. توصيل سريع لباب منزلك!
          </p>
        </div>
        <img
          src="/برجر-كبير-باربكيو-removebg-preview.png"
          width={500}
          height={500}
          alt="صورة شاورما لذيذة"
          className="absolute -right-4 lg:-right-[20%] grayscale filter -bottom-5 object-contain rounded-2xl"
        />
        {/* Yellow star above the image */}
        <img
          src="/star-yellow.png"
          width={60}
          height={60}
          alt="نجمة صفراء"
          className="absolute -left-6 top-8 w-16 h-16 opacity-80 transform rotate-12 z-10"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80 text-right text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          عروض يومية على جميع أنواع الشاورما
        </h2>
        <p className="mt-4 max-w-[26rem] text-right text-base/6 text-neutral-200">
          استمتع بخصومات خاصة على الشاورما والدجاج واللحم. تحقق من العروض الجديدة كل يوم!
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] bg-green-800">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-right text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            اطلب الآن واحصل على توصيل سريع وسهل
          </h2>
          <p className="mt-4 max-w-[26rem] text-right text-base/6 text-neutral-200">
            اختر شاورما روكسي المفضلة لديك، أضفها إلى سلة التسوق، وادفع إلكترونياً أو عند الاستلام. سعادتك هدفنا!
          </p>
        </div>
        <img
          src="/Project.png"
          width={500}
          height={500}
          alt="صورة روكسي شاورما"
          className="absolute -right-0 md:-right-[40%] lg:-right-[20%] -bottom-15 object-contain "
        />
        {/* Green star below the image */}
        <img
          src="/Star_Green.png"
          width={60}
          height={60}
          alt="نجمة خضراء"
          className="absolute -left-6 bottom-8 w-16 h-16 opacity-80 transform -rotate-12 z-10"
        />
      </WobbleCard>
    </div>
  );
}
