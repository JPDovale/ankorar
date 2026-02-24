#!/usr/bin/env bash
set -euo pipefail

# Build a partir da raiz do monorepo (contexto do Dockerfile)
REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
IMAGE_NAME="ankorar-api"
TAG="${1:-latest}"

echo "Building from $REPO_ROOT (tag: $TAG)"
docker build -f "$REPO_ROOT/apps/ankorar-api/Dockerfile" -t "$IMAGE_NAME:$TAG" "$REPO_ROOT"
echo "Built $IMAGE_NAME:$TAG"
