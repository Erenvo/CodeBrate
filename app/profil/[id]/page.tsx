// app/profil/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, MapPin, BookOpen, Github, Linkedin, MessageSquare, Mail, Code } from 'lucide-react'

// Profil veri tipi (Skills eklendi)
type ProfileType = {
  id: string
  username: string | null
  university: string | null
  department: string | null
  bio: string | null
  github_link: string | null
  linkedin_link: string | null
  discord_username: string | null
  email: string | null
  skills: string[] | null // <-- YENİ EKLENEN ALAN
}

export default function GenelProfilSayfasi() {
  const params = useParams()
  const id = params?.id as string
  
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return
      setLoading(true)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Kullanıcı bulunamadı.')
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [id, supabase])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Profil yükleniyor...</div>
  
  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
      <p>{error || 'Profil bulunamadı.'}</p>
      <a href="/" className="text-indigo-400 hover:underline">Ana Sayfaya Dön</a>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Profil Başlık Kartı */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
              {profile.username?.slice(0, 2).toUpperCase() || '??'}
            </div>

            {/* İsim, Ünvan ve YETENEKLER */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profile.username || 'İsimsiz Kullanıcı'}</h1>
              
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
                {profile.university && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-indigo-400" />
                    <span>{profile.university}</span>
                  </div>
                )}
                {profile.department && (
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} className="text-pink-400" />
                    <span>{profile.department}</span>
                  </div>
                )}
              </div>

              {/* --- YETENEKLER BÖLÜMÜ (BURASI EKSİKTİ) --- */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {/* ------------------------------------------- */}
            </div>

            {/* İletişim Butonları */}
            <div className="flex gap-2">
                {profile.email && (
                    <a href={`mailto:${profile.email}`} className="p-2 bg-gray-700 rounded-lg hover:bg-indigo-600 transition" title="E-posta Gönder">
                        <Mail size={20} />
                    </a>
                )}
            </div>
          </div>

          {/* Hakkımda */}
          {profile.bio && (
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Hakkımda</h3>
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Alt Bilgiler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bağlantılar */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Bağlantılar</h3>
            <div className="space-y-3">
              {profile.github_link ? (
                <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition group">
                  <Github className="text-gray-400 group-hover:text-white" />
                  <span className="text-indigo-400 group-hover:text-indigo-300 truncate">{profile.github_link.replace('https://', '')}</span>
                </a>
              ) : <p className="text-gray-500 text-sm">GitHub eklenmemiş.</p>}

              {profile.linkedin_link ? (
                <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition group">
                  <Linkedin className="text-gray-400 group-hover:text-white" />
                  <span className="text-indigo-400 group-hover:text-indigo-300 truncate">LinkedIn Profili</span>
                </a>
              ) : <p className="text-gray-500 text-sm">LinkedIn eklenmemiş.</p>}

              {profile.discord_username ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50">
                  <MessageSquare className="text-gray-400" />
                  <span className="text-gray-300">{profile.discord_username}</span>
                </div>
              ) : <p className="text-gray-500 text-sm">Discord eklenmemiş.</p>}
            </div>
          </div>

          {/* Henüz Proje Yok */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-gray-700/30 rounded-full mb-3">
              <Code size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Henüz Proje Yok</h3>
            <p className="text-sm text-gray-400 mt-2">Bu kullanıcı henüz bir proje yayınlamadı veya bir ekibe katılmadı.</p>
          </div>
        </div>
      </div>
    </div>
  )
}