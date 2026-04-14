// ============================================================
// Questionnaire step definitions
// ============================================================

export interface QuestionOption {
  value: string | number | boolean
  label: string
  sublabel?: string
}

export interface Question {
  id: string
  label: string
  sublabel?: string
  type: 'text' | 'cpf' | 'date' | 'number' | 'currency' | 'select' | 'radio' | 'boolean'
  options?: QuestionOption[]
  placeholder?: string
  required: boolean
  hint?: string
}

export interface Step {
  id: number
  title: string
  subtitle: string
  icon: string
  questions: Question[]
}

export const SIMULATION_STEPS: Step[] = [
  {
    id: 1,
    title: 'Dados Pessoais',
    subtitle: 'Precisamos te conhecer para personalizar a análise',
    icon: 'User',
    questions: [
      {
        id: 'full_name',
        label: 'Nome Completo',
        type: 'text',
        placeholder: 'Digite seu nome completo',
        required: true,
      },
      {
        id: 'cpf',
        label: 'CPF',
        type: 'cpf',
        placeholder: '000.000.000-00',
        required: true,
        hint: 'Usado apenas para análise. Não compartilhamos seus dados.',
      },
      {
        id: 'birth_date',
        label: 'Data de Nascimento',
        type: 'date',
        required: true,
      },
      {
        id: 'marital_status',
        label: 'Estado Civil',
        type: 'select',
        required: true,
        options: [
          { value: 'single', label: 'Solteiro(a)' },
          { value: 'married', label: 'Casado(a)' },
          { value: 'stable_union', label: 'União Estável' },
          { value: 'divorced', label: 'Divorciado(a)' },
          { value: 'widowed', label: 'Viúvo(a)' },
        ],
      },
      {
        id: 'dependents',
        label: 'Número de Dependentes',
        type: 'select',
        required: true,
        hint: 'Filhos, cônjuge dependente, etc.',
        options: [
          { value: 0, label: 'Nenhum' },
          { value: 1, label: '1 dependente' },
          { value: 2, label: '2 dependentes' },
          { value: 3, label: '3 ou mais' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Situação Financeira',
    subtitle: 'Informações sobre seu histórico e saúde financeira',
    icon: 'BarChart2',
    questions: [
      {
        id: 'has_restrictions',
        label: 'Possui restrições no CPF (negativado)?',
        sublabel: 'SPC, Serasa, Boa Vista ou qualquer órgão de proteção ao crédito',
        type: 'boolean',
        required: true,
      },
      {
        id: 'restriction_level',
        label: 'Qual o nível das restrições?',
        type: 'radio',
        required: false,
        hint: 'Responda apenas se possui restrições',
        options: [
          { value: 'light', label: 'Leves', sublabel: 'Dívidas pequenas ou recentes (até 1 ano)' },
          { value: 'severe', label: 'Graves', sublabel: 'Dívidas grandes, protestos ou execuções' },
        ],
      },
      {
        id: 'credit_score_range',
        label: 'Qual é o seu Score de Crédito?',
        sublabel: 'Consulte gratuitamente em serasa.com.br',
        type: 'radio',
        required: true,
        options: [
          { value: 'unknown', label: 'Não sei', sublabel: 'Nunca consultei' },
          { value: '0_300', label: '0 – 300', sublabel: 'Muito baixo' },
          { value: '301_500', label: '301 – 500', sublabel: 'Baixo' },
          { value: '501_700', label: '501 – 700', sublabel: 'Regular' },
          { value: '701_850', label: '701 – 850', sublabel: 'Bom' },
          { value: '851_1000', label: '851 – 1000', sublabel: 'Excelente' },
        ],
      },
      {
        id: 'monthly_income',
        label: 'Renda Mensal Bruta',
        sublabel: 'Soma de todos os seus rendimentos antes dos descontos',
        type: 'currency',
        placeholder: '0,00',
        required: true,
      },
      {
        id: 'current_income_commitment',
        label: '% da renda já comprometida com dívidas',
        sublabel: 'Parcelas de cartão, empréstimos, outros financiamentos, etc.',
        type: 'select',
        required: true,
        options: [
          { value: 0, label: 'Nenhuma dívida atual' },
          { value: 10, label: 'Até 10%' },
          { value: 20, label: '10% a 20%' },
          { value: 30, label: '20% a 30%' },
          { value: 40, label: '30% a 40%' },
          { value: 55, label: 'Mais de 40%' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Vínculo Empregatício',
    subtitle: 'Seu histórico profissional influencia a aprovação',
    icon: 'Briefcase',
    questions: [
      {
        id: 'employment_type',
        label: 'Tipo de Vínculo Empregatício',
        type: 'radio',
        required: true,
        options: [
          { value: 'clt', label: 'CLT / Assalariado', sublabel: 'Carteira assinada' },
          { value: 'public_servant', label: 'Servidor Público', sublabel: 'Federal, estadual ou municipal' },
          { value: 'retired', label: 'Aposentado / Pensionista', sublabel: 'INSS ou outro' },
          { value: 'business_owner', label: 'Empresário / MEI', sublabel: 'Sócio ou dono de empresa' },
          { value: 'autonomous', label: 'Autônomo / Freelancer', sublabel: 'Trabalho por conta própria' },
          { value: 'other', label: 'Outro', sublabel: 'Bolsista, estagiário, etc.' },
        ],
      },
      {
        id: 'employment_time',
        label: 'Tempo no emprego / atividade atual',
        type: 'radio',
        required: true,
        options: [
          { value: 'less_3m', label: 'Menos de 3 meses' },
          { value: '3m_6m', label: '3 a 6 meses' },
          { value: '6m_1y', label: '6 meses a 1 ano' },
          { value: '1y_2y', label: '1 a 2 anos' },
          { value: '2y_5y', label: '2 a 5 anos' },
          { value: 'more_5y', label: 'Mais de 5 anos' },
        ],
      },
      {
        id: 'has_proof_of_income',
        label: 'Possui comprovante de renda?',
        sublabel: 'Holerite, extrato bancário, declaração do IR ou decore-se de contador',
        type: 'boolean',
        required: true,
      },
    ],
  },
  {
    id: 4,
    title: 'Detalhes do Financiamento',
    subtitle: 'Informações sobre o bem que deseja financiar',
    icon: 'Home',
    questions: [
      {
        id: 'financing_type',
        label: 'Tipo de Financiamento',
        type: 'radio',
        required: true,
        options: [
          { value: 'property', label: 'Imóvel', sublabel: 'Casa, apartamento, terreno' },
          { value: 'vehicle', label: 'Veículo', sublabel: 'Carro, moto, caminhão' },
          { value: 'personal', label: 'Crédito Pessoal', sublabel: 'Sem garantia real' },
          { value: 'other', label: 'Outro', sublabel: 'Equipamento, máquina, etc.' },
        ],
      },
      {
        id: 'asset_value',
        label: 'Valor Total do Bem',
        sublabel: 'Valor de venda ou avaliação do imóvel/veículo',
        type: 'currency',
        placeholder: '0,00',
        required: true,
      },
      {
        id: 'down_payment',
        label: 'Valor da Entrada Disponível',
        sublabel: 'Quanto você tem para dar de entrada agora',
        type: 'currency',
        placeholder: '0,00',
        required: true,
      },
      {
        id: 'desired_term_months',
        label: 'Prazo desejado para pagamento',
        type: 'select',
        required: true,
        options: [
          { value: 12,  label: '12 meses (1 ano)' },
          { value: 24,  label: '24 meses (2 anos)' },
          { value: 36,  label: '36 meses (3 anos)' },
          { value: 48,  label: '48 meses (4 anos)' },
          { value: 60,  label: '60 meses (5 anos)' },
          { value: 84,  label: '84 meses (7 anos)' },
          { value: 120, label: '120 meses (10 anos)' },
          { value: 180, label: '180 meses (15 anos)' },
          { value: 240, label: '240 meses (20 anos)' },
          { value: 360, label: '360 meses (30 anos)' },
        ],
      },
      {
        id: 'has_paid_asset',
        label: 'Possui imóvel ou veículo quitado no seu nome?',
        sublabel: 'Bens quitados podem ser usados como garantia e aumentam a aprovação',
        type: 'boolean',
        required: true,
      },
    ],
  },
]
