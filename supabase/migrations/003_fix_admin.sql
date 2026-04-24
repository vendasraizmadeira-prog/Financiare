-- ============================================================
-- 003 – Fix: garantir is_admin e políticas corretas
-- Execute no Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Garantir que as colunas de admin existam (idempotente)
ALTER TABLE simulations
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '';

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- 2. Recriar política de leitura de simulações (com acesso admin)
DROP POLICY IF EXISTS "Users can view own simulations" ON simulations;
CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 3. Política de update de simulações para admin (idempotente)
DROP POLICY IF EXISTS "Admin can update simulations" ON simulations;
CREATE POLICY "Admin can update simulations"
  ON simulations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 4. Política de leitura de profiles (próprio + admin)
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid() AND p2.is_admin = true
    )
  );

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS simulations_stage_idx ON simulations (stage);

-- ============================================================
-- IMPORTANTE: após rodar o script acima, execute também:
-- (substitua pelo seu e-mail real se necessário)
-- ============================================================
-- UPDATE profiles SET is_admin = true WHERE email = 'SEU_EMAIL_AQUI';
