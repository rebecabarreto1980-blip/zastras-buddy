import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vendedor } from '@/lib/types';

function mapRow(row: any): Vendedor {
  return {
    id: row.id,
    nome: row.nome,
    dataCadastro: row.data_cadastro,
    ativo: row.ativo,
    role: row.role || 'vendedor',
    emailAuth: row.email_auth || undefined,
    authUserId: row.auth_user_id || undefined,
  };
}

/** Lista pública (usada na tela de login) — apenas colunas liberadas para anônimos. */
export function useVendedoresLogin() {
  return useQuery({
    queryKey: ['vendedores-login'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendedores')
        .select('id, nome, role, email_auth, ativo')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return (data || []).map((r: any) => ({
        id: r.id,
        nome: r.nome,
        dataCadastro: '',
        ativo: r.ativo,
        role: (r.role || 'vendedor') as Vendedor['role'],
        emailAuth: r.email_auth || undefined,
      })) as Vendedor[];
    },
  });
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
