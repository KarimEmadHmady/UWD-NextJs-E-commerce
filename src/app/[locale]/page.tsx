"use client"
// src/app/[locale]/page.tsx
import CategorySection from '@/components/category/category-section';
import { products as productsData } from '@/components/product/product-data';
import ShopProductCard from '@/components/product/ShopProductCard/ShopProductCard';
import ProductListItem from '@/components/shop/product-list-item';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';


/**
 * HomePage component - Main landing page for the e-commerce site.
 * Displays hero section, featured categories, product grid, slogan, and trusted brands.
 */
export default function HomePage() {
  const t = useTranslations('Home');
  const products = productsData;
  const viewMode = 'grid'; // or make it dynamic if needed
  const router = useRouter();
  return (
    <>
      {/* hero */}
      <section className="relative py-10 overflow-hidden bg-black sm:py-16 lg:py-24 xl:py-32 h-[48vh] sm:h-[70vh] m-6 rounded-[30px] flex items-center justify-center sm:block">
        <div className="absolute inset-0 ">
            <img className="object-cover w-full h-full md:object-left md:scale-150 md:origin-top-left" src="https://images.unsplash.com/photo-1540332788463-be4cdbc4be88?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Delicious Sweets" />
        </div>

        <div className="absolute inset-0 hidden bg-gradient-to-r md:block from-black to-transparent"></div>
        <div className="absolute inset-0 block bg-black/60 md:hidden"></div>

        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl  sm:mt-0 flex flex-col items-center justify-center h-full sm:block sm:h-auto">
            <div className="text-center md:w-2/3 lg:w-1/2 xl:w-1/3 md:text-left flex flex-col items-center justify-center h-full sm:block sm:h-auto">
                <h2 className="text-2xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">Discover the Sweetest Treats</h2>
                <p className="mt-4 text-base text-gray-200">Indulge in our delicious cakes, pastries, oriental sweets, and more. Freshly baked, delivered fast, and made with love!</p>
                <form action="#" method="POST" className="mt-8 lg:mt-12">
                    <div className="flex flex-col items-center sm:flex-row ">
                        <button type="button" onClick={() => router.push('/shop')} className="cursor-pointer inline-flex items-center justify-center  w-[200px] px-4 py-4 mt-4 font-semibold text-white transition-all duration-200 bg-pink-600 border border-transparent rounded-md sm:mt-0  sm:w-auto hover:bg-pink-700 focus:bg-pink-700">
                        Shop Sweets
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </section>
      <CategorySection />
      <div
            style={{
        backgroundImage: "url('/low-poly-grid-haikei.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '600px',
        width: '100%',
      }}>
      {/* Product Grid Section (نفس ستايل صفحة shop) */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Sweets</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our latest collection of cakes, cookies, oriental sweets, and more. Perfect for every occasion!
          </p>
        </div>
        <div className="p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const localProduct = {
                  ...product,
                  image: product.image,
                  reviews: product.reviews,
                  inStock: product.inStock,
                  isNew: product.isNew,
                  isSale: product.isSale,
                  discount: product.discount,
                };
                return <ShopProductCard key={product.id} product={localProduct} />;
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const localProduct = {
                  ...product,
                  image: product.image,
                  reviews: product.reviews,
                  inStock: product.inStock,
                  isNew: product.isNew,
                  isSale: product.isSale,
                  discount: product.discount,
                };
                return <ProductListItem key={product.id} product={localProduct} />;
              })}
            </div>
          )}
        </div>
      </div>
      </div>

    {/* Slogan */}
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-20">
          <div className="">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Celebrate Every Moment with Sweets</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">From birthdays to gatherings, our desserts make every moment special. Order now and enjoy the taste of happiness!</p>
          </div>
          <div className="relative pl-20 pr-6 sm:pl-6 md:px-0">
            <div className="relative w-full max-w-xs mt-4 mb-10 ml-auto">
              <img className="ml-auto" src="https://plus.unsplash.com/premium_photo-1676473229054-9d4abed0e1b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Celebration Sweets" />
              <img className="absolute -top-4 -left-12" src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/wavey-lines.svg" alt="" />
              <div className="absolute -bottom-10 -left-16">
                <div className="bg-black">
                  <div className="px-8 py-10">
                    <span className="block text-4xl font-bold text-white lg:text-5xl"> 100% </span>
                    <span className="block mt-2 text-base leading-tight text-white"> Fresh & Delicious<br />Everyday </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Trusted by Section */}
      <section className="py-10 bg-white sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-xl font-medium text-gray-900">Trusted by Sweet Lovers Everywhere</h2>
            </div>
            <div className="grid items-center grid-cols-2 gap-10 mt-12 md:grid-cols-4 sm:gap-y-16">
                <div>
                    <img className="object-contain w-auto mx-auto h-14" src="https://cdn.rareblocks.xyz/collection/celebration/images/logos/2/logo-1.png" alt="" />
                </div>
                <div>
                    <img className="object-contain w-auto mx-auto h-14" src="https://cdn.rareblocks.xyz/collection/celebration/images/logos/2/logo-2.png" alt="" />
                </div>
                <div>
                    <img className="object-contain w-auto h-10 mx-auto" src="https://cdn.rareblocks.xyz/collection/celebration/images/logos/2/logo-3.png" alt="" />
                </div>
                <div>
                    <img className="object-contain w-auto mx-auto h-14" src="https://cdn.rareblocks.xyz/collection/celebration/images/logos/2/logo-4.png" alt="" />
                </div>
            </div>
        </div>
      </section>

    </>
  );
}


