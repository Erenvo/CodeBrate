// app/projeler/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext'
import Link from 'next/link'
import { User, Calendar, MapPin, Lock, Globe, ArrowLeft, CheckCircle, Trash2, Edit, Send, Clock, XCircle } from 'lucide-react'

// Veri Tipleri
type ProjectType = {
  id: string
  title: string
  showcase_description: string
  safe_details: string | null
  category_tags: string[] | null
  created_at: string
  owner_id: string
  status: string // Status verisi
  profiles: {
    id: string
    username: string
    university: string
    department: string
  } | null
}

type ApplicationType = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function ProjeDetay() {
  const params = useParams()
  const id = params?.id as string
  
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const [project, setProject] = useState<ProjectType | null>(null)
  const [myApplication, setMyApplication] = useState<ApplicationType | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // 1. Projeyi Çek
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`*, profiles (id, username, university, department)`)
        .eq('id', id)
        .single()

      if (projectError) {
        setError('Proje bulunamadı.')
      } else {
        setProject(projectData as any)

        // 2. Başvuru Durumunu Kontrol Et
        if (user) {
          const { data: appData } = await supabase
            .from('project_applications')
            .select('id, status')
            .eq('project_id', id)
            .eq('applicant_id', user.id)
            .single()
          
          if (appData) {
            setMyApplication(appData as any)
          }
        }
      }
      setLoading(false)
    }

    if (id) fetchData()
  }, [id, user, supabase])

  // --- BAŞVURU YAPMA ---
  const handleApply = async () => {
    if (!user) {
      alert('Başvuru yapmak için giriş yapmalısın.')
      return
    }
    
    const message = window.prompt("Projeye katılmak istediğine dair kısa bir not bırak (Opsiyonel):")
    
    setApplying(true)
    const { error } = await supabase
      .from('project_applications')
      .insert({
        project_id: id,
        applicant_id: user.id,
        message: message
      })

    if (error) {
      alert('Hata: ' + error.message)
    } else {
      alert('Başvurun gönderildi! Proje sahibi onaylayınca bildirim alacaksın.')
      setMyApplication({ id: 'temp', status: 'pending' })
      router.refresh()
    }
    setApplying(false)
  }

  // --- SİLME ---
  const handleDelete = async () => {
    if (!window.confirm('Bu projeyi silmek istediğine emin misin?')) return
    setIsDeleting(true)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) {
      router.push('/projeler')
      router.refresh()
    } else {
      setIsDeleting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Yükleniyor...</div>
  if (error || !project) return <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">{error || 'Proje bulunamadı.'} <Link href="/projeler" className="text-indigo-400 hover:underline">Geri Dön</Link></div>

  const isOwner = user?.id === project.owner_id
  const isSafeUnlocked = isOwner || myApplication?.status === 'approved'

  // 🔥🔥🔥 ÇÖZÜM BURADA 🔥🔥🔥
  // Status verisini al, küçük harfe çevir. Eğer yoksa (null ise) boş string yap.
  const status = project.status ? project.status.toLowerCase() : ''
  
  // MANTIK: Eğer proje 'completed' (tamamlandı) veya 'closed' (kapalı) DEĞİLSE -> AKTİFTİR.
  // Yani null (boş) olsa bile aktif sayılır.
  const isProjectActive = status !== 'completed' && status !== 'closed'

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/projeler" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft size={20} /> Projelere Dön
        </Link>

        {/* Üst Başlık Kartı */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            
            {/* Durum Etiketi */}
            <div className="mb-4">
              {/* Null veya Active ise YAYINDA göster */}
              {(status === 'active' || !status) && <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/20 font-medium">🟢 Yayında (Aktif)</span>}
              {status === 'completed' && <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20 font-medium">🏁 Proje Tamamlandı</span>}
              {status === 'closed' && <span className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm border border-red-500/20 font-medium">🔴 Alım Kapalı</span>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.category_tags?.map((tag, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm bg-indigo-900/50 text-indigo-300 border border-indigo-700">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-t border-gray-700 pt-6">
              <Link href={`/profil/${project.profiles?.id}`} className="flex items-center gap-2 hover:text-indigo-400 transition">
                <div className="bg-gray-700 p-1.5 rounded-full"><User size={16} /></div>
                <span className="font-medium">{project.profiles?.username || 'Anonim'}</span>
              </Link>
              {project.profiles?.university && (
                <div className="flex items-center gap-2"><MapPin size={16} /><span>{project.profiles.university}</span></div>
              )}
              <div className="flex items-center gap-2"><Calendar size={16} /><span>{new Date(project.created_at).toLocaleDateString('tr-TR')}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* VİTRİN */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <Globe size={24} />
                <h2 className="text-xl font-semibold">Proje Vitrini</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                {project.showcase_description}
              </div>
            </div>

            {/* KASA */}
            <div className={`border rounded-xl p-6 transition-all ${isSafeUnlocked ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-gray-800/30 border-gray-700 border-dashed'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 ${isSafeUnlocked ? 'text-emerald-400' : 'text-gray-500'}`}>
                  <Lock size={24} />
                  <h2 className="text-xl font-semibold">Kasa (Gizli Detaylar)</h2>
                </div>
                {isOwner && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">Sahibi Sensin</span>}
                {myApplication?.status === 'approved' && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">Erişim İznin Var</span>}
              </div>

              {isSafeUnlocked ? (
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                  {project.safe_details || 'Henüz gizli detay eklenmemiş.'}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-2">Bu bilgiler kilitlidir.</p>
                  <p className="text-sm text-gray-500">Detayları görmek için projeye başvurmalı ve onay almalısın.</p>
                </div>
              )}
            </div>
          </div>

          {/* SAĞ KOLON (Aksiyonlar) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-24">
              
              {isOwner ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-2">Proje Yönetimi</h3>
                  <p className="text-sm text-gray-400 mb-4">Bu projenin sahibi sensin.</p>
                  
                  {/* DASHBOARD BUTONU */}
                  <button className="w-full bg-gray-700 text-gray-400 cursor-not-allowed py-2 rounded-lg mb-2 border border-gray-600">
                    Başvuruları Yönet (Yakında)
                  </button>

                  <Link href={`/projeler/${id}/duzenle`} className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
                    <Edit size={16} /> Projeyi Düzenle
                  </Link>
                  <button onClick={handleDelete} disabled={isDeleting} className="flex items-center justify-center gap-2 w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 py-2 rounded-lg transition">
                    <Trash2 size={16} /> Sil
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">İlgileniyor musun?</h3>
                  
                  {/* Başvuru Butonu */}
                  {!myApplication && (
                    <button 
                      onClick={handleApply}
                      // MANTIK DÜZELDİ: Aktifse VEYA boşsa (null) buton açılır. Sadece kapalıysa kapanır.
                      disabled={applying || !isProjectActive} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying ? 'Gönderiliyor...' : <> <Send size={18} /> Projeye Başvur </>}
                    </button>
                  )}

                  {myApplication?.status === 'pending' && (
                    <div className="w-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                      <Clock size={18} /> Başvuru Beklemede
                    </div>
                  )}

                  {myApplication?.status === 'approved' && (
                    <div className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Başvurun Onaylandı!
                    </div>
                  )}

                  {myApplication?.status === 'rejected' && (
                    <div className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                      <XCircle size={18} /> Başvuru Reddedildi
                    </div>
                  )}

                  <p className="text-xs text-center text-gray-500 mt-2">
                    {isProjectActive
                      ? 'Başvurun onaylanana kadar "Kasa" detaylarını göremezsin.' 
                      : 'Bu proje şu an başvuru kabul etmiyor.'}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}