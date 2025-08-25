'use client';
// src/components/common/Navbar/Navbar.tsx

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, User, MapPin, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, X, Heart ,Facebook, Instagram} from "lucide-react"
import dynamic from "next/dynamic";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/hooks/useAuth"
import { Button } from "../Button/Button"
import { LogOut } from "lucide-react"
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
  const t = useTranslations('Navigation');
  
  // State for side cart visibility
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);
  // Main navigation menu items
  const menuItems: MenuItem[] = [
    { label: t('home'), href: '/' },
    { label: t('shop'), href: '/shop' },
    { label: t('categories'), href: '/categore' },
    // { label: t('cart'), href: '/cart' },
    // { label: t('checkout'), href: '/checkout' },
    // { label: t('contact'), href: '/contact' },
    // { label: t('wishlist'), href: '/wishlist' },
    // { label: t('orders'), href: '/order-confirmation' },
    // { label: t('profile'), href: '/account' },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])
  const [scrollStep, setScrollStep] = useState(0)
  const [maxScrollSteps, setMaxScrollSteps] = useState(0)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { items, serverCartCount } = useCart();
  // نستخدم العدد من الـ items بدلاً من الـ serverCartCount لأن الـ backend خاطئ
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Debug cart count
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;
  const { user, isAuthenticated, logout, userLocation } = useAuth()

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
      }
    }
  }, [isAuthenticated, logout]);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { lang, setLang } = useLang();

  // Update html lang and dir attributes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  // Sync lang state with URL locale segment from next-intl
  useEffect(() => {
    if (locale === 'ar' || locale === 'en') {
      if (lang !== locale) setLang(locale as 'ar' | 'en');
    } else if (pathname?.startsWith('/ar') || pathname?.startsWith('/en')) {
      const pathLocale = pathname.split('/')[1] as 'ar' | 'en';
      if (pathLocale && pathLocale !== lang) setLang(pathLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, pathname]);

  // Handle language switch using next-intl router
  const handleLangSwitch = (newLang: 'ar' | 'en') => {
    if (lang === newLang) return;
    setLang(newLang); // يحدث الـ Redux
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
    const hrefWithLocale = `/${lang}${item.href}`.replace(/\/+/g, '/');
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
          href={hrefWithLocale}
          className={`
            flex items-center justify-between h-16 px-4 text-sm text-black transition-colors duration-250
            hover:text-red-600 md:hover:text-red-600 underline underline-offset-4 decoration-red-600
            ${hasChildren ? "cursor-pointer" : ""}
            ${level > 0 ? "md:px-6 md:py-2 md:h-auto" : ""}
            ${isOpen ? "text-red-600" : ""}
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
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 h-16 px-4 md:px-15 "
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      >
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
        <Link href="/" className="flex items-center min-w-[95px] flex-shrink-0" aria-label="Home">
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className="object-contain h-16 w-[80px]"
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
                  className={`block w-full text-left px-4 py-2 text-sm ${lang === 'en' ? 'text-red-600 font-bold' : 'text-black'} hover:bg-gray-50`}
                  onClick={() => { handleLangSwitch('en'); setLangDropdownOpen(false); }}
                >
                  EN
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${lang === 'ar' ? 'text-red-600 font-bold' : 'text-black'} hover:bg-gray-50`}
                  onClick={() => { handleLangSwitch('ar'); setLangDropdownOpen(false); }}
                >
                  AR
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="min-w-[90px] flex-shrink-0">
          
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
              <Link href="/search" className="p-1 text-lg text-black transition-colors duration-250 hover:text-red-600 transition-transform duration-200 hover:scale-110">
                <Search className="w-5 h-5" />
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className=" text-lg text-black transition-colors duration-250 hover:text-red-600 transition-transform duration-200 hover:scale-110 flex items-center cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 " />
                  
                </button>
              ) : (
                <Link href="/login" className="p-1 text-lg text-black transition-colors duration-250 hover:text-red-600 transition-transform duration-200 hover:scale-110">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </li>
            {isAuthenticated && (
              <li>
                <Link href="/account" className="p-1 text-lg text-black transition-colors duration-250 hover:text-red-600 transition-transform duration-200 hover:scale-110">
                  <User className="w-5 h-5" />
                </Link>
              </li>
            )}
            <li>
              <Link href="/contact" className="p-1 text-lg text-black transition-colors duration-250 hover:text-red-600 transition-transform duration-200 hover:scale-110">
                <MapPin className="w-5 h-5" />
              </Link>
            </li>
            <li className="relative cursor-pointer">
              <button
                type="button"
                className="p-1 text-lg text-black transition-colors duration-250 hover:text-red-600 cursor-pointer transition-transform duration-200 hover:scale-110"
                aria-label="Open cart"
                onClick={() => setIsSideCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-[5px] -right-[8px] bg-red-600 text-white text-xs font-bold rounded-full  min-w-[18px] h-[18px] flex items-center justify-center border-2 bg-black ">
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
        <ul className="pt-2 flex-1 divide-y-2 divide-gray-300">
          {menuItems.map((item: MenuItem, index: number) => (
            <li key={item.label}>
              <Link
                href={`/${lang}${item.href}`.replace(/\/+/g, '/')}
                className="block px-6 py-3 text-base font-medium text-black hover:text-red-600 md:hover:text-bule-600 transition-colors duration-200 underline underline-offset-4 decoration-red-600"
                onClick={toggleMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Language Switcher and Social Media Icons at the bottom - improved style */}
{/* Language Switcher and Social Media Icons */}
<div className="flex flex-col items-center justify-end mt-12 mb-8 gap-4">
  <img className="w-auto h-20 mb-6" src="/logo.png" alt="logo" />

  {/* Language Switcher + Social */}
  <div className="flex flex-row items-center justify-between gap-6 w-[70%]">
    
    {/* Language Switcher */}
    <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-sm">
      <button
        className={`px-4 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${
          lang === "en"
            ? "bg-red-600 text-white shadow-md"
            : "text-gray-600 hover:text-red-600"
        }`}
        onClick={() => handleLangSwitch("en")}
        disabled={lang === "en"}
      >
        EN
      </button>
      <button
        className={`px-4 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${
          lang === "ar"
            ? "bg-red-600 text-white shadow-md"
            : "text-gray-600 hover:text-red-600"
        }`}
        onClick={() => handleLangSwitch("ar")}
        disabled={lang === "ar"}
      >
        AR
      </button>
    </div>

    {/* Social Icons */}
    <div className="flex justify-center gap-4">
      {/* Facebook */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook className="w-7 h-7 text-[#1877F2] hover:opacity-80 transition" />
      </a>

      {/* Twitter (X) */}
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <X className="w-7 h-7 text-black hover:opacity-80 transition" />
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram className="w-7 h-7 text-pink-500 hover:opacity-80 transition" />
      </a>
    </div>
  </div>

  <span className="text-xs text-gray-400 mt-2">
    © {new Date().getFullYear()} Roxy
  </span>
</div>
</div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-30" onClick={toggleMobileMenu} />}
    </>
  )

}