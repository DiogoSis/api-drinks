resource "aws_lambda_function" "api_lambda" {
  for_each = local.lambda_functions

  function_name = "api-drinks-${var.environment}-${each.key}"
  handler       = "dist/lambda.handler"
  runtime       = "nodejs18.x"
  
  role          = aws_iam_role.lambda_role.arn
  
  filename         = "../dist/lambda.zip"
  source_code_hash = filebase64sha256("../dist/lambda.zip")
  
  memory_size = 256
  timeout     = 30
  
  environment {
    variables = {
      NODE_ENV     = var.environment
      DATABASE_URL = var.database_url
      JWT_SECRET   = var.jwt_secret
    }
  }
}

# Permissão para API Gateway invocar Lambda
resource "aws_lambda_permission" "api_gateway_lambda" {
  for_each = local.lambda_functions

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  
  source_arn = "${aws_api_gateway_rest_api.api_drinks.execution_arn}/*/*/*"
}

# Métodos e integrações do API Gateway para Lambda
resource "aws_api_gateway_method" "lambda_method" {
  for_each = local.lambda_endpoints

  rest_api_id   = aws_api_gateway_rest_api.api_drinks.id
  resource_id   = local.api_resources[each.value.resource]
  http_method   = each.value.method
  authorization = each.value.auth ? "COGNITO_USER_POOLS" : "NONE"
  authorizer_id = each.value.auth ? aws_api_gateway_authorizer.cognito.id : null
}

resource "aws_api_gateway_integration" "lambda_integration" {
  for_each = local.lambda_endpoints

  rest_api_id = aws_api_gateway_rest_api.api_drinks.id
  resource_id = local.api_resources[each.value.resource]
  http_method = aws_api_gateway_method.lambda_method[each.key].http_method
  
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda[each.value.function].invoke_arn
}

# Cognito Authorizer
resource "aws_api_gateway_authorizer" "cognito" {
  name          = "cognito-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.api_drinks.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [aws_cognito_user_pool.api_drinks.arn]
}

# Cognito User Pool
resource "aws_cognito_user_pool" "api_drinks" {
  name = "api-drinks-${var.environment}-user-pool"
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  
  auto_verified_attributes = ["email"]
  
  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
}

resource "aws_cognito_user_pool_client" "api_client" {
  name         = "api-drinks-${var.environment}-client"
  user_pool_id = aws_cognito_user_pool.api_drinks.id
  
  generate_secret     = false
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

# Variáveis locais para definir as funções Lambda e endpoints
locals {
  lambda_functions = {
    "auth"        = "auth",
    "drinks"      = "drinks",
    "ingredients" = "ingredients",
    "orders"      = "orders",
    "suppliers"   = "suppliers",
    "recipes"     = "recipes",
    "categories"  = "categories",
    "webhooks"    = "webhooks",
    "analytics"   = "analytics",
    "monitoring"  = "monitoring"
  }
  
  lambda_endpoints = {
    # Auth endpoints
    "auth-register"      = { function = "auth", resource = "auth", method = "POST", path = "register", auth = false },
    "auth-login"         = { function = "auth", resource = "auth", method = "POST", path = "login", auth = false },
    "auth-refresh-token" = { function = "auth", resource = "auth", method = "POST", path = "refresh-token", auth = false },
    "auth-logout"        = { function = "auth", resource = "auth", method = "POST", path = "logout", auth = true },
    
    # Drinks endpoints
    "drinks-list"            = { function = "drinks", resource = "drinks", method = "GET", path = "", auth = false },
    "drinks-get"             = { function = "drinks", resource = "drinks", method = "GET", path = "{id}", auth = false },
    "drinks-create"          = { function = "drinks", resource = "drinks", method = "POST", path = "", auth = true },
    "drinks-update"          = { function = "drinks", resource = "drinks", method = "PUT", path = "{id}", auth = true },
    "drinks-delete"          = { function = "drinks", resource = "drinks", method = "DELETE", path = "{id}", auth = true },
    "drinks-search"          = { function = "drinks", resource = "drinks", method = "GET", path = "search", auth = false },
    "drinks-category"        = { function = "drinks", resource = "drinks", method = "GET", path = "category/{cat}", auth = false },
    "drinks-recipe"          = { function = "drinks", resource = "drinks", method = "GET", path = "{id}/recipe", auth = false },
    "drinks-stock-check"     = { function = "drinks", resource = "drinks", method = "POST", path = "{id}/stock-check", auth = false },
    "drinks-cost-calculation" = { function = "drinks", resource = "drinks", method = "POST", path = "{id}/cost-calculation", auth = false },
    "drinks-related"         = { function = "drinks", resource = "drinks", method = "GET", path = "{id}/related", auth = false },
    
    # Ingredients endpoints
    "ingredients-list"       = { function = "ingredients", resource = "ingredients", method = "GET", path = "", auth = false },
    "ingredients-get"        = { function = "ingredients", resource = "ingredients", method = "GET", path = "{id}", auth = false },
    "ingredients-stock"      = { function = "ingredients", resource = "ingredients", method = "GET", path = "{id}/stock", auth = false },
    "ingredients-update-stock" = { function = "ingredients", resource = "ingredients", method = "PUT", path = "{id}/stock", auth = true },
    "ingredients-low-stock"  = { function = "ingredients", resource = "ingredients", method = "GET", path = "low-stock", auth = false },
    "ingredients-suppliers"  = { function = "ingredients", resource = "ingredients", method = "GET", path = "{id}/suppliers", auth = false },
    "ingredients-history"    = { function = "ingredients", resource = "ingredients", method = "GET", path = "{id}/history", auth = false },
    
    # Stock endpoints
    "stock-movements"        = { function = "ingredients", resource = "stock", method = "POST", path = "movements", auth = true },
    "stock-adjustment"       = { function = "ingredients", resource = "stock", method = "POST", path = "adjustment", auth = true },
    "stock-alerts"           = { function = "ingredients", resource = "stock", method = "GET", path = "alerts", auth = false },
    "stock-history"          = { function = "ingredients", resource = "stock", method = "GET", path = "history", auth = false },
    
    # Orders endpoints
    "orders-create"          = { function = "orders", resource = "orders", method = "POST", path = "", auth = false },
    "orders-list"            = { function = "orders", resource = "orders", method = "GET", path = "", auth = false },
    "orders-get"             = { function = "orders", resource = "orders", method = "GET", path = "{id}", auth = false },
    "orders-status"          = { function = "orders", resource = "orders", method = "GET", path = "status/{status}", auth = false },
    "orders-update-status"   = { function = "orders", resource = "orders", method = "PUT", path = "{id}/status", auth = true },
    "orders-fulfill"         = { function = "orders", resource = "orders", method = "POST", path = "{id}/fulfill", auth = true },
    "orders-cost"            = { function = "orders", resource = "orders", method = "GET", path = "{id}/cost", auth = false },
    
    # Suppliers endpoints
    "suppliers-list"         = { function = "suppliers", resource = "suppliers", method = "GET", path = "", auth = false },
    "suppliers-get"          = { function = "suppliers", resource = "suppliers", method = "GET", path = "{id}", auth = false },
    "suppliers-create"       = { function = "suppliers", resource = "suppliers", method = "POST", path = "", auth = true },
    "suppliers-update"       = { function = "suppliers", resource = "suppliers", method = "PUT", path = "{id}", auth = true },
    "suppliers-delete"       = { function = "suppliers", resource = "suppliers", method = "DELETE", path = "{id}", auth = true },
    "suppliers-search"       = { function = "suppliers", resource = "suppliers", method = "GET", path = "search", auth = false },
    "suppliers-ingredients"  = { function = "suppliers", resource = "suppliers", method = "GET", path = "{id}/ingredients", auth = false },
    "suppliers-add-ingredient" = { function = "suppliers", resource = "suppliers", method = "POST", path = "{id}/ingredients", auth = true },
    "suppliers-remove-ingredient" = { function = "suppliers", resource = "suppliers", method = "DELETE", path = "{id}/ingredients/{ingId}", auth = true },
    "suppliers-replenishment" = { function = "suppliers", resource = "suppliers", method = "GET", path = "replenishment", auth = false },
    
    # Recipes endpoints
    "recipes-list"           = { function = "recipes", resource = "recipes", method = "GET", path = "", auth = false },
    "recipes-create"         = { function = "recipes", resource = "recipes", method = "POST", path = "", auth = true },
    "recipes-update"         = { function = "recipes", resource = "recipes", method = "PUT", path = "{drinkId}/{ingId}", auth = true },
    "recipes-delete"         = { function = "recipes", resource = "recipes", method = "DELETE", path = "{drinkId}/{ingId}", auth = true },
    
    # Categories endpoints
    "categories-list"        = { function = "categories", resource = "categories", method = "GET", path = "", auth = false },
    "categories-create"      = { function = "categories", resource = "categories", method = "POST", path = "", auth = true },
    "categories-update"      = { function = "categories", resource = "categories", method = "PUT", path = "{id}", auth = true },
    "categories-delete"      = { function = "categories", resource = "categories", method = "DELETE", path = "{id}", auth = true },
    
    # Units endpoints
    "units-list"             = { function = "categories", resource = "units", method = "GET", path = "", auth = false },
    "units-create"           = { function = "categories", resource = "units", method = "POST", path = "", auth = true },
    "units-update"           = { function = "categories", resource = "units", method = "PUT", path = "{id}", auth = true },
    "units-delete"           = { function = "categories", resource = "units", method = "DELETE", path = "{id}", auth = true },
    
    # Webhooks endpoints
    "webhooks-order-created" = { function = "webhooks", resource = "webhooks", method = "POST", path = "order-created", auth = false },
    "webhooks-stock-low"     = { function = "webhooks", resource = "webhooks", method = "POST", path = "stock-low", auth = false },
    
    # Analytics endpoints
    "analytics-sales"        = { function = "analytics", resource = "analytics", method = "GET", path = "sales", auth = false },
    "analytics-inventory"    = { function = "analytics", resource = "analytics", method = "GET", path = "inventory-turnover", auth = false },
    
    # Monitoring endpoints
    "monitoring-health"      = { function = "monitoring", resource = "health", method = "GET", path = "", auth = false },
    "monitoring-metrics"     = { function = "monitoring", resource = "metrics", method = "GET", path = "", auth = false },
    "monitoring-logs"        = { function = "monitoring", resource = "logs", method = "GET", path = "", auth = true }
  }
}
