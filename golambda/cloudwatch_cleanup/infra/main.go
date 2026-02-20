package main

import (
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/cloudwatch"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/lambda"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

const name = "cloudwatch-cleanup"

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		role, err := createIamRoleForLambda(ctx)
		if err != nil {
			return err
		}

		function, err := createLambda(ctx, role)
		if err != nil {
			return err
		}

		onceAMonthRule, err := cloudwatch.NewEventRule(ctx, name+"-onceAMonth", &cloudwatch.EventRuleArgs{
			Description:        pulumi.String("Triggers Cloudwatch Cleanup Lambda once a month"),
			ScheduleExpression: pulumi.String("cron(0 6 1 * ? *)"),
		})
		if err != nil {
			return err
		}

		_, err = cloudwatch.NewEventTarget(ctx, name+"-onceAMonthTarget", &cloudwatch.EventTargetArgs{
			Rule: onceAMonthRule.Name,
			Arn:  function.Arn,
		})
		if err != nil {
			return err
		}

		_, err = lambda.NewPermission(ctx, name+"-allow-cloudwatch-to-call-lambda", &lambda.PermissionArgs{
			Action:      pulumi.String("lambda:InvokeFunction"),
			Function:    function.Name,
			Principal:   pulumi.String("events.amazonaws.com"),
			SourceArn:   onceAMonthRule.Arn,
			StatementId: pulumi.String("AllowExecutionFromCloudWatch"),
		})
		if err != nil {
			return err
		}

		// Export the lambda ARN.
		ctx.Export("lambda", function.Arn)

		return nil
	})
}

func createIamRoleForLambda(ctx *pulumi.Context) (*iam.Role, error) {
	role, err := iam.NewRole(ctx, name+"-lambda-exec-role", &iam.RoleArgs{
		AssumeRolePolicy: pulumi.String(`{
							"Version": "2012-10-17",
							"Statement": [{
								"Sid": "",
								"Effect": "Allow",
								"Principal": {
									"Service": "lambda.amazonaws.com"
								},
								"Action": "sts:AssumeRole"
							}]
						}`),
		InlinePolicies: iam.RoleInlinePolicyArray{iam.RoleInlinePolicyArgs{
			Name: pulumi.String("logwatch"),
			Policy: pulumi.String(`{
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Effect": "Allow",
                  "Action": [
                      "logs:DescribeLogGroups",
                      "ec2:DescribeRegions",
                      "logs:PutRetentionPolicy",
                      "logs:DescribeLogStreams",
                      "logs:DeleteLogGroup"
                  ],
                  "Resource": "*"
              }
          ]
      }`),
		}},
	})

	_, err = iam.NewRolePolicyAttachment(ctx, name+"-lambda-exec", &iam.RolePolicyAttachmentArgs{
		Role:      role.Name,
		PolicyArn: pulumi.String("arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"),
	})
	if err != nil {
		return nil, err
	}

	return role, nil
}

func createLambda(ctx *pulumi.Context, role *iam.Role) (*lambda.Function, error) {
	logGroup, err := cloudwatch.NewLogGroup(ctx, name, &cloudwatch.LogGroupArgs{
		Name:            pulumi.String("/aws/lambda/" + name),
		RetentionInDays: pulumi.Int(30),
	})
	if err != nil {
		return nil, err
	}

	codeArchive := pulumi.NewAssetArchive(map[string]any{
		"bootstrap": pulumi.NewFileAsset("../lambda/main"),
	})

	args := &lambda.FunctionArgs{
		Runtime:       pulumi.String("provided.al2"),
		Handler:       pulumi.String("bootstrap"),
		Code:          codeArchive,
		MemorySize:    pulumi.Int(128),
		Name:          pulumi.String(name),
		Publish:       pulumi.Bool(false),
		Role:          role.Arn,
		Timeout:       pulumi.Int(60),
		Architectures: pulumi.StringArray{pulumi.String("arm64")},
	}

	function, err := lambda.NewFunction(
		ctx,
		name,
		args,
		pulumi.DependsOn([]pulumi.Resource{role, logGroup}),
	)
	if err != nil {
		return nil, err
	}
	return function, nil
}
