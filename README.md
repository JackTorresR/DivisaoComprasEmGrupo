# 🛒 Divisor de Compras

Aplicação React que organiza as compras de uma viagem em grupo e distribui os produtos entre as pessoas de forma equilibrada.

Agora o app é **multiusuário**: qualquer pessoa pode criar uma conta, montar uma lista de compras e compartilhar um link único (por exemplo `seusite.com/mulungu-2026-09`) com o grupo. Quem recebe o link consegue **ver a divisão em tempo real e baixar as imagens**, mas só quem criou a lista pode editar. Os dados ficam salvos no **Firebase** (Firestore + Authentication), então não dependem mais do navegador de um único aparelho.

## ✨ Funcionalidades

- 👤 **Contas de usuário** (e-mail e senha) via Firebase Authentication.
- 🔗 **Listas por link (slug)**: ao criar uma lista você escolhe um nome (ex.: "Mulungu 2026-09") e o app gera um link único, tipo `/mulungu-2026-09`.
- 👀 **Modo somente leitura**: qualquer pessoa com o link vê a divisão, a lista de compras e pode baixar/copiar as imagens — mas não vê os formulários de edição. Só o dono da lista edita.
- ☁️ **Sincronização em tempo real**: enquanto o dono edita, quem está com a página aberta vê a distribuição atualizar sozinha (Firestore `onSnapshot`).
- 🧮 Cadastro de pessoas e produtos (nome, quantidade, preço unitário e embalagem opcional).
- 📊 Valor total, média por pessoa e diferença de cada pessoa em relação à média.
- 🔍 Busca de produtos e filtro por vínculo, além de filtro por nome/faixa na distribuição.
- 🖼️ Botão **Gerar imagem** por pessoa: prévia do card, download em PNG ou cópia da imagem (Canvas, sem bibliotecas externas).
- 🌙 Tema escuro por padrão.
- 🔒 Vínculo prévio de unidades de um produto a uma pessoa.
- ⚙️ Distribuição automática otimizada, calculada em um Web Worker (não trava a interface).
- ✍️ Ajuste manual do responsável por qualquer unidade (só o dono).
- 🧾 Lista de compras separada da distribuição, com cópia para WhatsApp.
- 📱 Layout responsivo (desktop, tablet e celular).

## 🧰 Requisitos

- Node.js **20.20.1** (há um `.nvmrc`; com nvm basta `nvm use`).
- npm 10 ou superior.
- Uma conta Google gratuita para criar o projeto no [Firebase](https://console.firebase.google.com/).

## 🔥 Configurando o Firebase (passo a passo)

O plano gratuito ("Spark") do Firebase é suficiente para esse projeto.

### 1. Criar o projeto

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em **Adicionar projeto**.
2. Dê um nome ao projeto (ex.: `divisor-de-compras`) e siga o assistente até o fim. Não é necessário ativar o Google Analytics.

### 2. Ativar a Authentication

1. No menu lateral, vá em **Build → Authentication** e clique em **Get started**.
2. Na aba **Sign-in method**, ative o provedor **E-mail/senha**.

### 3. Criar o Firestore Database

1. No menu lateral, vá em **Build → Firestore Database** e clique em **Criar banco de dados**.
2. Escolha o modo de produção ("Iniciar em modo de produção") e a região mais próxima de você.
3. Depois de criado, vá na aba **Regras** e cole o conteúdo do arquivo [`firestore.rules`](./firestore.rules) deste projeto. Ele garante que:
   - **Qualquer pessoa pode ler** uma lista (para funcionar o link público).
   - **Só quem está logado e é o dono** (`ownerId`) pode criar, editar ou apagar a própria lista.
   - A área privada `users/{uid}/trips` (usada para listar "minhas listas") só pode ser lida/escrita pelo próprio dono.

### 4. Pegar as credenciais do app Web

1. No Console, clique na engrenagem ⚙️ ao lado de "Visão geral do projeto" → **Configurações do projeto**.
2. Em **Seus apps**, clique no ícone **`</>`** (Web) para registrar um novo app. Não precisa marcar Hosting agora.
3. Copie os valores mostrados em `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

### 5. Preencher as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os valores do passo anterior:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=coloque-aqui
VITE_FIREBASE_AUTH_DOMAIN=coloque-aqui
VITE_FIREBASE_PROJECT_ID=coloque-aqui
VITE_FIREBASE_STORAGE_BUCKET=coloque-aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=coloque-aqui
VITE_FIREBASE_APP_ID=coloque-aqui
```

> ⚠️ O arquivo `.env` **não** deve ser commitado — ele já está no `.gitignore`. As chaves do Firebase Web não são secretas por natureza (ficam visíveis no navegador de qualquer usuário), mas quem protege seus dados de verdade são as **Regras do Firestore**, então não pule o passo 3.

## 💻 Instalação e execução local

```bash
npm install
npm run dev
```

Outros comandos:

```bash
npm run build       # typecheck + build de produção em dist/
npm run preview     # serve o build localmente
npm run typecheck   # apenas verificação de tipos
npm test            # testes do domínio (dinheiro, validações e algoritmo)
```

## 🚀 Publicando no Firebase Hosting (recomendado)

O Firebase Hosting é gratuito para esse volume de uso e já vem configurado neste projeto (`firebase.json`).

1. Instale a CLI do Firebase (uma vez só na sua máquina):

   ```bash
   npm install -g firebase-tools
   ```

2. Faça login e conecte a CLI ao seu projeto:

   ```bash
   firebase login
   ```

3. Edite o arquivo [`.firebaserc`](./.firebaserc) e troque `SEU_PROJECT_ID_AQUI` pelo ID do seu projeto Firebase (aparece nas Configurações do projeto, no Console).

4. Publique as regras do Firestore:

   ```bash
   firebase deploy --only firestore:rules
   ```

5. Gere o build de produção e publique o site:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

6. Pronto! A CLI mostra a URL final, algo como `https://seu-projeto.web.app`. É esse domínio que você vai compartilhar, por exemplo `https://seu-projeto.web.app/mulungu-2026-09`.

Sempre que quiser atualizar o site depois de mudar o código, repita os passos 5 (build + deploy).

### Outras opções de hospedagem

O app usa rotas por caminho (`/slug`), então **qualquer host precisa redirecionar todas as rotas para `index.html`** (SPA rewrite) — não é mais possível hospedar em um GitHub Pages simples sem esse ajuste. Se preferir outro host gratuito:

- **Vercel/Netlify**: funcionam bem, mas você precisa adicionar um rewrite equivalente (`vercel.json` com `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`, ou `_redirects` com `/*  /index.html  200` na Netlify) e configurar as mesmas variáveis `VITE_FIREBASE_*` no painel de ambiente do host.
- As regras do Firestore continuam sendo publicadas pela CLI do Firebase (`firebase deploy --only firestore:rules`), independente de onde o site está hospedado.

## 🧭 Como usar

1. Abra o site e **crie uma conta** (e-mail e senha).
2. Escolha um **nome para a lista** (ex.: "Mulungu 2026-09") — o app gera o link `/mulungu-2026-09` automaticamente.
3. Cadastre as **pessoas** (ou clique em **Carregar exemplo**) e os **produtos**. Para fixar unidades em alguém, use **Vincular** na linha do produto.
4. Clique em **Calcular distribuição**.
5. Compartilhe o link mostrado na barra verde no topo da página. Quem abrir esse link vê tudo, mas só você (o dono) consegue editar.
6. Use **Copiar para WhatsApp**, **Copiar lista** ou **Gerar imagem** para compartilhar os resultados.

Ao alterar quantidade, preço, pessoas ou vínculos, a distribuição calculada é descartada e precisa ser refeita. Mudar apenas nomes ou embalagens não descarta.

## 🗂️ Estrutura do projeto

```text
src/
├── components/
│   ├── auth/           login/cadastro (AuthPanel) e menu do usuário (UserMenu)
│   ├── trip/            tela inicial (HomeScreen), criação/lista de listas, página da lista (TripPage),
│   │                    aviso de somente leitura e barra de compartilhamento do link
│   ├── people/          cadastro de pessoas
│   ├── products/        cadastro de produtos e vínculos
│   ├── summary/         painel de resumo (some o botão calcular em modo leitura)
│   ├── shopping-list/   lista de compras
│   ├── distribution/    distribuição, ajuste manual (só dono) e geração de imagem
│   └── common/          componentes visuais reutilizáveis
├── domain/
│   ├── money/           centavos: leitura, soma e formatação
│   ├── calculations/    unidades, resumo, agrupamentos e lista de compras
│   ├── validation/      regras de validação (pessoas, produtos, prontidão, slug do link)
│   ├── distribution/    algoritmo de distribuição e Web Worker
│   ├── example/         dados de exemplo
│   └── types.ts         tipos do domínio (Person, Product, TripData, etc.)
├── services/firebase/   configuração do Firebase, autenticação, repositório da lista (Firestore) e mensagens de erro
├── routing/             leitura do link (/slug) sem depender de bibliotecas de rota
├── hooks/               useAuth (sessão), useTrip (sincroniza a lista com o Firestore), useTripData, useDistributionCalculator
├── store/               estado global em memória (Zustand), hidratado a partir do Firestore
├── utils/               funções auxiliares
└── styles/              CSS puro (tokens, base, layout, componentes)
```

Os nomes no código estão em inglês; `calculateDistribution` corresponde ao `calcularDistribuicao` e `improveDistribution` ao `melhorarDistribuicao` da especificação original.

## 🔐 Como funciona a permissão de edição

- Cada lista é um documento em `trips/{slug}` no Firestore, guardando `ownerId` (o `uid` de quem criou).
- As **Regras do Firestore** (`firestore.rules`) permitem leitura pública do documento, mas só aceitam escrita se `request.auth.uid` for igual ao `ownerId` salvo. Isso é validado no servidor do Firebase, não só na interface — então não dá para "burlar" editando o HTML.
- Além do documento da lista, existe um espelho leve em `users/{uid}/trips/{slug}`, usado só para listar "minhas listas" na tela inicial sem precisar de índices compostos no Firestore.
- No app, o hook `useTrip` decide se você é o dono comparando seu usuário logado com o `ownerId` da lista; se não for, os formulários de edição simplesmente não aparecem (o servidor bloquearia mesmo que aparecessem).

## 💰 Valores monetários

Todo valor é guardado em **centavos inteiros**. Preços digitados ("12,50") são convertidos por texto, sem ponto flutuante, e só viram "R$ 12,50" na hora de exibir.

## 📐 Regras de distribuição

- Cada produto é expandido em **unidades individuais**. Duas unidades iguais podem ir para pessoas diferentes; uma unidade nunca é dividida.
- Unidades **vinculadas** ficam fixas com a pessoa escolhida e **contam no total dela**.
- A **média** é sempre `valor total ÷ número de pessoas`, considerando todas as pessoas e todos os produtos, inclusive os vinculados.
- Quem já está **acima da média** por vínculos voluntários não é compensado.
- Quem está **abaixo da média** por causa dos vínculos recebe o que falta para se aproximar dela.

## 🧠 Como o algoritmo funciona

O objetivo é minimizar a soma dos quadrados dos totais das pessoas, o que equivale a minimizar o desvio em relação à média. Todas as contas usam inteiros, sem erro de arredondamento.

1. **Solução inicial gulosa** (`greedy.ts`).
2. **Busca local exata por pares** (`improveDistribution.ts`/`rebalancePair.ts`), usando meet-in-the-middle (até 22 unidades) ou programação dinâmica (acima disso).
3. **Busca iterada** (`optimizeDistribution.ts`), com semente fixa, permitindo trocas entre 2 ou 3 pessoas.
4. **Parada** quando os totais diferem em no máximo 1 centavo, após muitas rodadas sem melhora, ou no limite de rodadas (`settings.ts`).

O resultado é **determinístico**: os mesmos dados sempre geram a mesma distribuição.

## ⚠️ Limitações conhecidas

- A otimização não é comprovadamente ótima em instâncias grandes; é uma heurística muito forte, verificada por força bruta apenas em casos pequenos.
- Todas as unidades de um mesmo produto têm o mesmo preço.
- A cópia de texto/imagem usa a API de área de transferência, disponível apenas em HTTPS ou `localhost`.
- Editar pessoas, quantidades, preços ou vínculos descarta a distribuição calculada.
- O nome do link (slug) não pode ser trocado depois de criado — se errar, crie uma lista nova.
- O plano gratuito do Firebase tem limites diários generosos, mas existem (veja [preços do Firebase](https://firebase.google.com/pricing)); para o uso de um grupo de amigos/família isso não costuma ser um problema.
