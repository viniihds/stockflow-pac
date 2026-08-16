# stockflow-pac

Projeto inicial do sistema de gestao de estoque descrito em `docs/`.

## Estrutura atual

- `frontend/`: base visual da primeira tela do painel
- `frontend/preview.html`: mock estatico para abrir a tela sem dependencias
- `backend/`: esqueleto Spring Boot para evolucao da API
- `docker/postgres/`: banco PostgreSQL em container para o ambiente local
- `.github/workflows/tests.yml`: pipeline com testes do frontend e backend
- `docs/`: requisitos, riscos e material de apoio do produto

## O que foi iniciado

- leitura dos documentos de requisitos e risco
- primeira tela do frontend com foco em dashboard operacional
- backend inicial com endpoint de saude
- preview estatico em `frontend/preview.html` para abrir direto no navegador
- testes de exemplo para frontend e backend
- docker compose do PostgreSQL para o ambiente local

## O que precisa ter no computador

- `Git`
- `Node.js 20+` e `npm`
- `Java 21`
- `Maven 3.9+`
- `Docker Desktop` ou `Docker Engine` com `docker compose`

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

## Proximo passo tecnico

- conectar a tela inicial aos dados reais
- detalhar cadastro de produtos, categorias, movimentacoes e relatorios
- adicionar persistencia, autenticacao e integracoes quando o escopo entrar na fase funcional
