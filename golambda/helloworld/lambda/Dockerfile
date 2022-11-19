FROM golang:1.19.3-alpine3.16 as build
WORKDIR /src
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY main.go ./
RUN go build -ldflags='-s' -o /helloworld main.go

# runtime
FROM alpine:3.16.1
RUN addgroup -g 10001 nonroot && adduser -D -u 10001 -G nonroot nonroot
WORKDIR /
USER nonroot
COPY --from=build --chown=nonroot:nonroot /helloworld /helloworld
ENTRYPOINT [ "/helloworld" ]

