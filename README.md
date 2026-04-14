# Financiare – Análise de Aprovação de Financiamento

Web app para que clientes da Financiare descubram sua taxa de aprovação de financiamento e recebam um plano de melhoria personalizado.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Banco de dados**: Supabase (PostgreSQL + Auth)
- **Estilo**: Tailwind CSS
- **Linguagem**: TypeScript
- **Deploy**: Vercel

## Como rodar localmente

### 1. Clone e instale dependências

```bash
git clone https://github.com/SEU_USUARIO/financiare.git
cd financiare
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3. Configure o banco de dados (Supabase)

No **Supabase Dashboard > SQL Editor**, execute o arquivo:

```
supabase/migrations/001_initial.sql
```

### 4. Rode em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## Deploy no Vercel

1. Faça push do projeto para GitHub
2. Importe o repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático!

---

## Estrutura do Projeto

```
app/
  page.tsx              # Landing page
  auth/
    login/              # Login
    register/           # Cadastro
    callback/           # OAuth callback
  simulacao/            # Questionário multi-etapas
  resultado/            # Resultado da análise
  dashboard/            # Painel do usuário
components/
  ScoreGauge.tsx        # Medidor circular animado
lib/
  scoring/
    algorithm.ts        # Algoritmo de pontuação
    questions.ts        # Definição das perguntas
  supabase/
    client.ts           # Cliente browser
    server.ts           # Cliente servidor
  utils.ts              # Utilitários
types/
  index.ts              # Types TypeScript
supabase/
  migrations/
    001_initial.sql     # Schema do banco
```

## Algoritmo de Pontuação

| Fator | Peso |
|-------|------|
| Situação do CPF (Serasa/SPC) | 30% |
| Score de Crédito | 25% |
| Comprometimento de Renda | 20% |
| Estabilidade de Emprego | 15% |
| Entrada Disponível | 10% |

**Bônus**: +2 pts (faixa etária ideal 25-55 anos) + +3 pts (possui bem quitado)

## Interpretação do Score

| Score | Classificação |
|-------|--------------|
| 80–100% | Alta probabilidade |
| 60–79% | Boa probabilidade |
| 40–59% | Moderada |
| 0–39% | Baixa |
