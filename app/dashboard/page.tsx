import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LogOut,
  BarChart2,
  ChevronRight,
} from 'lucide-react'
import { NavLogo } from '@/components/LogoMark'
import { createClient } from '@/lib/supabase/server'
import type { ScoringResult } from '@/types'
import { scoreColor, scoreLabel } from '@/lib/utils'

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
          <NavLogo iconSize={22} />
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Olá, {firstName}! 👋
          </h1>
          <p className="mt-1 text-slate-500">
            Veja sua análise detalhada e seu plano de ação personalizado.
          </p>
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
            <h3 className="mb-1 font-semibold text-slate-700">Nenhuma análise encontrada</h3>
            <p className="text-sm text-slate-400">
              Entre em contato com nossa equipe para iniciar sua análise.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
