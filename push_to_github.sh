#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
target="https://github.com/RadiantSparkLLC/radiantspark-site.git"
if [ "$(git remote get-url origin)" != "$target" ]; then
  echo "Expected origin $target. Update origin before publishing." >&2
  exit 1
fi
if [ "$(git branch --show-current)" != main ]; then
  echo "Switch to main before publishing." >&2
  exit 1
fi
# Build the complete ZIP source before publishing.
npm --prefix website ci
npm run lint
npm run build
git add -- website assets index.html sw.js push_to_github.sh package.json package-lock.json publish-build.mjs README.md MERGE_VALIDATION.md app.html portal.html spardeals.html sparkdeals.html website.html
if ! git diff --cached --quiet; then
  git commit -m "Fix Pages delivery and refresh behavior"
fi
git push origin main
echo "Check deployment: https://github.com/RadiantSparkLLC/radiantspark-site/actions"
