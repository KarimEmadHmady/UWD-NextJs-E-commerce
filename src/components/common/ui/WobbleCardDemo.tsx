"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full my-10">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className="bg-[#73cdca]"
      >
        <div className="max-w-xs ">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Discover the Best Sweets & Desserts
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            Explore a wide variety of cakes, donuts, cookies, and chocolates. Enjoy authentic taste with fast delivery to your door!
          </p>
        </div>
        <img
          src="https://media.cnn.com/api/v1/images/stellar/prod/181127105254-08-50-sweets-travel-donuts.jpg?q=w_1110,c_fill"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Daily Offers on All Sweets
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Enjoy special discounts on cakes, donuts, and chocolates. Check back every day for the latest deals!
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] bg-[#131e4a]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Order Now & Get Fast, Easy Delivery
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Choose your favorite sweets, add them to your cart, and pay online or on delivery. Your happiness is our goal!
          </p>
        </div>
        <img
          src="https://media.istockphoto.com/id/1137312508/photo/assortment-of-products-with-high-sugar-level.jpg?s=612x612&w=0&k=20&c=pfMfQfo4pHnTfESlJCSB_wCrOvlHhtZ3Eqdu3CY5LDY="
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
