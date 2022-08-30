variable "environment" {}
variable "source_branch_name" {
  default = "development"
}
variable "tf_backend_bucket_name" {}
variable "ProjectName" {
  default = "stachecow"
}
variable "region" {
  default = "us-east-1"
}
variable "repo_id" {
  default = "pt1851/1851-ui3"
}
variable "codebuild_bucket"  {}
variable "codepipeline_bucket" {}
