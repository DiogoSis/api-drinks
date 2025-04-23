provider "aws" {
  region = var.aws_region
}

# API Gateway
resource "aws_api_gateway_rest_api" "api_drinks" {
  name        = "api-drinks-${var.environment}"
  description = "API Drinks REST API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway Resources
resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_rest_api.api_drinks.root_resource_id
  path_part   = "v1"
}

# Recursos para cada grupo de endpoints
resource "aws_api_gateway_resource" "auth_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "auth"
}

resource "aws_api_gateway_resource" "drinks_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "drinks"
}

resource "aws_api_gateway_resource" "ingredients_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "ingredients"
}

resource "aws_api_gateway_resource" "stock_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "stock"
}

resource "aws_api_gateway_resource" "orders_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "orders"
}

resource "aws_api_gateway_resource" "suppliers_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "suppliers"
}

resource "aws_api_gateway_resource" "recipes_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "recipes"
}

resource "aws_api_gateway_resource" "categories_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "categories"
}

resource "aws_api_gateway_resource" "units_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "units"
}

resource "aws_api_gateway_resource" "webhooks_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "webhooks"
}

resource "aws_api_gateway_resource" "analytics_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "analytics"
}

resource "aws_api_gateway_resource" "health_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "health"
}

resource "aws_api_gateway_resource" "metrics_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "metrics"
}

resource "aws_api_gateway_resource" "logs_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "logs"
}

# Deployment e Stage
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  stage_name  = var.environment

  lifecycle {
    create_before_destroy = true
  }
}

# Configuração de CORS
resource "aws_api_gateway_method" "options_method" {
  for_each = local.api_resources

  rest_api_id   = aws_api_gateway_rest_api.api_drinks.id
  resource_id   = each.value
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  for_each = local.api_resources

  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  resource_id = each.value
  http_method = aws_api_gateway_method.options_method[each.key].http_method
  type        = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  for_each = local.api_resources

  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  resource_id = each.value
  http_method = aws_api_gateway_method.options_method[each.key].http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  for_each = local.api_resources

  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  resource_id = each.value
  http_method = aws_api_gateway_method.options_method[each.key].http_method
  status_code = aws_api_gateway_method_response.options_200[each.key].status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# Variáveis locais para simplificar a referência aos recursos
locals {
  api_resources = {
    "auth"        = aws_api_gateway_resource.auth_resource.id,
    "drinks"      = aws_api_gateway_resource.drinks_resource.id,
    "ingredients" = aws_api_gateway_resource.ingredients_resource.id,
    "stock"       = aws_api_gateway_resource.stock_resource.id,
    "orders"      = aws_api_gateway_resource.orders_resource.id,
    "suppliers"   = aws_api_gateway_resource.suppliers_resource.id,
    "recipes"     = aws_api_gateway_resource.recipes_resource.id,
    "categories"  = aws_api_gateway_resource.categories_resource.id,
    "units"       = aws_api_gateway_resource.units_resource.id,
    "webhooks"    = aws_api_gateway_resource.webhooks_resource.id,
    "analytics"   = aws_api_gateway_resource.analytics_resource.id,
    "health"      = aws_api_gateway_resource.health_resource.id,
    "metrics"     = aws_api_gateway_resource.metrics_resource.id,
    "logs"        = aws_api_gateway_resource.logs_resource.id
  }
}
