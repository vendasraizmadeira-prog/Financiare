'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export default function AuthErrorBanner() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error_code')
  const [dismissed, setDismissed] = useState(false)

  if (!errorCode || dismissed) return null

  const isExpired = errorCode === 'otp_expired'

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4">
      <div className="flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 shadow-lg">
        <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
        <div className="flex-1 text-sm text-yellow-800">
          {isExpired ? (
            <>
              <p className="font-semibold">Link de confirmação expirado.</p>
              <p className="mt-0.5">
                Clique abaixo para receber um novo e-mail de confirmação.
              </p>
              <Link
                href="/auth/confirmar?expired=1"
                className="mt-2 inline-block rounded-lg bg-yellow-700 px-4 py-2 text-xs font-semibold text-white hover:bg-yellow-800 transition-colors"
              >
                Reenviar confirmação
              </Link>
            </>
          ) : (
            <p className="font-semibold">Erro de autenticação. Tente novamente.</p>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-yellow-500 hover:text-yellow-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
