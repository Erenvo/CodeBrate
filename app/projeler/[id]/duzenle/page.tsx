'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { Lock, Globe, Tags, AlertCircle, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProjeDuzenle() {
  const { user, loading } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [formData, setFormData] = useState({
    title: '',
    showcase_description: '',
    safe_details: '',
    tagsInput: '',
    status: 'active',
  })

  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      // 1. Vitrin Verisi
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Proje bulunamadı.')
      } else if (data) {
        if (user && data.owner_id !== user.id) {
          router.push('/projeler/' + id)
          return
        }

        // 2. Kasa Verisi
        const { data: vaultData } = await supabase
          .from('project_vault')
          .select('safe_details')
          .eq('project_id', id)
          .single()

        setFormData({
          title: data.title,
          showcase_description: data.showcase_description || '',
          safe_details: vaultData?.safe_details || '', 
          tagsInput: data.category_tags ? data.category_tags.join(', ') : '',
          status: data.status || 'active',
        })
      }
      setIsLoadingData(false)
    }

    if (user && id) fetchProject()
  }, [id, user, supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const tagsArray = formData.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    // 1. Vitrin Güncelleme
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        title: formData.title,
        showcase_description: formData.showcase_description,
        category_tags: tagsArray,
        status: formData.status,
      })
      .eq('id', id)

    if (updateError) {
      setError('Hata (Vitrin): ' + updateError.message)
      setIsSubmitting(false)
      return
    }

    // 2. Kasa Güncelleme
    const { error: vaultError } = await supabase
      .from('project_vault')
      .update({
        safe_details: formData.safe_details
      })
      .eq('project_id', id)

    if (vaultError) {
      setError('Hata (Kasa): ' + vaultError.message)
    } else {
      router.push('/projeler/' + id) 
      router.refresh()
    }
    setIsSubmitting(false)
  }

  if (loading || isLoadingData) return <div className="p-20 text-center text-gray-400">Yükleniyor...</div>
  if (!user) return <div className="p-20 text-center text-gray-400">Yetkiniz yok.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/projeler/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft size={20} /> İptal ve Geri Dön
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Projeyi Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg space-y-8">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Proje Başlığı</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3 text-indigo-400"><Globe size={20} /><h3 className="font-semibold text-lg">Vitrin (Herkese Açık)</h3></div>
            <textarea required rows={3} value={formData.showcase_description} onChange={(e) => setFormData({ ...formData, showcase_description: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3 text-emerald-400"><Lock size={20} /><h3 className="font-semibold text-lg">Kasa (Gizli Detaylar)</h3></div>
            <textarea required rows={4} value={formData.safe_details} onChange={(e) => setFormData({ ...formData, safe_details: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Tags size={16} /> Kategori Etiketleri</label>
            <input type="text" value={formData.tagsInput} onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Proje Durumu</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="active">🟢 Yayında (Aktif)</option>
              <option value="completed">🏁 Tamamlandı</option>
              <option value="closed">🔴 Alım Kapalı</option>
            </select>
          </div>

          {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-500/20"><AlertCircle size={18} /> {error}</div>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? 'Kaydediliyor...' : <><Save size={20} /> Değişiklikleri Kaydet</>}
          </button>
        </form>
      </div>
    </div>
  )
}