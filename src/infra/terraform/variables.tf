variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  description = "API Drinks Lambda deployment bucket"
  type        = string
}

variable "lambda_name" {
  description = "Lambda Drinks"
  type        = string
  default     = "api-drinks-function"
}

variable "api_name" {
  description = "API Drinks"
  type        = string
  default     = "api-drinks-gateway"
}

variable "database_url" {
  description = "URL PostgreSQL database"
  type        = string
  sensitive   = true
}