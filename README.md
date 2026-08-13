# Zastras Connect

Crie um CRM completo para minha loja ZASTRAS, unidade do Shopping Cidade Jardim. Minha loja vende BRINQUEDOS e LIVROS EDUCATIVOS.

## IDENTIDADE VISUAL:
- Nome da loja: ZASTRAS
- Segmento: Brinquedos e Livros Educativos
- Unidade: Shopping Cidade Jardim
- Logo: [farei upload depois]
- Cores principais: VERMELHO e ROXO (depois informarei os códigos exatos)
- Estilo: limpo, moderno, fácil de usar no celular

## FUNCIONALIDADES PRINCIPAIS:
1. Lista de clientes com nome, telefone, última compra
2. Botão do WhatsApp em cada cliente (abre conversa direto)
3. Registro de nome e data de nascimento das crianças
4. Campo para observações gerais
5. Registrar último contato
6. Busca rápida por nome ou telefone
7. Primeiro contato: marcar quando o cliente foi atendido pela primeira vez
8. Sistema de cupom de 10% para incentivar cadastro

## TELA DE LOGIN (SEM SENHA):

TELA DE ENTRADA - ZASTRAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[LOGO ZASTRAS]
Shopping Cidade Jardim

👋 Olá! Selecione seu nome para entrar:

┌─────────────────────────────┐
│ ▼ SELECIONE SEU NOME        │
│   Ana (vendedora)           │
│   Carla (vendedora)         │
│   João (vendedor)           │
│   Beatriz (vendedora)       │
│   Administrador             │
└─────────────────────────────┘

[ ENTRAR ]

──────────────────────────────
*Não precisa de senha, é só escolher seu nome

REGRAS:
- Se escolher um vendedor, entra e vê APENAS os clientes desse vendedor
- Se escolher "Administrador", entra e vê TODOS os clientes e relatórios
- A lista de vendedores é configurável pelo admin no painel

## ESTRUTURA DO BANCO DE DADOS:

Tabela: vendedores
- id (automático)
- nome (texto)
- data_cadastro
- ativo (verdadeiro/falso)

Tabela: clientes
- id (automático)
- nome_cliente (texto)
- telefone (texto)
- email (texto, opcional)
- vendedor_id (referência ao vendedor)
- data_cadastro (automática)
- nome_crianca (texto)
- data_nascimento_crianca (data)
- observacoes (texto longo)
- primeiro_contato_feito (verdadeiro/falso)
- data_primeiro_contato (data)
- ultimo_contato (data)
- cupom_10_enviado (verdadeiro/falso)
- data_cupom (data)
- codigo_cupom (texto)

Tabela: historico_contatos
- id (automático)
- cliente_id
- vendedor_id
- data_contato
- tipo_contato (whatsapp/telefone/pessoalmente)
- mensagem_enviada
- resposta_recebida
- cupom_gerado

Tabela: lembretes
- id (automático)
- vendedor_id
- cliente_id
- tipo_lembrete (aniversario/follow_up/dia_criancas)
- data_lembrete
- mensagem
- status (pendente/feito)

## FLUXO DE MENSAGENS:

MENSAGEM 1 - Pós-compra (agradecimento):
"Olá [Nome]! Aqui é da ZASTRAS 💜 Passando para agradecer pela compra! Esperamos que o presente traga muita alegria 🎁 Ah, e não esquece de seguir nosso Instagram @zastras para ficar por dentro das novidades! Volte sempre! 💫"

MENSAGEM 2 - Coleta de dados (com incentivo):
"Oi [Nome], aqui é da ZASTRAS! ❤️ A gente adorou ter você por aqui e queremos fazer uma surpresa especial para a criança que ganhou o presente! 🎁 Se você compartilhar com a gente: • Nome da criança 👧🧒 • Data de aniversário 📅 A gente te dá 10% de desconto na próxima compra! 🎉 Pode responder aqui por áudio mesmo – a gente escuta e já cadastra. Assim a gente manda uma mensagem personalizada no aniversário, com uma lembrança especial da ZASTRAS ✨ E claro, conta pra gente: a criança gostou do presente? 😊 É só responder que já te mandamos o cupom de 10%! Beijos, equipe ZASTRAS 💜"

MENSAGEM 3 - Aniversário da criança:
"Feliz aniversário, [NomeCriança]! 🎉🎂 [NomeCliente], passando aqui para desejar um dia maravilhoso para ele/ela! Que seja um ano cheio de descobertas e brincadeiras incríveis ✨ Temos novidades na loja que ele/ela vai amar! Quer dar uma olhadinha? 🎁 Com carinho, equipe ZASTRAS 💜"

MENSAGEM 4 - Dia das Crianças:
"Oi [NomeCliente]! 💜 O Dia das Crianças está chegando! 🎉 E claro que a ZASTRAS não podia deixar passar. Para o [NomeCriança], preparamos seleções especiais de brinquedos e livros educativos! Quer passar na loja ou quer que eu envie fotos das novidades? Beijos, equipe ZASTRAS 💜"

MENSAGEM 5 - Resposta com cupom:
"Recebemos, [NomeCliente]! ✅ Dados do [NomeCriança] cadastrados com sucesso! Aqui está seu cupom de 10%: [CUPOM] É só mostrar no caixa da loja! 🎁 Beijos, equipe ZASTRAS 💜"

## TELAS DO SISTEMA:

### TELA DE LOGIN (já descrita acima)

### TELA PRINCIPAL DO VENDEDOR:

Cabeçalho com:
- Logo ZASTRAS
- "Shopping Cidade Jardim"
- "Olá, [nome do vendedor] 👋"

ABA "RESPOSTAS PENDENTES" (destacada se tiver respostas):
- Lista de clientes que responderam WhatsApp
- Para cada resposta:
  * Nome do cliente
  * Horário da resposta
  * Prévia da mensagem (ou ícone 🎤 para áudio)
  * Botão "REGISTRAR DADOS"
  * Botão "OUVIR ÁUDIO" (quando tiver)
  * Botão "IGNORAR"

ABA "MEUS CLIENTES":
- Cards em grade (2 colunas no celular)
- Campo de busca no topo
- Botão flutuante "+" para adicionar novo cliente
- Cada card:
  * Nome do cliente
  * Telefone com ícone 💬 (abre WhatsApp)
  * Se tiver criança: "👦 [NomeCriança] - [Idade] anos"
  * Badge "✅" se primeiro contato feito
  * Badge "🆕" se primeiro contato pendente
  * Badge "🎂" se aniversário próximo
  * "Último contato: [X dias]"
  * Botão "Ver detalhes"

ABA "LEMBRETES":
- Seção "🎂 ANIVERSÁRIOS HOJE":
  * Lista de crianças que fazem aniversário hoje
  * Botão "ENVIAR MENSAGEM PRONTA" para cada
- Seção "⏰ FOLLOW-UP NECESSÁRIO":
  * Clientes sem contato há mais de 30 dias
  * Botão "ENVIAR WHATSAPP"
- Seção "🎁 DATAS ESPECIAIS PRÓXIMAS":
  * Dia das Crianças (outubro)
  * Natal
  * Botão "ENVIAR PARA TODOS"

### MODAL "REGISTRAR DADOS DA CRIANÇA":

Ao clicar em "REGISTRAR DADOS" em uma resposta:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   REGISTRAR DADOS DA CRIANÇA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cliente: [NomeCliente]
Telefone: [Telefone]

📝 RESPOSTA RECEBIDA:
"[mensagem ou ícone de áudio]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREENCHA OS DADOS:

Nome da criança: [_______________]

Data de nascimento: [ 📅 SELECIONAR DATA ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 CUPOM DE 10% SERÁ GERADO AUTOMATICAMENTE

[ ✅ CONFIRMAR E ENVIAR CUPOM ]
[ ❌ CANCELAR ]

### TELA DE DETALHES DO CLIENTE:

- Nome do cliente em destaque
- Telefone com botão WhatsApp

Seção "CRIANÇA":
- Nome da criança (editável)
- Data de nascimento (editável)
- Idade (calculada automaticamente)
- Botão "EDITAR"

Seção "PRIMEIRO CONTATO":
- Checkbox "Primeiro contato já foi realizado"
- Data do primeiro contato (se marcado)

Seção "ÚLTIMO CONTATO":
- Data
- Botão "REGISTRAR CONTATO AGORA"

Seção "OBSERVAÇÕES":
- Campo de texto livre
- Botão "SALVAR OBSERVAÇÕES"

Seção "CUPOM":
- Status: "Cupom enviado? Sim/Não"
- Código do cupom (se enviado)
- Data de envio

Botão "SALVAR ALTERAÇÕES" (no final)

### TELA DO ADMIN:

Cabeçalho: "Admin - Visão Geral"

Cards de resumo:
- Total de clientes: [XXX]
- Total de vendedores: [X]
- Clientes com criança cadastrada: [XX]
- Clientes pendentes de primeiro contato: [XX]

Seção "GERENCIAR VENDEDORES":
- Lista de vendedores com:
  * Nome
  * Quantidade de clientes
  * Progresso de primeiro contato (barra com %)
  * Botão "VER CLIENTES"
  * Botão "EDITAR"
  * Botão "REMOVER"
- Botão "+ ADICIONAR NOVO VENDEDOR" (só pede nome)

Seção "TODOS OS CLIENTES":
- Tabela com:
  * Nome do cliente
  * Telefone
  * Vendedor responsável
  * Nome da criança
  * Data de aniversário
  * Primeiro contato? (Sim/Não)
  * Cupom enviado? (Sim/Não)
  * Ações: 💬 (WhatsApp) e 👁️ (Ver detalhes)
- Busca e filtros no topo

## FUNCIONALIDADES AUTOMÁTICAS:

1. Ao cadastrar novo cliente:
   - Vincular automaticamente ao vendedor logado
   - Sugerir envio da Mensagem 1

2. Ao registrar dados da criança:
   - Gerar cupom único (ex: ZASTRAS10_NOMEDACRIANCA)
   - Enviar Mensagem 5 automaticamente
   - Criar lembrete de aniversário para a data

3. Todo dia ao abrir o sistema:
   - Mostrar lembretes de aniversários do dia
   - Mostrar clientes com mais de 30 dias sem contato
   - Mostrar respostas pendentes de WhatsApp

4. Cálculos automáticos:
   - Idade da criança baseada na data de nascimento
   - Dias desde último contato
   - Próximo aniversário

## EXEMPLO DE USO COMPLETO:

Cliente Patrícia compra presente:
1. Vendedor Carla está logada como "Carla"
2. Clica em "+" e cadastra: Patrícia, (11) 99999-8888
3. Sistema vincula automaticamente à Carla
4. Carla envia Mensagem 1 (agradecimento)
5. 3 dias depois, Carla envia Mensagem 2 (pedindo dados)
6. Patrícia responde: "Foi para o Pedro, ele faz 12/05" (áudio)
7. Na aba "Respostas Pendentes", Carla vê notificação
8. Carla clica em "REGISTRAR DADOS"
9. Preenche: nome "Pedro", data "12/05/2021"
10. Sistema envia cupom ZASTRAS10_PEDRO para Patrícia
11. No dia 12/05, sistema alerta Carla na aba "Lembretes"
12. Carla clica em "ENVIAR MENSAGEM PRONTA"
13. Mensagem 3 é enviada automaticamente com nome do Pedro
14. Patrícia volta na loja, usa cupom, compra mais

## IMPORTANTE:
- Design 100% responsivo (vendedores usam no celular)
- Botões grandes e fáceis de clicar
- Carregamento rápido (4G do shopping)
- Fluxo intuitivo, vendedor não pode se perder
- Login sem senha, só escolher o nome
- Prioridade máxima: registrar nome e data da criança rapidamente

## DADOS DE EXEMPLO PARA TESTE:

Vendedores:
- Ana (45 clientes)
- Carla (38 clientes)
- João (52 clientes)
- Beatriz (27 clientes)

Clientes da Carla:
- Patrícia Santos, (11) 99999-8888, filho Pedro (12/05/2021)
- Ricardo Almeida, (11) 97777-6666, filho Lucas (23/08/2019)
- Fernanda Lima, (11) 96666-5555, sobrinha Sofia (30/01/2022)

Por favor, crie esse sistema completo com todos os elementos descritos.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zastras-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80b63709-93bc-4ddb-9af1-5fc4848c946b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
