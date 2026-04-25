'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SalvarPage() {
  const router = useRouter()

  useEffect(() => {
    async function savePending() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      const raw = sessionStorage.getItem('financiare_result')
      if (!raw) {
        router.push('/dashboard')
        return
      }

      let parsed: { answers: unknown; result: unknown }
      try {
        parsed = JSON.parse(raw)
      } catch {
        sessionStorage.removeItem('financiare_result')
        router.push('/dashboard')
        return
      }

      const { data, error } = await supabase
        .from('simulations')
        .insert({
          user_id: session.user.id,
          answers: parsed.answers,
          result: parsed.result,
        })
        .select('id')
        .single()

      sessionStorage.removeItem('financiare_result')

      if (error || !data) {
        console.error('[salvar] insert error:', error?.message)
        router.push('/dashboard')
        return
      }

      router.push(`/resultado?id=${data.id}`)
    }

    savePending()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="text-slate-500">Salvando sua análise...</p>
      </div>
    </div>
  )
}
