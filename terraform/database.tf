resource "aws_db_instance" "postgres" {
  identifier           = "api-drinks-${var.environment}"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14.6"
  instance_class       = "db.t3.micro"
  db_name              = "apidrinks"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres14"
  publicly_accessible  = false
  skip_final_snapshot  = true
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  
  tags = {
    Name        = "api-drinks-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "api-drinks-${var.environment}-subnet-group"
  subnet_ids = var.subnet_ids
  
  tags = {
    Name        = "api-drinks-${var.environment}-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "api-drinks-${var.environment}-rds-sg"
  description = "Allow inbound traffic to RDS from Lambda"
  vpc_id      = var.vpc_id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "api-drinks-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "lambda_sg" {
  name        = "api-drinks-${var.environment}-lambda-sg"
  description = "Allow Lambda to connect to RDS"
  vpc_id      = var.vpc_id
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "api-drinks-${var.environment}-lambda-sg"
    Environment = var.environment
  }
}
