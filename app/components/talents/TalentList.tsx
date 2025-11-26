'use client'
import Link from 'next/link'
import { User, MapPin, BookOpen, ArrowRight } from 'lucide-react'

export type ProfileType = {
  id: string
  username: string
  university: string
  department: string
  bio: string
  skills: string[] | null
}

type Props = {
  profiles: ProfileType[]
  loading: boolean
}

// 👇 Burada da "default" yok
export function TalentList({ profiles, loading }: Props) {
  if (loading) return <div className="text-center py-20 text-gray-500">Yetenekler aranıyor...</div>

  if (profiles.length === 0) return (
    <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl bg-gray-800/50">
      <div className="bg-gray-800 inline-block p-4 rounded-full mb-4 shadow-sm">
        <User size={32} className="text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white">Kimse bulunamadı</h3>
      <p className="text-gray-400 mt-2">Farklı bir arama terimi deneyebilirsin.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <article key={profile.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-indigo-500/50 transition group flex flex-col h-full hover:shadow-lg hover:shadow-indigo-500/10">
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                {profile.username?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition line-clamp-1">
                  {profile.username}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin size={12} />
                  <span className="truncate max-w-[150px]">{profile.university || 'Üniversite Yok'}</span>
                </div>
              </div>
            </div>
            {profile.department && (
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-3 bg-gray-700/30 p-2 rounded">
                <BookOpen size={16} className="text-indigo-400" />
                <span className="truncate">{profile.department}</span>
              </div>
            )}
            <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
              {profile.bio || 'Henüz biyografi eklenmemiş.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-700/50">
              {profile.skills?.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 rounded-md bg-gray-700/50 text-indigo-300 text-xs border border-gray-600/50">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <Link href={`/profil/${profile.id}`} className="bg-gray-900/30 border-t border-gray-700 px-6 py-3 flex justify-between items-center text-sm text-indigo-400 font-medium hover:bg-gray-700/50 transition">
            Profili İncele <ArrowRight size={16} />
          </Link>
        </article>
      ))}
    </div>
  )
}