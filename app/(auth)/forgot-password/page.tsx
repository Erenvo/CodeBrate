// app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // Şifre sıfırlama e-postası gönder
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Kullanıcı linke tıklayınca bu sayfaya yönlendirilecek:
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Şifre sıfırlama linki e-postana gönderildi! Lütfen gelen kutunu (ve spam klasörünü) kontrol et.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-lg bg-indigo-900/50 flex items-center justify-center text-indigo-400 mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white">Şifre Sıfırlama</h1>
          <p className="text-sm text-gray-400 mt-2">
            E-posta adresini gir, sana sıfırlama linki gönderelim.
          </p>
        </div>

        {!message ? (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">E-posta Adresi</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="ornek@universite.edu.tr"
              />
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
          </form>
        ) : (
          <div className="text-center bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Giriş ekranına dön
          </Link>
        </div>

      </div>
    </div>
  )
}