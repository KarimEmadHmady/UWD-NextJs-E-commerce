// src/app/[locale]/page.tsx
import CategorySection from '@/components/category/category-section';
import ProductGrid from '@/components/product/product-grid';
import { useTranslations } from 'next-intl';


export default function HomePage() {
  const t = useTranslations('Home');
  return (
    <>
    {/* hero */}
    <section className="relative py-10 overflow-hidden bg-black sm:py-16 lg:py-24 xl:py-32 h-[70vh] m-6 rounded-[30px]">
      <div className="absolute inset-0 ">
          <img className="object-cover w-full h-full md:object-left md:scale-150 md:origin-top-left" src="https://images.unsplash.com/photo-1665686310429-ee43624978fa?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>

      <div className="absolute inset-0 hidden bg-gradient-to-r md:block from-black to-transparent"></div>

      <div className="absolute inset-0 block bg-black/60 md:hidden"></div>

      <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl  sm:mt-0">
          <div className="text-center md:w-2/3 lg:w-1/2 xl:w-1/3 md:text-left">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">Discover the Best Deals – All in One Place</h2>
              <p className="mt-4 text-base text-gray-200">Explore a wide range of high-quality products at unbeatable prices. Whether you're shopping for fashion, electronics, home goods, or more – we've got something for everyone. Fast delivery, secure checkout, and exclusive offers await!

              .</p>

              <form action="#" method="POST" className="mt-8 lg:mt-12">
                  <div className="flex flex-col items-center sm:flex-row sm:justify-center">

                      <button type="submit" className="inline-flex items-center justify-center  w-[200px] px-4 py-4 mt-4 font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md sm:mt-0  sm:w-auto hover:bg-blue-700 focus:bg-blue-700">
                      Shop Now

                      </button>
                  </div>
              </form>
          </div>
      </div>
    </section>

    <CategorySection />


      {/* Product Grid Section */}
      <div
            style={{
        backgroundImage: "url('/low-poly-grid-haikei.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '600px',
        width: '100%',
      }}>
        <ProductGrid />

      </div>

          {/* slog */}
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
    <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-20">
            <div className="">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Grow business with Celebration.</h2>
                <p className="mt-4 text-base leading-relaxed text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
            </div>

            <div className="relative pl-20 pr-6 sm:pl-6 md:px-0">
                <div className="relative w-full max-w-xs mt-4 mb-10 ml-auto">
                    <img className="ml-auto" src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/person.jpg" alt="" />

                    <img className="absolute -top-4 -left-12" src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/wavey-lines.svg" alt="" />

                    <div className="absolute -bottom-10 -left-16">
                        <div className="bg-yellow-300">
                            <div className="px-8 py-10">
                                <span className="block text-4xl font-bold text-black lg:text-5xl"> 53% </span>
                                <span className="block mt-2 text-base leading-tight text-black"> High Conversions<br />Everything </span>
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
                <h2 className="text-xl font-medium text-gray-900">Trusted by world class creators</h2>
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


