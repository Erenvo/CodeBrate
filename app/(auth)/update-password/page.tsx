// app/(auth)/update-password/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.')
      return
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)
    
    // Kullanıcıyı güncelle (Yeni şifre ata)
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Başarılı, ana sayfaya yönlendir
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-lg bg-indigo-900/50 flex items-center justify-center text-indigo-400 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white">Yeni Şifre Belirle</h1>
          <p className="text-sm text-gray-400 mt-2">
            Lütfen hesabın için yeni bir şifre gir.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="******"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="******"
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle ve Giriş Yap'}
          </button>
        </form>

      </div>
    </div>
  )
}