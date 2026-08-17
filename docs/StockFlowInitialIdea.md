# Gestão de estoque

# Objetivo do sistema:

Desenvolver um sistema de gestão de estoque que permita controlar produtos, entradas e saídas, preços, prazos de entrega, gestão financeira e geração de relatórios.

## Stakeholders:

- Administrador do sistema
- Equipe de estoque
- Financeiro
- Gestores

## Requisitos Funcionais:

- Cadastro de produtos
- Atualização de estoque (entrada/saída)
- Controle de preços
- Controle de prazos de entrega
- Gestão financeira (custos, lucros)
- Geração de relatórios (estoque, vendas, financeiro)

## Requisitos Não Funcionais:

- Interface responsiva (React)
- API REST com alta disponibilidade
- Segurança de dados (autenticação/autorização)
- Persistência com PostgreSQL
- Deploy via Docker
- Integração contínua com GitHub Actions

# Elicitação de Requisitos

## Técnicas Utilizadas

- Entrevistas com usuários
- Questionários
- Observação do processo atual
- Prototipação (wireframes no React)

## Principais Necessidades Identificadas

- Controle preciso de estoque em tempo real
- Redução de erros manuais
- Visibilidade financeira
- Relatórios automatizados
- Facilidade de uso

# Validação de Requisitos

## Métodos de Validação

- Revisões com stakeholders
- Protótipos navegáveis
- Testes de aceitação
- Casos de uso

## Critérios de Aceitação (exemplos)

- Produto deve ser cadastrado com nome, código, preço e quantidade
- Sistema deve atualizar estoque automaticamente após movimentações
- Relatórios devem ser gerados em menos de 5 segundos

# Documento de Requisitos (Resumo Estruturado)

## Casos de Uso Principais

- Gerenciar produtos
- Registrar entrada de estoque
- Registrar saída de estoque
- Consultar relatórios
- Gerenciar dados financeiros

## Modelo de Dados (Resumo)

Entidades principais:

- Produto
- Estoque
- Movimentação
- Pedido/Entrega
- Financeiro