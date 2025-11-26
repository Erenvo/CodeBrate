// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext' // Context yolun @/context ise bu doğru
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, ArrowRight, User, Briefcase } from 'lucide-react'

// Veri Tipleri
type ApplicationType = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  message: string
  project: {
    id: string
    title: string
  }
  applicant: {
    id: string
    username: string
    university: string
  }
}

// 👇 BU SATIR ÇOK ÖNEMLİ (export default)
export default function DashboardPage() {
  const { user, loading } = useAuth()
  const supabase = createClient()

  const [myApplications, setMyApplications] = useState<ApplicationType[]>([]) 
  const [incomingApplications, setIncomingApplications] = useState<ApplicationType[]>([]) 
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setDataLoading(true)

      // 1. Yaptığım Başvurular
      const { data: myApps } = await supabase
        .from('project_applications')
        .select(`
          id, status, created_at, message,
          project:projects (id, title),
          applicant:profiles (id, username, university)
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })

      // 2. Projelerime Gelen Başvurular
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('owner_id', user.id)
      
      if (projects && projects.length > 0) {
        const projectIds = projects.map(p => p.id)
        const { data: incomingApps } = await supabase
          .from('project_applications')
          .select(`
            id, status, created_at, message,
            project:projects (id, title),
            applicant:profiles (id, username, university)
          `)
          .in('project_id', projectIds)
          .order('created_at', { ascending: false })
        
        if (incomingApps) setIncomingApplications(incomingApps as any)
      }

      if (myApps) setMyApplications(myApps as any)
      setDataLoading(false)
    }

    if (!loading) fetchData()
  }, [user, loading, supabase])

  // Durum Güncelleme
  const handleUpdateStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('project_applications')
      .update({ status: newStatus })
      .eq('id', appId)

    if (error) {
      alert('Hata: ' + error.message)
    } else {
      setIncomingApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ))
    }
  }

  if (loading || dataLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Yükleniyor...</div>
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-400">Giriş yapmalısın.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <h1 className="text-3xl font-bold text-white mb-8">Yönetim Paneli</h1>

        {/* GELEN BAŞVURULAR */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
            <User size={24} /> Projelerine Gelen Başvurular
          </h2>
          
          {incomingApplications.length === 0 ? (
            <p className="text-gray-500 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">Henüz projelerine başvuran kimse yok.</p>
          ) : (
            <div className="space-y-4">
              {incomingApplications.map((app) => (
                <div key={app.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-lg">{app.applicant?.username || 'Anonim'}</span>
                      <span className="text-gray-500 text-sm">• {app.applicant?.university}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      <span className="text-indigo-400 font-medium">{app.project?.title}</span> projesine başvurdu.
                    </p>
                    {app.message && (
                      <div className="bg-gray-900/50 p-3 rounded-lg text-sm text-gray-300 italic border-l-2 border-indigo-500">
                        "{app.message}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {app.status === 'pending' ? (
                      <>
                        <button onClick={() => handleUpdateStatus(app.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                          Onayla
                        </button>
                        <button onClick={() => handleUpdateStatus(app.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                          Reddet
                        </button>
                        {/* Profil Linki */}
                        {app.applicant?.id && (
                            <Link href={`/profil/${app.applicant.id}`} className="text-gray-400 hover:text-white p-2 bg-gray-700 rounded-lg transition">
                            <ArrowRight size={20} />
                            </Link>
                        )}
                      </>
                    ) : (
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                        app.status === 'approved' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'
                      }`}>
                        {app.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* YAPTIĞIM BAŞVURULAR */}
        <section>
          <h2 className="text-xl font-semibold text-pink-400 mb-4 flex items-center gap-2">
            <Briefcase size={24} /> Yaptığım Başvurular
          </h2>

          {myApplications.length === 0 ? (
            <p className="text-gray-500 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">Henüz hiçbir projeye başvurmadın.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myApplications.map((app) => (
                <Link key={app.id} href={`/projeler/${app.project?.id}`} className="block group">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-indigo-500/50 transition h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-medium group-hover:text-indigo-400 transition truncate pr-4">{app.project?.title}</h3>
                      {app.status === 'pending' && <Clock size={18} className="text-yellow-500 shrink-0" />}
                      {app.status === 'approved' && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                      {app.status === 'rejected' && <XCircle size={18} className="text-red-500 shrink-0" />}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50 mt-2">
                      <span className="text-xs text-gray-500">Durum:</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                        app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {app.status === 'pending' ? 'Bekliyor' : 
                         app.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}