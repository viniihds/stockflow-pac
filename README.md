# StockFlow

Sistema web de gestao de estoque para microempreendedores e pequenos comercios.

## Descricao curta

O projeto centraliza cadastro de produtos, controle de estoque, movimentacoes, precificacao, financeiro e base para relatorios operacionais.

## Problema atendido

Pequenos negocios costumam controlar estoque e movimentacoes de forma manual ou espalhada em planilhas, o que aumenta erro, perda de visibilidade e dificuldade de acompanhamento financeiro.

## Publico beneficiado

- microempreendedores
- pequenos comercios
- equipe de estoque
- financeiro
- gestores

## Objetivo do sistema

Permitir controle simples e confiavel de produtos e movimentacoes, com visao rapida do estoque e base para evolucao do financeiro e dos relatorios.

## Integrantes e responsabilidades principais

- Guilherme Tamanini: frontend e deploy
- Vinicius Henrique da Silva: comunicacao, repositorio, README, arquitetura, backend, banco de dados, backlog e cronograma

## Stack tecnologica

- Frontend: React
- Backend: Java com Spring Boot
- Banco de dados: PostgreSQL
- Testes: Vitest/Jest no frontend e JUnit no backend
- CI/CD: GitHub Actions
- Containerizacao: Docker
- Gestao de tarefas: Jira
- Prototipacao/design: Figma

## Arquitetura resumida

Arquitetura cliente-servidor em camadas, com:

- frontend React consumindo a API via HTTP
- backend Spring Boot como monolito modular expondo API REST
- banco relacional PostgreSQL
- ambiente local containerizado com Docker
- automacao de testes via GitHub Actions

O diagrama de apoio fica na pasta `docs/`.

## Estrutura atual

- `frontend/`: base visual da primeira tela do painel
- `frontend/preview.html`: mock estatico para abrir a tela sem dependencias
- `backend/`: esqueleto Spring Boot para evolucao da API
- `docker/postgres/`: banco PostgreSQL em container para o ambiente local
- `.github/workflows/tests.yml`: pipeline com testes do frontend e backend
- `docs/`: requisitos, riscos e material de apoio do produto

## Como subir o ambiente

### 1. Banco de dados

1. copie `docker/postgres/.env.example` para `docker/postgres/.env`
2. ajuste as credenciais se quiser
3. rode:

```bash
cd docker/postgres
docker compose up -d
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

O backend sobe em `http://localhost:8080` e exibe `GET /api/health`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

### 4. Testes

Frontend:

```bash
cd frontend
npm test
```

Backend:

```bash
cd backend
mvn test
```

## O que precisa ter no computador

- `Git`
- `Node.js 20+` e `npm`
- `Java 21`
- `Maven 3.9+`
- `Docker Desktop` ou `Docker Engine` com `docker compose`

## Variaveis de ambiente esperadas

As variaveis usadas no ambiente local do banco ficam em `docker/postgres/.env`.

Padrao atual:

- `POSTGRES_DB=stockflow`
- `POSTGRES_USER=stockflow`
- `POSTGRES_PASSWORD=stockflow`
- `POSTGRES_PORT=5432`

## Definicao do MVP

Uma aplicacao web capaz de centralizar o cadastro e controle basico de produtos e movimentacoes de estoque, permitindo que um pequeno negocio acompanhe de forma simples a situacao atual do seu estoque.

### Fluxo principal do MVP

Dashboard -> cadastro de produto -> produto disponivel no estoque -> registrar entrada/saida -> estoque atualizado -> consultar situacao do estoque

### Funcionalidades incluidas no MVP

- gestao de produtos
- gestao de categorias
- controle de estoque
- dashboard basico
- controle de movimentacoes
- gestao financeira basica

### Funcionalidades fora do MVP

- geracao de relatorios completos

### Como sera demonstrado

Atravessando o fluxo principal, acessando o dashboard, cadastrando categorias e produtos, registrando entrada e saida de produtos e mostrando o impacto no estoque e no financeiro.

## Backlog inicial

Link do Jira: [StockFlow PAC - Backlog](https://stockflowpac.atlassian.net/jira/software/projects/KAN/list?jql=project%20%3D%20KAN%20ORDER%20BY%20cf%5B10019%5D%20ASC)

## Cronograma resumido

- 10/08 a 24/08: fundacao do projeto, repositorio, commits iniciais e artefatos do checkpoint
- 24/08 a 07/09: modelagem do banco e CRUD de categoria e produtos
- 07/09 a 21/09: registro de movimentacoes no estoque e financeiro
- 21/09 a 05/10: frontend completo da aplicacao
- 05/10 a 19/10: finalizar fluxo completo da aplicacao
- 19/10 a 02/11: qualidade e automacao com CI/CD
- 02/11 a 16/11: finalizacao e entrega do MVP

## Riscos principais

- atraso no desenvolvimento
- problemas de integracao na aplicacao
- bugs proximos a entrega

## Instrucoes de instalacao e execucao local

1. subir o PostgreSQL com `docker compose up -d` dentro de `docker/postgres`
2. subir o backend com `mvn spring-boot:run` dentro de `backend`
3. subir o frontend com `npm install` e `npm run dev` dentro de `frontend`

## Evidencias atuais

- commit/push inicial registrado em `docs/StockFlowActivity1.pdf`
- frontend iniciado com tela de home
- backend iniciado com endpoint de health
- testes de exemplo adicionados para frontend e backend
- banco local preparado via Docker

## Proximos passos

- conectar frontend e backend
- expandir cadastro de produtos, categorias e movimentacoes
- detalhar persistencia e validacoes
- completar relatorios e financeiro
