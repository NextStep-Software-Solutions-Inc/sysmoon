/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sysmoon/database'],
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
