'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { TrendingUp, Mail, CheckCircle, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function ConfirmarContent() {
  const searchParams = useSearchParams()
  const expired = searchParams.get('expired') === '1'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('Não foi possível reenviar. Verifique o e-mail e tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">E-mail reenviado!</h2>
          <p className="mb-2 text-slate-500">
            Enviamos um novo link de confirmação para <strong>{email}</strong>.
          </p>
          <p className="mb-6 text-sm text-slate-400">
            Verifique também a <strong>pasta de spam</strong> — às vezes o e-mail pode cair lá.
            Se encontrar na pasta de spam, marque como "não é spam" para receber próximos e-mails normalmente.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Ir para o login
          </Link>
          <button
            onClick={() => setSent(false)}
            className="mt-3 block w-full text-sm text-slate-500 hover:text-slate-700"
          >
            Reenviar para outro e-mail
          </button>
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
            <h1 className="text-2xl font-bold text-slate-900">Confirmar e-mail</h1>
          </div>

          {/* Expired notice */}
          {expired && (
            <div className="mb-5 flex gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">Seu link de confirmação expirou.</p>
                <p className="mt-0.5">
                  Links de e-mail têm validade curta. Informe seu e-mail abaixo para receber um novo link.
                </p>
              </div>
            </div>
          )}

          <p className="mb-6 text-center text-sm text-slate-500">
            Informe o e-mail que você usou no cadastro para recebermos um novo link de confirmação.
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleResend} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mail do cadastro
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full rounded-lg border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
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
              {loading ? 'Reenviando...' : 'Reenviar link de confirmação'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            Já confirmou?{' '}
            <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Fazer login
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
