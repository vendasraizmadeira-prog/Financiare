import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Plus,
  LogOut,
  Clock,
  BarChart2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { ScoringResult } from '@/types'
import { scoreColor, scoreLabel, cn } from '@/lib/utils'

function ScoreBadge({ score }: { score: number }) {
  const color = scoreColor(score)
  const label = scoreLabel(score)
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-bold"
      style={{ background: `${color}18`, color }}
    >
      {label} · {score}%
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: simulations } = await supabase
    .from('simulations')
    .select('id, created_at, result, answers')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const profile = user.user_metadata as { full_name?: string }
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuário'

  const latest = simulations?.[0]
  const latestResult = latest?.result as ScoringResult | undefined

  async function handleSignOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Financiare</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">{user.email}</span>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Olá, {firstName}! 👋
            </h1>
            <p className="mt-1 text-slate-500">
              Acompanhe suas análises e melhore sua taxa de aprovação.
            </p>
          </div>
          <Link
            href="/simulacao"
            className="hidden items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors sm:flex"
          >
            <Plus className="h-4 w-4" /> Nova análise
          </Link>
        </div>

        {/* Latest score card */}
        {latestResult ? (
          <div
            className="mb-6 rounded-2xl p-6 text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Última análise</p>
                <div
                  className="mt-1 text-6xl font-extrabold"
                  style={{ color: scoreColor(latestResult.approval_percentage) }}
                >
                  {latestResult.approval_percentage}%
                </div>
                <div
                  className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold"
                  style={{
                    background: `${scoreColor(latestResult.approval_percentage)}22`,
                    color: scoreColor(latestResult.approval_percentage),
                  }}
                >
                  Aprovação {latestResult.label}
                </div>
              </div>
              <div className="text-right">
                <BarChart2 className="ml-auto mb-4 h-10 w-10 text-slate-700" />
                <Link
                  href={`/resultado?id=${latest?.id}`}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Ver detalhes <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Mini factor bars */}
            <div className="mt-6 grid grid-cols-5 gap-2">
              {latestResult.factors.map((f) => (
                <div key={f.id} className="text-center">
                  <div className="mx-auto mb-1 h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${f.percentage}%`,
                        background: scoreColor(f.percentage),
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{f.name.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <BarChart2 className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h3 className="mb-1 font-semibold text-slate-700">Nenhuma análise ainda</h3>
            <p className="mb-5 text-sm text-slate-400">
              Faça sua primeira análise de aprovação e descubra suas chances.
            </p>
            <Link
              href="/simulacao"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Começar análise <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* History */}
        {simulations && simulations.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Histórico de Análises</h2>
            <div className="space-y-3">
              {simulations.map((sim) => {
                const r = sim.result as ScoringResult
                const date = new Date(sim.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
                const time = new Date(sim.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                const answers = sim.answers as { financing_type?: string; asset_value?: number }

                return (
                  <Link
                    key={sim.id}
                    href={`/resultado?id=${sim.id}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold"
                        style={{
                          background: `${scoreColor(r.approval_percentage)}18`,
                          color: scoreColor(r.approval_percentage),
                        }}
                      >
                        {r.approval_percentage}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {answers?.financing_type === 'property'
                            ? 'Financiamento Imobiliário'
                            : answers?.financing_type === 'vehicle'
                            ? 'Financiamento de Veículo'
                            : 'Crédito Pessoal'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {date} às {time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScoreBadge score={r.approval_percentage} />
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/simulacao"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nova análise
          </Link>
        </div>
      </div>
    </div>
  )
}
