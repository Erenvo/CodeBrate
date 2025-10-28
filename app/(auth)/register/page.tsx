// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // Adım 2'de oluşturduk
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('') // Tasarımdaki 'Ad Soyad' alanı
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Görev 1.5'teki frontend doğrulaması [cite: 71]
  const validateEmailDomain = (email: string) => {
    return email.endsWith('.edu.tr')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (!validateEmailDomain(email)) {
      setError(
        'Kayıt olmak için .edu.tr uzantılı bir üniversite e-postası kullanmalısınız.'
      )
      setLoading(false)
      return
    }

    // Supabase'e kayıt isteği [cite: 71]
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // SQL fonksiyonumuzun beklediği 'Ad Soyad' verisi
          username: username,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage(
        'Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı onaylayın.'
      )
      // Formu temizle
      setEmail('')
      setPassword('')
      setUsername('')
    }
    setLoading(false)
  }

  // Buradaki HTML/Tailwind kodu, senin 'auth_pages_dark_theme.jsx' dosyasından alındı
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-3">
            UP
          </div>
          <h1 className="text-2xl font-semibold text-white">Kayıt Ol</h1>
          <p className="text-sm text-gray-400">
            Yeni bir hesap oluşturmak için bilgilerini doldur.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
          />
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
            placeholder="Şifre oluştur"
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
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {message && (
            <p className="text-sm text-green-500 text-center">{message}</p>
          )}
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          Zaten bir hesabın var mı?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Giriş yap
          </Link>
        </div>
      </div>
    </div>
  )
}