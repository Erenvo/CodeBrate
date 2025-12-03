// app/profil/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, MapPin, BookOpen, Github, Linkedin, MessageSquare, Mail, Code, Clock, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Profil Tipi
type ProfileType = {
  id: string
  username: string | null
  full_name: string | null // YENİ
  university: string | null
  department: string | null
  bio: string | null
  github_link: string | null
  linkedin_link: string | null
  discord_username: string | null
  email: string | null
  skills: string[] | null
  commitment_level: string | null
}

type ProjectType = {
  id: string
  title: string
  showcase_description: string
  category_tags: string[] | null
  created_at: string
}

export default function GenelProfilSayfasi() {
  const params = useParams()
  const id = params?.id as string
  
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [projects, setProjects] = useState<ProjectType[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setLoading(true)
      
      // 1. Profili Çek
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (profileError) {
        setError('Kullanıcı bulunamadı.')
      } else {
        setProfile(profileData)

        // 2. Projeleri Çek
        const { data: projectsData } = await supabase
          .from('projects')
          .select('id, title, showcase_description, category_tags, created_at')
          .eq('owner_id', id)
          .order('created_at', { ascending: false })

        if (projectsData) {
          setProjects(projectsData as any)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [id, supabase])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Profil yükleniyor...</div>
  if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-gray-400">{error || 'Profil bulunamadı.'}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* ÜST KISIM: Profil Başlık Kartı */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
              {profile.full_name ? profile.full_name.slice(0, 2).toUpperCase() : profile.username?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              {/* İSİM ve NICKNAME AYRIMI */}
              <h1 className="text-3xl font-bold text-white">{profile.full_name || profile.username}</h1>
              <p className="text-indigo-400 font-medium">@{profile.username}</p>
              
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
                {profile.university && <div className="flex items-center gap-1"><MapPin size={16} className="text-gray-500" /><span>{profile.university}</span></div>}
                {profile.department && <div className="flex items-center gap-1"><BookOpen size={16} className="text-pink-400" /><span>{profile.department}</span></div>}
                
                {profile.commitment_level && (
                  <div className="flex items-center gap-1 bg-gray-700/30 px-2 py-1 rounded text-xs border border-gray-600 text-green-400">
                    <Clock size={14} />
                    <span>{profile.commitment_level}</span>
                  </div>
                )}
              </div>
              
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
                {profile.email && <a href={`mailto:${profile.email}`} className="p-2 bg-gray-700 rounded-lg hover:bg-indigo-600 transition"><Mail size={20} /></a>}
            </div>
          </div>
          {profile.bio && (
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Hakkımda</h3>
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* ... ALT KISIMLAR (Bağlantılar ve Projeler) AYNI KALIYOR ... */}
        {/* Kodu kısaltmak için burayı tekrar yazmadım, önceki koddaki Grid yapısı aynen duracak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SOL KOLON: Bağlantılar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Bağlantılar</h3>
              <div className="space-y-3">
                {profile.github_link ? (
                  <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition group">
                    <Github className="text-gray-400 group-hover:text-white" />
                    <span className="text-indigo-400 group-hover:text-indigo-300 truncate text-sm">GitHub</span>
                  </a>
                ) : <p className="text-gray-500 text-sm">GitHub yok.</p>}

                {profile.linkedin_link ? (
                  <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition group">
                    <Linkedin className="text-gray-400 group-hover:text-white" />
                    <span className="text-indigo-400 group-hover:text-indigo-300 truncate text-sm">LinkedIn</span>
                  </a>
                ) : <p className="text-gray-500 text-sm">LinkedIn yok.</p>}

                {profile.discord_username ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50">
                    <MessageSquare className="text-gray-400" />
                    <span className="text-gray-300 text-sm truncate">{profile.discord_username}</span>
                  </div>
                ) : <p className="text-gray-500 text-sm">Discord yok.</p>}
              </div>
            </div>
          </div>

          {/* SAĞ KOLON: Projeler Listesi */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Code className="text-indigo-500" /> Yayınlanan Projeler
            </h3>

            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link href={`/projeler/${project.id}`} key={project.id} className="block group">
                    <article className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-indigo-500/50 transition">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">{project.title}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(project.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.showcase_description}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                          {project.category_tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-gray-700/50 text-xs text-gray-300 border border-gray-600/50">{tag}</span>
                          ))}
                        </div>
                        <span className="text-sm text-indigo-400 flex items-center gap-1 group-hover:underline">
                          İncele <ArrowRight size={14} />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col justify-center items-center text-center">
                <div className="p-3 bg-gray-700/30 rounded-full mb-3"><Code size={24} className="text-gray-500" /></div>
                <p className="text-gray-400">Bu kullanıcı henüz bir proje yayınlamadı.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}