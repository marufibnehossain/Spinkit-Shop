/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth"],
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "en.dandoy-sports.eu", pathname: "/**" },
    ],
    localPatterns: [
      { pathname: "/uploads/**", search: "" },
      { pathname: "/images/**", search: "" },
    ],
  },
};
module.exports = nextConfig;
