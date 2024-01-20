#!/usr/bin/env python3

import os
import sys


if __name__ == "__main__":  # pragma: no cover
    # if len(sys.argv) < 2:
    #     print("Usage: generate_new_api_key_for_user <user_name> [confirm]")
    #     exit(1)

    data = {
        "lines": {
            (39, 1): "trail",
            (70, 3): "dashboard_pull-request",
            (105, 4): "dashboard_lint",
            (134, 4): "dashboard",
            (171, 3): "dashboard_unit-test",
            (179, 4): "dashboard_branch-coverage",
            (214, 3): "dashboard_snyk",
        },
        "css_title": "Github Actions workflow",
        "css_class": "ci-yml",
        "filename": "main.yml"
    }

    line_kinds = {}
    for (start, count), kind in data["lines"].items():
        for n in range(start, start+count):
            line_kinds[n] = kind

    css_title = data['css_title']
    css_class = data['css_class']
    print(f"<div class='title'>{css_title}</div>")
    print(f"<div class='{css_class}'>")

    path = os.path.abspath(os.path.dirname(__file__))
    filename = f"{path}/{data['filename']}"
    with open(filename, 'r') as file:
        lines = [line.rstrip() for line in file.readlines()]

    max_length = max(len(line) for line in lines)

    for n, line in enumerate(lines, 1):
        line = line.ljust(max_length+5)
        number = "%3s" % n
        kind = line_kinds.get(n, "")
        sn = "n" if kind == "" else "s"  # Something or Nothing
        # don't treat the line as jinja
        before = f"<span class='line {sn} {kind}'>{{% raw %}}"
        after = "{% endraw %}</span>"
        print(f"  {before}<span class='number'> {number}</span> {line}{after}")

    print("</div>")
