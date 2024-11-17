.PHONY: upgrade-libraries
upgrade-libraries:
	@go get go@latest
	@go get -u ./...
	@go fmt ./...
	@go mod tidy
	@go mod verify

.PHONY: build
build:
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0  go build -tags lambda.norpc -ldflags='-s' -o main .