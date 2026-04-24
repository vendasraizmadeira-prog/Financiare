-- ============================================================
-- 002 – Admin CRM: stage, notes, is_admin
-- ============================================================

-- Add pipeline stage and notes to simulations
ALTER TABLE simulations
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '';

-- Add admin flag to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Update existing read policy to include admin access
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

-- Admin can update simulations (stage, notes)
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

-- Admin can read all profiles
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

-- Index for stage queries
CREATE INDEX IF NOT EXISTS simulations_stage_idx ON simulations (stage);
CREATE INDEX IF NOT EXISTS simulations_created_at_idx ON simulations (created_at DESC);
