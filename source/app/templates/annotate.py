#!/usr/bin/env python3

import os
import sys


if __name__ == "__main__":  # pragma: no cover
    # if len(sys.argv) < 2:
    #     print("Usage: generate_new_api_key_for_user <user_name> [confirm]")
    #     exit(1)

    line_kinds = {}
    for n in range(31, 39+1):
        line_kinds[n] = "trail"
    for n in range(69, 71+1):
        line_kinds[n] = "dashboard_pull-request"
    for n in range(104, 107+1):
        line_kinds[n] = "dashboard_lint"
    for n in range(133, 136+1):
        line_kinds[n] = "dashboard"
    for n in range(173, 175+1):
        line_kinds[n] = "dashboard_unit-test"
    for n in range(177, 180+1):
        line_kinds[n] = "dashboard_branch-coverage"
    for n in range(212, 214+1):
        line_kinds[n] = "dashboard_snyk"

    print("<div class='title'>Github Actions workflow</div>")
    print("<div class='ci-yml'>")

    path = os.path.abspath(os.path.dirname(__file__))
    filename = f"{path}/main.yml"
    with open(filename, 'r') as file:
        lines = [line.rstrip() for line in file.readlines()]
        for n, line in enumerate(lines, 1):
            kind = line_kinds.get(n, "")
            # don't treat the line as jinja
            before = f"<span class='line {kind}'>{{% raw %}}"
            after = "{% endraw %}</span>"
            print(f"  {before}{line}{after}")

    print("</div>")
