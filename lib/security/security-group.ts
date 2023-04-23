import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class SecurityGroups {
  private readonly _onlyAllOutbound: SecurityGroup;

  constructor(scope: Construct, vpc: Vpc) {
    this._onlyAllOutbound = new SecurityGroup(scope, 'ec2-to-s3-sg', {
      vpc,
      allowAllOutbound: true,
    });
  }

  public get onlyAllOutbound(): SecurityGroup {
    return this._onlyAllOutbound;
  }
}
