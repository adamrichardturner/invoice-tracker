/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

    return [
      {
        source: "/user/:path*",
        destination: `${backendUrl}/user/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
