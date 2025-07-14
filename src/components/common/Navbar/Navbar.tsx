'use client';
// src/components/common/Navbar/Navbar.tsx

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, User, MapPin, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, Menu, X, Heart } from "lucide-react"
import dynamic from "next/dynamic";
// Lazy load SideCart for better performance
const SideCart = dynamic(() => import("@/components/cart/side-cart/side-cart"), { ssr: false });

interface MenuItem {
  label: string
  href: string
  children?: MenuItem[]
  isMega?: boolean
  megaContent?: {
    categories?: Array<{
      title: string
      items: Array<{ label: string; href: string }>
    }>
    catalogue?: Array<{
      image: string
      title: string
      href: string
    }>
  }
}

export default function Navigation() {
  // State for side cart visibility
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);
  // Main navigation menu items
  const menuItems: MenuItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categore' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
    { label: 'Contact', href: '/contact' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Orders', href: '/order-confirmation' },
    { label: 'Profile', href: '/account' },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])
  const [scrollStep, setScrollStep] = useState(0)
  const [maxScrollSteps, setMaxScrollSteps] = useState(0)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  // Menu translations
  const menuTranslations: Record<string, { en: string; ar: string }> = {
    Home: { en: 'Home', ar: 'الرئيسية' },
    Shop: { en: 'Shop', ar: 'المتجر' },
    Categories: { en: 'Categories', ar: 'التصنيفات' },
    Cart: { en: 'Cart', ar: 'عربة التسوق' },
    Checkout: { en: 'Checkout', ar: 'الدفع' },
    Contact: { en: 'Contact', ar: 'اتصل بنا' },
    Wishlist: { en: 'Wishlist', ar: 'المفضلة' },
    Orders: { en: 'order-confirmation', ar: 'تاكيد الطلب' },
    Profile: { en: 'account', ar: 'الملف الشخصي' },
  };

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [lang, setLang] = useState<'ar' | 'en'>(locale as 'ar' | 'en');

  // Sync lang state with next-intl locale
  useEffect(() => {
    setLang(locale as 'ar' | 'en');
  }, [locale]);

  // Update html lang and dir attributes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  // Handle language switch using next-intl router
  const handleLangSwitch = (newLang: 'ar' | 'en') => {
    if (lang === newLang) return;
    let segments = pathname?.split("/") || [];
    // Remove empty segments at the end (from trailing slash)
    if (segments.length > 2 && segments[segments.length - 1] === "") {
      segments = segments.slice(0, -1);
    }
    // Remove current locale prefix if present
    if (segments[1] === "ar" || segments[1] === "en") {
      segments = ["", ...segments.slice(2)];
    }
    // Always add '/ar' for Arabic, '/en' for English
    let newPath = newLang === "en" ? `/en${segments.join("/")}` : `/ar${segments.join("/")}`;
    // Remove double slashes
    newPath = newPath.replace(/\/+/g, "/");
    // Remove trailing slash except for root
    if (newPath.length > 1 && newPath.endsWith("/")) {
      newPath = newPath.slice(0, -1);
    }
    router.replace(newPath);
    setLang(newLang);
  }

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      const dropdowns = document.querySelectorAll('.lang-dropdown-btn, .lang-dropdown-list');
      let inside = false;
      dropdowns.forEach((el) => {
        if (el.contains(e.target as Node)) inside = true;
      });
      if (!inside) setLangDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langDropdownOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }

  // Dropdown toggle for mobile
  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  // Calculate horizontal scroll steps
  const calculateScrollSteps = () => {
    if (!menuRef.current || !wrapperRef.current) return
    const menuItemsEls = Array.from(menuRef.current.children)
    const wrapperHeight = wrapperRef.current.offsetHeight
    const rowTops = new Set(menuItemsEls.map((item) => (item as HTMLElement).offsetTop))
    const totalRows = rowTops.size
    const visibleRows = Math.floor(wrapperHeight / 65)
    setMaxScrollSteps(Math.max(totalRows - visibleRows, 0))
  }

  // Horizontal scroll
  const handleHorizontalScroll = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setScrollStep((prev) => Math.max(0, prev - 1))
    } else {
      setScrollStep((prev) => Math.min(maxScrollSteps, prev + 1))
    }
  }

  // Window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
        document.body.style.overflow = "unset"
        calculateScrollSteps()
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        toggleMobileMenu()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMobileMenuOpen])

  // Render menu item
  const renderMenuItem = (item: MenuItem, level = 0, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdowns.includes(item.label);
    // const isDropdownRight = index >= menuItems.length / 2; // Not used
    return (
      <li
        key={item.label}
        className={`
          relative group
          ${level === 0 ? "md:border-b-0" : ""}
          ${level > 0 ? "border-b border-gray-100 md:border-b-0" : "border-b border-gray-100 md:border-b-0"}
        `}
      >
        <Link
          href={item.href}
          className={`
            flex items-center justify-between h-16 px-4 text-sm text-black transition-colors duration-250
            hover:text-blue-600 md:hover:text-blue-600
            ${hasChildren ? "cursor-pointer" : ""}
            ${level > 0 ? "md:px-6 md:py-2 md:h-auto" : ""}
            ${isOpen ? "text-blue-600" : ""}
          `}
          onClick={(e) => {
            if (hasChildren && window.innerWidth <= 768) {
              e.preventDefault();
              toggleDropdown(item.label);
            }
          }}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <ChevronDown
              className={`
                w-4 h-4 transition-transform duration-250
                ${isOpen ? "rotate-180" : ""}
                md:opacity-75
              `}
            />
          )}
        </Link>
        {/* ...dropdown/mega menu rendering as before... */}
      </li>
    );
  };

  // ...rest of the JSX (header, menus, etc)...
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 h-16 px-4 md:px-15 bg-[#ececec] ">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 relative z-50 focus:outline-none group"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">{isMobileMenuOpen ? "Close" : "Open"} menu</span>

          <span className="relative w-6 h-6 flex items-center justify-center">
            {/* Top Line */}
            <span
              className={`absolute h-0.5 w-6 bg-black rounded transition-all duration-300 
                ${isMobileMenuOpen ? 'rotate-45 top-1/2' : '-translate-y-2'}`}
            />

            {/* Middle Line */}
            <span
              className={`absolute h-0.5 w-6 bg-black rounded transition-all duration-300  w-[15px]
                ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Bottom Line */}
            <span
              className={`absolute h-0.5 w-6 bg-black rounded transition-all duration-300 
                ${isMobileMenuOpen ? '-rotate-45 top-1/2' : 'translate-y-2'}`}
            />
          </span>
        </button>


        {/* Logo */}
        <Link href="/" className="flex items-center min-w-[50px] flex-shrink-0" aria-label="Home">
          <Image
            src="/next.svg"
            alt="Logo"
            width={28}
            height={16}
            className="object-contain h-6 w-auto"
            priority
          />
        </Link>


        {/* Desktop Navigation + Language Switcher */}
        <div className="hidden md:flex items-center justify-center flex-1 gap-6">
          <div ref={wrapperRef} className="overflow-hidden max-h-16">
            <ul
              ref={menuRef}
              className="flex flex-row flex-wrap justify-center overflow-x-auto overflow-y-hidden h-full max-w-full w-full"
              style={{
                transform: `translateY(-${scrollStep * 65}px)`,
                transition: "transform 0.3s ease",
              }}
            >
              {menuItems.map((item: MenuItem, index: number) => renderMenuItem(item, 0, index))}
            </ul>
          </div>

          {/* Horizontal Scroll Buttons */}
          {maxScrollSteps > 0 && (
            <div className="flex ml-4">
              <button
                onClick={() => handleHorizontalScroll("prev")}
                disabled={scrollStep === 0}
                className="w-9 h-9 flex items-center justify-center text-sm border-0 bg-transparent cursor-pointer transition-colors duration-250 hover:text-bule-600 disabled:opacity-25 disabled:cursor-default"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleHorizontalScroll("next")}
                disabled={scrollStep >= maxScrollSteps}
                className="w-9 h-9 flex items-center justify-center text-sm border-0 bg-transparent cursor-pointer transition-colors duration-250 hover:text-bule-600 disabled:opacity-25 disabled:cursor-default"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Language Switcher Dropdown (Desktop) */}
          <div className="relative ml-6">
            <button
              className="flex items-center gap-1 text-sm font-bold text-black hover:text-bule-600 focus:outline-none lang-dropdown-btn"
              aria-haspopup="true"
              aria-expanded={langDropdownOpen}
              tabIndex={0}
              onClick={() => setLangDropdownOpen((open) => !open)}
            >
              {lang === 'ar' ? 'AR' : 'EN'}
              <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {langDropdownOpen && (
              <div
                className="absolute left-0 mt-2 min-w-[80px] bg-white border border-gray-100 rounded shadow-lg z-50 lang-dropdown-list"
                tabIndex={-1}
              >
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${lang === 'en' ? 'text-blue-600 font-bold' : 'text-black'} hover:bg-gray-50`}
                  onClick={() => { handleLangSwitch('en'); setLangDropdownOpen(false); }}
                >
                  EN
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${lang === 'ar' ? 'text-blue-600 font-bold' : 'text-black'} hover:bg-gray-50`}
                  onClick={() => { handleLangSwitch('ar'); setLangDropdownOpen(false); }}
                >
                  AR
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="min-w-[150px] flex-shrink-0">
          
          <ul className="flex justify-end gap-2 list-none items-center">
            {/* Wishlist Icon */}
            <li className="relative cursor-pointer">
              <button
                type="button"
                className="p-1 text-lg transition-colors duration-250 hover:text-red-500 cursor-pointer transition-transform duration-200 hover:scale-110"
                aria-label="Open wishlist"
                onClick={() => router.push("/wishlist")}
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-black"}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-[5px] -right-[8px] bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 bg-red-500 ">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <Link href="#" className="p-1 text-lg text-black transition-colors duration-250 hover:text-blue-600 transition-transform duration-200 hover:scale-110">
                <Search className="w-5 h-5" />
              </Link>
            </li>
            <li>
              <Link href="#" className="p-1 text-lg text-black transition-colors duration-250 hover:text-blue-600 transition-transform duration-200 hover:scale-110">
                <User className="w-5 h-5" />
              </Link>
            </li>
            <li>
              <Link href="#" className="p-1 text-lg text-black transition-colors duration-250 hover:text-blue-600 transition-transform duration-200 hover:scale-110">
                <MapPin className="w-5 h-5" />
              </Link>
            </li>
            <li className="relative cursor-pointer">
              <button
                type="button"
                className="p-1 text-lg text-black transition-colors duration-250 hover:text-blue-600 cursor-pointer transition-transform duration-200 hover:scale-110"
                aria-label="Open cart"
                onClick={() => setIsSideCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-[5px] -right-[8px] bg-black text-white text-xs font-bold rounded-full  min-w-[18px] h-[18px] flex items-center justify-center border-2 bg-black ">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>

      {/* Side Cart Drawer */}
      <SideCart isOpen={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
          </ul>
        </div>
      </header>
      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed top-0 left-0 w-full h-full bg-white shadow-lg overflow-y-auto z-40 transition-transform duration-300 ease-out flex flex-col
          ${isMobileMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"}
        `}
      >
        {/* Mobile menu top bar: just close button */}
        <div className="flex items-center justify-end px-4 py-4 border-b border-gray-100">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 ml-2"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>
        <ul className="pt-2 flex-1">
          {menuItems.map((item: MenuItem, index: number) => (
            <li key={item.label} className="border-b border-gray-100 last:border-b-0">
              <Link
                href={item.href}
                className="block px-6 py-3 text-base font-medium text-black hover:text-blue-600 md:hover:text-bule-600 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                {menuTranslations[item.label]?.[lang] || item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Language Switcher and Social Media Icons at the bottom - improved style */}
        <div className="flex flex-col items-center justify-end mt-12 mb-8 gap-4">
          <div className="flex justify-center gap-4 mb-2">
            <button
              className={`px-4 py-2 rounded-[10px] border text-base font-bold transition-colors duration-200 focus:outline-none ${lang === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
              onClick={() => handleLangSwitch('en')}
              disabled={lang === 'en'}
            >
              EN
            </button>
            <button
              className={`px-4 py-2 rounded-[10px] border text-base font-bold transition-colors duration-200 focus:outline-none ${lang === 'ar' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
              onClick={() => handleLangSwitch('ar')}
              disabled={lang === 'ar'}
            >
              AR
            </button>
          </div>
          <div className="flex justify-center gap-4 mb-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="group rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 w-10 h-10">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                <path fill="currentColor" d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="group rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 w-10 h-10">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-blue-400 group-hover:text-blue-500 transition-colors duration-200">
                <path fill="currentColor" d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="group rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200 w-10 h-10">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-pink-500 group-hover:text-pink-600 transition-colors duration-200">
                <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.338 2.396 3.511 2.338 4.788.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.277.33 2.45 1.298 3.418.968.968 2.141 1.24 3.418 1.298C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.277-.058 2.45-.33 3.418-1.298.968-.968 1.24-2.141 1.298-3.418.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.33-2.45-1.298-3.418-.968-.968-2.141-1.24-3.418-1.298C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
              </svg>
            </a>
          </div>
          <span className="text-xs text-gray-400 mt-2">© {new Date().getFullYear()} YourBrand</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-30" onClick={toggleMobileMenu} />}
    </>
  )

}