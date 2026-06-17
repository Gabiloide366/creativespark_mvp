"use client"

import { useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isRegistering) {
      const { error } = await supabase.auth.signUp(
        { email, password },
        { emailRedirectTo: `${window.location.origin}` }
      )
      setLoading(false)
      if (error) {
        setMessage(error.message)
        return
      }
      setMessage('Verifique seu e-mail para confirmar o cadastro. O link será enviado para a mesma URL atual.')
      setIsRegistering(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    onLoginSuccess()
  }

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360, width: '100%'}}>
      {message && (
        <div style={{background: '#f8fafc', color: '#1f2937', border: '1px solid #d1d5db', borderRadius: 10, padding: 12}}>
          {message}
        </div>
      )}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{padding: 8, borderRadius: 6, border: '1px solid #ddd', background: '#f9fafb', color: '#111827'}}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{padding: 8, borderRadius: 6, border: '1px solid #ddd', background: '#f9fafb', color: '#111827'}}
      />

      <button type="submit" disabled={loading} style={{padding: 10, borderRadius: 6, background: '#111827', color: '#fff', border: 'none'}}>
        {isRegistering ? (loading ? 'Cadastrando...' : 'Cadastrar') : (loading ? 'Entrando...' : 'Entrar')}
      </button>

      <button type="button" onClick={() => setIsRegistering(!isRegistering)} style={{marginTop: 8, background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer'}}>
        {isRegistering ? 'Já tenho conta — Entrar' : 'Criar conta'}
      </button>
    </form>
  )
}
