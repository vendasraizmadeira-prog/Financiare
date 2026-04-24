import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LeadDetail from './LeadDetail'

export const dynamic = 'force-dynamic'

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase
    .from('simulations')
    .select('id, created_at, stage, admin_notes, answers, result')
    .eq('id', id)
    .single()

  if (!lead) notFound()

  return <LeadDetail lead={lead} />
}
