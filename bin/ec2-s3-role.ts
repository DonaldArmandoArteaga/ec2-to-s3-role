#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Ec2S3RoleStack } from '../lib/ec2-s3-role-stack';

const app = new cdk.App();
new Ec2S3RoleStack(app, 'Ec2S3RoleStack', {

});