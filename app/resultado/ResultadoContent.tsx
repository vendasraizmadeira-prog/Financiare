'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Share2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookmarkPlus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ScoringResult, ScoringFactor, FactorStatus } from '@/types'
import { cn, formatCurrency, scoreColor, scoreLabel, statusBarColor, statusBg, statusColor } from '@/lib/utils'
import ScoreGauge from '@/components/ScoreGauge'
import ContactCTA from './ContactCTA'

export default function ResultadoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const local = searchParams.get('local')

  const [result, setResult] = useState<ScoringResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (local) {
        const raw = sessionStorage.getItem('financiare_result')
        if (raw) {
          const parsed = JSON.parse(raw)
          setResult(parsed.result)
        }
        setLoading(false)
        return
      }

      if (!id) {
        router.push('/simulacao')
        return
      }

      const supabase = createClient()
      const { data } = await supabase
        .from('simulations')
        .select('result')
        .eq('id', id)
        .single()

      if (data?.result) {
        setResult(data.result as ScoringResult)
      }
      setLoading(false)
    }

    load()
  }, [id, local, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-slate-500">Calculando sua análise...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-slate-900">Análise não encontrada</h2>
          <p className="mb-6 text-slate-500">Faça uma nova simulação para ver seu resultado.</p>
          <Link
            href="/simulacao"
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Nova Simulação
          </Link>
        </div>
      </div>
    )
  }

  const score = result.approval_percentage
  const color = scoreColor(score)
  const label = scoreLabel(score)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Financiare</span>
          </div>
          <Link
            href="/simulacao"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Nova análise
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 pt-8">
        {/* Score Hero Card */}
        <div
          className="relative mb-6 overflow-hidden rounded-2xl p-8 text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)` }}
        >
          {/* Decoration */}
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10"
            style={{ background: color }}
          />

          <div className="relative flex flex-col items-center md:flex-row md:items-center md:gap-12">
            {/* Gauge */}
            <div className="shrink-0">
              <ScoreGauge score={score} size={200} />
            </div>

            {/* Text */}
            <div className="mt-6 text-center md:mt-0 md:text-left">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                Resultado da sua análise
              </p>
              <h1 className="mt-2 text-5xl font-extrabold" style={{ color }}>
                {score}%
              </h1>
              <div
                className="mt-2 inline-block rounded-full px-4 py-1 text-sm font-bold"
                style={{ background: `${color}22`, color }}
              >
                {score >= 80
                  ? 'Perfil bem posicionado'
                  : score >= 60
                  ? 'Perfil com potencial de aprovação'
                  : score >= 40
                  ? 'Perfil em desenvolvimento'
                  : 'Perfil precisa de atenção'}
              </div>
              <p className="mt-4 text-sm text-slate-300 max-w-sm">
                {score >= 80
                  ? 'Seu perfil está bem posicionado para aprovação. Veja os detalhes abaixo e siga as orientações para avançar com segurança.'
                  : score >= 60
                  ? 'Você tem potencial de aprovação, mas alguns pontos ainda precisam de atenção para aumentar sua segurança no processo.'
                  : score >= 40
                  ? 'Há pontos que precisam de ajuste antes de avançar. Siga o plano abaixo para melhorar seu perfil.'
                  : 'Seu perfil precisa de atenção em alguns critérios. Siga as orientações para se preparar para a aprovação.'}
              </p>

              {/* Diagnostic block */}
              <div className="mt-4 space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Seu perfil tem potencial para avançar</span>
                </div>
                {score < 80 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Alguns critérios ainda podem limitar sua aprovação</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ArrowRight className="h-4 w-4 shrink-0" />
                  <span>Com a estratégia certa, suas chances ficam mais seguras</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save-to-account banner (anonymous mode) */}
        {local && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Sua análise não está salva</p>
              <p className="text-xs text-emerald-700 mt-0.5">Crie uma conta ou faça login para guardar este resultado e acompanhar sua evolução.</p>
            </div>
            <Link
              href="/auth/login"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <BookmarkPlus className="h-4 w-4" /> Salvar
            </Link>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <ContactCTA
            score={score}
            name={result.factors?.[0] ? undefined : undefined}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100"
          />
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Minha análise Financiare', url: window.location.href })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('Link copiado!')
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="h-4 w-4" /> Compartilhar
          </button>
        </div>

        {/* Attention points */}
        {result.factors.some((f) => f.status === 'poor' || f.status === 'critical' || f.status === 'fair') && (
          <div className="mb-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
            <h3 className="mb-3 text-sm font-bold text-yellow-800">Pontos que merecem atenção</h3>
            <div className="space-y-1.5">
              {result.factors
                .filter((f) => f.status === 'poor' || f.status === 'critical' || f.status === 'fair')
                .slice(0, 3)
                .map((f) => (
                  <div key={f.id} className="flex items-center gap-2 text-sm text-yellow-700">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{f.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Factors Grid */}
        <h2 className="mb-4 text-xl font-bold text-slate-900">Análise Detalhada por Fator</h2>
        <div className="mb-8 space-y-3">
          {result.factors.map((factor) => (
            <FactorCard
              key={factor.id}
              factor={factor}
              expanded={expandedFactor === factor.id}
              onToggle={() =>
                setExpandedFactor(expandedFactor === factor.id ? null : factor.id)
              }
            />
          ))}
        </div>

        {/* Action Plan */}
        {result.general_recommendations.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 mb-8">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              O que você precisa ajustar para ser aprovado
            </h2>
            <div className="space-y-4">
              {result.general_recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      rec.impact === 'high'
                        ? 'bg-red-100 text-red-600'
                        : rec.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800">{rec.title}</p>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                          rec.impact === 'high'
                            ? 'bg-red-100 text-red-600'
                            : rec.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {rec.impact === 'high' ? 'Alto impacto' : rec.impact === 'medium' ? 'Médio impacto' : 'Baixo impacto'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="rounded-2xl bg-emerald-600 p-6 text-center text-white">
          <h3 className="mb-2 text-lg font-bold">
            Agora você tem dois caminhos
          </h3>
          <p className="mb-6 text-sm text-emerald-100">
            Você pode tentar sozinho… ou seguir com orientação para aumentar suas chances com mais segurança.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ContactCTA
              score={score}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            />
            <Link
              href="/simulacao"
              className="flex items-center gap-2 rounded-xl border border-emerald-400 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Refazer análise
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Factor Card ─────────────────────────────────────────────
function FactorCard({
  factor,
  expanded,
  onToggle,
}: {
  factor: ScoringFactor
  expanded: boolean
  onToggle: () => void
}) {
  const hasRecs = factor.recommendations.length > 0

  return (
    <div className={cn('rounded-xl border-2 bg-white overflow-hidden transition-all', statusBg(factor.status))}>
      <button
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon status={factor.status} />
              <span className="font-semibold text-slate-800 truncate">{factor.name}</span>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-1000', statusBarColor(factor.status))}
                  style={{ width: `${factor.percentage}%` }}
                />
              </div>
              <span className={cn('text-sm font-bold shrink-0', statusColor(factor.status))}>
                {factor.points}/{factor.max_points} pts
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 truncate">{factor.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                factor.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                factor.status === 'good' ? 'bg-green-100 text-green-700' :
                factor.status === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                factor.status === 'poor' ? 'bg-orange-100 text-orange-700' :
                factor.status === 'critical' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-600',
              )}
            >
              {factor.percentage}%
            </div>
            {hasRecs && (
              expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </div>
      </button>

      {expanded && hasRecs && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            O que você pode fazer
          </p>
          {factor.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3">
              <div
                className={cn(
                  'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                  rec.impact === 'high' ? 'bg-red-500' : rec.impact === 'medium' ? 'bg-yellow-500' : 'bg-slate-400',
                )}
              />
              <div>
                <p className="text-sm font-medium text-slate-700">{rec.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: FactorStatus }) {
  if (status === 'excellent' || status === 'good') {
    return <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
  }
  if (status === 'fair') {
    return <AlertCircle className="h-4 w-4 shrink-0 text-yellow-500" />
  }
  if (status === 'poor' || status === 'critical') {
    return <XCircle className="h-4 w-4 shrink-0 text-red-500" />
  }
  return <Info className="h-4 w-4 shrink-0 text-slate-400" />
}
