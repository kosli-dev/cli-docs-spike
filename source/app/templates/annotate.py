#!/usr/bin/env python3

import os
import sys


if __name__ == "__main__":  # pragma: no cover
    # if len(sys.argv) < 2:
    #     print("Usage: generate_new_api_key_for_user <user_name> [confirm]")
    #     exit(1)

    line_kinds = {}
    data = {
        (39, 1): "trail",
        (69, 3): "dashboard_pull-request",
        (104, 4): "dashboard_lint",
        (133, 4): "dashboard",
        (171, 3): "dashboard_unit-test",
        (179, 4): "dashboard_branch-coverage",
        (214, 3): "dashboard_snyk"
    }
    for (start, count), kind in data.items():
        for n in range(start, start+count):
            line_kinds[n] = kind

    print("<div class='title'>Github Actions workflow</div>")
    print("<div class='ci-yml'>")

    path = os.path.abspath(os.path.dirname(__file__))
    filename = f"{path}/main.yml"
    with open(filename, 'r') as file:
        lines = [line.rstrip() for line in file.readlines()]
        for n, line in enumerate(lines, 1):
            number = "%3s" % n
            kind = line_kinds.get(n, "")
            # don't treat the line as jinja
            before = f"<span class='line {kind}'>{{% raw %}}"
            after = "{% endraw %}</span>"
            print(f"  {before}{number} {line}{after}")

    print("</div>")
