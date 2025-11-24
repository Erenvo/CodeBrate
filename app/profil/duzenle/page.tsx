// app/profil/duzenle/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext' // Import yolunu kontrol et
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react' // Çarpı ikonu için

export default function ProfilDuzenle() {
  const { user, loading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  // Form verileri
  const [formData, setFormData] = useState({
    username: '',
    university: '',
    department: '',
    bio: '',
    github_link: '',
    linkedin_link: '',
    discord_username: '',
  })
  
  // Yetenekler için özel state
  const [skills, setSkills] = useState<string[]>([]) // Kaydedilecek liste
  const [currentSkill, setCurrentSkill] = useState('') // O an yazılan yetenek

  const [isSaving, setIsSaving] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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
        })
        // Yetenekleri de çek (eğer varsa)
        if (data.skills) {
          setSkills(data.skills)
        }
      }
      setDataFetched(true)
    }
    if (!loading && user) getProfile()
  }, [user, loading, supabase, dataFetched])

  // Yetenek Ekleme Fonksiyonu
  const handleAddSkill = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Sayfanın yenilenmesini engelle
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]) // Listeye ekle
      setCurrentSkill('') // Kutuyu temizle
    }
  }

  // Yetenek Silme Fonksiyonu
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  // 2. Verileri Kaydet
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        university: formData.university,
        department: formData.department,
        bio: formData.bio,
        github_link: formData.github_link,
        linkedin_link: formData.linkedin_link,
        discord_username: formData.discord_username,
        skills: skills, // Yetenek dizisini kaydet
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id as string)

    if (error) {
      setMessage('Hata oluştu: ' + error.message)
    } else {
      setMessage('Profil başarıyla güncellendi! 🎉')
      router.refresh()
    }
    setIsSaving(false)
  }

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>
  if (!user) return <div className="p-8 text-center">Giriş yapmalısınız.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Profili Düzenle</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* YETENEKLER (YENİ) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Yetenekler (Skills)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Örn: React, Python, Figma"
                className="flex-1 rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleAddSkill}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Ekle
              </button>
            </div>
            {/* Eklenen Yetenekler Listesi */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-900/50 text-indigo-300 border border-indigo-700">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-white focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Üniversite & Bölüm */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Üniversite</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bölüm</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Hakkımda */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Hakkımda</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Sosyal Medya */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">GitHub</label>
              <input
                type="text"
                value={formData.github_link}
                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn</label>
              <input
                type="text"
                value={formData.linkedin_link}
                onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Discord</label>
              <input
                type="text"
                value={formData.discord_username}
                onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Buton */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
              {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            {message && (
              <p className={`mt-4 text-center text-sm ${message.includes('Hata') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}