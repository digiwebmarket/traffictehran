/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/v2tehrandashboard',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
