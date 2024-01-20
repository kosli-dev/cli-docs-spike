#!/usr/bin/env bash
set -Eeu

repo_root() { git rev-parse --show-toplevel; }

TARGET_FILENAME="$(repo_root)/source/app/templates/ci-yml.html"

./source/app/templates/annotate.py ci-yml.py  > "${TARGET_FILENAME}"

