ALTER TABLE public.historico_contatos ADD COLUMN IF NOT EXISTS respondeu boolean DEFAULT NULL;

DROP POLICY IF EXISTS "Admin or owner can select historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Admin or owner can insert historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Admin or owner can update historico" ON public.historico_contatos;
DROP POLICY IF EXISTS "Admin or owner can delete historico" ON public.historico_contatos;

CREATE POLICY "Admin or client owner can select historico" ON public.historico_contatos FOR SELECT TO authenticated
USING (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = historico_contatos.cliente_id AND c.vendedor_id = current_vendedor_id()));
CREATE POLICY "Admin or client owner can insert historico" ON public.historico_contatos FOR INSERT TO authenticated
WITH CHECK (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = historico_contatos.cliente_id AND c.vendedor_id = current_vendedor_id()));
CREATE POLICY "Admin or client owner can update historico" ON public.historico_contatos FOR UPDATE TO authenticated
USING (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = historico_contatos.cliente_id AND c.vendedor_id = current_vendedor_id()))
WITH CHECK (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = historico_contatos.cliente_id AND c.vendedor_id = current_vendedor_id()));
CREATE POLICY "Admin or client owner can delete historico" ON public.historico_contatos FOR DELETE TO authenticated
USING (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = historico_contatos.cliente_id AND c.vendedor_id = current_vendedor_id()));

DROP POLICY IF EXISTS "Admin or owner can select lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Admin or owner can insert lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Admin or owner can update lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Admin or owner can delete lembretes" ON public.lembretes;

CREATE POLICY "Admin or client owner can select lembretes" ON public.lembretes FOR SELECT TO authenticated
USING (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = lembretes.cliente_id AND c.vendedor_id = current_vendedor_id()));
CREATE POLICY "Admin or client owner can insert lembretes" ON public.lembretes FOR INSERT TO authenticated
WITH CHECK (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = lembretes.cliente_id AND c.vendedor_id = current_vendedor_id()));
CREATE POLICY "Admin or client owner can update lembretes" ON public.lembretes FOR UPDATE TO authenticated
USING (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = lembretes.cliente_id AND c.vendedor_id = current_vendedor_id()))
WITH CHECK (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = lembretes.cliente_id AND c.vendedor_id = current_vendedor_id()));
CREATE POLICY "Admin or client owner can delete lembretes" ON public.lembretes FOR DELETE TO authenticated
USING (is_admin() OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = lembretes.cliente_id AND c.vendedor_id = current_vendedor_id()));