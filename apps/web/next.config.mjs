/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@house-designer/shared", "@house-designer/ui"]
};

export default nextConfig;
