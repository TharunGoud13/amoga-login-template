import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "secure.gravatar.com",
      "images.tmcnet.com"
    ],
  },
  reactStrictMode: true,
  compiler: {
      removeConsole: process.env.NODE_ENV === "production"
  },
};

const withPWAConfig = withPWA({
  dest: "public",
});

export default withPWAConfig(withNextIntl(nextConfig));
