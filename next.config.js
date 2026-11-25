/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // A foto do mentor (placeholder) é servida em runtime pelo próprio servidor.
    // Se usar next/image com fontes externas, declare-as aqui:
    remotePatterns: [
      { protocol: "https", hostname: "mentoria-regisdencia.vercel.app" },
    ],
  },
};

module.exports = nextConfig;
