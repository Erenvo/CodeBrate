// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react' // İkonları ekledik

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // Şifre göster/gizle durumu
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

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
          {/* E-posta Input */}
          <input
            type="email"
            placeholder="Üniversite e-postan (@edu.tr)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-500"
          />
          
          {/* Şifre Input (Göz İkonlu) */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Tipi duruma göre değişir
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Şifremi Unuttum Linki */}
          <div className="flex justify-end text-sm">
            <Link 
              href="/forgot-password" 
              className="font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              Şifreni mi unuttun?
            </Link>
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>

          {error && (
            <p className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition">
            Kayıt ol
          </Link>
        </div>
      </div>
    </div>
  )
}