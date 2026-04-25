import { Suspense } from 'react'
import RegisterGate from './RegisterGate'

export default function GatePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-slate-500">Preparando sua análise...</p>
        </div>
      </div>
    }>
      <RegisterGate />
    </Suspense>
  )
}
