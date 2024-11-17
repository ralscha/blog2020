## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	
## upgrade-libraries: upgrade all libraries and run tidy and verify
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