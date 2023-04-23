import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { Ec2S3RoleStack } from '../lib/ec2-s3-role-stack';

describe('Verify resources creation', () => {
  let stack: Ec2S3RoleStack;
  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    stack = new Ec2S3RoleStack(app, 'Ec2S3RoleStack');
    template = Template.fromStack(stack);
  });

  test('Vpc Created', () => {
    template.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: '10.0.0.0/16',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: 'default',
      Tags: [
        {
          Key: 'Name',
          Value: 'Ec2S3RoleStack/ec2-to-s3-vpc',
        },
      ],
    });
  });

  test('Security Group Created', () => {
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Ec2S3RoleStack/ec2-to-s3-sg',
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
      VpcId: stack.resolve(stack.vpc.mainVPC.vpcId),
    });
  });

  test('S3 Role Created', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'ec2.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AmazonS3FullAccess',
            ],
          ],
        },
      ],
    });
  });

  test('EC2 Instance Created', () => {
    template.hasResourceProperties('AWS::EC2::Instance', {
      AvailabilityZone: 'us-east-1a',
      IamInstanceProfile: {
        Ref: 'ec2instanceInstanceProfile9BCE9015',
      },
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
      InstanceType: 't3.micro',
      SecurityGroupIds: [
        stack.resolve(stack.securityGroup.onlyAllOutbound.securityGroupId),
      ],
      SubnetId: stack.resolve(stack.vpc.mainVPC.publicSubnets[0].subnetId),
      Tags: [
        {
          Key: 'Name',
          Value: 'Ec2S3RoleStack/ec2-instance',
        },
      ],
      UserData: {
        'Fn::Base64':
          '#!/usr/bin/env python3\r\n\r\nfrom datetime import datetime\r\nimport subprocess\r\n\r\nbucket_name = f\'s3://ec2-s3-role-{datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}\'\r\nfile_name = "HelloWorld.txt" \r\n\r\nsubprocess.run(["aws", "s3","mb",bucket_name], stderr=subprocess.PIPE, text=True)\r\n\r\nwith open(file_name, "w") as f:\r\n    f.write("Hello, World! I am Donald Armando!!!")\r\n\r\nsubprocess.run(["aws", "s3","mv",file_name,bucket_name], stderr=subprocess.PIPE, text=True)',
      },
    });
  });
});
