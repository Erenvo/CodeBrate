'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext'
import { useRouter } from 'next/navigation'
import { Lock, Globe, Tags, AlertCircle, Plus } from 'lucide-react'

export default function ProjeOlustur() {
  const { user, loading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    showcase_description: '',
    safe_details: '',
    tagsInput: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // app/projeler/olustur/page.tsx içindeki handleSubmit fonksiyonu

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!user) {
      setError('Proje oluşturmak için giriş yapmalısınız.')
      setIsSubmitting(false)
      return
    }

    // Etiketleri temizle
    const tagsArray = formData.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    // 1. ADIM: Vitrin (projects) Kaydı
    // DİKKAT: Burada artık 'safe_details' YOK!
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        owner_id: user.id,
        title: formData.title,
        showcase_description: formData.showcase_description,
        category_tags: tagsArray,
      })
      .select('id') // ID'yi geri istiyoruz
      .single()

    if (projectError) {
      setError('Proje hatası: ' + projectError.message)
      setIsSubmitting(false)
      return
    }

    if (projectData) {
      // 2. ADIM: Kasa (project_vault) Kaydı
      // Gizli veriyi buraya, yeni tabloya yazıyoruz
      const { error: vaultError } = await supabase
        .from('project_vault')
        .insert({
          project_id: projectData.id,
          safe_details: formData.safe_details // <--- DOĞRU YER BURASI ✅
        })

      if (vaultError) {
        setError('Kasa hatası: ' + vaultError.message)
      } else {
        router.push('/projeler')
        router.refresh()
      }
    }
    
    setIsSubmitting(false)
  }

  if (loading) return <div className="p-20 text-center text-gray-400">Yükleniyor...</div>
  if (!user) return <div className="p-20 text-center text-gray-400">Önce giriş yapmalısınız.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Plus className="text-indigo-500" /> Yeni Proje Oluştur
          </h1>
          <p className="text-gray-400 mt-2">
            Fikrini "Vitrin" ve "Kasa" mantığıyla paylaş.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg space-y-8">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Proje Başlığı</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Örn: Kampüs Pazarı"
            />
          </div>

          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
              <Globe size={20} />
              <h3 className="font-semibold text-lg">Vitrin (Herkese Açık)</h3>
            </div>
            <textarea
              required
              rows={3}
              value={formData.showcase_description}
              onChange={(e) => setFormData({ ...formData, showcase_description: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Projenin kısa ve merak uyandıran özeti..."
            />
          </div>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <Lock size={20} />
              <h3 className="font-semibold text-lg">Kasa (Gizli Detaylar)</h3>
            </div>
            <textarea
              required
              rows={4}
              value={formData.safe_details}
              onChange={(e) => setFormData({ ...formData, safe_details: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Teknik detaylar, iş modeli..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Tags size={16} /> Kategori Etiketleri
            </label>
            <input
              type="text"
              value={formData.tagsInput}
              onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Örn: React, Girişimcilik, AI"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-3 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isSubmitting ? 'Oluşturuluyor...' : 'Projeyi Yayınla'}
          </button>
        </form>
      </div>
    </div>
  )
}