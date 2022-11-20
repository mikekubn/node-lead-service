#! /bin/bash

echo $PAT | docker login ghcr.io --username $USR --password-stdin
docker build -t lead-service:0.1.0 .
docker tag lead-service:0.1.0 ghcr.io/akcentacz/lead-service/lead-service:0.1.0
docker push ghcr.io/akcentacz/lead-service/lead-service:0.1.0
