.PHONY: upgrade-libraries
upgrade-libraries:
	@go get -u ./...
	@go fmt ./...
	@go mod tidy
	@go mod verify

