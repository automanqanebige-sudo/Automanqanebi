/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Firebase Hosting Image Optimization fails for Storage URLs (/_next/image → 500).
    // Serve remote images directly so listing photos display.
    unoptimized: true,
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'automanqanebi1.firebasestorage.app',
      },
    ],
  },
  // Required for Google signInWithPopup (keeps window.opener link alive).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
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
