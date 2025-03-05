# API Drinks - Sistema de Gerenciamento de Bebidas

## Visão Geral

API Drinks é uma aplicação backend RESTful desenvolvida com Node.js, TypeScript, Express e Prisma que gerencia dados de bebidas (drinks), suas receitas e ingredientes. Esta API segue os princípios SOLID e utiliza uma arquitetura em camadas para promover a manutenibilidade e escalabilidade.

## Arquitetura

O projeto segue uma arquitetura em camadas que separa claramente as responsabilidades:

- **Controllers**: Gerenciam requisições HTTP e respostas
- **Services**: Implementam a lógica de negócio
- **Repositories**: Interagem com o banco de dados
- **Interfaces**: Definem contratos para classes e objetos

### Diagrama de Arquitetura
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ Routes │─→─│ Controllers │─→─│ Services │─→─│ Repository │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │ ↓ ┌─────────────┐ │ Database │ └─────────────┘
```

## Regras de Negócio

### Entidades Principais

1. **Drink**
   - Representa uma bebida com nome, descrição, categoria e modo de preparo
   - Cada drink é composto por múltiplos ingredientes em quantidades específicas

2. **Ingrediente**
   - Representa um item usado na composição de bebidas
   - Possui uma unidade de medida e categoria associadas

3. **ReceitaDrink**
   - Representa a relação entre um drink e seus ingredientes
   - Armazena a quantidade necessária de cada ingrediente para preparar o drink

4. **UnidadeMedida**
   - Define as unidades de medida usadas para os ingredientes (ml, oz, unidade, etc)

### Relacionamentos

- Um **Drink** pode ter vários **Ingredientes** através da tabela de junção **ReceitaDrink**
- Um **Ingrediente** pode estar presente em vários **Drinks**
- Cada **Ingrediente** tem uma **UnidadeMedida** associada

## Endpoints API

A API fornece os seguintes endpoints:

### Get Drinks
``` 
GET /drink-list
```

Retorna a lista completa de drinks ordenados por ID, incluindo todos os ingredientes, quantidades e unidades de medida.

### Get Drink by ID
```
GET /drink-list?drinkId=<id>
```


Retorna um drink específico pelo seu ID, incluindo todos os ingredientes, quantidades e unidades de medida.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **TypeScript**: Linguagem de programação tipada
- **Express**: Framework para aplicações web
- **Prisma**: ORM para mapeamento e interação com o banco de dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional
- **AWS Lambda**: Função serverless para executar a aplicação
- **AWS API Gateway**: Gateway de API para expor os endpoints
- **Terraform**: Ferramenta de infraestrutura como código

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/api-drinks.git
   cd api-drinks
   ```
2. Instale as dependências:
```
npm install
```
3. Configure as variáveis de ambiente:
    - Crie um arquivo .env baseado no .env.example
    - Configure a URL de conexão do banco de dados PostgreSQL

4. Gere o Prisma Client:
```
npx prisma generate
```
5. Execute a aplicação:
```
npm run start:dev
```

## Estrutura de Diretórios
```
api-drinks/
├── prisma/
│   └── schema.prisma     # Definição do schema do banco de dados
├── src/
│   ├── controllers/      # Controladores da API
│   ├── interfaces/       # Interfaces TypeScript
│   ├── repositories/     # Camada de acesso a dados
│   ├── routes/           # Definição de rotas
│   ├── services/         # Lógica de negócio
│   └── main.ts           # Ponto de entrada da aplicação
├── terraform/            # Configuração do Terraform para AWS
│   ├── main.tf           # Configuração principal do Terraform
│   ├── variables.tf      # Definição das variáveis
│   ├── lambda.tf         # Configuração do Lambda
│   ├── api-gateway.tf    # Configuração da API Gateway
│   ├── iam.tf            # Configuração das permissões IAM
│   └── outputs.tf        # Outputs (URL da API, etc)
├── scripts/              # Scripts auxiliares
│   └── build.sh          # Script para construir o pacote de deploy
├── .env                  # Variáveis de ambiente
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
└── README.md             # Esta documentação
```
## Modelo de Banco de Dados

O sistema utiliza um banco de dados PostgreSQL com as seguintes tabelas principais:

- **drink**: Armazena informações sobre as bebidas
- **ingrediente**: Armazena informações sobre ingredientes
- **receitadrink**: Tabela de junção entre drinks e ingredientes
- **unidademedida**: Define unidades de medida para ingredientes

## Como Contribuir

Para contribuir com este projeto, por favor:

1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença ISC.