# Divisor de Compras

Aplicação React que organiza as compras de uma viagem em grupo e distribui os produtos entre as pessoas de forma equilibrada. Roda 100% no navegador, sem backend, sem banco de dados e sem chamadas externas.

## Funcionalidades

- Cadastro, edição e remoção de pessoas e de produtos (nome, quantidade, preço unitário e embalagem opcional).
- Valor total, total de produtos, média por pessoa e diferença de cada pessoa em relação à média.
- Busca de produtos (ignora acentos e maiúsculas, procura no nome e na embalagem) e filtro por vínculo (todos, com vínculo, sem vínculo). O filtro só afeta a lista da tela: a lista de compras e o cálculo continuam usando todos os produtos.
- Rolagem interna nas listas de pessoas, produtos (com cabeçalho fixo), lista de compras e distribuição, para os cards não crescerem sem limite.
- Filtro na distribuição: busca por nome (sem diferenciar acentos) e seletor Todos, Acima da média e Abaixo da média.
- Botão **Gerar imagem** em cada pessoa da distribuição: mostra uma prévia do card e permite baixar o PNG ou copiar a imagem. A imagem é desenhada localmente com Canvas, sem bibliotecas, usando as cores do tema.
- Tema escuro por padrão, com cores suaves para descansar a vista.
- Vínculo prévio de unidades de um produto a uma pessoa (por exemplo, "Jack leva 2 Papel higiênico").
- Distribuição automática com otimização, executada em um Web Worker (a interface não trava e mostra o progresso).
- Ajuste manual do responsável por qualquer unidade, com totais atualizados na hora e sem refazer o cálculo.
- Lista de compras separada da distribuição.
- Cópia para WhatsApp da distribuição completa ou somente da lista de compras.
- Dados de exemplo, persistência automática em `localStorage` (via Zustand) e botão para limpar tudo, com confirmação.
- Layout responsivo (desktop, tablet e celular).

## Requisitos

- Node.js **20.20.1** (há um arquivo `.nvmrc`; com nvm basta executar `nvm use`).
- npm 10 ou superior.

## Instalação e execução local

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

## Publicação no GitHub Pages

O projeto usa `base: './'` no `vite.config.ts`, então funciona em qualquer nome de repositório sem configuração extra.

Com GitHub Actions (recomendado, já incluso em `.github/workflows/deploy.yml`):

1. Envie o código para um repositório no GitHub, na branch `main`.
2. Em **Settings → Pages**, escolha **Source: GitHub Actions**.
3. A cada `git push` na `main`, o workflow instala as dependências com Node 20.20.1, roda os testes, gera o build e publica a pasta `dist`.

Publicação manual, sem Actions: rode `npm run build` e publique o conteúdo de `dist/` na branch `gh-pages` (ou em outra fonte configurada em Settings → Pages).

## Como usar

1. Cadastre as **pessoas** (ou clique em **Carregar exemplo**).
2. Cadastre os **produtos** com quantidade e preço unitário. Para fixar unidades em alguém, use **Vincular** na linha do produto.
3. Clique em **Calcular distribuição**. O cálculo pode levar alguns segundos, e isso é intencional: o algoritmo faz várias rodadas de otimização.
4. Confira os cartões por pessoa, os produtos previamente vinculados e, se quiser, altere manualmente em **Ajustar manualmente**.
5. Use **Copiar para WhatsApp** ou **Copiar lista** para compartilhar.

Ao alterar quantidade, preço, pessoas ou vínculos, a distribuição calculada é descartada e precisa ser refeita, pois deixaria de refletir os dados. Mudar apenas nomes ou embalagens não descarta.

## Estrutura do projeto

```text
src/
├── components/        componentes visuais (people, products, summary, shopping-list, distribution, common)
├── domain/
│   ├── money/         centavos: leitura, soma e formatação
│   ├── calculations/  unidades, resumo, agrupamentos e lista de compras
│   ├── validation/    regras de validação dos formulários
│   ├── distribution/  algoritmo de distribuição e Web Worker
│   └── example/       dados de exemplo
├── hooks/             useTripData e useDistributionCalculator
├── services/storage/  configuração do localStorage
├── store/             estado global (Zustand + persist)
├── utils/             funções auxiliares
└── styles/            CSS puro (tokens, base, layout, componentes)
```

Os nomes no código estão em inglês; `calculateDistribution` corresponde ao `calcularDistribuicao` e `improveDistribution` ao `melhorarDistribuicao` da especificação.

## Valores monetários

Todo valor é guardado em **centavos inteiros**. Preços digitados ("12,50") são convertidos por texto, sem ponto flutuante, e só viram "R$ 12,50" na hora de exibir. Somas e comparações do algoritmo usam apenas inteiros, então nunca aparece algo como `R$ 15,299999`.

## Regras de distribuição

- Cada produto é expandido em **unidades individuais**. Duas unidades iguais podem ir para pessoas diferentes; uma unidade nunca é dividida.
- Unidades **vinculadas** ficam fixas com a pessoa escolhida, não entram na distribuição automática e **contam no total dela**.
- A **média** é sempre `valor total ÷ número de pessoas`, considerando todas as pessoas e todos os produtos, inclusive os vinculados. Ela não muda por causa de vínculos.
- Quem já está **acima da média** por vínculos voluntários não é compensado: nada é retirado dessa pessoa, e o algoritmo tende a não lhe dar mais nada, distribuindo o restante entre as demais.
- Quem está **abaixo da média** por causa dos vínculos recebe o que falta para se aproximar dela.
- Diferença exibida = total da pessoa − média (arredondada para centavos).

## Como o algoritmo funciona

O objetivo é minimizar a soma dos quadrados dos totais das pessoas. Como a soma de todos os totais é fixa, isso equivale a minimizar o desvio em relação à média, penalizando fortemente quem fica muito longe dela. Todas as contas são feitas com inteiros, sem erro de arredondamento.

1. **Solução inicial gulosa** (`greedy.ts`): unidades livres ordenadas da mais cara para a mais barata, cada uma indo para quem tem o menor total naquele momento (começando pelos totais dos vínculos). Empates são resolvidos pela ordem de cadastro.
2. **Busca local exata por pares** (`improveDistribution.ts` e `rebalancePair.ts`): para cada par de pessoas, junta as unidades livres das duas e encontra a **melhor divisão possível** entre elas (problema da soma de subconjuntos). Se a nova divisão reduz o custo, ela é aplicada. Repete até nenhum par melhorar.
   - Até 22 unidades no par: _meet-in-the-middle_ (exato, `meetInTheMiddle.ts`).
   - Acima disso: programação dinâmica sobre os centavos (exata, `dynamicProgramming.ts`).
3. **Busca iterada** (`optimizeDistribution.ts`): repetidamente embaralha as unidades de 2 ou 3 pessoas, escolhidas por um gerador pseudoaleatório com semente fixa, e refaz a busca local. Só aceita resultados iguais ou melhores. Isso permite trocas entre três pessoas, que a busca por pares não enxerga.
4. **Parada**: quando todos os totais diferem em no máximo 1 centavo (ótimo garantido), após muitas rodadas sem melhora, ou no limite de rodadas (`settings.ts`).

O resultado é **determinístico**: os mesmos dados sempre geram a mesma distribuição, porque a semente é fixa e todos os desempates seguem a ordem de cadastro.

Nos testes automatizados, o algoritmo é comparado com força bruta em instâncias pequenas (incluindo vínculos) e encontra o ótimo global em todas elas. Em cenários maiores, as diferenças ficam tipicamente em 1 a 4 centavos.

## Limitações conhecidas

- A otimização não é comprovadamente ótima em instâncias grandes; é uma heurística muito forte, verificada por força bruta apenas em casos pequenos.
- Todas as unidades de um mesmo produto têm o mesmo preço; não há preços diferentes por unidade.
- Os dados ficam no navegador atual. Limpar os dados do navegador ou trocar de aparelho apaga tudo; use "Copiar para WhatsApp" como registro.
- A cópia usa a API de área de transferência, disponível apenas em HTTPS ou `localhost`.
- Editar pessoas, quantidades, preços ou vínculos descarta a distribuição calculada; ajustes manuais são perdidos ao recalcular.
