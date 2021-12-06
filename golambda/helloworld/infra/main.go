package main

import (
	"encoding/base64"
	"errors"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/cloudwatch"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/ecr"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/lambda"
	"github.com/pulumi/pulumi-docker/sdk/v3/go/docker"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"strings"
)

const name = "helloworld"

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		repo, err := createPrivateEcrRepository(ctx)
		if err != nil {
			return err
		}

		err = createEcrRepositoryLifecycle(ctx, err, repo)
		if err != nil {
			return err
		}

		registryInfo := getRegistryInfo(ctx, repo)

		// Build and publish the container image.
		image, err := docker.NewImage(ctx, name+"-image", &docker.ImageArgs{
			Build:     &docker.DockerBuildArgs{Context: pulumi.String("../lambda")},
			ImageName: repo.RepositoryUrl,
			Registry:  registryInfo,
		})
		if err != nil {
			return err
		}

		role, err := createIamRoleForLambda(ctx)
		if err != nil {
			return err
		}

		function, err := createLambda(ctx, image, role)
		if err != nil {
			return err
		}

		// Export the lambda ARN.
		ctx.Export("lambda", function.Arn)

		return nil
	})
}

func createPrivateEcrRepository(ctx *pulumi.Context) (*ecr.Repository, error) {
	repo, err := ecr.NewRepository(ctx, name+"-repo", nil)
	if err != nil {
		return nil, err
	}
	return repo, nil
}

func createEcrRepositoryLifecycle(ctx *pulumi.Context, err error, repo *ecr.Repository) error {
	_, err = ecr.NewLifecyclePolicy(ctx, name+"-policy", &ecr.LifecyclePolicyArgs{
		Repository: repo.Name,
		Policy: pulumi.String(`{
        "rules": [{
            "rulePriority": 1,
            "description": "Expire untagged images after 7 days",
            "selection": {
                "tagStatus": "untagged",
                "countType": "sinceImagePushed",
                "countUnit": "days",
                "countNumber": 7
            },
            "action": {
                "type": "expire"
            }
        }]
      }`),
	})
	return err
}

func getRegistryInfo(ctx *pulumi.Context, repo *ecr.Repository) docker.ImageRegistryOutput {
	registryInfo := repo.RegistryId.ApplyT(func(id string) (docker.ImageRegistry, error) {
		creds, err := ecr.GetCredentials(ctx, &ecr.GetCredentialsArgs{RegistryId: id})
		if err != nil {
			return docker.ImageRegistry{}, err
		}
		decoded, err := base64.StdEncoding.DecodeString(creds.AuthorizationToken)
		if err != nil {
			return docker.ImageRegistry{}, err
		}
		parts := strings.Split(string(decoded), ":")
		if len(parts) != 2 {
			return docker.ImageRegistry{}, errors.New("invalid credentials")
		}
		return docker.ImageRegistry{
			Server:   creds.ProxyEndpoint,
			Username: parts[0],
			Password: parts[1],
		}, nil
	}).(docker.ImageRegistryOutput)
	return registryInfo
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

func createLambda(ctx *pulumi.Context, image *docker.Image, role *iam.Role) (*lambda.Function, error) {
	logGroup, err := cloudwatch.NewLogGroup(ctx, name, &cloudwatch.LogGroupArgs{
		Name:            pulumi.String("/aws/lambda/" + name),
		RetentionInDays: pulumi.Int(30),
	})
	if err != nil {
		return nil, err
	}

	args := &lambda.FunctionArgs{
		ImageUri:    image.ImageName,
		MemorySize:  pulumi.Int(128),
		Name:        pulumi.String(name),
		PackageType: pulumi.String("Image"),
		Publish:     pulumi.Bool(false),
		Role:        role.Arn,
		Timeout:     pulumi.Int(3),
	}

	function, err := lambda.NewFunction(
		ctx,
		name+"-lambda",
		args,
		pulumi.DependsOn([]pulumi.Resource{role, logGroup}),
	)
	if err != nil {
		return nil, err
	}

	return function, nil
}
