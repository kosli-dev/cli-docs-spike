#!/usr/bin/env python3

import importlib.util
import os
import sys

if __name__ == "__main__":  # pragma: no cover
    if len(sys.argv) < 2:
        print("Usage: annotate.py <filename>")
        exit(1)
    else:
        params_filename = sys.argv[1]

    dir_path = os.path.abspath(os.path.dirname(__file__))
    spec = importlib.util.spec_from_file_location('data', f"{dir_path}/{params_filename}")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)

    line_kinds = {}
    for (start, count), kind in m.data["lines"].items():
        for n in range(start, start+count):
            line_kinds[n] = kind

    filename = f"{dir_path}/{m.data['filename']}"
    with open(filename, 'r') as file:
        lines = [line.rstrip() for line in file.readlines()]

    max_length = max(len(line) for line in lines)

    css_title = m.data['css_title']
    css_class = m.data['css_class']

    print(f"<div class='title'>{css_title}</div>")
    print(f"<div class='{css_class}'>")

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
