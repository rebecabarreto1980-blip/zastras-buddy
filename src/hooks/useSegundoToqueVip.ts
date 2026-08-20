import { Cliente, HistoricoContato } from '@/lib/types';

const DIAS_ESPERA = 5;

function diasDesde(data: string): number {
  const diff = new Date().getTime() - new Date(data).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Trilha VIP: cliente Diamante que recebeu a Mensagem 1 da ADMIN há 5+ dias,
 * sem resposta e sem nenhum contato posterior do vendedor dono.
 */
export function precisaSegundoToqueVip(
  cliente: Cliente,
  historicos: HistoricoContato[],
  adminVendedorId?: string,
  vendedorId?: string
): boolean {
  if (cliente.segmento !== 'Diamante') return false;
  if (!adminVendedorId || !vendedorId) return false;

  const doCliente = historicos
    .filter(h => h.clienteId === cliente.id)
    .sort((a, b) => (a.dataContato < b.dataContato ? 1 : -1));

  const contatoAdmin = doCliente.find(h => h.vendedorId === adminVendedorId);
  if (!contatoAdmin) return false;
  if (contatoAdmin.respondeu === true) return false;
  if (diasDesde(contatoAdmin.dataContato) < DIAS_ESPERA) return false;

  const houveSegundoToque = doCliente.some(
    h => h.vendedorId === vendedorId && h.dataContato >= contatoAdmin.dataContato && h.id !== contatoAdmin.id
  );
  return !houveSegundoToque;
}
