/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Habilitar features experimentais se necessário
  },
  // Configurações para melhorar a performance
  swcMinify: true,
  // Configurações para o Vercel
  output: 'standalone',
};

module.exports = nextConfig; 