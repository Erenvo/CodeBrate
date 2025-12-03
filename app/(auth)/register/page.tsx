// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('') 
  const [username, setUsername] = useState('') 
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const validateEmailDomain = (email: string) => {
    return email.endsWith('.edu.tr')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (!validateEmailDomain(email)) {
      setError('Kayıt olmak için .edu.tr uzantılı bir üniversite e-postası kullanmalısınız.')
      setLoading(false)
      return
    }

    // Kullanıcı adı kontrolü
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      setError('Bu kullanıcı adı maalesef alınmış. Lütfen başka bir tane seç.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, 
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı onaylayın.')
      setEmail('')
      setPassword('')
      setUsername('')
      setFullName('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-3">UP</div>
          <h1 className="text-2xl font-semibold text-white">Kayıt Ol</h1>
          <p className="text-sm text-gray-400">Yeni bir hesap oluşturmak için bilgileri doldur.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ad Soyad"  // <-- SADECE BU KALDI
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Kullanıcı Adı" // <-- SADECE BU KALDI
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} 
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 focus:ring-indigo-500 outline-none"
          />
          <input
            type="email"
            placeholder="Üniversite e-postan (@edu.tr)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 focus:ring-indigo-500 outline-none"
          />
          <input
            type="password"
            placeholder="Şifre oluştur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 focus:ring-indigo-500 outline-none"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Kontrol Ediliyor...' : 'Kayıt Ol'}
          </button>

          {error && <p className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
          {message && <p className="text-sm text-green-500 text-center">{message}</p>}
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          Zaten bir hesabın var mı? <Link href="/login" className="text-indigo-400 hover:underline">Giriş yap</Link>
        </div>
      </div>
    </div>
  )
}