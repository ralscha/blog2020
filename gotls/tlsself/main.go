package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func hello(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprintf(w, "hello world")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", hello)

	srv := &http.Server{
		Addr:         ":8443",
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		Handler:      mux,
	}
	log.Fatal(srv.ListenAndServeTLS("./cert.pem", "./key.pem"))
}
