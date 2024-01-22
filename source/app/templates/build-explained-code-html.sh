#!/usr/bin/env bash
set -Eeu

./source/app/templates/explainCode.py simple/ci-yml.py
./source/app/templates/explainCode.py simple/template-yml.py
