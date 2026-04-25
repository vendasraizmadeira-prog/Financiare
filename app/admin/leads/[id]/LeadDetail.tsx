'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageCircle,
  Phone,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Save,
  Loader2,
} from 'lucide-react'
import type { SimulationRow, LeadStage, FactorStatus } from '@/types'
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/types'
import { cn, scoreColor, scoreTextColor, statusBarColor, statusBg, statusColor } from '@/lib/utils'

type Lead = Pick<SimulationRow, 'id' | 'created_at' | 'stage' | 'admin_notes' | 'answers' | 'result'>

const DIFFICULTY_LABELS: Record<string, string> = {
  approval: 'Não sabe se consegue aprovação',
  entry: 'Não tem entrada',
  income: 'Renda limitada',
  process: 'Dúvidas sobre o processo',
  start: 'Não sabe por onde começar',
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: '⚡ O quanto antes',
  '3months': '📅 Próximos 3 meses',
  '6months': '📅 De 3 a 6 meses',
  organizing: '🔍 Ainda se organizando',
}

const GUIDANCE_LABELS: Record<string, string> = {
  yes: '✅ Sim, quer começar',
  understand: '🤔 Quer entender melhor',
  researching: '👀 Só pesquisando',
}

export default function LeadDetail({ lead }: { lead: Lead }) {
  const router = useRouter()
  const [stage, setStage] = useState<LeadStage>(lead.stage as LeadStage)
  const [notes, setNotes] = useState(lead.admin_notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const score = lead.result?.approval_percentage ?? 0
  const name = lead.answers?.full_name ?? 'Sem nome'
  const phone = lead.answers?.phone ?? ''

  function whatsappUrl() {
    const digits = phone.replace(/\D/g, '')
    const number = digits.startsWith('55') ? digits : `55${digits}`
    const msg = encodeURIComponent(
      `Olá ${name}! Aqui é da Financiare. Vi que você fez uma análise de financiamento conosco e gostaria de entender melhor seu perfil para te orientar da melhor forma. Tem um momento?`,
    )
    return `https://wa.me/${number}?text=${msg}`
  }

  async function saveChanges() {
    setSaving(true)
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, admin_notes: notes }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            ← Voltar ao CRM
          </button>
          <button
            onClick={saveChanges}
            disabled={saving}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition',
              saved ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-700',
              saving && 'opacity-70 cursor-not-allowed',
            )}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pt-8 space-y-6">
        {/* Score Hero */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ background: 'linear-gradient(135deg, #0F2830 0%, #1A4D58 100%)' }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold text-white"
              style={{ background: scoreColor(score), boxShadow: `0 0 24px ${scoreColor(score)}55` }}
            >
              {score}%
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              <p className="mt-1 text-slate-400 text-sm">
                {lead.answers?.city && `📍 ${lead.answers.city}  ·  `}
                Simulou em {new Date(lead.created_at).toLocaleDateString('pt-BR')}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {phone && (
                  <>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                    <a
                      href={`tel:${phone.replace(/\D/g, '')}`}
                      className="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 transition-colors"
                    >
                      <Phone className="h-4 w-4" /> {phone}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stage + Notes */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">Gestão do Lead</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Estágio no pipeline</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {Object.entries(LEAD_STAGE_LABELS).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
              <div className="mt-2 flex">
                <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', LEAD_STAGE_COLORS[stage])}>
                  {LEAD_STAGE_LABELS[stage]}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Notas internas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações sobre este lead..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Qualification Summary */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">Qualificação</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QualCard label="Quer contato" value={lead.answers?.wants_contact === 'yes' ? '✅ Sim' : '❌ Não'} />
            <QualCard
              label="Horizonte de decisão"
              value={TIMELINE_LABELS[lead.answers?.financing_timeline ?? ''] ?? '—'}
            />
            <QualCard
              label="Intenção"
              value={GUIDANCE_LABELS[lead.answers?.wants_guidance ?? ''] ?? '—'}
            />
            <QualCard
              label="Maior dificuldade"
              value={DIFFICULTY_LABELS[lead.answers?.main_difficulty ?? ''] ?? '—'}
            />
            <QualCard label="FGTS" value={lead.answers?.has_fgts === 'yes' ? '✅ Tem FGTS' : lead.answers?.has_fgts === 'no' ? 'Não' : 'Não sabe'} />
            <QualCard
              label="Financiar com"
              value={
                lead.answers?.financing_with === 'alone' ? 'Sozinho' :
                lead.answers?.financing_with === 'spouse' ? 'Cônjuge' :
                lead.answers?.financing_with === 'other' ? 'Outra pessoa' : '—'
              }
            />
          </div>
        </div>

        {/* Simulation Data */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">Dados da Simulação</h2>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <DataRow label="CPF" value={lead.answers?.cpf ?? '—'} />
            <DataRow label="Nascimento" value={lead.answers?.birth_date ?? '—'} />
            <DataRow label="Estado civil" value={lead.answers?.marital_status ?? '—'} />
            <DataRow label="Dependentes" value={String(lead.answers?.dependents ?? 0)} />
            <DataRow
              label="Renda mensal"
              value={
                lead.answers?.monthly_income
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.answers.monthly_income)
                  : '—'
              }
            />
            <DataRow
              label="Valor do imóvel"
              value={
                lead.answers?.asset_value
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.answers.asset_value)
                  : '—'
              }
            />
            <DataRow
              label="Entrada disponível"
              value={
                lead.answers?.down_payment !== undefined
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.answers.down_payment)
                  : '—'
              }
            />
            <DataRow label="Restrições CPF" value={lead.answers?.has_restrictions ? 'Sim' : 'Não'} />
            <DataRow label="Comprovante de renda" value={lead.answers?.has_proof_of_income ? 'Sim' : 'Ainda não'} />
            <DataRow
              label="Vínculo"
              value={
                lead.answers?.employment_type === 'clt' ? 'CLT' :
                lead.answers?.employment_type === 'public_servant' ? 'Servidor público' :
                lead.answers?.employment_type === 'retired' ? 'Aposentado' :
                lead.answers?.employment_type === 'business_owner' ? 'Empresário/MEI' :
                lead.answers?.employment_type === 'autonomous' ? 'Autônomo' : '—'
              }
            />
            <DataRow label="Tem terreno" value={lead.answers?.has_land ? 'Sim' : 'Não'} />
          </div>
        </div>

        {/* Score Factors */}
        {lead.result?.factors && (
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Análise por Fator</h2>
            <div className="space-y-3">
              {lead.result.factors.map((factor) => (
                <div
                  key={factor.id}
                  className={cn('rounded-xl border-2 p-4', statusBg(factor.status))}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={factor.status} />
                      <span className="text-sm font-semibold text-slate-800">{factor.name}</span>
                    </div>
                    <span className={cn('text-sm font-bold', statusColor(factor.status))}>
                      {factor.points}/{factor.max_points} pts
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn('h-full rounded-full', statusBarColor(factor.status))}
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function QualCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-50 bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  )
}

function StatusIcon({ status }: { status: FactorStatus }) {
  if (status === 'excellent' || status === 'good')
    return <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
  if (status === 'fair')
    return <AlertCircle className="h-4 w-4 shrink-0 text-yellow-500" />
  if (status === 'poor' || status === 'critical')
    return <XCircle className="h-4 w-4 shrink-0 text-red-500" />
  return <Info className="h-4 w-4 shrink-0 text-slate-400" />
}
