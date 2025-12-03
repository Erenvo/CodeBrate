// app/yetenekler/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TalentHeader } from '@/app/components/talents/TalentHeader'
import { TalentList } from '@/app/components/talents/TalentList'

export type ProfileType = {
  id: string
  username: string
  full_name: string | null // Burayı ekledik
  university: string
  department: string
  bio: string
  skills: string[] | null
}

export default function YetenekHavuzuPage() {
  const [profiles, setProfiles] = useState<ProfileType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true)
      
      // 👇 KRİTİK NOKTA BURASI: 'full_name' verisini istiyor muyuz?
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, university, department, bio, skills')
        .not('username', 'is', null) 
        .order('created_at', { ascending: false })

      if (!error) {
        setProfiles(data as any)
      }
      setLoading(false)
    }
    fetchProfiles()
  }, [supabase])

  const filteredProfiles = profiles.filter((p) =>
    (p.full_name && p.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.username && p.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <TalentHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TalentList profiles={filteredProfiles} loading={loading} />
      </div>
    </div>
  )
}