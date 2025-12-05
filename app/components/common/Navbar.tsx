// app/components/common/Navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const supabase = createClient()

  // Kullanıcı giriş yaptıysa Profil bilgilerini çek
  useEffect(() => {
    const fetchProfileName = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id)
          .single()

        if (data) {
          // Varsa Ad Soyad, yoksa Kullanıcı Adı, o da yoksa 'Profilim'
          setDisplayName(data.full_name || data.username || 'Profilim')
        }
      }
    }

    fetchProfileName()
  }, [user, supabase])

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
              CodeBrate
            </h1>
            <p className="text-xs text-gray-400">
              Projeni paylaş, takımını bul.
            </p>
          </div>
        </Link>

        {/* ORTA MENÜ */}
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

        {/* SAĞ TARAF (Giriş Durumuna Göre) */}
        <div className="flex items-center gap-3">
          {user ? (
            // KULLANICI GİRİŞ YAPMIŞSA
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mr-2 bg-gray-800 px-3 py-2 rounded-md border border-gray-700 hover:border-gray-500 transition"
              >
                <LayoutDashboard size={16} />
                <span>Panelim</span>
              </Link>

              <Link
                href="/profil/duzenle"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <User size={18} />
                {/* BURASI GÜNCELLENDİ: Artık veritabanından gelen ismi gösteriyor */}
                <span>{displayName || 'Yükleniyor...'}</span>
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
            // MİSAFİR İSE
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