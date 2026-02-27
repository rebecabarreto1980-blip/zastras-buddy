import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vendedor } from '@/lib/types';

function mapRow(row: any): Vendedor {
  return {
    id: row.id,
    nome: row.nome,
    dataCadastro: row.data_cadastro,
    ativo: row.ativo,
  };
}

export function useVendedores() {
  return useQuery({
    queryKey: ['vendedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendedores')
        .select('*')
        .order('nome');
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useAddVendedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string) => {
      const { data, error } = await supabase
        .from('vendedores')
        .insert({ nome })
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendedores'] }),
  });
}

export function useRemoveVendedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vendedores')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendedores'] }),
  });
}
