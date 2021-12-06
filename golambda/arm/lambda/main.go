package main

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(handle)
}

func handle(input string) (string, error) {
	fmt.Println("input: ", input)
	hasher := sha256.New()
	hasher.Write([]byte(input))
	sha := base64.URLEncoding.EncodeToString(hasher.Sum(nil))
	return sha, nil
}
