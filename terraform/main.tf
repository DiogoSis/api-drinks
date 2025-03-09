terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket para armazenar o código do Lambda
resource "aws_s3_bucket" "lambda_bucket" {
  bucket = var.s3_bucket_name
}

# Configurações de acesso do bucket
resource "aws_s3_bucket_ownership_controls" "lambda_bucket_ownership" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket_ownership]
  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

# Upload do código para o S3
resource "aws_s3_object" "lambda_code" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "function.zip"
  source = "../function.zip"  
  
  # Atualiza o arquivo no S3 quando o arquivo local for alterado
  etag = filemd5("../function.zip")
}