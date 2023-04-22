#!/bin/bash 
aws s3 mb s3://ec2-s3-role-875485648654
aws s3 ls >> s3_list.log