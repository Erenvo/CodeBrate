// app/mesajlar/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext'
import Link from 'next/link'
import { MessageSquare, User, ArrowRight } from 'lucide-react'

// Sohbet Edilen Kişi Tipi
type ConversationType = {
  other_user_id: string
  other_user_name: string
  last_message: string
  last_message_date: string
}

export default function MesajlarSayfasi() {
  const { user, loading } = useAuth()
  const supabase = createClient()
  const [conversations, setConversations] = useState<ConversationType[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return

      // Hem GÖNDEREN hem ALICI olduğum mesajları çek
      // Bu sorgu biraz karmaşık çünkü "Sohbet Listesi" oluşturmaya çalışıyoruz
      // MVP için basit tutuyoruz: Tüm mesajları çekip JS ile gruplayacağız.
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, sender_id, receiver_id,
          sender:sender_id (id, full_name, username),
          receiver:receiver_id (id, full_name, username)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Mesaj hatası:', error)
      } else if (data) {
        // Mesajları "Konuşulan Kişiye" göre grupla
        const convoMap = new Map<string, ConversationType>()

        data.forEach((msg: any) => {
          // Karşı taraf kim?
          const isMeSender = msg.sender_id === user.id
          const otherUser = isMeSender ? msg.receiver : msg.sender
          const otherId = otherUser.id

          // Eğer bu kişiyle daha önce eklenmiş bir sohbet yoksa ekle
          // (Zaten tarihe göre sıralı çektiğimiz için ilk gelen en yenisidir)
          if (!convoMap.has(otherId)) {
            convoMap.set(otherId, {
              other_user_id: otherId,
              other_user_name: otherUser.full_name || otherUser.username,
              last_message: msg.content,
              last_message_date: msg.created_at
            })
          }
        })

        setConversations(Array.from(convoMap.values()))
      }
      setPageLoading(false)
    }

    if (!loading) fetchConversations()
  }, [user, loading, supabase])

  if (loading || pageLoading) return <div className="p-20 text-center text-gray-500">Sohbetler yükleniyor...</div>
  if (!user) return <div className="p-20 text-center text-gray-500">Giriş yapmalısın.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <MessageSquare className="text-indigo-500" /> Mesajlarım
        </h1>

        {conversations.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl bg-gray-800/50">
            <p className="text-gray-400">Henüz kimseyle mesajlaşmadın.</p>
            <p className="text-sm text-gray-500 mt-2">Projelerdeki "İletişime Geç" butonlarını kullanabilirsin.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {conversations.map((convo) => (
              <Link 
                key={convo.other_user_id} 
                href={`/mesajlar/${convo.other_user_id}`}
                className="bg-gray-800 border border-gray-700 p-5 rounded-xl flex items-center justify-between hover:border-indigo-500/50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-700 p-3 rounded-full text-indigo-300">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                      {convo.other_user_name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {convo.last_message}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block mb-2">
                    {new Date(convo.last_message_date).toLocaleDateString('tr-TR')}
                  </span>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}