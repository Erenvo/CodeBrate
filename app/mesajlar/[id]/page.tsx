// app/mesajlar/[id]/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/AuthContext'
import Link from 'next/link'
import { Send, ArrowLeft, Loader2 } from 'lucide-react'

// Tip Tanımları
type MessageType = {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
  is_read: boolean
  project_id: string
}

type ProfileType = {
  username: string
  full_name: string
}

export default function SohbetEkrani() {
  const params = useParams()
  // ID'yi güvenli alıyoruz
  const otherUserId = (Array.isArray(params?.id) ? params?.id[0] : params?.id) as string

  const searchParams = useSearchParams()
  const projectIdParam = searchParams.get('projectId')

  const { user } = useAuth()
  const supabase = createClient()
  
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !otherUserId) return

      // 1. Karşı tarafı çek
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', otherUserId)
        .single()
      
      if (profile) setOtherUser(profile)

      // 2. Mesajları çek
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (msgs) {
        setMessages(msgs as MessageType[]) 
        
        if (msgs.length > 0) {
          setActiveProjectId(msgs[msgs.length - 1].project_id)
        } 
        else if (projectIdParam) {
          setActiveProjectId(projectIdParam)
        }
      }
      setLoading(false)
    }

    if (user) fetchData()

    // 3. Realtime Abonelik (DÜZELTİLDİ: Duplicate Kontrolü)
    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as MessageType
        
        // Sadece bu sohbetle ilgiliyse...
        if (
          (newMsg.sender_id === otherUserId && newMsg.receiver_id === user?.id) ||
          (newMsg.sender_id === user?.id && newMsg.receiver_id === otherUserId)
        ) {
          // EĞER MESAJ LİSTEDE YOKSA EKLE (Duplicate önleme)
          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [user, otherUserId, projectIdParam, supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !activeProjectId) {
      if (!activeProjectId) alert("Hata: Hangi proje için konuştuğunuz belirlenemedi. Lütfen proje sayfasından 'İletişime Geç' diyerek gelin.")
      return
    }

    setSending(true)
    const msgContent = newMessage.trim()
    setNewMessage('') 

    // 👇 DÜZELTME: Veritabanına yaz ve yazılan veriyi GERİ AL (.select)
    const { data, error } = await supabase
      .from('messages')
      .insert({
        project_id: activeProjectId,
        sender_id: user.id,
        receiver_id: otherUserId,
        content: msgContent
      })
      .select() // Gönderilen mesajın ID'sini ve tarihini geri getir
      .single()

    if (error) {
      alert('Gönderilemedi: ' + error.message)
      setNewMessage(msgContent)
    } else if (data) {
      // 👇 EKRANA HEMEN EKLE (Realtime'ı bekleme, anında görünsün)
      setMessages((prev) => [...prev, data as MessageType])
    }
    setSending(false)
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Sohbet yükleniyor...</div>

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-900 text-gray-100">
      
      {/* HEADER */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <Link href="/mesajlar" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={24} />
        </Link>
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
          {otherUser?.full_name ? otherUser.full_name.slice(0, 2).toUpperCase() : otherUser?.username?.slice(0, 2).toUpperCase() || '?'}
        </div>
        <div>
          <h2 className="font-semibold text-white">{otherUser?.full_name || otherUser?.username}</h2>
          <p className="text-xs text-indigo-400">@{otherUser?.username}</p>
        </div>
      </div>

      {/* MESAJLAR */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Sohbeti başlat 👋</p>
            <p className="text-xs mt-1">Bu mesajlar gizlidir ve sadece ikiniz arasında kalır.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                }`}>
                  <p>{msg.content}</p>
                  <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSendMessage} className="bg-gray-800 border-t border-gray-700 p-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Bir mesaj yaz..."
          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-full px-5 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
        <button 
          type="submit" 
          disabled={sending || !newMessage.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>

    </div>
  )
}