#!/usr/bin/env bash
set -euo pipefail

DOCKERHUB_USER="${DOCKERHUB_USER:-jpdv}"
IMAGE_NAME="ankorar-api"
TAG="${1:-latest}"
REMOTE="$DOCKERHUB_USER/$IMAGE_NAME:$TAG"

echo "Tagging and pushing $REMOTE"
docker tag "$IMAGE_NAME:$TAG" "$REMOTE"
docker push "$REMOTE"
echo "Pushed $REMOTE"
