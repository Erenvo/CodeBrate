// app/projeler/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Plus, Calendar, User, ArrowRight, MapPin } from 'lucide-react'

// Veri Tipleri
type ProjectType = {
  id: string
  title: string
  showcase_description: string
  category_tags: string[] | null
  created_at: string
  status: string
  profiles: {
    username: string
    university: string
  } | null // Supabase'den gelen ilişkisel veri
}

export default function ProjePazari() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      
      // İLİŞKİSEL SORGU (JOIN)
      // Hem projeleri çekiyoruz hem de 'owner_id' üzerinden
      // o projeyi oluşturan kişinin ismini ve okulunu alıyoruz.
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            username,
            university
          )
        `)
        .order('created_at', { ascending: false }) // En yeni en üstte

      if (error) {
        console.error('Hata:', error)
      } else {
        setProjects(data as any)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [supabase])

  // Arama Filtresi (Başlık, Açıklama veya Etiketlerde arar)
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.showcase_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category_tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Başlık ve Üst Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Proje Pazarı</h1>
            <p className="text-gray-400 mt-2">Hayalindeki projeyi bul veya kendi ekibini kur.</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            {/* Arama Çubuğu */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Proje, etiket veya konu ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
              />
            </div>
            {/* Proje Oluştur Butonu */}
            <Link 
              href="/projeler/olustur" 
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Proje Oluştur</span>
            </Link>
          </div>
        </div>

        {/* Yükleniyor... */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Proje Listesi */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article 
                key={project.id} 
                // 1. DİKKAT: Buraya 'relative' eklendi
                className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition group h-full relative"
              >
                
                {/* 2. YENİ KISIM: Durum Etiketi (Sağ Üst) */}
                <div className="absolute top-4 right-4 z-10">
                  {project.status === 'active' && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 font-medium">Yayında</span>}
                  {project.status === 'completed' && <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20 font-medium">Tamamlandı</span>}
                  {project.status === 'closed' && <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20 font-medium">Kapalı</span>}
                </div>
                {/* --------------------------------------- */}

                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Yazar Bilgisi */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="bg-gray-700 p-1 rounded-full">
                        <User size={12} />
                      </div>
                      <span className="text-indigo-300 font-medium">{project.profiles?.username || 'Anonim'}</span>
                    </div>
                    {project.profiles?.university && (
                        <div className="flex items-center gap-1 text-xs text-gray-500" title={project.profiles.university}>
                            <MapPin size={12} />
                            <span className="truncate max-w-[100px]">{project.profiles.university}</span>
                        </div>
                    )}
                  </div>

                  {/* Başlık */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Açıklama */}
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {project.showcase_description}
                  </p>

                  {/* Etiketler */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-700/50">
                    {project.category_tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 rounded-md bg-gray-700/30 text-indigo-300 text-xs border border-gray-600/50">
                        {tag}
                      </span>
                    ))}
                    {project.category_tags && project.category_tags.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">+{project.category_tags.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Alt Bilgi */}
                <div className="bg-gray-900/30 px-6 py-3 flex justify-between items-center border-t border-gray-700">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={14} />
                    {new Date(project.created_at).toLocaleDateString('tr-TR')}
                  </div>
                  <Link 
                    href={`/projeler/${project.id}`} 
                    className="text-sm text-indigo-400 font-medium hover:text-indigo-300 flex items-center gap-1"
                  >
                    Detaylar <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Hiç Proje Yoksa */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl bg-gray-800/50">
            <div className="bg-gray-800 inline-block p-4 rounded-full mb-4 shadow-sm">
              <Search size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Henüz proje bulunamadı</h3>
            <p className="text-gray-400 mt-2">Aramayı değiştirmeyi veya ilk projeyi sen oluşturmayı dene.</p>
            <Link 
              href="/projeler/olustur"
              className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 underline"
            >
              Hemen bir tane oluştur
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}