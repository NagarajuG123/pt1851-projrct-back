variable "environment" {}
variable "source_branch_name" {}
variable "tf_backend_bucket_name" {}
variable "ProjectName" {
  default = "e1903"
}
variable "region" {
  default = "us-east-1"
}
variable "repo_id" {
  default = "hellomainland/1851-ui3"
}
variable "codebuild_bucket"  {}
variable "codepipeline_bucket" {}