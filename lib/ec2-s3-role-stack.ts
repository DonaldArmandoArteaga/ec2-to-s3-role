import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EC2Instance } from './instance/ec2';
import { IamRole } from './security/role';
import { SecurityGroups } from './security/security-group';
import { VPC } from './security/vpc';

export class Ec2S3RoleStack extends cdk.Stack {
  private readonly _vpc: VPC;
  private readonly _securityGroup: SecurityGroups;
  private readonly _role: IamRole;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this._vpc = new VPC(this);
    this._role = new IamRole(this);
    this._securityGroup = new SecurityGroups(this, this._vpc.mainVPC);
    new EC2Instance(
      this,
      this._vpc.mainVPC,
      this._securityGroup.onlyAllOutbound,
      this._role.s3Role
    );
  }

  public get vpc(): VPC {
    return this._vpc;
  }

  public get securityGroup(): SecurityGroups {
    return this._securityGroup;
  }
}
