import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IamRole {
  private readonly _s3Role: Role;

  constructor(scope: Construct) {
    this._s3Role = new Role(scope, 'ec2-to-s3-access-role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });
  }

  public get s3Role(): Role {
    return this._s3Role;
  }
}
