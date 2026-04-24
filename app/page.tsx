import Link from 'next/link'
import { Suspense } from 'react'
import {
  BarChart2,
  Shield,
  Clock,
  ArrowRight,
  Star,
  TrendingUp,
  FileCheck,
} from 'lucide-react'
import AuthErrorBanner from './AuthErrorBanner'

const features = [
  {
    icon: BarChart2,
    title: 'Análise com critérios reais do banco',
    description:
      'Seu perfil é avaliado da mesma forma que o banco analisa na aprovação.',
  },
  {
    icon: TrendingUp,
    title: 'Clareza do que precisa ajustar',
    description:
      'Você entende exatamente o que pode estar impedindo sua aprovação e como evoluir.',
  },
  {
    icon: Shield,
    title: 'Seus dados protegidos e respeitados',
    description:
      'Seus dados são utilizados apenas para análise do seu perfil. Nenhuma consulta é feita sem sua autorização.',
  },
  {
    icon: Clock,
    title: 'Resultado rápido e direto ao ponto',
    description:
      'Em poucos minutos, você entende sua situação e o que precisa ajustar para avançar com segurança.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Responda algumas perguntas rápidas',
    desc: 'Você informa seus dados e entendemos como o banco enxerga seu perfil hoje.',
  },
  {
    num: '02',
    title: 'Entenda seu perfil',
    desc: 'Você descobre se já pode ser aprovado ou o que está te impedindo de avançar.',
  },
  {
    num: '03',
    title: 'Próximo passo com segurança',
    desc: 'Você recebe a orientação certa para evoluir seu perfil até a aprovação.',
  },
]

const factors = [
  { label: 'Situação do CPF (histórico financeiro)', weight: '30%' },
  { label: 'Comportamento financeiro', weight: '25%' },
  { label: 'Comprometimento da sua renda', weight: '20%' },
  { label: 'Estabilidade da sua renda', weight: '15%' },
  { label: 'Capacidade de investimento inicial', weight: '10%' },
]

const testimonials = [
  {
    name: 'Mariana S.',
    city: 'São Paulo/SP',
    text: 'Eu achava que não seria aprovada. Depois da análise, entendi exatamente o que precisava ajustar. Quando dei entrada, já estava preparada.',
  },
  {
    name: 'Juliana e Rafael',
    city: 'Catanduva/SP',
    text: 'A gente já tinha tentado antes e não deu certo. Depois da análise, entendemos onde estávamos errando. Organizamos tudo e seguimos com mais segurança.',
  },
  {
    name: 'Carlos M.',
    city: 'São José do Rio Preto/SP',
    text: 'Eu achava que por ser autônomo seria impossível. A análise me mostrou exatamente o que o banco precisava ver. Hoje sei como me organizar para dar entrada.',
  },
  {
    name: 'Fernanda L.',
    city: 'Novo Horizonte/SP',
    text: 'Eu tinha renda, mas não sabia se seria aprovada. Depois da análise, ficou claro o que precisava ajustar. Agora me sinto segura para dar o próximo passo.',
  },
  {
    name: 'Aline R.',
    city: 'Irapuã/SP',
    text: 'Eu achava que não era pra mim. A análise me mostrou que era possível, só precisava de organização. Isso me deu esperança e direção.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense>
        <AuthErrorBanner />
      </Suspense>

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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            Análise gratuita com visão real do banco (sem impacto no seu CPF)
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Descubra se você está pronto para ser{' '}
            <span className="text-emerald-400">aprovado</span> no financiamento
          </h1>

          <p className="mx-auto mb-4 max-w-2xl text-lg text-slate-300">
            A aprovação não depende só da renda, depende de como o banco enxerga seu perfil.
            Em até 3 minutos, você entende onde está e o que precisa ajustar para avançar da forma certa.
          </p>

          <p className="mx-auto mb-10 max-w-xl text-sm text-slate-400">
            Essa análise segue os mesmos critérios que utilizamos na Financiare para preparar nossos clientes para aprovação.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/simulacao"
              className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all"
            >
              Quero saber se posso ser aprovado
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
            >
              Já comecei minha análise
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8">
            {[
              { value: '+2.400', label: 'Pessoas já analisadas' },
              { value: '78%', label: 'Avançam para aprovação' },
              { value: '3 min', label: 'Tempo da análise' },
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
            <p className="mt-3 text-slate-500">
              Entenda seu perfil antes de dar entrada no financiamento
            </p>
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
            <h2 className="text-3xl font-bold text-slate-900">
              Por que fazer sua análise com a Financiare
            </h2>
            <p className="mt-3 text-slate-500">
              Você não precisa adivinhar se será aprovado. Precisa entender como o banco analisa seu perfil.
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
                O que realmente define a aprovação do seu financiamento
              </h2>
              <p className="mb-8 text-slate-400">
                A aprovação não depende de um único fator. O banco analisa seu perfil como um todo.
                Aqui você entende o que pode aprovar… e o que pode reprovar seu financiamento.
              </p>
              <Link
                href="/simulacao"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
              >
                Iniciar minha análise <ArrowRight className="h-4 w-4" />
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
            <h2 className="text-3xl font-bold text-slate-900">
              Quem entende o processo, aprova com mais segurança
            </h2>
            <p className="mt-3 text-slate-500">
              Clientes que organizaram o perfil antes de dar entrada tiveram mais clareza e segurança no processo.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Perfil ajustado
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
          <div className="mt-10 text-center">
            <p className="text-sm font-semibold text-slate-400">+2.400 perfis analisados</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <FileCheck className="mx-auto mb-6 h-14 w-14 text-emerald-200" />
          <h2 className="mb-4 text-3xl font-bold text-white">
            Agora você já sabe o que pode estar te impedindo
          </h2>
          <p className="mb-8 text-emerald-100">
            Em poucos minutos, você descobre se pode ser aprovado hoje e o que precisa ajustar para avançar com segurança.
          </p>
          <Link
            href="/simulacao"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg hover:bg-emerald-50 transition-colors"
          >
            Iniciar minha análise <ArrowRight className="h-4 w-4" />
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
