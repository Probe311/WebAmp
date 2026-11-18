-- Harden catalog writes: admin-only (is_admin via user_roles).
-- Apply in Supabase SQL Editor after rotating leaked keys.
-- Seed your admin once:
--   INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_AUTH_UUID', 'admin')
--   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own role" ON public.user_roles;
CREATE POLICY "Users read own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE for authenticated clients — manage via service_role / dashboard.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Catalog tables: drop permissive "any authenticated" write policies, admin-only writes.
-- Table list covers LMS + product catalog used by the admin panel.

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'courses', 'lessons', 'quiz_questions', 'rewards',
    'tablatures', 'chords',
    'brands', 'amplifiers', 'amplifier_parameters',
    'pedals', 'pedal_parameters', 'presets',
    'dlc_packs', 'dlc_pack_courses', 'feature_flags'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF to_regclass('public.' || t) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    -- Drop known permissive write policies (names from RLS_SECURITY_GUIDE / common patterns)
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Authenticated users can insert ' || t, t);
      EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Authenticated users can update ' || t, t);
      EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Authenticated users can delete ' || t, t);
      EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Authenticated users can insert courses', t);
      EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Authenticated users can update courses', t);
      EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Authenticated users can delete courses', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;

    -- Recreate admin write policies (idempotent names)
    EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Admins can insert ' || t, t);
    EXECUTE format(
      'CREATE POLICY %L ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin())',
      'Admins can insert ' || t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Admins can update ' || t, t);
    EXECUTE format(
      'CREATE POLICY %L ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
      'Admins can update ' || t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS %L ON public.%I', 'Admins can delete ' || t, t);
    EXECUTE format(
      'CREATE POLICY %L ON public.%I FOR DELETE TO authenticated USING (public.is_admin())',
      'Admins can delete ' || t, t
    );
  END LOOP;
END $$;
