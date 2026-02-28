
-- Drop restrictive policies and create permissive ones for all tables

-- CLIENTES
DROP POLICY IF EXISTS "Autenticados atualizam clientes" ON public.clientes;
DROP POLICY IF EXISTS "Autenticados deletam clientes" ON public.clientes;
DROP POLICY IF EXISTS "Autenticados inserem clientes" ON public.clientes;
DROP POLICY IF EXISTS "Clientes visíveis para autenticados" ON public.clientes;

CREATE POLICY "Allow all select on clientes" ON public.clientes FOR SELECT USING (true);
CREATE POLICY "Allow all insert on clientes" ON public.clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on clientes" ON public.clientes FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on clientes" ON public.clientes FOR DELETE USING (true);

-- VENDEDORES
DROP POLICY IF EXISTS "Apenas admins atualizam vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Apenas admins deletam vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Apenas admins inserem vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Vendedores visíveis para todos autenticados" ON public.vendedores;

CREATE POLICY "Allow all select on vendedores" ON public.vendedores FOR SELECT USING (true);
CREATE POLICY "Allow all insert on vendedores" ON public.vendedores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on vendedores" ON public.vendedores FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on vendedores" ON public.vendedores FOR DELETE USING (true);

-- HISTORICO_CONTATOS
DROP POLICY IF EXISTS "Autenticados inserem histórico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Histórico visível para autenticados" ON public.historico_contatos;

CREATE POLICY "Allow all select on historico" ON public.historico_contatos FOR SELECT USING (true);
CREATE POLICY "Allow all insert on historico" ON public.historico_contatos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on historico" ON public.historico_contatos FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on historico" ON public.historico_contatos FOR DELETE USING (true);

-- LEMBRETES
DROP POLICY IF EXISTS "Autenticados atualizam lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Autenticados inserem lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Lembretes visíveis para autenticados" ON public.lembretes;

CREATE POLICY "Allow all select on lembretes" ON public.lembretes FOR SELECT USING (true);
CREATE POLICY "Allow all insert on lembretes" ON public.lembretes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on lembretes" ON public.lembretes FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on lembretes" ON public.lembretes FOR DELETE USING (true);
