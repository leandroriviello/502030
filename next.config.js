/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // Railway usa el puerto 3000 por defecto, pero si necesitas otro puerto
  // Railway lo asignará automáticamente a través de la variable PORT
};

module.exports = nextConfig;

