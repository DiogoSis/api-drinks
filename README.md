# API de Drinks - Refatoração e Expansão

Este repositório contém uma API completa para gerenciamento de drinks, ingredientes, estoque, pedidos e fornecedores, desenvolvida com Node.js/TypeScript, Express e Prisma.

## Visão Geral

A API de Drinks é uma solução completa para bares e estabelecimentos que trabalham com bebidas, permitindo o gerenciamento de:

- Drinks e suas receitas
- Ingredientes e controle de estoque
- Pedidos e atendimento
- Fornecedores e relações
- Categorias e unidades de medida
- Autenticação e autorização de usuários

A API foi desenvolvida seguindo os princípios SOLID, com uma arquitetura em camadas que separa claramente as responsabilidades entre controllers, services e repositories.

## Tecnologias Utilizadas

- **Backend**: Node.js, TypeScript, Express
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Validação**: Zod
- **Autenticação**: JWT
- **Testes**: Jest
- **Infraestrutura**: AWS (Lambda, API Gateway, RDS, Cognito)
- **IaC**: Terraform

## Estrutura do Projeto

```
api-drinks/
├── docs/                    # Documentação
│   ├── architecture/        # Diagramas e descrições de arquitetura
│   ├── routes/              # Documentação das rotas da API
│   └── examples/            # Exemplos de payloads
├── prisma/                  # Configuração do Prisma e schemas
├── src/                     # Código-fonte
│   ├── config/              # Configurações da aplicação
│   ├── controllers/         # Controllers da API
│   ├── dtos/                # Data Transfer Objects
│   ├── errors/              # Classes de erro
│   ├── interfaces/          # Interfaces e tipos
│   ├── middlewares/         # Middlewares Express
│   ├── repositories/        # Repositories para acesso ao banco
│   ├── routes/              # Definição de rotas
│   ├── services/            # Serviços com lógica de negócio
│   ├── utils/               # Utilitários
│   ├── lambda.ts            # Ponto de entrada para AWS Lambda
│   └── main.ts              # Ponto de entrada da aplicação
├── terraform/               # Configuração de infraestrutura AWS
└── tests/                   # Testes automatizados
    ├── unit/                # Testes unitários
    └── integration/         # Testes de integração
```

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- AWS CLI (para deploy)
- Terraform (para infraestrutura)

### Instalação Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/DiogoSis/api-drinks.git
   cd api-drinks
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Execução dos Testes

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Todos os testes
npm test
```

## Deploy na AWS

### Usando Terraform

1. Configure suas credenciais da AWS:
   ```bash
   aws configure
   ```

2. Inicialize o Terraform:
   ```bash
   cd terraform
   terraform init
   ```

3. Crie um arquivo de variáveis:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edite o arquivo terraform.tfvars com suas configurações
   ```

4. Planeje e aplique a infraestrutura:
   ```bash
   terraform plan -out=tfplan
   terraform apply tfplan
   ```

### Deploy Manual das Funções Lambda

1. Construa o projeto:
   ```bash
   npm run build
   ```

2. Empacote para o Lambda:
   ```bash
   npm run package
   ```

3. Faça o upload do pacote para o Lambda:
   ```bash
   cd dist
   aws lambda update-function-code --function-name api-drinks-dev-auth --zip-file fileb://lambda.zip
   # Repita para cada função Lambda
   ```

## Documentação da API

A documentação completa da API está disponível na pasta `docs/`:

- **Arquitetura**: Diagramas e descrições da arquitetura do sistema
- **Rotas**: Documentação detalhada de todas as rotas da API
- **Exemplos**: Exemplos de payloads para as principais operações

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
