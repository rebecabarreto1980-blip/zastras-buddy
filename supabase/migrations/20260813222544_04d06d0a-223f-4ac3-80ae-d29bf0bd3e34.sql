-- clientes
DROP POLICY IF EXISTS "Allow all select on clientes" ON public.clientes;
DROP POLICY IF EXISTS "Allow all insert on clientes" ON public.clientes;
DROP POLICY IF EXISTS "Allow all update on clientes" ON public.clientes;
DROP POLICY IF EXISTS "Allow all delete on clientes" ON public.clientes;

REVOKE ALL ON public.clientes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select clientes" ON public.clientes FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update clientes" ON public.clientes FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete clientes" ON public.clientes FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- vendedores
DROP POLICY IF EXISTS "Allow all select on vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Allow all insert on vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Allow all update on vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Allow all delete on vendedores" ON public.vendedores;

REVOKE ALL ON public.vendedores FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendedores TO authenticated;
GRANT ALL ON public.vendedores TO service_role;
ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select vendedores" ON public.vendedores FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert vendedores" ON public.vendedores FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update vendedores" ON public.vendedores FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete vendedores" ON public.vendedores FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- historico_contatos
DROP POLICY IF EXISTS "Allow all select on historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Allow all insert on historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Allow all update on historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Allow all delete on historico" ON public.historico_contatos;

REVOKE ALL ON public.historico_contatos FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.historico_contatos TO authenticated;
GRANT ALL ON public.historico_contatos TO service_role;
ALTER TABLE public.historico_contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select historico" ON public.historico_contatos FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert historico" ON public.historico_contatos FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update historico" ON public.historico_contatos FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete historico" ON public.historico_contatos FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- lembretes
DROP POLICY IF EXISTS "Allow all select on lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Allow all insert on lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Allow all update on lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Allow all delete on lembretes" ON public.lembretes;

REVOKE ALL ON public.lembretes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lembretes TO authenticated;
GRANT ALL ON public.lembretes TO service_role;
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select lembretes" ON public.lembretes FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert lembretes" ON public.lembretes FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update lembretes" ON public.lembretes FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete lembretes" ON public.lembretes FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);