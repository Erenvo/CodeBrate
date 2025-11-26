// app/profil/duzenle/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext'
import { useRouter } from 'next/navigation'
import { X, Lock, Eye, EyeOff } from 'lucide-react'

export default function ProfilDuzenle() {
  const { user, loading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  // PROFİL VERİLERİ
  const [formData, setFormData] = useState({
    username: '',
    university: '',
    department: '',
    bio: '',
    github_link: '',
    linkedin_link: '',
    discord_username: '',
    commitment_level: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState('')
  
  // ŞİFRE VERİLERİ
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPass, setIsChangingPass] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [passMessage, setPassMessage] = useState<string | null>(null)

  // 1. Verileri Çek
  useEffect(() => {
    const getProfile = async () => {
      if (dataFetched || !user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setFormData({
          username: data.username || '',
          university: data.university || '',
          department: data.department || '',
          bio: data.bio || '',
          github_link: data.github_link || '',
          linkedin_link: data.linkedin_link || '',
          discord_username: data.discord_username || '',
          commitment_level: data.commitment_level || '',
        })
        if (data.skills) {
          setSkills(data.skills)
        }
      }
      setDataFetched(true)
    }
    if (!loading && user) getProfile()
  }, [user, loading, supabase, dataFetched])

  // Yetenek İşlemleri
  const handleAddSkill = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill('')
    }
  }
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  // 2. PROFİL GÜNCELLEME
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        skills: skills,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id as string)

    if (error) {
      setMessage('Hata: ' + error.message)
    } else {
      setMessage('Profil başarıyla güncellendi! 🎉')
      router.refresh()
    }
    setIsSaving(false)
  }

  // 3. ŞİFRE DEĞİŞTİRME
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassMessage(null)

    if (!user?.email) return

    if (!passwordData.currentPassword) {
        setPassMessage('Hata: Lütfen mevcut şifrenizi girin.')
        return
    }
    if (passwordData.newPassword.length < 6) {
      setPassMessage('Hata: Yeni şifre en az 6 karakter olmalı.')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassMessage('Hata: Yeni şifreler eşleşmiyor.')
      return
    }

    setIsChangingPass(true)

    // ADIM A: Mevcut şifreyi doğrula
    // Not: Burada bilerek kullanıcının mevcut e-postasını logluyoruz
    console.log("Doğrulama yapılan email:", user.email)

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword
    })

    if (signInError) {
        // GERÇEK HATAYI GÖSTERİYORUZ
        setPassMessage(`Doğrulama Hatası: ${signInError.message}`)
        setIsChangingPass(false)
        return
    }

    // ADIM B: Güncelleme
    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    })

    if (error) {
      setPassMessage('Hata: ' + error.message)
    } else {
      setPassMessage('Şifreniz başarıyla değiştirildi! 🔒')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
    setIsChangingPass(false)
  }

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>
  if (!user) return <div className="p-8 text-center">Giriş yapmalısınız.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* --- KISIM 1: PROFİL BİLGİLERİ --- */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6">Profili Düzenle</h1>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Ad Soyad */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>

            {/* Yetenekler */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Yetenekler (Skills)</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(e as any); } }} placeholder="Örn: React, Python, Figma" className="flex-1 rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                <button onClick={handleAddSkill} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">Ekle</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-900/50 text-indigo-300 border border-indigo-700">
                    {skill} <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-white ml-1"><X size={14} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Diğer Alanlar */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Taahhüt</label>
              <select value={formData.commitment_level} onChange={(e) => setFormData({ ...formData, commitment_level: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white">
                <option value="" disabled>Seçiniz</option>
                <option value="Haftada 0-5 Saat">Haftada 0-5 Saat</option>
                <option value="Haftada 5-10 Saat">Haftada 5-10 Saat</option>
                <option value="Haftada 10-20 Saat">Haftada 10-20 Saat</option>
                <option value="Haftada 20+ Saat">Haftada 20+ Saat</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Üniversite</label><input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Bölüm</label><input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" /></div>
            </div>

            <div><label className="block text-sm font-medium text-gray-400 mb-1">Hakkımda</label><textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" /></div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div><label className="block text-sm font-medium text-gray-400 mb-1">GitHub</label><input type="text" value={formData.github_link} onChange={(e) => setFormData({ ...formData, github_link: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn</label><input type="text" value={formData.linkedin_link} onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Discord</label><input type="text" value={formData.discord_username} onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" /></div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSaving} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50">{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</button>
              {message && <p className={`mt-4 text-center text-sm ${message.includes('Hata') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            </div>
          </form>
        </div>

        {/* --- KISIM 2: GÜVENLİK (GÜNCELLENDİ) --- */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock size={20} className="text-indigo-500" /> Güvenlik
          </h2>
          {/* Hangi e-posta ile işlem yapılıyor? */}
          <p className="text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">
            Kullanıcı: <span className="text-white font-medium">{user.email}</span>
          </p>
          
          <form onSubmit={handleChangePassword} className="space-y-6">
            
            {/* Mevcut Şifre */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">Mevcut Şifre</label>
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Şu anki şifreniz..."
                />
                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-9 text-gray-400 hover:text-white">{showCurrentPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">Yeni Şifre</label>
                <input type={showNewPass ? "text" : "password"} required minLength={6} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Yeni şifreniz..." />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-9 text-gray-400 hover:text-white">{showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">Yeni Şifre (Tekrar)</label>
                <input type={showConfirmPass ? "text" : "password"} required minLength={6} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Yeni şifreniz (tekrar)..." />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-9 text-gray-400 hover:text-white">{showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>

            <div>
              <button type="submit" disabled={isChangingPass} className="flex justify-center py-2 px-6 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none disabled:opacity-50 transition">
                {isChangingPass ? 'Doğrulanıyor...' : 'Şifreyi Güncelle'}
              </button>
              {passMessage && <p className={`mt-3 text-sm ${passMessage.includes('Hata') ? 'text-red-400' : 'text-green-400'}`}>{passMessage}</p>}
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}