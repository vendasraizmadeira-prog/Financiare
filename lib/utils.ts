import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FactorStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function statusColor(status: FactorStatus): string {
  const map: Record<FactorStatus, string> = {
    excellent: 'text-emerald-600',
    good: 'text-green-500',
    fair: 'text-yellow-500',
    poor: 'text-orange-500',
    critical: 'text-red-600',
    unknown: 'text-slate-400',
  }
  return map[status]
}

export function statusBg(status: FactorStatus): string {
  const map: Record<FactorStatus, string> = {
    excellent: 'bg-emerald-50 border-emerald-200',
    good: 'bg-green-50 border-green-200',
    fair: 'bg-yellow-50 border-yellow-200',
    poor: 'bg-orange-50 border-orange-200',
    critical: 'bg-red-50 border-red-200',
    unknown: 'bg-slate-50 border-slate-200',
  }
  return map[status]
}

export function statusBarColor(status: FactorStatus): string {
  const map: Record<FactorStatus, string> = {
    excellent: 'bg-emerald-500',
    good: 'bg-green-500',
    fair: 'bg-yellow-500',
    poor: 'bg-orange-500',
    critical: 'bg-red-500',
    unknown: 'bg-slate-400',
  }
  return map[status]
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#10b981' // emerald-500
  if (score >= 60) return '#22c55e' // green-500
  if (score >= 40) return '#eab308' // yellow-500
  if (score >= 20) return '#f97316' // orange-500
  return '#ef4444'                  // red-500
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Alta'
  if (score >= 60) return 'Boa'
  if (score >= 40) return 'Moderada'
  return 'Baixa'
}

export function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-green-500'
  if (score >= 40) return 'text-yellow-500'
  if (score >= 20) return 'text-orange-500'
  return 'text-red-600'
}
