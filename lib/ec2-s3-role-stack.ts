import * as cdk from "aws-cdk-lib";
import {
  Vpc,
  SubnetType,
  SecurityGroup,
  Peer,
  Port,
  Instance,
  InstanceType,
  InstanceClass,
  InstanceSize,
  AmazonLinuxImage,
  AmazonLinuxGeneration,
  UserData,
  CloudFormationInit,
  InitFile,
  InitConfig,
} from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal, ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { Construct } from "constructs";
import { readFileSync } from "fs";

export class Ec2S3RoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "ec2-to-s3-vpc", {
      cidr: "10.0.0.0/16",
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "public-subnet",
          cidrMask: 24,
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    const webserverSG = new SecurityGroup(this, "ec2-to-s3-sg", {
      vpc,
      allowAllOutbound: true,
    });

    const webserverRole = new Role(this, "ec2-to-s3-access-role", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
      ],
    });

    new Instance(this, "ec2-instance", {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      role: webserverRole,
      securityGroup: webserverSG,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData: UserData.custom(
        readFileSync("./scripts/s3.py", "utf8")
      ),
      userDataCausesReplacement:true,
      keyName: "ec2-input-system-instance-1-key",
    });
  }
}
