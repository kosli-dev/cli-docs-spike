#!/usr/bin/env bash
set -Eeu

./source/app/templates/explain.py simple/ci-yml.py
./source/app/templates/explain.py simple/template-yml.py
