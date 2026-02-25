export interface Vendedor {
  id: string;
  nome: string;
  dataCadastro: string;
  ativo: boolean;
}

export interface Cliente {
  id: string;
  nomeCliente: string;
  telefone: string;
  email?: string;
  vendedorId: string;
  dataCadastro: string;
  nomeCrianca?: string;
  dataNascimentoCrianca?: string;
  observacoes?: string;
  primeiroContatoFeito: boolean;
  dataPrimeiroContato?: string;
  ultimoContato?: string;
  cupom10Enviado: boolean;
  dataCupom?: string;
  codigoCupom?: string;
}

export interface HistoricoContato {
  id: string;
  clienteId: string;
  vendedorId: string;
  dataContato: string;
  tipoContato: 'whatsapp' | 'telefone' | 'pessoalmente';
  mensagemEnviada?: string;
  respostaRecebida?: string;
  cupomGerado?: string;
}

export interface Lembrete {
  id: string;
  vendedorId: string;
  clienteId: string;
  tipoLembrete: 'aniversario' | 'follow_up' | 'dia_criancas';
  dataLembrete: string;
  mensagem: string;
  status: 'pendente' | 'feito';
}

export type UserRole = 'vendedor' | 'admin';

export interface AuthUser {
  id: string;
  nome: string;
  role: UserRole;
}
