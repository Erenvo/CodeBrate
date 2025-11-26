// app/yetenekler/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// 👇 DİKKAT: Artık süslü parantez { } içinde çağırıyoruz. Bu kesin çözüm.
import { TalentHeader } from '@/app/components/talents/TalentHeader'
import { TalentList, ProfileType } from '@/app/components/talents/TalentList'

export default function YetenekHavuzuPage() {
  const [profiles, setProfiles] = useState<ProfileType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, university, department, bio, skills')
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
    p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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