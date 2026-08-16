import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HistoricoContato } from '@/lib/types';

export function mapHistoricoRow(row: any): HistoricoContato {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    vendedorId: row.vendedor_id || '',
    dataContato: row.data_contato,
    tipoContato: row.tipo_contato,
    mensagemEnviada: row.mensagem_enviada || undefined,
    respostaRecebida: row.resposta_recebida || undefined,
    cupomGerado: row.cupom_gerado || undefined,
    respondeu: row.respondeu ?? null,
  };
}

export function useHistoricos(clienteId?: string) {
  return useQuery({
    queryKey: ['historico', clienteId ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('historico_contatos')
        .select('*')
        .order('data_contato', { ascending: false });
      if (clienteId) query = query.eq('cliente_id', clienteId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapHistoricoRow);
    },
  });
}

export function useMarcarRespondido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('historico_contatos')
        .update({ respondeu: true } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['historico'] }),
  });
}

export function useRegistrarContato() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h: { clienteId: string; vendedorId?: string | null; tipoContato?: string; mensagemEnviada?: string }) => {
      const { error } = await supabase.from('historico_contatos').insert({
        cliente_id: h.clienteId,
        vendedor_id: h.vendedorId || null,
        tipo_contato: h.tipoContato || 'whatsapp',
        mensagem_enviada: h.mensagemEnviada || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['historico'] }),
  });
}

/** Considerar pausar contato: os 2 contatos mais recentes sem resposta e nenhum mais recente respondido. */
export function devePausarContato(historicos: HistoricoContato[]): boolean {
  const ordenados = [...historicos].sort((a, b) => (a.dataContato < b.dataContato ? 1 : -1));
  if (ordenados.length < 2) return false;
  return ordenados.slice(0, 2).every(h => h.respondeu !== true);
}
