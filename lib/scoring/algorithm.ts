import type {
  SimulationAnswers,
  ScoringResult,
  ScoringFactor,
  FactorStatus,
  Recommendation,
} from '@/types'

// ============================================================
// Helper – calculate monthly PRICE payment
// ============================================================
function calcMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0
  const i = annualRate / 12
  if (i === 0) return principal / months
  return (principal * i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1)
}

// ============================================================
// Helper – age from ISO date string
// ============================================================
function calcAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function statusLabel(status: FactorStatus): string {
  const map: Record<FactorStatus, string> = {
    excellent: 'Excelente',
    good: 'Bom',
    fair: 'Regular',
    poor: 'Ruim',
    critical: 'Crítico',
    unknown: 'Indefinido',
  }
  return map[status]
}

// ============================================================
// FACTOR 1 – Restrições no CPF (max 30 pts)
// ============================================================
function scoreRestrictions(answers: SimulationAnswers): ScoringFactor {
  const { has_restrictions, restriction_level } = answers
  let points = 0
  let status: FactorStatus = 'excellent'
  const recommendations: Recommendation[] = []

  if (!has_restrictions) {
    points = 30
    status = 'excellent'
  } else if (restriction_level === 'light') {
    points = 8
    status = 'poor'
    recommendations.push({
      title: 'Quite as pendências no seu CPF',
      description:
        'Negocie e pague as dívidas em aberto. Após a quitação, o nome sai dos órgãos de proteção em até 5 dias úteis. Isso pode aumentar até +22 pontos na sua aprovação.',
      impact: 'high',
      icon: 'AlertCircle',
    })
    recommendations.push({
      title: 'Solicite uma certidão negativa após a quitação',
      description:
        'Com o CPF limpo, bancos e financeiras avaliam seu pedido de forma bem mais favorável, desbloqueando acesso a taxas menores.',
      impact: 'medium',
      icon: 'FileCheck',
    })
  } else {
    points = 0
    status = 'critical'
    recommendations.push({
      title: 'Regularize todas as restrições no CPF imediatamente',
      description:
        'Com restrições graves, a maioria das financeiras reprova automaticamente. Consulte o Serasa e SPC, negocie parcelamentos ou descontos e priorize a limpeza do nome.',
      impact: 'high',
      icon: 'XCircle',
    })
    recommendations.push({
      title: 'Considere a Negociação Digital (Serasa Limpa Nome)',
      description:
        'Plataformas como Serasa Limpa Nome e Acordo Certo oferecem descontos de até 99% em dívidas antigas. Aproveite para regularizar sua situação.',
      impact: 'high',
      icon: 'Handshake',
    })
  }

  return {
    id: 'restrictions',
    name: 'Situação do CPF',
    description: 'Presença de restrições/negativações no Serasa, SPC e Boa Vista',
    points,
    max_points: 30,
    percentage: Math.round((points / 30) * 100),
    status,
    recommendations,
  }
}

// ============================================================
// FACTOR 2 – Score de Crédito (max 25 pts)
// ============================================================
function scoreCreditScore(answers: SimulationAnswers): ScoringFactor {
  const { credit_score_range } = answers
  let points = 0
  let status: FactorStatus = 'unknown'
  const recommendations: Recommendation[] = []

  switch (credit_score_range) {
    case '851_1000': points = 25; status = 'excellent'; break
    case '701_850':  points = 20; status = 'good'; break
    case '501_700':  points = 13; status = 'fair'; break
    case '301_500':  points = 6;  status = 'poor'; break
    case '0_300':    points = 1;  status = 'critical'; break
    case 'unknown':  points = 11; status = 'unknown'; break
  }

  if (credit_score_range !== '851_1000' && credit_score_range !== 'unknown') {
    recommendations.push({
      title: 'Pague todas as contas na data correta',
      description:
        'O histórico de pagamentos representa 35% do score. Pagamentos em dia por 6+ meses consecutivos têm grande impacto.',
      impact: 'high',
      icon: 'Calendar',
    })
  }
  if (['0_300', '301_500', '501_700', 'unknown'].includes(credit_score_range)) {
    recommendations.push({
      title: 'Consulte seu score gratuitamente',
      description:
        'Acesse serasa.com.br ou BoaVista SCPC e veja exatamente o que está derrubando seu score. Cada ponto conquistado aumenta suas chances.',
      impact: 'medium',
      icon: 'Search',
    })
    recommendations.push({
      title: 'Reduza a utilização do limite do cartão',
      description:
        'Use no máximo 30% do seu limite disponível de crédito. Uso acima de 50% penaliza fortemente o score.',
      impact: 'medium',
      icon: 'CreditCard',
    })
  }

  return {
    id: 'credit_score',
    name: 'Score de Crédito',
    description: 'Pontuação nos bureaus de crédito (Serasa, SPC, Boa Vista)',
    points,
    max_points: 25,
    percentage: Math.round((points / 25) * 100),
    status,
    recommendations,
  }
}

// ============================================================
// FACTOR 3 – Comprometimento de Renda (max 20 pts)
// ============================================================
function scoreIncomeCommitment(
  answers: SimulationAnswers,
  monthlyPayment: number,
): ScoringFactor {
  const { monthly_income, current_income_commitment } = answers
  const recommendations: Recommendation[] = []

  if (monthly_income <= 0) {
    return {
      id: 'income_commitment',
      name: 'Comprometimento de Renda',
      description: 'Parcela estimada em relação à renda mensal bruta',
      points: 0,
      max_points: 20,
      percentage: 0,
      status: 'unknown',
      recommendations: [],
    }
  }

  const newCommitmentPct = (monthlyPayment / monthly_income) * 100
  const totalCommitmentPct = newCommitmentPct + current_income_commitment

  let points = 0
  let status: FactorStatus = 'critical'

  if (totalCommitmentPct <= 20) {
    points = 20; status = 'excellent'
  } else if (totalCommitmentPct <= 30) {
    points = 15; status = 'good'
  } else if (totalCommitmentPct <= 40) {
    points = 8;  status = 'fair'
  } else if (totalCommitmentPct <= 50) {
    points = 3;  status = 'poor'
  } else {
    points = 0;  status = 'critical'
  }

  if (totalCommitmentPct > 30) {
    recommendations.push({
      title: 'Aumente o valor da entrada',
      description: `Com mais entrada, a parcela cai e o comprometimento de renda melhora. Bancos preferem que a parcela não ultrapasse 30% da renda bruta (atualmente estimado em ${totalCommitmentPct.toFixed(0)}%).`,
      impact: 'high',
      icon: 'TrendingUp',
    })
  }
  if (current_income_commitment > 15) {
    recommendations.push({
      title: 'Quite outras dívidas antes do financiamento',
      description: `Você já tem ${current_income_commitment}% da renda comprometida. Reduzir esse percentual melhora a análise de crédito e pode garantir taxas mais baixas.`,
      impact: 'high',
      icon: 'Minus',
    })
  }
  if (totalCommitmentPct > 40) {
    recommendations.push({
      title: 'Considere aumentar a renda com um codevedor',
      description:
        'Incluir um codevedor (cônjuge, familiar) soma as rendas e reduz o percentual de comprometimento, aumentando significativamente as chances de aprovação.',
      impact: 'medium',
      icon: 'Users',
    })
  }

  return {
    id: 'income_commitment',
    name: 'Comprometimento de Renda',
    description: `Parcela estimada + dívidas atuais em relação à renda (${totalCommitmentPct.toFixed(0)}% comprometido)`,
    points,
    max_points: 20,
    percentage: Math.round((points / 20) * 100),
    status,
    recommendations,
  }
}

// ============================================================
// FACTOR 4 – Estabilidade de Emprego (max 15 pts)
// ============================================================
function scoreEmployment(answers: SimulationAnswers): ScoringFactor {
  const { employment_type, employment_time, has_proof_of_income } = answers
  const recommendations: Recommendation[] = []
  let points = 0
  let status: FactorStatus = 'fair'

  const timeMultiplier: Record<string, number> = {
    less_3m: 0,
    '3m_6m': 0.4,
    '6m_1y': 0.6,
    '1y_2y': 0.8,
    '2y_5y': 1.0,
    more_5y: 1.0,
  }
  const tm = timeMultiplier[employment_time] ?? 0

  switch (employment_type) {
    case 'public_servant':
      points = 15; status = 'excellent'; break
    case 'retired':
      points = 13; status = 'excellent'; break
    case 'clt':
      points = Math.round(6 + 9 * tm); status = tm >= 1 ? 'excellent' : tm >= 0.6 ? 'good' : 'fair'; break
    case 'business_owner':
      points = Math.round(5 + 8 * tm); status = tm >= 1 ? 'good' : 'fair'; break
    case 'autonomous':
      points = Math.round(3 + 7 * tm + (has_proof_of_income ? 3 : 0)); status = tm >= 1 ? 'fair' : 'poor'; break
    default:
      points = Math.round(3 * tm); status = 'poor'
  }

  points = Math.min(15, points)

  if (!has_proof_of_income) {
    points = Math.max(0, points - 3)
    recommendations.push({
      title: 'Reúna comprovantes de renda dos últimos 3 meses',
      description:
        'Sem comprovante de renda, a maioria das financeiras rejeita automaticamente. Junte holerites, decore-se de IR, extratos bancários ou declaração do contador.',
      impact: 'high',
      icon: 'FileText',
    })
  }
  if (['autonomous', 'business_owner'].includes(employment_type)) {
    recommendations.push({
      title: 'Prepare uma declaração do contador atualizada',
      description:
        'Para autônomos e empresários, a declaração de IR e o pró-labore formalizado são os documentos mais valorizados pelas financeiras.',
      impact: 'medium',
      icon: 'Briefcase',
    })
  }
  if (employment_time === 'less_3m' || employment_time === '3m_6m') {
    recommendations.push({
      title: 'Aguarde 6+ meses no emprego atual antes de solicitar',
      description:
        'Tempo de vínculo empregatício é um dos principais critérios. Com 1 ano ou mais, sua pontuação nesse fator melhora consideravelmente.',
      impact: 'medium',
      icon: 'Clock',
    })
  }

  if (points >= 13) status = 'excellent'
  else if (points >= 10) status = 'good'
  else if (points >= 7) status = 'fair'
  else if (points >= 4) status = 'poor'
  else status = 'critical'

  return {
    id: 'employment',
    name: 'Estabilidade de Emprego',
    description: 'Tipo de vínculo, tempo de emprego e capacidade de comprovar renda',
    points,
    max_points: 15,
    percentage: Math.round((points / 15) * 100),
    status,
    recommendations,
  }
}

// ============================================================
// FACTOR 5 – Entrada Disponível (max 10 pts)
// ============================================================
function scoreDownPayment(answers: SimulationAnswers): ScoringFactor {
  const { asset_value, down_payment } = answers
  const recommendations: Recommendation[] = []

  if (asset_value <= 0) {
    return {
      id: 'down_payment',
      name: 'Entrada Disponível',
      description: 'Percentual do valor do bem disponível como entrada',
      points: 0,
      max_points: 10,
      percentage: 0,
      status: 'unknown',
      recommendations: [],
    }
  }

  const pct = (down_payment / asset_value) * 100
  let points = 0
  let status: FactorStatus = 'critical'

  if (pct >= 30) {
    points = 10; status = 'excellent'
  } else if (pct >= 20) {
    points = 8;  status = 'good'
  } else if (pct >= 10) {
    points = 5;  status = 'fair'
  } else if (pct > 0) {
    points = 2;  status = 'poor'
  } else {
    points = 0;  status = 'critical'
  }

  if (pct < 20) {
    recommendations.push({
      title: `Aumente a entrada para pelo menos 20% do valor (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset_value * 0.2)})`,
      description:
        'Uma entrada maior reduz o valor financiado, diminui a parcela, melhora as condições do crédito e aumenta as chances de aprovação.',
      impact: 'high',
      icon: 'PiggyBank',
    })
  }
  if (pct < 10) {
    recommendations.push({
      title: 'Pesquise programas habitacionais com entrada facilitada',
      description:
        'Programas como Minha Casa Minha Vida permitem entradas menores para imóveis dentro das faixas de preço. Verifique se o bem se enquadra.',
      impact: 'medium',
      icon: 'Home',
    })
  }

  return {
    id: 'down_payment',
    name: 'Entrada Disponível',
    description: `${pct.toFixed(0)}% do valor do bem disponível como entrada`,
    points,
    max_points: 10,
    percentage: Math.round((points / 10) * 100),
    status,
    recommendations,
  }
}

// ============================================================
// MAIN – calculateScore
// ============================================================
export function calculateScore(answers: SimulationAnswers): ScoringResult {
  const financingAmount = Math.max(0, answers.asset_value - answers.down_payment)

  // Typical annual financing rate (adjust per product if needed)
  const annualRate = answers.financing_type === 'property' ? 0.1099 : 0.1599

  const monthlyPayment = calcMonthlyPayment(
    financingAmount,
    annualRate,
    answers.desired_term_months,
  )

  const f1 = scoreRestrictions(answers)
  const f2 = scoreCreditScore(answers)
  const f3 = scoreIncomeCommitment(answers, monthlyPayment)
  const f4 = scoreEmployment(answers)
  const f5 = scoreDownPayment(answers)

  let total = f1.points + f2.points + f3.points + f4.points + f5.points

  // Bonus points (capped at 100)
  const age = answers.birth_date ? calcAge(answers.birth_date) : 35
  if (answers.has_paid_asset) total += 3
  if (age >= 25 && age <= 55) total += 2

  const finalScore = Math.min(100, Math.max(0, total))

  let label = 'Baixa'
  if (finalScore >= 80) label = 'Alta'
  else if (finalScore >= 60) label = 'Boa'
  else if (finalScore >= 40) label = 'Moderada'

  // Gather all recommendations sorted by impact
  const allRecs = [f1, f2, f3, f4, f5].flatMap((f) => f.recommendations)
  const impactOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
  const generalRecommendations = allRecs
    .sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact])
    .slice(0, 6)

  return {
    total_score: finalScore,
    approval_percentage: finalScore,
    label,
    factors: [f1, f2, f3, f4, f5],
    estimated_monthly_payment: monthlyPayment,
    financing_amount: financingAmount,
    general_recommendations: generalRecommendations,
    calculated_at: new Date().toISOString(),
  }
}
