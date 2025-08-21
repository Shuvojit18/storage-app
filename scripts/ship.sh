#!/usr/bin/env bash
# Usage: ./scripts/ship.sh https://github.com/<you>/<repo>.git
set -euo pipefail
REPO_URL="${1:-}"
if [ -z "$REPO_URL" ]; then
  echo "Usage: $0 https://github.com/<you>/<repo>.git"
  exit 1
fi
git init
git add .
GIT_COMMITTER_NAME="auto" GIT_COMMITTER_EMAIL="auto@local"   git commit -m "feat: media-timeline SoC" --author="auto <auto@local>" || true
git branch -M main
if git remote | grep -q '^origin$'; then git remote remove origin; fi
git remote add origin "$REPO_URL"
git push -u origin main
