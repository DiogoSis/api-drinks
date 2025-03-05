# terraform/api-gateway.tf
resource "aws_apigatewayv2_api" "api_gateway" {
  name          = var.api_name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default"
  auto_deploy = true
  
  # Configurações de log
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      httpMethod     = "$context.httpMethod"
      path           = "$context.path"
      status         = "$context.status"
    })
  }
}

# Configuração de logs para API Gateway
resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name = "/aws/apigateway/${var.api_name}"
  retention_in_days = 7
}

# Integração entre API Gateway e Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api_gateway.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.api.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

# Rota para qualquer caminho (catch-all)
resource "aws_apigatewayv2_route" "all_routes" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Permissão para API Gateway invocar o Lambda
resource "aws_lambda_permission" "api_gateway_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  
  # Fonte ARN: arn:aws:execute-api:{regionId}:{accountId}:{apiId}/*/*/{proxy+}
  source_arn = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}