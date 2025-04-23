# Documentação das Rotas da API de Drinks

Este documento descreve todas as rotas disponíveis na API de Drinks, organizadas por categoria.

## Prefixo da API

Todas as rotas da API são prefixadas com `/v1`.

## Autenticação & Autorização

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| POST | `/auth/register` | Registrar novo usuário | Não | `name`, `email`, `password`, `role` (opcional) |
| POST | `/auth/login` | Autenticar e obter token JWT | Não | `email`, `password` |
| POST | `/auth/refresh-token` | Renovar token de acesso | Não | `refreshToken` |
| POST | `/auth/logout` | Invalidar sessão/token | Sim | - |

### Exemplo de Payload - Registro de Usuário
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "bartender"
}
```

### Exemplo de Resposta - Login
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "bartender"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Drinks & Receitas

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| GET | `/drinks` | Listar drinks (com paginação e filtros) | Não | `page`, `limit`, `nome`, `categoria` |
| GET | `/drinks/{id}` | Detalhes completos de um drink | Não | `id` (path) |
| POST | `/drinks` | Criar novo drink | Sim | Objeto drink completo |
| PUT | `/drinks/{id}` | Atualizar drink | Sim | `id` (path), campos a atualizar |
| DELETE | `/drinks/{id}` | Excluir drink | Sim | `id` (path) |
| GET | `/drinks/search` | Buscar por nome | Não | `name` (query) |
| GET | `/drinks/category/{cat}` | Filtrar por categoria | Não | `cat` (path) |
| GET | `/drinks/{id}/recipe` | Receita completa | Não | `id` (path) |
| POST | `/drinks/{id}/stock-check` | Verificar disponibilidade de estoque | Não | `id` (path), `quantidade` |
| POST | `/drinks/{id}/cost-calculation` | Calcular custo de produção | Não | `id` (path) |
| GET | `/drinks/{id}/related` | Drinks similares | Não | `id` (path) |

### Exemplo de Payload - Criação de Drink
```json
{
  "nome": "Caipirinha",
  "descricao": "Drink brasileiro tradicional",
  "categoria": "Cocktail",
  "preparation": "Macere o limão com açúcar, adicione gelo e cachaça",
  "photoUrl": "https://example.com/caipirinha.jpg",
  "ingredientes": [
    {
      "ingredienteId": 1,
      "quantidade": 50
    },
    {
      "ingredienteId": 2,
      "quantidade": 15
    },
    {
      "ingredienteId": 3,
      "quantidade": 2
    }
  ]
}
```

### Exemplo de Resposta - Verificação de Estoque
```json
{
  "disponivel": true,
  "ingredientes": [
    {
      "id": 1,
      "nome": "Cachaça",
      "disponivel": true,
      "quantidadeNecessaria": 50,
      "estoqueAtual": 750
    },
    {
      "id": 2,
      "nome": "Açúcar",
      "disponivel": true,
      "quantidadeNecessaria": 15,
      "estoqueAtual": 500
    },
    {
      "id": 3,
      "nome": "Limão",
      "disponivel": true,
      "quantidadeNecessaria": 2,
      "estoqueAtual": 20
    }
  ]
}
```

## Ingredientes, Estoque & Movimentações

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| GET | `/ingredients` | Listar ingredientes | Não | `page`, `limit`, `nome`, `categoria` |
| GET | `/ingredients/{id}` | Detalhar ingrediente | Não | `id` (path) |
| GET | `/ingredients/{id}/stock` | Mostrar estoque atual | Não | `id` (path) |
| PUT | `/ingredients/{id}/stock` | Atualizar níveis de estoque | Sim | `id` (path), `quantidade`, `motivo` |
| GET | `/ingredients/low-stock` | Listar ingredientes com estoque abaixo do mínimo | Não | - |
| GET | `/ingredients/{id}/suppliers` | Fornecedores do ingrediente | Não | `id` (path) |
| GET | `/ingredients/{id}/history` | Histórico de movimentações | Não | `id` (path), `dataInicio`, `dataFim` |
| POST | `/stock/movements` | Registrar movimentação | Sim | Objeto movimentação |
| POST | `/stock/adjustment` | Ajuste manual de estoque | Sim | Objeto ajuste |
| GET | `/stock/alerts` | Alertas de estoque mínimo | Não | - |
| GET | `/stock/history` | Histórico geral de movimentações | Não | `dataInicio`, `dataFim`, `page`, `limit` |

### Exemplo de Payload - Movimentação de Estoque
```json
{
  "ingredienteId": 1,
  "quantidade": 100,
  "tipo": "entrada",
  "motivo": "Compra de fornecedor",
  "fornecedorId": 2
}
```

### Exemplo de Payload - Ajuste de Estoque
```json
{
  "ingredienteId": 3,
  "quantidadeNova": 25,
  "motivo": "Correção após inventário"
}
```

## Pedidos & Atendimento

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| POST | `/orders` | Criar novo pedido | Não | Objeto pedido |
| GET | `/orders` | Listar pedidos | Não | `page`, `limit`, `status`, `clienteNome`, `dataInicio`, `dataFim` |
| GET | `/orders/{id}` | Detalhes do pedido | Não | `id` (path) |
| GET | `/orders/status/{status}` | Listar pedidos por status | Não | `status` (path), `page`, `limit` |
| PUT | `/orders/{id}/status` | Atualizar status do pedido | Sim | `id` (path), `status`, `observacao` |
| POST | `/orders/{id}/fulfill` | Processar atendimento do pedido | Sim | `id` (path), `bartenderId` |
| GET | `/orders/{id}/cost` | Calcular custo total do pedido | Não | `id` (path) |

### Exemplo de Payload - Criação de Pedido
```json
{
  "clienteNome": "Maria Oliveira",
  "mesa": 5,
  "itens": [
    {
      "drinkId": 1,
      "quantidade": 2,
      "observacao": "Sem açúcar"
    },
    {
      "drinkId": 3,
      "quantidade": 1
    }
  ]
}
```

### Exemplo de Resposta - Detalhes do Pedido
```json
{
  "id": 1,
  "clienteNome": "Maria Oliveira",
  "mesa": 5,
  "status": "pendente",
  "dataCriacao": "2025-04-22T19:30:00Z",
  "itens": [
    {
      "id": 1,
      "drink": {
        "id": 1,
        "nome": "Caipirinha",
        "categoria": "Cocktail"
      },
      "quantidade": 2,
      "observacao": "Sem açúcar",
      "precoUnitario": 15.00,
      "precoTotal": 30.00
    },
    {
      "id": 2,
      "drink": {
        "id": 3,
        "nome": "Mojito",
        "categoria": "Cocktail"
      },
      "quantidade": 1,
      "precoUnitario": 18.00,
      "precoTotal": 18.00
    }
  ],
  "valorTotal": 48.00
}
```

## Fornecedores & Relações

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| GET | `/suppliers` | Listar fornecedores | Não | `page`, `limit` |
| GET | `/suppliers/{id}` | Detalhar fornecedor | Não | `id` (path) |
| POST | `/suppliers` | Criar fornecedor | Sim | Objeto fornecedor |
| PUT | `/suppliers/{id}` | Atualizar fornecedor | Sim | `id` (path), campos a atualizar |
| DELETE | `/suppliers/{id}` | Excluir fornecedor | Sim | `id` (path) |
| GET | `/suppliers/search` | Buscar por nome | Não | `name` (query) |
| GET | `/suppliers/{id}/ingredients` | Ingredientes fornecidos | Não | `id` (path) |
| POST | `/suppliers/{id}/ingredients` | Associar ingrediente | Sim | `id` (path), objeto associação |
| DELETE | `/suppliers/{id}/ingredients/{ingId}` | Desassociar ingrediente | Sim | `id` (path), `ingId` (path) |
| GET | `/suppliers/replenishment` | Sugestões de reposição | Não | - |

### Exemplo de Payload - Criação de Fornecedor
```json
{
  "nome": "Distribuidora ABC",
  "email": "contato@abc.com",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua das Bebidas, 123",
  "cnpj": "12.345.678/0001-90",
  "observacoes": "Entrega às segundas e quintas"
}
```

### Exemplo de Payload - Associação de Ingrediente
```json
{
  "ingredienteId": 1,
  "precoUnitario": 45.90,
  "prazoEntrega": 3,
  "observacoes": "Pedido mínimo de 5 unidades"
}
```

## Receitas & Gerenciamento

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| GET | `/recipes` | Listar todas as receitas | Não | - |
| POST | `/recipes` | Criar/alterar relação drink-ingrediente | Sim | Objeto receita |
| PUT | `/recipes/{drinkId}/{ingId}` | Atualizar quantidade necessária | Sim | `drinkId` (path), `ingId` (path), `quantidade` |
| DELETE | `/recipes/{drinkId}/{ingId}` | Remover ingrediente da receita | Sim | `drinkId` (path), `ingId` (path) |

### Exemplo de Payload - Criação de Receita
```json
{
  "drinkId": 1,
  "ingredienteId": 4,
  "quantidade": 30,
  "observacao": "Adicionar por último"
}
```

## Categorias & Unidades

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| GET | `/categories` | Listar categorias | Não | - |
| POST | `/categories` | Criar categoria | Sim | Objeto categoria |
| PUT | `/categories/{id}` | Atualizar categoria | Sim | `id` (path), campos a atualizar |
| DELETE | `/categories/{id}` | Excluir categoria | Sim | `id` (path) |
| GET | `/units` | Listar unidades de medida | Não | - |
| POST | `/units` | Criar unidade | Sim | Objeto unidade |
| PUT | `/units/{id}` | Atualizar unidade | Sim | `id` (path), campos a atualizar |
| DELETE | `/units/{id}` | Excluir unidade | Sim | `id` (path) |

### Exemplo de Payload - Criação de Categoria
```json
{
  "nome": "Sem Álcool",
  "descricao": "Drinks sem teor alcoólico",
  "tipo": "drink"
}
```

### Exemplo de Payload - Criação de Unidade
```json
{
  "nome": "Mililitro",
  "abreviacao": "ml",
  "descricao": "Unidade de volume"
}
```

## Webhooks, Analytics & Monitoramento

| Método | Rota | Descrição | Autenticação | Parâmetros |
|--------|------|-----------|--------------|------------|
| POST | `/webhooks/order-created` | Notificação de novo pedido | Não | Objeto pedido |
| POST | `/webhooks/stock-low` | Alerta externo de estoque baixo | Não | Objeto alerta |
| GET | `/analytics/sales` | Relatório de vendas por período | Não | `period` (query) |
| GET | `/analytics/inventory-turnover` | Giro de estoque | Não | `period` (query) |
| GET | `/health` | Status da API e conexões | Não | - |
| GET | `/metrics` | Métricas de performance | Não | - |
| GET | `/logs` | Logs recentes de erro/auditoria | Sim | - |

### Exemplo de Payload - Webhook de Pedido Criado
```json
{
  "event": "order.created",
  "data": {
    "orderId": 1,
    "clienteNome": "Maria Oliveira",
    "mesa": 5,
    "itens": [
      {
        "drinkId": 1,
        "nome": "Caipirinha",
        "quantidade": 2
      },
      {
        "drinkId": 3,
        "nome": "Mojito",
        "quantidade": 1
      }
    ],
    "timestamp": "2025-04-22T19:30:00Z"
  }
}
```

### Exemplo de Resposta - Relatório de Vendas
```json
{
  "periodo": "2025-04-01 a 2025-04-30",
  "totalVendas": 12580.50,
  "quantidadePedidos": 342,
  "ticketMedio": 36.78,
  "topDrinks": [
    {
      "id": 1,
      "nome": "Caipirinha",
      "quantidade": 215,
      "valorTotal": 3225.00
    },
    {
      "id": 3,
      "nome": "Mojito",
      "quantidade": 187,
      "valorTotal": 3366.00
    }
  ],
  "vendasPorDia": [
    {
      "data": "2025-04-01",
      "valor": 420.50
    },
    {
      "data": "2025-04-02",
      "valor": 385.00
    }
  ]
}
```
