
"use client"
import { useEffect, useState } from "react"

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      onClick={handleScrollToTop}
      className={`fixed bottom-5 right-5 cursor-pointer z-50 rounded-full transition-all duration-300 hover:scale-110 border-none outline-none focus:ring-2 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      aria-label="Scroll to top"
      style={{
        backgroundImage: `url('/Red-Star.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '48px',
        height: '48px',
        border: 'none',
        backgroundColor: 'transparent',
        position: 'fixed',
        bottom: '20px',
        right: '20px'
      }}
    >
      {/* سهم لأعلى فوق الصورة */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <svg 
          width="18" 
          height="18" 
          fill="none" 
          viewBox="0 -5 25 25"
          className="text-white drop-shadow-lg"
        >
          <path 
            d="M12 19V5M12 5l-7 7M12 5l7 7" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    </button>
  )
}
