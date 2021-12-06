.PHONY: build
build:
	make -C ../lambda build
	
.PHONY: up
up: build
	aws-vault exec home -- pulumi up

.PHONY: down
down:
	aws-vault exec home -- pulumi destroy

.PHONY: call-lambda
call-lambda:
	aws-vault exec home -- aws lambda invoke \
      --function-name ${shell pulumi stack output lambda} \
      --region ${shell pulumi config get aws:region} \
			--cli-binary-format raw-in-base64-out \
			--payload '"hello world"' \
			out.json

.PHONY: upgrade-libraries
upgrade-libraries:
	@go get -u ./...
	@go fmt ./...
	@go mod tidy
	@go mod verify