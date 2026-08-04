# ============================================================
# OIT MIS — Terraform Variables
# ============================================================

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 Instance size"
  type        = string
  default     = "t3.small" # 2 vCPU, 2GB RAM
}

variable "ssh_public_key" {
  description = "Public SSH key for server authentication"
  type        = string
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKwS5zvKd39xGbsJ9AoLWKtSToFsw/+mPoH7EcojIs+R arabd@LENOVO"
}
