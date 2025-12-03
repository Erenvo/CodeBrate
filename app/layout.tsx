// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/components/common/Navbar' // Navbar'ı ekledik
import { AuthProvider } from '@/app/AuthContext' // AuthProvider'ı ekledik
import Footer from '@/app/components/common/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Üniversite Proje Partneri Ağı',
  description: 'Üniversite öğrencileri için proje arkadaşı bulma platformu.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {/* Tüm siteyi AuthProvider ile sarıyoruz ki giriş bilgisini bilsin */}
        <AuthProvider>
          
          {/* Navbar her sayfada en üstte görünecek */}
          <Navbar />
          
          {/* Sayfaların içeriği buraya gelecek */}
          {children}

          <Footer />
          
        </AuthProvider>
      </body>
    </html>
  )
}