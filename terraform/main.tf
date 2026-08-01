# ============================================================
# OIT MIS — Phase 3: Infrastructure as Code (Terraform for AWS)
# ============================================================
# Provisions an AWS EC2 instance with Docker, Security Groups,
# Elastic IP, and automated OIT MIS server bootstrap.
#
# Usage:
#   cd terraform
#   terraform init
#   terraform plan
#   terraform apply
# ============================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── 1. VPC & Public Subnet ──────────────────────────────────
resource "aws_vpc" "oit_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "oit-mis-vpc"
    Environment = "production"
  }
}

resource "aws_internet_gateway" "oit_igw" {
  vpc_id = aws_vpc.oit_vpc.id

  tags = {
    Name = "oit-mis-igw"
  }
}

resource "aws_subnet" "oit_public_subnet" {
  vpc_id                  = aws_vpc.oit_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "oit-mis-public-subnet"
  }
}

resource "aws_route_table" "oit_public_rt" {
  vpc_id = aws_vpc.oit_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.oit_igw.id
  }

  tags = {
    Name = "oit-mis-public-rt"
  }
}

resource "aws_route_table_association" "oit_public_assoc" {
  subnet_id      = aws_subnet.oit_public_subnet.id
  route_table_id = aws_route_table.oit_public_rt.id
}

# ── 2. Security Group (Firewall) ────────────────────────────
resource "aws_security_group" "oit_sg" {
  name        = "oit-mis-security-group"
  description = "Security group for OIT MIS Web Application & API"
  vpc_id      = aws_vpc.oit_vpc.id

  # HTTP (Port 80)
  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS (Port 443)
  ingress {
    description = "Allow HTTPS secure traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH (Port 22)
  ingress {
    description = "Allow SSH management"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound All Traffic
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "oit-mis-sg"
  }
}

# ── 3. SSH Key Pair ─────────────────────────────────────────
resource "aws_key_pair" "oit_key" {
  key_name   = "oit-mis-deploy-key"
  public_key = var.ssh_public_key
}

# ── 4. Ubuntu 22.04 LTS AMI Lookup ─────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# ── 5. EC2 Server Instance ──────────────────────────────────
resource "aws_instance" "oit_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.oit_public_subnet.id
  vpc_security_group_ids = [aws_security_group.oit_sg.id]
  key_name               = aws_key_pair.oit_key.key_name

  root_block_device {
    volume_size           = 20 # 20 GB SSD
    volume_type           = "gp3"
    delete_on_termination = true
  }

  # Bootstrap Docker & OIT MIS on initial boot
  user_data = <<-EOF
              #!/bin/bash
              sudo apt update && sudo apt upgrade -y
              curl -fsSL https://get.docker.com | sh
              sudo usermod -aG docker ubuntu
              sudo systemctl enable docker
              sudo systemctl start docker
              git clone https://github.com/Arab10-oss/orion-mis.git /opt/oit-mis
              cd /opt/oit-mis
              cp .env.example .env
              EOF

  tags = {
    Name        = "oit-mis-production-server"
    Environment = "production"
  }
}

# ── 6. Static Elastic IP (EIP) ──────────────────────────────
resource "aws_eip" "oit_eip" {
  instance = aws_instance.oit_server.id
  domain   = "vpc"

  tags = {
    Name = "oit-mis-elastic-ip"
  }
}

# ── 7. Outputs ──────────────────────────────────────────────
output "public_ip" {
  description = "Elastic Public IP address of the server"
  value       = aws_eip.oit_eip.public_ip
}

output "ssh_command" {
  description = "Command to SSH into your cloud server"
  value       = "ssh ubuntu@${aws_eip.oit_eip.public_ip}"
}
