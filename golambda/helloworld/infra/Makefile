.PHONY: up
up:
	aws-vault exec home -- pulumi up

.PHONY: down
down:
	aws-vault exec home -- pulumi destroy

.PHONY: call-lambda
call-lambda:
	aws-vault exec home -- aws lambda invoke \
      --function-name ${shell pulumi stack output lambda} \
      --region ${shell pulumi config get aws:region} out.json

.PHONY: upgrade-libraries
upgrade-libraries:
	@go get go@latest
	@go get -u ./...
	@go fmt ./...
	@go mod tidy
	@go mod verify
