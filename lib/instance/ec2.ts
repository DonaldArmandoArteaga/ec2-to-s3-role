import {
  AmazonLinuxGeneration,
  AmazonLinuxImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  SubnetType,
  UserData,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';

export class EC2Instance {
  constructor(
    scope: Construct,
    vpc: Vpc,
    securityGroup: SecurityGroup,
    role: Role
  ) {
    new Instance(scope, 'ec2-instance', {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      availabilityZone: 'us-east-1a',
      role,
      securityGroup,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData: UserData.custom(readFileSync('./scripts/s3.py', 'utf8')),
      userDataCausesReplacement: true,
    });
  }
}
