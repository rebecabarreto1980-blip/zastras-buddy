DROP VIEW IF EXISTS public.vendedores_login;

REVOKE ALL ON FUNCTION public.current_vendedor_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_vendedor_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

GRANT SELECT (id, nome, role, email_auth, ativo) ON public.vendedores TO anon;

DROP POLICY IF EXISTS "Anyone can list vendedores for login" ON public.vendedores;
CREATE POLICY "Anyone can list vendedores for login" ON public.vendedores FOR SELECT TO anon
  USING (ativo = true);