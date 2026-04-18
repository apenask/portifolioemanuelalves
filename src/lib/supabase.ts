/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

console.log('SUPABASE URL BUILD:', import.meta.env.VITE_SUPABASE_URL)
console.log('SUPABASE KEY BUILD:', import.meta.env.VITE_SUPABASE_ANON_KEY)

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)