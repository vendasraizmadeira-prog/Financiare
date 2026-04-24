'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const benefits = [
  'Salve e acompanhe suas análises',
  'Receba alertas de melhoria de score',
  'Histórico completo de simulações',
]

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(
        error.message.includes('already')
          ? 'Este e-mail já está cadastrado. Tente fazer login.'
          : 'Erro ao criar conta. Tente novamente.',
      )
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Conta criada!</h2>
          <p className="mb-6 text-slate-500">
            Verifique seu e-mail para confirmar o cadastro. Depois, você já pode fazer sua análise de financiamento.
          </p>
          <Link
            href="/simulacao"
            className="inline-block w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Fazer Análise Agora
          </Link>
          <Link href="/auth/login" className="mt-3 block text-sm text-slate-500 hover:text-slate-700">
            Fazer login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Criar conta grátis</h1>
            <p className="mt-1 text-sm text-slate-500">
              Comece a análise de aprovação agora
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 rounded-xl bg-emerald-50 p-4">
            <div className="space-y-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition',
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700',
              )}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-400">
            Ao criar sua conta você concorda com nossos{' '}
            <Link href="#" className="text-emerald-600 hover:underline">Termos de Uso</Link>{' '}
            e{' '}
            <Link href="#" className="text-emerald-600 hover:underline">Política de Privacidade</Link>.
          </p>

          <div className="mt-5 text-center text-sm text-slate-500">
            Já tem conta?{' '}
            <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Fazer login
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
