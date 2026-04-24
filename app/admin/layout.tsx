import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Lock } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  if (user.app_metadata?.is_admin === true) return <>{children}</>

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600">
          <TrendingUp className="h-7 w-7 text-white" />
        </div>
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            <Lock className="h-4 w-4" />
            Sem permissão de admin
          </div>
        </div>
        <p className="mb-1 text-sm text-slate-500">Logado como</p>
        <p className="mb-6 font-semibold text-slate-800">{user.email}</p>
        <p className="mb-6 text-sm text-slate-500">
          Para liberar o acesso, vá ao Supabase Dashboard → Authentication → Users →
          clique no teu utilizador → Edit → campo <strong>App Metadata</strong> → insere{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{'{"is_admin":true}'}</code>{' '}
          e salva. Depois volta aqui e recarrega.
        </p>
        <div className="flex gap-3">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Abrir Supabase
          </a>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl border border-slate-200 py-3 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Ir para o dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
