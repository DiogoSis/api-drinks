output "api_endpoint" {
  description = "URL base da API"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "lambda_function_name" {
  description = "Nome da função Lambda"
  value       = aws_lambda_function.api.function_name
}

output "lambda_arn" {
  description = "ARN da função Lambda"
  value       = aws_lambda_function.api.arn
}

output "s3_bucket" {
  description = "Bucket S3 com o código do Lambda"
  value       = aws_s3_bucket.lambda_bucket.id
}