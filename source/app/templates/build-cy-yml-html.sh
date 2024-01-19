#!/usr/bin/env bash
set -Eeu

repo_root() { git rev-parse --show-toplevel; }

#SOURCE_FILENAME="${repo_root}/source/app/templates/main.yml"
TARGET_FILENAME="$(repo_root)/source/app/templates/ci-yml.html"

./source/app/templates/annotate.py > "${TARGET_FILENAME}"