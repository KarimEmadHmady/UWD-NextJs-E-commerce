// src/components/common/Footer/Footer.tsx 
import Link from "next/link";

export default function Footer() {
 return (
<section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
                <img className="w-auto h-16" src="/logo.png" alt="Sweetness Sweets" height="100px" />

                <p className="text-base leading-relaxed text-gray-600 mt-7">Sweetness Sweets offers you the most delicious and finest oriental and western sweets, freshly made every day. Experience authentic taste and high quality with fast and premium service.</p>

                <ul className="flex items-center space-x-3 mt-9">
                    <li>
                        <a href="https://www.instagram.com/" title="Instagram" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-pink-600 focus:bg-pink-600">
                            {/* Instagram Icon */}
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                                <circle cx="16.806" cy="7.207" r="1.078"></circle>
                                <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="https://facebook.com" title="Facebook" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-pink-600 focus:bg-pink-600">
                            {/* Facebook Icon */}
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="https://x.com" title="X" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-pink-600 focus:bg-pink-600">
                            {/* X Icon instead of Twitter */}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="https://wa.me/" title="WhatsApp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-pink-600 focus:bg-pink-600">
                            {/* WhatsApp Icon modern */}
                            <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.818-2.236A11.96 11.96 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 21.818c-1.818 0-3.591-.482-5.127-1.391l-.364-.218-4.655 1.336 1.336-4.655-.218-.364A9.818 9.818 0 1 1 16 24.818Zm5.273-7.273c-.291-.145-1.709-.845-1.973-.945-.264-.1-.455-.145-.646.145-.191.291-.736.945-.902 1.136-.164.191-.336.218-.627.073-.291-.145-1.229-.454-2.342-1.447-.866-.772-1.45-1.723-1.618-2.014-.164-.291-.018-.447.127-.591.13-.13.291-.336.436-.5.145-.164.191-.291.291-.482.1-.191.045-.364-.018-.509-.064-.145-.646-1.564-.882-2.145-.232-.558-.468-.482-.646-.491l-.545-.009c-.182 0-.473.064-.718.291-.245.227-.936.914-.936 2.227 0 1.314.958 2.584 1.091 2.764.127.182 1.885 2.873 4.573 3.914.64.218 1.139.348 1.528.445.642.163 1.227.14 1.689.085.515-.062 1.709-.699 1.951-1.374.241-.676.241-1.256.168-1.374-.073-.118-.264-.191-.555-.336Z" fill="currentColor"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">About</p>

                <ul className="mt-6 space-y-4">
                    <li>
                        <Link href="/search" title="Search" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Search </Link>
                    </li>
                    <li>
                        <Link href="/shop" title="Sweets Menu" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Sweets Menu </Link>
                    </li>
                    <li>
                        <Link href="/account" title="Profile" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Profile </Link>
                    </li>
                    <li>
                        <Link href="/contact" title="Contact Us" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Contact Us </Link>
                    </li>
                </ul>
            </div>

            <div>
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Support</p>

                <ul className="mt-6 space-y-4">
                    <li>
                        <Link href="/customer-support" title="Customer Support" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Customer Support </Link>
                    </li>
                    <li>
                        <Link href="/privacy-policy" title="Privacy Policy" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Privacy Policy </Link>
                    </li>
                    <li>
                        <Link href="/terms-conditions" title="Terms & Conditions" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> Terms & Conditions </Link>
                    </li>
                    <li>
                        <Link href="/faq" title="FAQ" className="flex text-base text-black transition-all duration-200 hover:text-pink-600 focus:text-pink-600"> FAQ </Link>
                    </li>
                </ul>
            </div>

            <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Subscribe to our newsletter</p>

                <form action="#" method="POST" className="mt-6">
                    <div>
                        <label className="sr-only">Email</label>
                        <input type="email" name="email" id="email" placeholder="Enter your email" className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-pink-600 caret-pink-600" />
                    </div>

                    <button type="submit" className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-pink-600 rounded-md hover:bg-pink-700 focus:bg-pink-700">Subscribe</button>
                </form>
            </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-600">© All rights reserved 2025 for Sweetness Sweets</p>
    </div>
</section>
 )
}

