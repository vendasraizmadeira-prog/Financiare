import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Lock, Terminal } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profile?.is_admin) return <>{children}</>

  // Not admin — show setup instructions
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Acesso Admin</h1>
            <p className="text-sm text-slate-500">Financiare CRM</p>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <Lock className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Sua conta ainda não tem permissão de admin.</p>
            <p className="mt-1 text-yellow-700">
              Logado como: <strong>{user.email}</strong>
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm font-semibold text-slate-700">
          Para liberar o acesso, execute no Supabase → SQL Editor:
        </p>

        <div className="mb-6 flex items-start gap-2 rounded-xl bg-slate-900 p-4">
          <Terminal className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
          <pre className="text-xs text-emerald-400 whitespace-pre-wrap break-all">
{`INSERT INTO profiles (id, email, is_admin)
VALUES ('${user.id}', '${user.email}', true)
ON CONFLICT (id) DO UPDATE SET is_admin = true;`}
          </pre>
        </div>

        <p className="mb-6 text-xs text-slate-400">
          Depois de executar, recarregue esta página.
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
            href="/"
            className="flex-1 rounded-xl border border-slate-200 py-3 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}
