// app/(auth)/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('') 
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const supabase = createClient()

  // Username kontrolü
  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setUsernameStatus(null)
        return
      }

      setCheckingUsername(true)
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      setUsernameStatus(existingUser ? 'taken' : 'available')
      setCheckingUsername(false)
    }

    const debounceTimer = setTimeout(checkUsername, 500)
    return () => clearTimeout(debounceTimer)
  }, [username])

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

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor. Lütfen aynı şifreyi gir.')
      setLoading(false)
      return
    }

    if (usernameStatus === 'taken') {
      setError('Bu kullanıcı adı maalesef alınmış. Lütfen başka bir tane seç.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(), 
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
      setConfirmPassword('')
      setUsername('')
      setFullName('')
      setUsernameStatus(null)
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
            placeholder="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 focus:ring-indigo-500 outline-none"
          />
          
          {/* Kullanıcı Adı Alanı */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} 
                required
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 pr-10 text-gray-200 focus:ring-indigo-500 outline-none"
              />
              {checkingUsername && (
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              {!checkingUsername && usernameStatus === 'available' && (
                <div className="absolute right-3 top-3 text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {!checkingUsername && usernameStatus === 'taken' && (
                <div className="absolute right-3 top-3 text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {usernameStatus === 'available' && (
              <p className="text-sm text-green-400 mt-1">✓ Bu kullanıcı adı kullanılabilir</p>
            )}
            {usernameStatus === 'taken' && (
              <p className="text-sm text-red-400 mt-1">✗ Bu kullanıcı adı alınmış</p>
            )}
          </div>

          <input
            type="email"
            placeholder="Üniversite e-postan (@edu.tr)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-gray-200 focus:ring-indigo-500 outline-none"
          />
          
          {/* Şifre Alanı */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre oluştur"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 pr-10 text-gray-200 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 4.5a7 7 0 016.338 10.355l-1.413-1.413A5 5 0 109.999 5.5H10a1 1 0 000-2zm3.894 10.445l-1.414-1.414A3 3 0 106.5 9.5a1 1 0 01-2 0 5 5 0 118.106 5.445z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* Şifre Onay Alanı */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Şifreyi onayla"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 pr-10 text-gray-200 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 4.5a7 7 0 016.338 10.355l-1.413-1.413A5 5 0 109.999 5.5H10a1 1 0 000-2zm3.894 10.445l-1.414-1.414A3 3 0 106.5 9.5a1 1 0 01-2 0 5 5 0 118.106 5.445z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading || usernameStatus === 'taken'}
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