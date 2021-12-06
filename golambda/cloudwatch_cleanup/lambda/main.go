package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs/types"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"time"
)

func main() {
	lambda.Start(handle)
}

func handle() error {
	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(ctx)

	ec2Client := ec2.NewFromConfig(cfg)
	drresp, err := ec2Client.DescribeRegions(ctx, nil)
	if err != nil {
		fmt.Printf("describe regions failed: %v\n", err)
		return err
	}

	for _, region := range drresp.Regions {
		fmt.Println(*region.RegionName)

		if err != nil {
			fmt.Printf("loading default config failed: %v\n", err)
			return err
		}

		cfgr := cfg.Copy()
		cfgr.Region = *region.RegionName
		cloudwatchlogsClient := cloudwatchlogs.NewFromConfig(cfgr)

		var allLogGroups []types.LogGroup
		var nextToken *string

		for {
			dlgresp, err := cloudwatchlogsClient.DescribeLogGroups(ctx, &cloudwatchlogs.DescribeLogGroupsInput{
				Limit:     aws.Int32(50),
				NextToken: nextToken,
			})
			if err != nil {
				fmt.Printf("DescribeLogGroups failed: %v\n", err)
				return err
			}
			allLogGroups = append(allLogGroups, dlgresp.LogGroups...)

			nextToken = dlgresp.NextToken
			if nextToken == nil {
				break
			}
		}

		aYearAgo := time.Now().UnixMilli() - (365 * 24 * 60 * 60 * 1000)

		for _, lg := range allLogGroups {

			// set retention of 1 year if not set
			if lg.RetentionInDays == nil {
				_, err := cloudwatchlogsClient.PutRetentionPolicy(ctx, &cloudwatchlogs.PutRetentionPolicyInput{
					LogGroupName:    lg.LogGroupName,
					RetentionInDays: aws.Int32(365),
				})
				if err != nil {
					fmt.Printf("PutRetentionPolicy failed: %v\n", err)
					return err
				}
			}

			//fetch a logstream to check if log group is empty
			streams, err := cloudwatchlogsClient.DescribeLogStreams(ctx, &cloudwatchlogs.DescribeLogStreamsInput{
				LogGroupName: lg.LogGroupName,
				Limit:        aws.Int32(1),
			})
			if err != nil {
				fmt.Printf("DescribeLogStreams failed: %v\n", err)
				return err
			}

			//delete empty log streams older than a year
			if len(streams.LogStreams) == 0 && *lg.CreationTime < aYearAgo {
				_, err := cloudwatchlogsClient.DeleteLogGroup(ctx, &cloudwatchlogs.DeleteLogGroupInput{LogGroupName: lg.LogGroupName})
				if err != nil {
					fmt.Printf("DeleteLogGroup failed: %v\n", err)
					return err
				}
			}

		}

	}

	return nil
}
