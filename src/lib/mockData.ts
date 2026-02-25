import { Vendedor, Cliente, Lembrete } from './types';

export const vendedoresIniciais: Vendedor[] = [
  { id: 'v1', nome: 'Ana', dataCadastro: '2024-01-15', ativo: true },
  { id: 'v2', nome: 'Carla', dataCadastro: '2024-01-15', ativo: true },
  { id: 'v3', nome: 'João', dataCadastro: '2024-02-01', ativo: true },
  { id: 'v4', nome: 'Beatriz', dataCadastro: '2024-03-10', ativo: true },
];

const today = new Date().toISOString().split('T')[0];

export const clientesIniciais: Cliente[] = [
  // Carla's clients
  { id: 'c1', nomeCliente: 'Patrícia Santos', telefone: '11999998888', email: '', vendedorId: 'v2', dataCadastro: '2024-06-10', nomeCrianca: 'Pedro', dataNascimentoCrianca: '2021-05-12', observacoes: 'Cliente frequente, prefere brinquedos educativos', primeiroContatoFeito: true, dataPrimeiroContato: '2024-06-10', ultimoContato: '2024-11-20', cupom10Enviado: true, dataCupom: '2024-06-15', codigoCupom: 'ZASTRAS10_PEDRO' },
  { id: 'c2', nomeCliente: 'Ricardo Almeida', telefone: '11977776666', email: '', vendedorId: 'v2', dataCadastro: '2024-07-05', nomeCrianca: 'Lucas', dataNascimentoCrianca: '2019-08-23', observacoes: '', primeiroContatoFeito: true, dataPrimeiroContato: '2024-07-05', ultimoContato: '2024-12-01', cupom10Enviado: true, dataCupom: '2024-07-10', codigoCupom: 'ZASTRAS10_LUCAS' },
  { id: 'c3', nomeCliente: 'Fernanda Lima', telefone: '11966665555', email: '', vendedorId: 'v2', dataCadastro: '2024-08-20', nomeCrianca: 'Sofia', dataNascimentoCrianca: '2022-01-30', observacoes: 'Comprou para sobrinha', primeiroContatoFeito: true, dataPrimeiroContato: '2024-08-20', ultimoContato: '2024-10-15', cupom10Enviado: false },
  // Ana's clients
  { id: 'c4', nomeCliente: 'Mariana Costa', telefone: '11988887777', vendedorId: 'v1', dataCadastro: '2024-05-01', nomeCrianca: 'Isabela', dataNascimentoCrianca: '2020-03-15', primeiroContatoFeito: true, dataPrimeiroContato: '2024-05-01', ultimoContato: '2024-12-10', cupom10Enviado: true, dataCupom: '2024-05-05', codigoCupom: 'ZASTRAS10_ISABELA' },
  { id: 'c5', nomeCliente: 'Carlos Mendes', telefone: '11955554444', vendedorId: 'v1', dataCadastro: '2024-09-12', primeiroContatoFeito: true, dataPrimeiroContato: '2024-09-12', ultimoContato: '2024-11-05', cupom10Enviado: false },
  { id: 'c6', nomeCliente: 'Juliana Rocha', telefone: '11944443333', vendedorId: 'v1', dataCadastro: '2024-10-01', nomeCrianca: 'Miguel', dataNascimentoCrianca: '2023-02-28', primeiroContatoFeito: false, cupom10Enviado: false },
  // João's clients
  { id: 'c7', nomeCliente: 'Roberto Silva', telefone: '11933332222', vendedorId: 'v3', dataCadastro: '2024-04-15', nomeCrianca: 'Ana Clara', dataNascimentoCrianca: '2021-12-10', primeiroContatoFeito: true, dataPrimeiroContato: '2024-04-15', ultimoContato: '2024-12-15', cupom10Enviado: true, dataCupom: '2024-04-20', codigoCupom: 'ZASTRAS10_ANACLARA' },
  { id: 'c8', nomeCliente: 'Tatiana Oliveira', telefone: '11922221111', vendedorId: 'v3', dataCadastro: '2024-06-20', primeiroContatoFeito: true, dataPrimeiroContato: '2024-06-20', ultimoContato: '2024-09-30', cupom10Enviado: false },
  // Beatriz's clients
  { id: 'c9', nomeCliente: 'Amanda Ferreira', telefone: '11911110000', vendedorId: 'v4', dataCadastro: '2024-07-10', nomeCrianca: 'Theo', dataNascimentoCrianca: '2022-07-04', primeiroContatoFeito: true, dataPrimeiroContato: '2024-07-10', ultimoContato: '2024-11-25', cupom10Enviado: true, dataCupom: '2024-07-15', codigoCupom: 'ZASTRAS10_THEO' },
  { id: 'c10', nomeCliente: 'Paulo Henrique', telefone: '11900009999', vendedorId: 'v4', dataCadastro: '2024-11-01', primeiroContatoFeito: false, cupom10Enviado: false },
];

export const lembretesIniciais: Lembrete[] = [
  { id: 'l1', vendedorId: 'v2', clienteId: 'c1', tipoLembrete: 'aniversario', dataLembrete: '2025-05-12', mensagem: 'Aniversário do Pedro!', status: 'pendente' },
  { id: 'l2', vendedorId: 'v2', clienteId: 'c3', tipoLembrete: 'follow_up', dataLembrete: today, mensagem: 'Fernanda sem contato há 30+ dias', status: 'pendente' },
  { id: 'l3', vendedorId: 'v1', clienteId: 'c6', tipoLembrete: 'follow_up', dataLembrete: today, mensagem: 'Primeiro contato pendente com Juliana', status: 'pendente' },
];
