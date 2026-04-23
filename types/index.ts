// ============================================================
// Financiare – Core Types
// ============================================================

export type EmploymentType =
  | 'clt'
  | 'autonomous'
  | 'business_owner'
  | 'public_servant'
  | 'retired'
  | 'other'

export type EmploymentTime =
  | 'less_3m'
  | '3m_6m'
  | '6m_1y'
  | '1y_2y'
  | '2y_5y'
  | 'more_5y'

export type CreditScoreRange =
  | 'unknown'
  | '0_300'
  | '301_500'
  | '501_700'
  | '701_850'
  | '851_1000'

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'stable_union'

export type FinancingType = 'property' | 'vehicle' | 'personal' | 'other' | 'ready_property' | 'land_construction' | 'land_only' | 'evaluating'

export type RestrictionLevel = 'none' | 'light' | 'severe'

export type FactorStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | 'unknown'

// ============================================================
// Questionnaire answers (stored as JSON in Supabase)
// ============================================================
export interface SimulationAnswers {
  // Step 1 – Dados Pessoais
  full_name: string
  cpf: string
  birth_date: string        // ISO date string "YYYY-MM-DD"
  marital_status: MaritalStatus
  dependents: number

  // Step 2 – Situação Financeira
  has_restrictions: boolean
  restriction_level: RestrictionLevel
  credit_score_range: CreditScoreRange
  monthly_income: number    // BRL
  current_income_commitment: number  // % of income already committed

  // Step 3 – Vínculo Empregatício
  employment_type: EmploymentType
  employment_time: EmploymentTime
  has_proof_of_income: boolean

  // Step 4 – Detalhes do Financiamento
  financing_type: FinancingType
  asset_value: number       // total value of asset
  down_payment: number      // entry amount available
  desired_term_months: number
  has_paid_asset: boolean   // owns a paid-off property/vehicle

  // Optional qualification fields
  has_fgts?: 'yes' | 'no' | 'unknown'
  financing_with?: 'alone' | 'spouse' | 'other'
  has_land?: boolean
  city?: string
  main_difficulty?: string
  wants_guidance?: string
  financing_timeline?: string
  wants_contact?: string
}

// ============================================================
// Scoring Result
// ============================================================
export interface ScoringFactor {
  id: string
  name: string
  description: string
  points: number
  max_points: number
  percentage: number
  status: FactorStatus
  recommendations: Recommendation[]
}

export interface Recommendation {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  icon: string
}

export interface ScoringResult {
  total_score: number          // 0–100
  approval_percentage: number  // same, expressed as %
  label: string                // "Alta", "Boa", "Moderada", "Baixa"
  factors: ScoringFactor[]
  estimated_monthly_payment: number
  financing_amount: number
  general_recommendations: Recommendation[]
  calculated_at: string        // ISO datetime
}

// ============================================================
// Supabase DB row types
// ============================================================
export interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface SimulationRow {
  id: string
  user_id: string | null      // null = guest simulation
  answers: SimulationAnswers
  result: ScoringResult
  created_at: string
}
