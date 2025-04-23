# Arquitetura da API de Drinks

Este documento descreve a arquitetura da API de Drinks, incluindo os componentes principais, fluxos de dados e decisões de design.

## Visão Geral da Arquitetura

A API de Drinks segue uma arquitetura em camadas baseada nos princípios SOLID, com separação clara de responsabilidades entre os diferentes componentes. A aplicação é construída usando Node.js/TypeScript com Express como framework web e Prisma como ORM para acesso ao banco de dados PostgreSQL.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Controllers    │────▶│    Services     │────▶│  Repositories   │────▶│   Database      │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       ▲                       ▲
        │                       │                       │
        │                       │                       │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│     Routes      │     │   Interfaces    │     │     Models      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲
        │
        │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Middlewares    │     │      DTOs       │     │     Errors      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Componentes Principais

### 1. Controllers

Os controllers são responsáveis por receber as requisições HTTP, validar os dados de entrada, chamar os serviços apropriados e retornar as respostas adequadas. Eles não contêm lógica de negócio, apenas coordenam o fluxo de dados entre a camada de apresentação e a camada de serviços.

### 2. Services

Os services contêm a lógica de negócio da aplicação. Eles recebem dados validados dos controllers, executam as operações necessárias, interagem com os repositories para acessar o banco de dados e retornam os resultados processados.

### 3. Repositories

Os repositories são responsáveis pelo acesso ao banco de dados. Eles encapsulam as operações de CRUD (Create, Read, Update, Delete) e fornecem uma interface para os services interagirem com o banco de dados sem conhecer os detalhes de implementação.

### 4. Interfaces

As interfaces definem contratos entre os diferentes componentes da aplicação, permitindo a implementação do princípio de inversão de dependência (Dependency Inversion Principle) do SOLID. Isso facilita a substituição de implementações e a realização de testes unitários.

### 5. DTOs (Data Transfer Objects)

Os DTOs são objetos que definem a estrutura dos dados que são transferidos entre as camadas da aplicação. Eles são usados para validação de entrada, garantindo que os dados recebidos estejam no formato esperado antes de serem processados.

### 6. Middlewares

Os middlewares são funções que processam as requisições antes que elas cheguem aos controllers. Eles são usados para autenticação, validação, tratamento de erros e outras funcionalidades transversais.

### 7. Error Handling

A aplicação possui um sistema centralizado de tratamento de erros, com classes de erro específicas para diferentes tipos de situações. Isso permite um tratamento consistente de erros em toda a aplicação.

## Fluxo de Dados

1. Uma requisição HTTP é recebida pelo servidor Express
2. A requisição passa pelos middlewares (autenticação, validação, etc.)
3. A rota correspondente direciona a requisição para o controller apropriado
4. O controller valida os dados de entrada usando DTOs
5. O controller chama o service apropriado
6. O service executa a lógica de negócio e interage com os repositories
7. O repository acessa o banco de dados usando o Prisma
8. Os dados são retornados através da cadeia (repository → service → controller)
9. O controller formata a resposta e a envia de volta ao cliente

## Infraestrutura AWS

A API é implantada na AWS usando uma arquitetura serverless:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  API Gateway    │────▶│  AWS Lambda     │────▶│  RDS PostgreSQL │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       │
        │                       │
        │                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Cognito        │     │  CloudWatch     │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

- **API Gateway**: Gerencia todas as requisições HTTP, roteando-as para as funções Lambda apropriadas
- **Lambda**: Executa o código da API em um ambiente serverless
- **RDS PostgreSQL**: Armazena todos os dados da aplicação
- **Cognito**: Gerencia autenticação e autorização de usuários
- **CloudWatch**: Monitora a aplicação e registra logs

## Decisões de Design

### Princípios SOLID

A arquitetura foi projetada seguindo os princípios SOLID:

- **S (Single Responsibility)**: Cada classe tem uma única responsabilidade
- **O (Open/Closed)**: As classes são abertas para extensão, mas fechadas para modificação
- **L (Liskov Substitution)**: As implementações podem ser substituídas sem afetar o comportamento do sistema
- **I (Interface Segregation)**: Interfaces específicas são preferidas a interfaces genéricas
- **D (Dependency Inversion)**: Dependências são injetadas, não criadas internamente

### Validação de Entrada

A validação de entrada é realizada usando a biblioteca Zod, que permite definir schemas de validação de forma declarativa e gerar tipos TypeScript a partir desses schemas.

### Tratamento de Erros

O tratamento de erros é centralizado, com uma hierarquia de classes de erro que permite identificar e tratar diferentes tipos de erros de forma consistente.

### Autenticação e Autorização

A autenticação é baseada em tokens JWT, com suporte para refresh tokens. A autorização é baseada em roles (admin, user, bartender).

### Serverless

A escolha de uma arquitetura serverless com AWS Lambda permite escalabilidade automática e redução de custos quando a aplicação não está sendo utilizada.
