import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Please check your environment configuration.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  address: string
  created_at: string
}

export interface Loan {
  id: string
  client_id: string
  amount: number
  interest_rate: number
  installments: number
  total_amount: number
  paid_amount: number
  status: 'active' | 'paid' | 'overdue'
  created_at: string
  due_date: string
  client?: Client
}

export interface User {
  id: string
  email: string
  created_at: string
}