# Exemplos de Payloads para a API de Drinks

Este documento contém exemplos de payloads para as principais operações da API de Drinks.

## Autenticação

### Registro de Usuário
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "bartender"
}
```

### Login
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Refresh Token
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Drinks

### Criação de Drink
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

### Atualização de Drink
```json
{
  "nome": "Caipirinha de Limão",
  "descricao": "Versão atualizada da caipirinha tradicional",
  "preparation": "Macere o limão com açúcar, adicione gelo e cachaça. Decore com uma fatia de limão."
}
```

### Verificação de Estoque
```json
{
  "quantidade": 5
}
```

## Ingredientes

### Criação de Ingrediente
```json
{
  "nome": "Cachaça",
  "descricao": "Destilado brasileiro",
  "categoria": "Destilados",
  "unidadeMedidaId": 1,
  "estoqueMinimo": 500,
  "estoqueAtual": 2000,
  "custo": 45.90
}
```

### Atualização de Estoque
```json
{
  "quantidade": 100,
  "motivo": "Ajuste após inventário"
}
```

### Movimentação de Estoque
```json
{
  "ingredienteId": 1,
  "quantidade": 500,
  "tipo": "entrada",
  "motivo": "Compra de fornecedor",
  "fornecedorId": 2
}
```

### Ajuste de Estoque
```json
{
  "ingredienteId": 3,
  "quantidadeNova": 25,
  "motivo": "Correção após inventário"
}
```

## Pedidos

### Criação de Pedido
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

### Atualização de Status do Pedido
```json
{
  "status": "em_preparo",
  "observacao": "Iniciando preparação dos drinks"
}
```

### Processamento de Pedido
```json
{
  "bartenderId": 2
}
```

## Fornecedores

### Criação de Fornecedor
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

### Associação de Ingrediente a Fornecedor
```json
{
  "ingredienteId": 1,
  "precoUnitario": 45.90,
  "prazoEntrega": 3,
  "observacoes": "Pedido mínimo de 5 unidades"
}
```

## Receitas

### Criação/Alteração de Receita
```json
{
  "drinkId": 1,
  "ingredienteId": 4,
  "quantidade": 30,
  "observacao": "Adicionar por último"
}
```

### Atualização de Quantidade na Receita
```json
{
  "quantidade": 25,
  "observacao": "Reduzir quantidade para equilibrar sabor"
}
```

## Categorias e Unidades

### Criação de Categoria
```json
{
  "nome": "Sem Álcool",
  "descricao": "Drinks sem teor alcoólico",
  "tipo": "drink"
}
```

### Criação de Unidade de Medida
```json
{
  "nome": "Mililitro",
  "abreviacao": "ml",
  "descricao": "Unidade de volume"
}
```

## Webhooks

### Notificação de Pedido Criado
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

### Alerta de Estoque Baixo
```json
{
  "event": "stock.low",
  "data": {
    "ingredienteId": 1,
    "nome": "Cachaça",
    "estoqueAtual": 450,
    "estoqueMinimo": 500,
    "timestamp": "2025-04-22T15:45:00Z"
  }
}
```
