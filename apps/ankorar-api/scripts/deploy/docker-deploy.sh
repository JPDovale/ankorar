#!/usr/bin/env bash
set -euo pipefail

# Build + tag + push para Docker Hub (usuário jpdv)
SCRIPT_DIR="$(dirname "$0")"
TAG="${1:-latest}"

"$SCRIPT_DIR/docker-build.sh" "$TAG"
"$SCRIPT_DIR/docker-push.sh" "$TAG"
