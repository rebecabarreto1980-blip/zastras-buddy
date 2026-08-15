ALTER TABLE public.vendedores
  ADD COLUMN IF NOT EXISTS auth_user_id uuid,
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'vendedor',
  ADD COLUMN IF NOT EXISTS email_auth text;

ALTER TABLE public.vendedores DROP CONSTRAINT IF EXISTS vendedores_role_check;
ALTER TABLE public.vendedores ADD CONSTRAINT vendedores_role_check CHECK (role IN ('admin','vendedor'));

CREATE UNIQUE INDEX IF NOT EXISTS vendedores_email_auth_key ON public.vendedores (lower(email_auth)) WHERE email_auth IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS vendedores_auth_user_id_key ON public.vendedores (auth_user_id) WHERE auth_user_id IS NOT NULL;

UPDATE public.vendedores SET email_auth = 'alexandre@zastras.local' WHERE upper(nome) LIKE 'ALEXANDRE%' AND email_auth IS NULL;
UPDATE public.vendedores SET email_auth = 'debora@zastras.local' WHERE (upper(nome) LIKE 'DÉBORAH%' OR upper(nome) LIKE 'DEBORAH%' OR upper(nome) LIKE 'DEBORA%') AND email_auth IS NULL;
UPDATE public.vendedores SET email_auth = 'bete@zastras.local' WHERE upper(nome) LIKE 'BETE%' AND email_auth IS NULL;

UPDATE public.vendedores SET role = 'admin' WHERE upper(nome) IN ('ADM','ADMIN');

INSERT INTO public.vendedores (nome, role, email_auth, ativo)
SELECT 'ADMIN', 'admin', 'admin@zastras.local', true
WHERE NOT EXISTS (SELECT 1 FROM public.vendedores WHERE lower(email_auth) = 'admin@zastras.local');

CREATE OR REPLACE FUNCTION public.current_vendedor_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.vendedores WHERE auth_user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.vendedores WHERE auth_user_id = auth.uid() AND role = 'admin')
$$;

-- CLIENTES
DROP POLICY IF EXISTS "Authenticated can select clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated can insert clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated can delete clientes" ON public.clientes;

CREATE POLICY "Admin or owner can select clientes" ON public.clientes FOR SELECT TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can insert clientes" ON public.clientes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can update clientes" ON public.clientes FOR UPDATE TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id())
  WITH CHECK (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can delete clientes" ON public.clientes FOR DELETE TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id());

-- HISTORICO_CONTATOS
DROP POLICY IF EXISTS "Authenticated can select historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Authenticated can insert historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Authenticated can update historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Authenticated can delete historico" ON public.historico_contatos;

CREATE POLICY "Admin or owner can select historico" ON public.historico_contatos FOR SELECT TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can insert historico" ON public.historico_contatos FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can update historico" ON public.historico_contatos FOR UPDATE TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id())
  WITH CHECK (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can delete historico" ON public.historico_contatos FOR DELETE TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id());

-- LEMBRETES
DROP POLICY IF EXISTS "Authenticated can select lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Authenticated can insert lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Authenticated can update lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Authenticated can delete lembretes" ON public.lembretes;

CREATE POLICY "Admin or owner can select lembretes" ON public.lembretes FOR SELECT TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can insert lembretes" ON public.lembretes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can update lembretes" ON public.lembretes FOR UPDATE TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id())
  WITH CHECK (public.is_admin() OR vendedor_id = public.current_vendedor_id());
CREATE POLICY "Admin or owner can delete lembretes" ON public.lembretes FOR DELETE TO authenticated
  USING (public.is_admin() OR vendedor_id = public.current_vendedor_id());

-- VENDEDORES: leitura pública limitada (tela de login) via view, e vínculo do auth_user_id
CREATE OR REPLACE VIEW public.vendedores_login
WITH (security_invoker = off) AS
  SELECT id, nome, role, email_auth, ativo FROM public.vendedores WHERE ativo = true;

GRANT SELECT ON public.vendedores_login TO anon, authenticated;

DROP POLICY IF EXISTS "Authenticated can update vendedores" ON public.vendedores;
CREATE POLICY "Authenticated can update vendedores" ON public.vendedores FOR UPDATE TO authenticated
  USING (public.is_admin() OR lower(email_auth) = lower(coalesce(auth.jwt() ->> 'email', '')))
  WITH CHECK (public.is_admin() OR lower(email_auth) = lower(coalesce(auth.jwt() ->> 'email', '')));