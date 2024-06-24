import withPWA from 'next-pwa';

/** @type {import('next-pwa').PWAConfig} */
const pwaConfig = {
  dest: 'public',
};

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(pwaConfig)(nextConfig);
