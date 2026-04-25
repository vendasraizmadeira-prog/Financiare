import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorCode = searchParams.get('error_code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Supabase redirects here with error params when OTP expires
  if (errorCode === 'otp_expired' || searchParams.get('error') === 'access_denied') {
    return NextResponse.redirect(`${origin}/auth/confirmar?expired=1`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // After email confirmation, go to salvar to claim any pending simulation
      return NextResponse.redirect(`${origin}/resultado/salvar`)
    }
    // Code exchange failed (likely expired)
    return NextResponse.redirect(`${origin}/auth/confirmar?expired=1`)
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback`)
}
