#!/usr/bin/env python3

import os
import sys


if __name__ == "__main__":  # pragma: no cover
    # if len(sys.argv) < 2:
    #     print("Usage: generate_new_api_key_for_user <user_name> [confirm]")
    #     exit(1)

    print("<div class='title'>Github Actions workflow</div>")
    print("<div class='ci-yml'>")

    path = os.path.abspath(os.path.dirname(__file__))
    filename = f"{path}/main.yml"
    with open(filename, 'r') as file:
        lines = [line.rstrip() for line in file.readlines()]
        for n, line in enumerate(lines, 1):
            # don't treat the line as jinja
            before = "<span class='line'>{% raw %}"
            after = "{% endraw %}</span>"
            print(f"  {before}{line}{after}")

    print("</div>")
