import { Vendedor, Cliente, HistoricoContato, Lembrete } from './types';
import { vendedoresIniciais, clientesIniciais, lembretesIniciais } from './mockData';

const KEYS = {
  vendedores: 'zastras_vendedores',
  clientes: 'zastras_clientes',
  historico: 'zastras_historico',
  lembretes: 'zastras_lembretes',
};

function get<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Vendedores
export function getVendedores(): Vendedor[] {
  return get<Vendedor>(KEYS.vendedores, vendedoresIniciais);
}
export function saveVendedores(v: Vendedor[]) { set(KEYS.vendedores, v); }
export function addVendedor(nome: string): Vendedor {
  const vendedores = getVendedores();
  const novo: Vendedor = { id: `v${Date.now()}`, nome, dataCadastro: new Date().toISOString().split('T')[0], ativo: true };
  vendedores.push(novo);
  saveVendedores(vendedores);
  return novo;
}
export function removeVendedor(id: string) {
  saveVendedores(getVendedores().filter(v => v.id !== id));
}
export function updateVendedor(id: string, data: Partial<Vendedor>) {
  const vendedores = getVendedores().map(v => v.id === id ? { ...v, ...data } : v);
  saveVendedores(vendedores);
}

// Clientes
export function getClientes(): Cliente[] {
  return get<Cliente>(KEYS.clientes, clientesIniciais);
}
export function saveClientes(c: Cliente[]) { set(KEYS.clientes, c); }
export function getClientesByVendedor(vendedorId: string): Cliente[] {
  return getClientes().filter(c => c.vendedorId === vendedorId);
}
export function addCliente(cliente: Omit<Cliente, 'id' | 'dataCadastro'>): Cliente {
  const clientes = getClientes();
  const novo: Cliente = { ...cliente, id: `c${Date.now()}`, dataCadastro: new Date().toISOString().split('T')[0] };
  clientes.push(novo);
  saveClientes(clientes);
  return novo;
}
export function updateCliente(id: string, data: Partial<Cliente>) {
  const clientes = getClientes().map(c => c.id === id ? { ...c, ...data } : c);
  saveClientes(clientes);
}
export function deleteCliente(id: string) {
  saveClientes(getClientes().filter(c => c.id !== id));
}

// Historico
export function getHistorico(): HistoricoContato[] {
  return get<HistoricoContato>(KEYS.historico, []);
}
export function addHistorico(h: Omit<HistoricoContato, 'id'>): HistoricoContato {
  const historico = getHistorico();
  const novo: HistoricoContato = { ...h, id: `h${Date.now()}` };
  historico.push(novo);
  set(KEYS.historico, historico);
  return novo;
}

// Lembretes
export function getLembretes(): Lembrete[] {
  return get<Lembrete>(KEYS.lembretes, lembretesIniciais);
}
export function saveLembretes(l: Lembrete[]) { set(KEYS.lembretes, l); }
export function updateLembrete(id: string, data: Partial<Lembrete>) {
  const lembretes = getLembretes().map(l => l.id === id ? { ...l, ...data } : l);
  saveLembretes(lembretes);
}

// Cupom
export function gerarCupom(nomeCrianca: string): string {
  const nome = nomeCrianca.toUpperCase().replace(/\s/g, '');
  return `ZASTRAS10_${nome}`;
}

// WhatsApp
export function getWhatsAppLink(telefone: string, mensagem: string): string {
  const phone = telefone.replace(/\D/g, '');
  const fullPhone = phone.startsWith('55') ? phone : `55${phone}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(mensagem)}`;
}

// Message templates
export function getMensagem1(nome: string): string {
  return `Olá ${nome}! Aqui é da ZASTRAS ❤️ Passando para agradecer pela compra! Esperamos que o presente traga muita alegria 🎁 Ah, e não esquece de seguir nosso Instagram @zastras.cidadejardim para ficar por dentro das novidades! Volte sempre! 💫`;
}
export function getMensagem2(nome: string): string {
  return `Oi ${nome}, aqui é da ZASTRAS! ❤️ A gente adorou ter você por aqui e queremos fazer uma surpresa especial para a criança que ganhou o presente! 🎁 Se você compartilhar com a gente:\n• Nome da criança 👧🧒\n• Data de aniversário 📅\nA gente te dá 10% de desconto na próxima compra! 🎉\nPode responder aqui por áudio mesmo – a gente escuta e já cadastra.\nAssim a gente manda uma mensagem personalizada no aniversário, com uma lembrança especial da ZASTRAS ✨\nE claro, conta pra gente: a criança gostou do presente? 😊\nÉ só responder que já te mandamos o cupom de 10%!\nBeijos, equipe ZASTRAS ❤️`;
}
export function getMensagem3(nomeCliente: string, nomeCrianca: string): string {
  return `Feliz aniversário, ${nomeCrianca}! 🎉🎂\n${nomeCliente}, passando aqui para desejar um dia maravilhoso! Que seja um ano cheio de descobertas e brincadeiras incríveis ✨\nTemos novidades na loja que vai amar! Quer dar uma olhadinha? 🎁\nCom carinho, equipe ZASTRAS ❤️`;
}
export function getMensagem4(nomeCliente: string, nomeCrianca?: string): string {
  const crianca = nomeCrianca ? `Para o ${nomeCrianca}, preparamos` : 'Preparamos';
  return `Oi ${nomeCliente}! ❤️ O Dia das Crianças está chegando! 🎉\nE claro que a ZASTRAS não podia deixar passar.\n${crianca} seleções especiais de brinquedos e livros educativos!\nQuer passar na loja ou quer que eu envie fotos das novidades?\nBeijos, equipe ZASTRAS ❤️`;
}
export function getMensagem5(nomeCliente: string, nomeCrianca: string, cupom: string): string {
  return `Recebemos, ${nomeCliente}! ✅\nDados do ${nomeCrianca} cadastrados com sucesso!\nAqui está seu cupom de 10%: ${cupom}\nÉ só mostrar no caixa da loja! 🎁\nBeijos, equipe ZASTRAS ❤️`;
}
export function getMensagemDesconto(nomeVendedor: string): string {
  return `Olá, tudo bem?\n\nAqui é ${nomeVendedor} da Zastras do Shopping Cidade Jardim.\n\nQueria saber se o presente que você escolheu fez sucesso por aí 😊\n\nQuando estiver pelo shopping, passe no quiosque para ver as novidades, sempre temos coisas bem legais chegando por aqui.\n\nAté o fim de março, nossos clientes que retornarem ganham 10% de desconto.\n\nE, se for mais fácil, também temos delivery.\n\nSerá um prazer receber você por aqui! ✨`;
}

// Helpers
export function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function diasDesdeContato(ultimoContato?: string): number | null {
  if (!ultimoContato) return null;
  const diff = new Date().getTime() - new Date(ultimoContato).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isAniversarioProximo(dataNascimento?: string, dias: number = 7): boolean {
  if (!dataNascimento) return false;
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  const aniversarioEsteAno = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
  if (aniversarioEsteAno < hoje) {
    aniversarioEsteAno.setFullYear(hoje.getFullYear() + 1);
  }
  const diff = aniversarioEsteAno.getTime() - hoje.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) <= dias;
}

export function isAniversarioHoje(dataNascimento?: string): boolean {
  if (!dataNascimento) return false;
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  return hoje.getMonth() === nasc.getMonth() && hoje.getDate() === nasc.getDate();
}

export function formatarTelefone(tel: string): string {
  const nums = tel.replace(/\D/g, '');
  if (nums.length === 11) return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  if (nums.length === 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
  return tel;
}
