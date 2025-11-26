// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/app/AuthContext' // Az önce oluşturduğun AuthContext'i çağırıyoruz
import { User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth() // Kullanıcı giriş yapmış mı? Bilgiyi çekiyoruz

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* LOGO KISMI */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">
            UP
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              CodaBrate
            </h1>
            <p className="text-xs text-gray-400">
              Projeni paylaş, takımını bul.
            </p>
          </div>
        </Link>

        {/* ORTA MENÜ (Sadece masaüstünde görünür) */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/projeler" className="hover:text-indigo-400">
            Projeler
          </Link>
          <Link href="/yetenekler" className="hover:text-indigo-400">
            Yetenek Havuzu
          </Link>
          <Link href="/nasil-calisir" className="hover:text-indigo-400">
            Nasıl Çalışır
          </Link>
        </nav>

        {/* SAĞ TARAF (Giriş Durumuna Göre Değişir) */}
        <div className="flex items-center gap-3">
          {user ? (
            // DURUM 1: KULLANICI GİRİŞ YAPMIŞSA
            <>
              <Link
                href="/profil/duzenle"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <User size={18} />
                <span>{user.user_metadata.username || 'Profilim'}</span>
              </Link>
              
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-4 py-2 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:text-red-400 transition"
              >
                <LogOut size={16} />
                Çıkış Yap
              </button>
            </>
          ) : (
            // DURUM 2: KULLANICI GİRİŞ YAPMAMIŞSA (Misafir)
            <>
              <Link
                href="/register"
                className="hidden sm:inline-flex items-center gap-2 rounded-md border border-indigo-500 px-4 py-2 text-indigo-400 text-sm font-medium hover:bg-gray-800 transition"
              >
                Kaydol
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition"
              >
                Giriş Yap
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}