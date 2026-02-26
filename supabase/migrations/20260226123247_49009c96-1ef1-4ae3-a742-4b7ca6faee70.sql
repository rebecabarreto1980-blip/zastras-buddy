
-- Tabela de vendedores
CREATE TABLE public.vendedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
  ativo BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendedores visíveis para todos autenticados"
  ON public.vendedores FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Apenas admins inserem vendedores"
  ON public.vendedores FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Apenas admins atualizam vendedores"
  ON public.vendedores FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Apenas admins deletam vendedores"
  ON public.vendedores FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cpf TEXT,
  email TEXT,
  vendedor_id UUID REFERENCES public.vendedores(id),
  data_compra DATE,
  data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
  nome_crianca TEXT,
  data_nascimento_crianca DATE,
  observacoes TEXT,
  primeiro_contato_feito BOOLEAN NOT NULL DEFAULT false,
  data_primeiro_contato DATE,
  ultimo_contato DATE,
  cupom10_enviado BOOLEAN NOT NULL DEFAULT false,
  data_cupom DATE,
  codigo_cupom TEXT
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes visíveis para autenticados"
  ON public.clientes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados inserem clientes"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados atualizam clientes"
  ON public.clientes FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados deletam clientes"
  ON public.clientes FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Tabela de histórico de contatos
CREATE TABLE public.historico_contatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  vendedor_id UUID REFERENCES public.vendedores(id),
  data_contato DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_contato TEXT NOT NULL DEFAULT 'whatsapp',
  mensagem_enviada TEXT,
  resposta_recebida TEXT,
  cupom_gerado TEXT
);

ALTER TABLE public.historico_contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Histórico visível para autenticados"
  ON public.historico_contatos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados inserem histórico"
  ON public.historico_contatos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Tabela de lembretes
CREATE TABLE public.lembretes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendedor_id UUID REFERENCES public.vendedores(id),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo_lembrete TEXT NOT NULL DEFAULT 'follow_up',
  data_lembrete DATE NOT NULL,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente'
);

ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lembretes visíveis para autenticados"
  ON public.lembretes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados inserem lembretes"
  ON public.lembretes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados atualizam lembretes"
  ON public.lembretes FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Inserir vendedores iniciais
INSERT INTO public.vendedores (nome) VALUES
  ('ADM'),
  ('ALEXANDRE'),
  ('DÉBORAH'),
  ('BRENDHA');
