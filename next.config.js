/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid Windows rename races (Desktop/AV) during static export finalize
  experimental: {
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  // Proxy Firebase Auth helpers onto the app origin (redirect / Safari / Chrome).
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/__/auth/:path*',
          destination: 'https://automanqanebi1.firebaseapp.com/__/auth/:path*',
        },
      ],
    }
  },
};

module.exports = nextConfig;
