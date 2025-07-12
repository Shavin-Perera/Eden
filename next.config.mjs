/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checking
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // Changed from SAMEORIGIN for better security
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }, // Added XSS protection
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }, // Added HSTS
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" 
          },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=()' },
        ],
      },
    ];
  },
  // Removed insecure rewrites that could be bypassed
}

export default nextConfig
