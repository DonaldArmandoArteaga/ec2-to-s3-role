import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VPC {
  private readonly _mainVPC: Vpc;

  constructor(scope: Construct) {
    this._mainVPC = new Vpc(scope, 'ec2-to-s3-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      availabilityZones:['us-east-1a'],
      subnetConfiguration: [
        {
          name: 'public-subnet',
          cidrMask: 24,
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });
  }

  public get mainVPC(): Vpc {
    return this._mainVPC;
  }
}
