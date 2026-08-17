# Gestão de estoque

[Gestão de estoque (1)](https://app.notion.com/p/Gest-o-de-estoque-1-36750f709c7c8027b7f1fb102aca0b41?pvs=21)

Nessa sessão vamos apresentar a nossa primeira versão dos requisitos funcionais e não funcionais do nosso sistema de gestão de estoque, mas, primeiramente devemos explicar o que são requisitos funcionais e não funcionais. 

Os requisitos funcionais descrevem as ações específicas que um sistema ou aplicativo deve ser capaz de executar. Eles são as capacidades concretas e as operações que o software deve realizar para atender às necessidades e expectativas do usuário. 

Enquanto os requisitos funcionais delineiam o que um software deve fazer, os requisitos não funcionais especificam como o software deve fazer isso. Eles são cruciais para garantir a qualidade e a eficiência do software, abrangendo aspectos como desempenho, segurança, confiabilidade e usabilidade. Esses requisitos não estão diretamente ligados às funções específicas do software, mas sim à sua operação e ambiente.

## Requisitos Funcionais

- **RF0001** – O sistema deve permitir o cadastro de produtos
- **RF0002** – O sistema deve permitir o cadastro de categorias de produtos
- **RF0003** – O sistema deve permitir o cadastro de usuários
- **RF0004** – O sistema deve permitir o gerenciamento de permissões de usuários
- **RF0005** – O sistema deve permitir o gerenciamento de rotas (navegação entre páginas no **React**)
- **RF0006** – O sistema deve permitir o gerenciamento de categorias de produtos
- **RF0007** – O sistema deve gerar gráficos por categorias de produtos
- **RF0008** – O sistema deve permitir atualização de estoque (entrada e saída)
- **RF0009** – O sistema deve permitir o controle de preços dos produtos
- **RF0010** – O sistema deve permitir o controle de prazos de entrega
- **RF0011** – O sistema deve permitir a gestão financeira (custos e lucros)
- **RF0012** – O sistema deve gerar relatórios de estoque, vendas e financeiro
- **RF0013** – O sistema deve permitir busca e filtro de produtos
- **RF0014** – O sistema deve emitir alertas de estoque mínimo
- **RF0015** – O sistema deve registrar histórico de movimentações de estoque
- **RF0016** – O sistema deve permitir controle de pedidos de compra
- **RF0017** – O sistema deve permitir controle de vendas
- **RF0018** – O sistema deve permitir exportação de relatórios (PDF/CSV)
- **RF0019** – O sistema deve permitir autenticação de usuários (login/logout)
- **RF0020** – O sistema deve exibir dashboard com indicadores principais
- **RF0021** – O sistema deve permitir edição e exclusão de registros
- **RF0022** – O sistema deve permitir categorização financeira (despesas/receitas)

---

## Requisitos Não Funcionais

- **RNF0001** – O sistema deve possuir interface responsiva utilizando **React**
- **RNF0002** – A API deve seguir o padrão REST
- **RNF0003** – O sistema deve ter alta disponibilidade
- **RNF0004** – O sistema deve garantir segurança de dados (autenticação e autorização)
- **RNF0005** – O sistema deve utilizar **PostgreSQL** para persistência de dados
- **RNF0006** – O sistema deve ser containerizado com **Docker**
- **RNF0007** – O sistema deve possuir integração contínua com **GitHub Actions**
- **RNF0008** – O sistema deve ter tempo de resposta inferior a 2 segundos para operações comuns
- **RNF009** – O sistema deve garantir integridade dos dados
- **RNF0010** – O sistema deve possuir logs de auditoria
- **RNF0011** – O sistema deve ser compatível com os principais navegadores (Chrome, Edge)
- **RNF0012** – O sistema deve possuir backup automático dos dados
- **RNF0013** – O sistema deve garantir criptografia de dados sensíveis
- **RNF0014** – O sistema deve ter arquitetura modular e de fácil manutenção
- **RNF0015** – O sistema deve possuir documentação da API
- **RNF0016** – O sistema deve ter monitoramento e alertas
- **RNF0017** – O sistema deve garantir consistência visual e usabilidade da interface