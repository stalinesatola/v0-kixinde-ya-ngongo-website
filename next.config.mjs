/** @type {import('next').NextConfig} */
const nextConfig = {
  // Erros de TypeScript param o deploy no Vercel — deixar o compilador verificar
  // typescript: { ignoreBuildErrors: true }, // REMOVIDO: escondia erros reais

  images: {
    unoptimized: true, // Manter para compatibilidade com imagens locais
    // Adicionar domínios externos quando necessário:
    // remotePatterns: [
    //   { protocol: 'https', hostname: '**.supabase.co' },
    // ],
  },

  // Melhor compatibilidade com pacotes que usam módulos Node.js (nodemailer, crypto)
  serverExternalPackages: ['nodemailer'],
}

export default nextConfig
