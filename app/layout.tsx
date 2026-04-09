import type { Metadata, Viewport } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KIXINDE YA NGONGO | Engenharia e Construção Civil',
  description: 'Empresa multidisciplinar angolana especializada em Engenharia, Construção Civil, Arquitetura, Topografia e Inteligência Artificial. Unimos a sabedoria do território à tecnologia do futuro.',
  keywords: ['arquitetura', 'engenharia', 'construção', 'topografia', 'inteligência artificial', 'Angola', 'Luanda', 'projetos', 'infraestrutura'],
  openGraph: {
    title: 'KIXINDE YA NGONGO',
    description: 'Arquitetura, Engenharia e Inteligência Artificial para transformar terrenos em projetos reais.',
    locale: 'pt_AO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#303030',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}
