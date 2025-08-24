import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer/Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
import NotificationContainer from '@/components/common/NotificationContainer';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay';
import QueryProvider from '@/components/common/QueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "شاورما روكسي - Shawarma Roxy",
  description: "أشهى أنواع الشاورما والوجبات السريعة من روكسي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${cairo.variable} antialiased font-cairo`}>
        <QueryProvider>
          <ReduxProvider>
            <GlobalLoadingOverlay />
            <NotificationContainer />
            {children}
            <Footer/>
            <ScrollToTopButton />
            <Toaster position="top-center" richColors />
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
