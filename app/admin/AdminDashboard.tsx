'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Phone,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Users,
  Star,
  Flame,
} from 'lucide-react'
import type { SimulationRow, LeadStage } from '@/types'
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/types'
import { cn, scoreColor, scoreTextColor } from '@/lib/utils'

const STAGES: { value: LeadStage | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Novos' },
  { value: 'hot', label: 'Quentes 🔥' },
  { value: 'to_schedule', label: 'Agendar' },
  { value: 'in_contact', label: 'Em atendimento' },
  { value: 'closed', label: 'Fechados' },
  { value: 'not_qualified', label: 'Não qualificados' },
]

type Lead = Pick<SimulationRow, 'id' | 'created_at' | 'stage' | 'admin_notes' | 'answers' | 'result'>

interface Props {
  initialLeads: Lead[]
}

export default function AdminDashboard({ initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<LeadStage | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const name = lead.answers?.full_name?.toLowerCase() ?? ''
      const phone = lead.answers?.phone ?? ''
      const city = lead.answers?.city ?? ''
      const matchSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        phone.includes(search) ||
        city.toLowerCase().includes(search.toLowerCase())
      const matchStage = stageFilter === 'all' || lead.stage === stageFilter
      return matchSearch && matchStage
    })
  }, [leads, search, stageFilter])

  const stats = useMemo(() => {
    const total = leads.length
    const wantContact = leads.filter((l) => l.answers?.wants_contact === 'yes').length
    const avgScore =
      total > 0
        ? Math.round(leads.reduce((s, l) => s + (l.result?.approval_percentage ?? 0), 0) / total)
        : 0
    const highApproval = leads.filter((l) => (l.result?.approval_percentage ?? 0) >= 70).length
    return { total, wantContact, avgScore, highApproval }
  }, [leads])

  async function updateStage(id: string, stage: LeadStage) {
    setUpdatingId(id)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    setUpdatingId(null)
  }

  function whatsappUrl(phone: string, name: string) {
    const digits = phone.replace(/\D/g, '')
    const number = digits.startsWith('55') ? digits : `55${digits}`
    const msg = encodeURIComponent(
      `Olá ${name}! Aqui é da Financiare. Vi que você fez uma análise de financiamento conosco e gostaria de entender melhor seu perfil para te orientar da melhor forma. Tem um momento?`,
    )
    return `https://wa.me/${number}?text=${msg}`
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (d >= 1) return `${d}d atrás`
    if (h >= 1) return `${h}h atrás`
    return 'Agora'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Financiare</span>
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                Admin CRM
              </span>
            </div>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            Ver site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-slate-600" />}
            label="Total de leads"
            value={stats.total}
            bg="bg-slate-100"
          />
          <StatCard
            icon={<MessageCircle className="h-5 w-5 text-emerald-600" />}
            label="Querem contato"
            value={stats.wantContact}
            bg="bg-emerald-50"
            valueColor="text-emerald-700"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
            label="Score médio"
            value={`${stats.avgScore}%`}
            bg="bg-blue-50"
            valueColor="text-blue-700"
          />
          <StatCard
            icon={<Star className="h-5 w-5 text-orange-500" />}
            label="Alta aprovação (+70%)"
            value={stats.highApproval}
            bg="bg-orange-50"
            valueColor="text-orange-700"
          />
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="text-sm text-slate-500">
            {filtered.length} leads
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {STAGES.map((s) => {
            const count =
              s.value === 'all'
                ? leads.length
                : leads.filter((l) => l.stage === s.value).length
            return (
              <button
                key={s.value}
                onClick={() => setStageFilter(s.value)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
                  stageFilter === s.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                )}
              >
                {s.label}
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-xs',
                    stageFilter === s.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Leads */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-400">
            Nenhum lead encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => {
              const score = lead.result?.approval_percentage ?? 0
              const name = lead.answers?.full_name ?? 'Sem nome'
              const phone = lead.answers?.phone ?? ''
              const city = lead.answers?.city ?? ''
              const wantsContact = lead.answers?.wants_contact === 'yes'
              const hasFgts = lead.answers?.has_fgts === 'yes'
              const timeline = lead.answers?.financing_timeline
              const isHot = wantsContact && score >= 50

              return (
                <div
                  key={lead.id}
                  className={cn(
                    'rounded-2xl bg-white border p-5 transition-shadow hover:shadow-md',
                    isHot ? 'border-orange-200' : 'border-slate-100',
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Left: Name + Score */}
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white text-sm"
                        style={{ background: scoreColor(score) }}
                      >
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{name}</span>
                          {isHot && (
                            <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                              <Flame className="h-3 w-3" /> Quer contato
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {phone && <span>📱 {phone}</span>}
                          {city && <span>📍 {city}</span>}
                          {hasFgts && <span className="text-emerald-600 font-medium">✓ FGTS</span>}
                          {timeline && (
                            <span>
                              {timeline === 'asap' ? '⚡ Urgente' :
                               timeline === '3months' ? '📅 3 meses' :
                               timeline === '6months' ? '📅 6 meses' : '🔍 Pesquisando'}
                            </span>
                          )}
                          <span className="text-slate-400">{timeAgo(lead.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Score + Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Score badge */}
                      <div className="text-center">
                        <div
                          className={cn('text-2xl font-extrabold', scoreTextColor(score))}
                        >
                          {score}%
                        </div>
                        <div className="text-xs text-slate-400">aprovação</div>
                      </div>

                      {/* Stage select */}
                      <select
                        value={lead.stage}
                        disabled={updatingId === lead.id}
                        onChange={(e) => updateStage(lead.id, e.target.value as LeadStage)}
                        className={cn(
                          'rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer',
                          LEAD_STAGE_COLORS[lead.stage as LeadStage] ?? 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {Object.entries(LEAD_STAGE_LABELS).map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ))}
                      </select>

                      {/* Contact buttons */}
                      {phone && (
                        <>
                          <a
                            href={whatsappUrl(phone, name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <a
                            href={`tel:${phone.replace(/\D/g, '')}`}
                            title="Ligar"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </>
                      )}

                      {/* Detail link */}
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Detalhes <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bg,
  valueColor = 'text-slate-900',
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  bg: string
  valueColor?: string
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', bg)}>
        {icon}
      </div>
      <div className={cn('text-2xl font-extrabold', valueColor)}>{value}</div>
      <div className="mt-0.5 text-sm text-slate-500">{label}</div>
    </div>
  )
}
