import { ChevronRight, Home } from 'lucide-react'
import React from 'react'
import Image from 'next/image'


export default function Categore() {
  return (
    <div>

               {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600"> Categories</span>
          </nav>
        </div>
      </div>
            {/* Product List Section: Categories Grid */}
      <div className="bg-white dark:text-gray-100">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {/* Cakes */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75 sm:col-span-2 md:col-span-1">
              <Image src="https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Cakes" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Cakes</div>
              </div>
            </a>

            {/* Oriental Sweets */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Oriental Sweets" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Oriental Sweets</div>
              </div>
            </a>
            {/* Pastries */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75 sm:col-span-2 md:col-span-1">
              <Image src="https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Pastries" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Pastries</div>
              </div>
            </a>
            {/* Cookies */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Cookies" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Cookies</div>
              </div>
            </a>
            {/* Cupcakes */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Cupcakes" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Cupcakes</div>
              </div>
            </a>
            {/* Tarts */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Tarts" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Tarts</div>
              </div>
            </a>
            {/* Chocolates */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Chocolates" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Chocolates</div>
              </div>
            </a>
            {/* Pies */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Pies" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Pies</div>
              </div>
            </a>
            {/* Ice Cream */}
            <a href="#" className="group relative block overflow-hidden transition ease-out active:opacity-75">
              <Image src="https://images.unsplash.com/photo-1619286311276-d8343d00ce1f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Ice Cream" width={400} height={192} className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-pink-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">Ice Cream</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
