'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle, Loader2, Mail, Eye, EyeOff, TrendingUp, Shield, BarChart2 } from 'lucide-react'
import { NavLogo } from '@/components/LogoMark'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type Step = 'form' | 'email-sent'

export default function RegisterGate() {
  const router = useRouter()
  const [approvalPct, setApprovalPct] = useState<number | null>(null)
  const [step, setStep] = useState<Step>('form')

  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('financiare_result')
      if (raw) {
        const parsed = JSON.parse(raw)
        setApprovalPct(parsed?.result?.approval_percentage ?? null)
      } else {
        router.push('/simulacao')
      }
    } catch {
      router.push('/simulacao')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!fullName.trim()) {
      setError('Informe seu nome completo.')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/resultado/salvar`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Auto-confirmed (session returned immediately)
    if (data.session) {
      window.location.href = '/resultado/salvar'
      return
    }

    // Email confirmation needed
    setStep('email-sent')
    setLoading(false)
  }

  if (step === 'email-sent') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-slate-900">Confirme seu e-mail</h1>
          <p className="mb-6 text-slate-500">
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para acessar sua análise completa.
          </p>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
            Após confirmar, você será redirecionado automaticamente para o resultado.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <NavLogo iconSize={22} />
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">

          {/* Left: preview + benefits */}
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Análise concluída
            </div>
            <h1 className="mb-4 text-3xl font-extrabold text-slate-900 leading-tight">
              Sua análise está pronta!
            </h1>
            <p className="mb-6 text-slate-500">
              Crie sua conta gratuita para desbloquear seu resultado completo e plano de ação personalizado.
            </p>

            {/* Blurred score preview */}
            {approvalPct !== null && (
              <div
                className="relative mb-6 overflow-hidden rounded-2xl p-8 text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0F2830 0%, #1A4D58 100%)' }}
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Sua aprovação estimada
                  </p>
                  <div className="relative">
                    <span
                      className="text-6xl font-extrabold text-emerald-400"
                      style={{ filter: 'blur(12px)', userSelect: 'none' }}
                    >
                      {approvalPct}%
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <Lock className="h-8 w-8 text-white/80" />
                        <span className="text-xs font-semibold text-white/70">Bloqueado</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">Crie sua conta para ver</p>
                </div>
              </div>
            )}

            {/* Benefit bullets */}
            <div className="space-y-3">
              {[
                { icon: BarChart2, text: 'Score detalhado em 5 fatores com plano de ação específico' },
                { icon: TrendingUp, text: 'Acompanhe sua evolução e refaça sua análise quando quiser' },
                { icon: Shield, text: 'Seus dados são protegidos e nunca compartilhados sem sua permissão' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <Icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: registration form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-slate-900">Criar conta gratuita</h2>
            <p className="mb-6 text-sm text-slate-500">Leva menos de 1 minuto. Sem cartão de crédito.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-md',
                  loading
                    ? 'bg-emerald-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
                )}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Criando conta...' : 'Ver meu resultado completo'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              Ja tem conta?{' '}
              <Link href="/auth/login" className="font-semibold text-emerald-600 hover:underline">
                Fazer login
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Ao criar sua conta, voce concorda com nossos termos de uso e politica de privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
