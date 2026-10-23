FROM public.ecr.aws/lambda/provided:al2023 as build
RUN dnf install -y golang && dnf clean all
RUN go env -w GOPROXY=direct
ADD go.mod go.sum ./
RUN go mod download
ADD main.go ./
RUN go build -tags lambda.norpc -ldflags='-s' -o /helloworld main.go

# runtime
FROM public.ecr.aws/lambda/provided:al2023
COPY --from=build /helloworld /helloworld
ENTRYPOINT [ "/helloworld" ]

