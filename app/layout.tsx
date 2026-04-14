import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Financiare – Análise de Aprovação de Financiamento',
  description:
    'Descubra sua taxa de aprovação de financiamento em minutos. Análise gratuita e personalizada com orientações para maximizar suas chances.',
  keywords: ['financiamento', 'crédito', 'aprovação', 'simulação', 'imóvel', 'veículo'],
  openGraph: {
    title: 'Financiare – Análise de Aprovação',
    description: 'Descubra suas chances de aprovação e o que fazer para melhorá-las.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
