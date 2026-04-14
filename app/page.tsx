import Link from 'next/link'
import {
  CheckCircle,
  BarChart2,
  Shield,
  Clock,
  ArrowRight,
  Star,
  TrendingUp,
  FileCheck,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: BarChart2,
    title: 'Análise em Tempo Real',
    description:
      'Responda algumas perguntas e receba sua taxa de aprovação instantaneamente, com detalhes de cada fator.',
  },
  {
    icon: TrendingUp,
    title: 'Plano de Melhoria',
    description:
      'Veja exatamente o que falta para aumentar suas chances e receba um passo-a-passo personalizado.',
  },
  {
    icon: Shield,
    title: 'Seguro e Confidencial',
    description:
      'Seus dados ficam protegidos. Não realizamos consultas ao SPC/Serasa sem sua autorização.',
  },
  {
    icon: Clock,
    title: 'Resultado em 3 Minutos',
    description:
      'Nossa análise leva menos de 3 minutos. Sem burocracia, sem espera, sem complicação.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Preencha o formulário',
    desc: 'Informe dados pessoais, financeiros e detalhes do bem que deseja financiar.',
  },
  {
    num: '02',
    title: 'Receba seu score',
    desc: 'Calculamos sua taxa de aprovação com base em 5 fatores principais.',
  },
  {
    num: '03',
    title: 'Siga as orientações',
    desc: 'Veja o que precisa melhorar e acompanhe seu progresso até a aprovação.',
  },
]

const factors = [
  { label: 'Situação do CPF', weight: '30%' },
  { label: 'Score de Crédito', weight: '25%' },
  { label: 'Comprometimento de Renda', weight: '20%' },
  { label: 'Estabilidade de Emprego', weight: '15%' },
  { label: 'Entrada Disponível', weight: '10%' },
]

const testimonials = [
  {
    name: 'Mariana S.',
    city: 'São Paulo, SP',
    text: 'Em 3 minutos soube exatamente o que precisava fazer para ser aprovada. Segui o plano e consegui meu apartamento!',
    score: 87,
  },
  {
    name: 'Carlos R.',
    city: 'Belo Horizonte, MG',
    text: 'Tinha medo de ser reprovado. A análise mostrou que eu só precisava de mais 3 meses de vínculo. Planejei e deu certo.',
    score: 73,
  },
  {
    name: 'Fernanda L.',
    city: 'Curitiba, PR',
    text: 'Finalmente entendi o que influencia o financiamento. As orientações foram claras e muito úteis.',
    score: 91,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Financiare</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/simulacao"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Simular Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-32 pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            Análise gratuita e sem consulta ao SPC/Serasa
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Descubra suas chances de{' '}
            <span className="text-emerald-400">aprovação</span> no financiamento
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
            Nossa análise inteligente avalia os 5 principais fatores que determinam a
            aprovação do seu crédito. Em 3 minutos, você sabe exatamente onde está e o
            que precisa melhorar.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/simulacao"
              className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all"
            >
              Fazer Análise Gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
            >
              Acessar minha conta
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8">
            {[
              { value: '+2.400', label: 'Análises realizadas' },
              { value: '78%', label: 'Taxa de aprovação' },
              { value: '3 min', label: 'Tempo médio' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-emerald-400">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Como funciona</h2>
            <p className="mt-3 text-slate-500">Simples, rápido e sem burocracia</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="flex flex-col items-start">
                  <span className="mb-4 text-5xl font-extrabold text-emerald-100">{step.num}</span>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Por que usar a Financiare</h2>
            <p className="mt-3 text-slate-500">
              Sua análise de crédito mais transparente e completa do mercado
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <f.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factors breakdown */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Os 5 fatores que determinam a sua aprovação
              </h2>
              <p className="mb-8 text-slate-400">
                Nossa análise avalia cada um dos fatores que os bancos e financeiras
                utilizam para decidir sobre o seu crédito. Você entende onde está bem e
                onde precisa melhorar.
              </p>
              <Link
                href="/simulacao"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
              >
                Analisar agora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {factors.map((factor, i) => (
                <div
                  key={factor.label}
                  className="flex items-center justify-between rounded-xl bg-slate-800 px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900 text-sm font-bold text-emerald-400">
                      {i + 1}
                    </div>
                    <span className="font-medium text-slate-200">{factor.label}</span>
                  </div>
                  <span className="rounded-full bg-emerald-900 px-3 py-1 text-sm font-bold text-emerald-400">
                    {factor.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Quem já usou aprovou</h2>
            <p className="mt-3 text-slate-500">Veja o que nossos clientes falam</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-600">{t.score}%</div>
                    <div className="text-xs text-slate-400">aprovação</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <FileCheck className="mx-auto mb-6 h-14 w-14 text-emerald-200" />
          <h2 className="mb-4 text-3xl font-bold text-white">
            Pronto para descobrir suas chances?
          </h2>
          <p className="mb-8 text-emerald-100">
            Análise gratuita, sem consulta ao SPC/Serasa e sem compromisso. Resultado em
            menos de 3 minutos.
          </p>
          <Link
            href="/simulacao"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg hover:bg-emerald-50 transition-colors"
          >
            Fazer Análise Gratuita <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Financiare</span>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Financiare. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-800 transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">Termos</Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
