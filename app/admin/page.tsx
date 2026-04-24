import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('simulations')
    .select('id, created_at, stage, admin_notes, answers, result')
    .order('created_at', { ascending: false })

  return <AdminDashboard initialLeads={leads ?? []} />
}
