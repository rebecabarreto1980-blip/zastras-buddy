import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Cliente, Compra } from '@/lib/types';

export function mapClienteRow(row: any): Cliente {
  return {
    id: row.id,
    nomeCliente: row.nome_cliente,
    telefone: row.telefone,
    email: row.email || undefined,
    vendedorId: row.vendedor_id || '',
    dataCadastro: row.data_cadastro,
    nomeCrianca: row.nome_crianca || undefined,
    dataNascimentoCrianca: row.data_nascimento_crianca || undefined,
    observacoes: row.observacoes || undefined,
    primeiroContatoFeito: row.primeiro_contato_feito,
    dataPrimeiroContato: row.data_primeiro_contato || undefined,
    ultimoContato: row.ultimo_contato || undefined,
    cupom10Enviado: row.cupom10_enviado,
    dataCupom: row.data_cupom || undefined,
    codigoCupom: row.codigo_cupom || undefined,
    produtos: row.produtos || undefined,
    dataCompra: row.data_compra || undefined,
    segmento: row.segmento || undefined,
    valorTotalGasto: row.valor_total_gasto ?? undefined,
    ultimaCompra: row.ultima_compra || undefined,
    qtdCompras: row.qtd_compras ?? undefined,
  };
}

function toDbRow(data: Partial<Cliente>): Record<string, any> {
  const map: Record<string, any> = {};
  if (data.nomeCliente !== undefined) map.nome_cliente = data.nomeCliente;
  if (data.telefone !== undefined) map.telefone = data.telefone;
  if (data.email !== undefined) map.email = data.email || null;
  if (data.vendedorId !== undefined) map.vendedor_id = data.vendedorId || null;
  if (data.nomeCrianca !== undefined) map.nome_crianca = data.nomeCrianca || null;
  if (data.dataNascimentoCrianca !== undefined) map.data_nascimento_crianca = data.dataNascimentoCrianca || null;
  if (data.observacoes !== undefined) map.observacoes = data.observacoes || null;
  if (data.primeiroContatoFeito !== undefined) map.primeiro_contato_feito = data.primeiroContatoFeito;
  if (data.dataPrimeiroContato !== undefined) map.data_primeiro_contato = data.dataPrimeiroContato || null;
  if (data.ultimoContato !== undefined) map.ultimo_contato = data.ultimoContato || null;
  if (data.cupom10Enviado !== undefined) map.cupom10_enviado = data.cupom10Enviado;
  if (data.dataCupom !== undefined) map.data_cupom = data.dataCupom || null;
  if (data.codigoCupom !== undefined) map.codigo_cupom = data.codigoCupom || null;
  if (data.produtos !== undefined) map.produtos = data.produtos || null;
  if (data.dataCompra !== undefined) map.data_compra = data.dataCompra || null;
  if (data.segmento !== undefined) map.segmento = data.segmento || null;
  if (data.valorTotalGasto !== undefined) map.valor_total_gasto = data.valorTotalGasto ?? null;
  if (data.ultimaCompra !== undefined) map.ultima_compra = data.ultimaCompra || null;
  if (data.qtdCompras !== undefined) map.qtd_compras = data.qtdCompras ?? null;
  return map;
}

export function useClientes(vendedorId?: string) {
  return useQuery({
    queryKey: ['clientes', vendedorId],
    queryFn: async () => {
      let query = supabase.from('clientes').select('*').order('nome_cliente');
      if (vendedorId) {
        query = query.eq('vendedor_id', vendedorId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapClienteRow);
    },
  });
}

export function useAddCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
      const dbRow = toDbRow(cliente) as any;
      const { data, error } = await supabase
        .from('clientes')
        .insert(dbRow as any)
        .select()
        .single();
      if (error) throw error;
      return mapClienteRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clientes'] }),
  });
}

export function useUpdateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cliente> }) => {
      const dbRow = toDbRow(data);
      const { error } = await supabase
        .from('clientes')
        .update(dbRow)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clientes'] }),
  });
}

export function useAddHistorico() {
  return useMutation({
    mutationFn: async (h: { clienteId: string; vendedorId: string; tipoContato: string; mensagemEnviada?: string }) => {
      const { error } = await supabase
        .from('historico_contatos')
        .insert({
          cliente_id: h.clienteId,
          vendedor_id: h.vendedorId,
          tipo_contato: h.tipoContato,
          mensagem_enviada: h.mensagemEnviada || null,
        });
      if (error) throw error;
    },
  });
}

export function mapCompraRow(row: any): Compra {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    dataCompra: row.data_compra,
    produtos: row.produtos || undefined,
    valor: row.valor ?? undefined,
    notaCupom: row.nota_cupom || undefined,
    createdAt: row.created_at,
  };
}

export function useCompras(clienteId?: string) {
  return useQuery({
    queryKey: ['compras', clienteId],
    queryFn: async () => {
      let query = supabase.from('compras').select('*').order('data_compra', { ascending: false });
      if (clienteId) {
        query = query.eq('cliente_id', clienteId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapCompraRow);
    },
  });
}

export function useAddCompra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (compra: Omit<Compra, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('compras')
        .insert({
          cliente_id: compra.clienteId,
          data_compra: compra.dataCompra,
          produtos: compra.produtos || null,
          valor: compra.valor ?? null,
          nota_cupom: compra.notaCupom || null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapCompraRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['compras'] }),
  });
}
