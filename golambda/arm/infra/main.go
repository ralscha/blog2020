package main

import (
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/cloudwatch"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/lambda"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

const name = "hash"

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
	})
	if err != nil {
		return nil, err
	}

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

	codeArchive := pulumi.NewAssetArchive(map[string]interface{}{
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
		Timeout:       pulumi.Int(3),
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
