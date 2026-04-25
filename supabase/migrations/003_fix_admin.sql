-- ============================================================
-- 003 – Fix: recursão infinita nas policies de profiles/simulations
-- Substitui queries em profiles dentro de policies de profiles
-- pelo check direto no JWT (auth.jwt() -> 'app_metadata')
-- Execute no Supabase Dashboard → SQL Editor
-- ============================================================

-- Profiles: remover policy recursiva e recriar com JWT check
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Simulations SELECT: admin check via JWT (sem query em profiles)
DROP POLICY IF EXISTS "Users can view own simulations" ON simulations;
CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Simulations UPDATE: admin check via JWT
DROP POLICY IF EXISTS "Admin can update simulations" ON simulations;
CREATE POLICY "Admin can update simulations"
  ON simulations FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- Para marcar um usuário como admin (substitua pelo e-mail real):
-- UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"is_admin": true}'
-- WHERE email = 'SEU_EMAIL_AQUI';
-- ============================================================
