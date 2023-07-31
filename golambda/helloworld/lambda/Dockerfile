FROM golang:1.20.6-alpine3.17 as build
WORKDIR /src
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY main.go ./
RUN go build -ldflags='-s' -o /helloworld main.go

# runtime
FROM alpine:3.17.2
RUN addgroup -g 10001 nonroot && adduser -D -u 10001 -G nonroot nonroot
WORKDIR /
USER nonroot
COPY --from=build --chown=nonroot:nonroot /helloworld /helloworld
ENTRYPOINT [ "/helloworld" ]

