# Deploy do StockFlow (gratuito)

Arquitetura de producao:

```
Navegador -> Vercel (React) -> Render (Spring Boot, Docker) -> Neon (PostgreSQL)
```

Ordem: **Neon -> Render -> Vercel -> voltar no Render para liberar o CORS**.
Cada passo precisa de uma informacao do anterior; anote as URLs conforme avanca.

## Variaveis de ambiente

### Render (backend)

| Variavel | Valor | Obrigatoria |
|---|---|---|
| `POSTGRES_HOST` | host do Neon, ex.: `ep-xxxx.sa-east-1.aws.neon.tech` | sim |
| `POSTGRES_PORT` | `5432` | nao (padrao 5432) |
| `POSTGRES_DB` | nome do banco no Neon, ex.: `neondb` | sim |
| `POSTGRES_USER` | usuario do Neon | sim |
| `POSTGRES_PASSWORD` | senha do Neon | sim |
| `POSTGRES_SSLMODE` | `require` | sim (o Neon exige SSL) |
| `JWT_SECRET` | segredo em Base64 (gere com o comando abaixo) | **sim** (sem ele o app nao sobe em producao) |
| `CORS_ALLOWED_ORIGINS` | URL do front na Vercel, sem `/` no final | sim |
| `JWT_EXP_MINUTES` | minutos de validade do token | nao (padrao 60) |

Gerar o `JWT_SECRET` (precisa de Node instalado):

```
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

A porta nao precisa ser configurada: o Render define `PORT` e o app le essa variavel.

### Vercel (frontend)

| Variavel | Valor |
|---|---|
| `VITE_API_BASE` | URL do backend **com `/api`**, ex.: `https://stockflow-api.onrender.com/api` |

> O Vite grava essa variavel no momento do build. Se mudar o valor, faca um **Redeploy**.

## 1. Neon (banco)

1. Crie conta em neon.com e um projeto (ex.: `stockflow`).
2. Abra **Connect** / **Connection details** e anote host, database, user e password.
   Se o host tiver `-pooler`, desligue a opcao **Connection pooling** para obter o host direto
   (use o host direto no backend).
3. Recomendado: abra o **SQL Editor** do Neon, cole o conteudo de `docker/postgres/init.sql`
   e execute. Isso deixa o banco igual ao ambiente local. (Se pular este passo, o Hibernate
   cria as tabelas automaticamente na primeira subida.)

## 2. Render (backend)

1. Em render.com: **New -> Web Service** e conecte o repositorio do GitHub.
2. Configure:
   - **Root Directory:** `backend`
   - **Runtime / Language:** Docker (usa o `backend/Dockerfile`)
   - **Instance Type:** Free
   - **Health Check Path** (em Advanced): `/api/health`
3. Em **Environment**, cadastre as variaveis da tabela acima. Para `CORS_ALLOWED_ORIGINS`
   use um valor provisorio (ex.: `http://localhost:5173`); voce atualiza no passo 4.
4. **Create Web Service** e aguarde o build (alguns minutos).
5. Teste: `https://SEU-BACKEND.onrender.com/api/health` deve responder `{"status":"ok",...}`.

## 3. Vercel (frontend)

1. Em vercel.com: **Add New -> Project** e importe o mesmo repositorio.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - Build Command `npm run build` e Output Directory `dist` (padroes do Vite)
3. Em **Environment Variables**, crie `VITE_API_BASE` = `https://SEU-BACKEND.onrender.com/api`.
4. **Deploy** e anote a URL (ex.: `https://stockflow-pac.vercel.app`).

O arquivo `frontend/vercel.json` ja garante que recarregar paginas como `/products` nao de 404.

## 4. Fechar a integracao (CORS)

1. No Render, edite `CORS_ALLOWED_ORIGINS` para a URL da Vercel (sem `/` no final).
   Pode manter o localhost separando por virgula:
   `https://stockflow-pac.vercel.app,http://localhost:5173`
2. Salve; o Render faz redeploy sozinho.
3. Abra o site da Vercel, crie uma conta em **/register** e faca o fluxo completo.

## Antes de apresentar

- O backend gratuito do Render "dorme" apos 15 min sem uso; a primeira requisicao depois
  disso pode levar de 30 a 60 s. Abra `/api/health` uns 2 minutos antes da apresentacao.
- O banco do Neon tambem suspende quando ocioso e volta sozinho na primeira consulta.
- Faca o fluxo uma vez antes: categoria -> produto -> entrada/saida -> financeiro.

## Problemas comuns

| Sintoma | Causa provavel |
|---|---|
| Render falha com `Could not resolve placeholder 'JWT_SECRET'` | `JWT_SECRET` nao foi cadastrado |
| Render falha com erro de SSL / `no pg_hba.conf entry` | falta `POSTGRES_SSLMODE=require` |
| Render falha com `password authentication failed` | usuario ou senha do Neon errados |
| Deploy do Render fica em "port scan timeout" | confira se o Root Directory e `backend` e se o servico usa o Dockerfile |
| Erro de CORS no console do navegador | `CORS_ALLOWED_ORIGINS` diferente da URL real da Vercel (confira `https`, subdominio e se nao tem `/` no final) |
| Front chama `...vercel.app:8080/api` ou `localhost` | `VITE_API_BASE` nao definida ou definida depois do build: corrija e faca **Redeploy** |
| Requisicoes com `//` no caminho dao 400 | `VITE_API_BASE` com barra no final (o front ja remove, mas confira) |
| Primeiro acesso muito lento | cold start do plano gratuito (normal) |
