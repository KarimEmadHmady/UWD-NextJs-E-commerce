import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "eljokerstores.com", "vlegko.ru"],
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);