resource "aws_lambda_function" "api" {
  function_name = var.lambda_name
  
  # Localizando o S3 bucket e arquivo de código
  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_code.key
  
  # Configurações de execução
  handler       = "lambda.handler"
  runtime       = "nodejs18.x"
  architectures = ["arm64"]
  
  # IAM role para o Lambda
  role = aws_iam_role.lambda_role.arn
  
  # Configurações do ambiente - variáveis passadas para seu código
  environment {
    variables = {
      DATABASE_URL = var.database_url,
      NODE_ENV     = "production"
    }
  }
  
  # Configurações de performance
  memory_size = 128
  timeout     = 10
}

# Log group para Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = 7
}