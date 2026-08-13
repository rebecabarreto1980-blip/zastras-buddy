CREATE TABLE public.compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  data_compra date NOT NULL,
  produtos text,
  valor numeric(10,2),
  nota_cupom text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.compras TO authenticated;
GRANT ALL ON public.compras TO service_role;
REVOKE ALL ON public.compras FROM anon;

ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select compras" ON public.compras FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert compras" ON public.compras FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update compras" ON public.compras FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete compras" ON public.compras FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

ALTER TABLE public.clientes
  ADD COLUMN segmento text,
  ADD COLUMN valor_total_gasto numeric(10,2),
  ADD COLUMN ultima_compra date,
  ADD COLUMN qtd_compras integer DEFAULT 0;