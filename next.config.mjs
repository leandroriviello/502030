/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: process.env.NODE_ENV === 'production',
  // Configuración para Railway
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // Railway usa el puerto 3000 por defecto, pero si necesitas otro puerto
  // Railway lo asignará automáticamente a través de la variable PORT
};

export default nextConfig;

