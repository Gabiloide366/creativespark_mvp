import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string

console.log('Supabase URL:', supabaseUrl ? '✅ loaded' : '❌ missing')
console.log('Supabase Key:', supabaseAnonKey ? '✅ loaded' : '❌ missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
