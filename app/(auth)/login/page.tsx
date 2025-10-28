// app/(auth)/login/page.tsx
'use client' // Etkileşimli bir sayfa olduğu için

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // Zaten oluşturduğumuz istemci
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form gönderme fonksiyonu
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Supabase'in giriş yapma fonksiyonunu kullanıyoruz (Görev 1.6) 
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message) // Hata varsa (örn: "Invalid login credentials") göster
      setLoading(false)
    } else {
      // Giriş başarılı, kullanıcıyı ana sayfaya yönlendir
      router.push('/')
      // router.refresh() Navbar'ın "Giriş Yaptı" durumuna
      // güncellenmesini tetikler.
      router.refresh()
    }
    // Not: Yönlendirme olduğu için setLoading(false) demeye gerek kalmayabilir,
    // ancak hata durumunda false'a çekmek önemlidir.
  }

  // Buradaki HTML/Tailwind kodu, senin 'auth_pages_dark_theme.jsx' dosyasından alındı
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-3">
            UP
          </div>
          <h1 className="text-2xl font-semibold text-white">Giriş Yap</h1>
          <p className="text-sm text-gray-400">
            Hesabına erişmek için e-posta ve şifreni gir.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Üniversite e-postan (@edu.tr)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-indigo-400 hover:underline">
            Kayıt ol
          </Link>
        </div>
      </div>
    </div>
  )
}