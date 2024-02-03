#!/usr/bin/env bash
set -Eeu

./source/app/templates/explainCode.py simple_github/ci-yml.py
./source/app/templates/explainCode.py simple_github/template-yml.py

./source/app/templates/explainCode.py simple_gitlab/ci-yml.py
./source/app/templates/explainCode.py simple_gitlab/template-yml.py
