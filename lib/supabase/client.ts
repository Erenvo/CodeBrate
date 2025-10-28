// lib/supabase/client.ts
// Bu dosya, Next.js'in Client Component'lerinde (tarayıcı tarafında)
// Supabase ile konuşmanızı sağlar.

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // .env.local dosyanızdan anahtarları otomatik olarak okur
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}