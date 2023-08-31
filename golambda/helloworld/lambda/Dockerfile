FROM public.ecr.aws/lambda/provided:al2 as build
RUN yum install -y golang
RUN go env -w GOPROXY=direct
ADD go.mod go.sum ./
RUN go mod download
ADD main.go ./
RUN go build -tags lambda.norpc -ldflags='-s' -o /helloworld main.go

# runtime
FROM public.ecr.aws/lambda/provided:al2
COPY --from=build /helloworld /helloworld
ENTRYPOINT [ "/helloworld" ]

