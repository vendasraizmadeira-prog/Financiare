'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  score: number
  name?: string
  className?: string
  label?: string
}

export default function ContactCTA({
  score,
  name,
  className,
  label = 'Quero orientação para ser aprovado',
}: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      setChecked(true)
    })
  }, [])

  // WhatsApp business number from env (configure NEXT_PUBLIC_BUSINESS_WHATSAPP in Vercel)
  const businessWa = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP?.replace(/\D/g, '')

  function buildWhatsAppUrl() {
    const num = businessWa?.startsWith('55') ? businessWa : `55${businessWa}`
    const msg = encodeURIComponent(
      `Olá! Acabei de fazer minha análise de financiamento na Financiare e ${
        score >= 60
          ? `meu resultado foi ${score}% de aprovação`
          : `preciso entender como melhorar meu perfil (${score}%)`
      }. Gostaria de orientação para avançar. ${name ? `Meu nome é ${name}.` : ''}`,
    )
    return `https://wa.me/${num}?text=${msg}`
  }

  if (!checked) return null

  // Logged-in user + business WhatsApp configured → open WhatsApp
  if (isLoggedIn && businessWa) {
    return (
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    )
  }

  // Logged-in user + no WhatsApp configured → go to dashboard
  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className={className}>
        {label} <ArrowRight className="h-4 w-4" />
      </Link>
    )
  }

  // Not logged in → create account
  return (
    <Link href="/auth/register" className={className}>
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
