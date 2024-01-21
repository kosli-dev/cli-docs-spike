#!/usr/bin/env python3

import importlib.util
import os
import sys
from collections import defaultdict

if __name__ == "__main__":  # pragma: no cover
    if len(sys.argv) < 2:
        print("Usage: explain.py <filename>")
        exit(1)
    else:
        params_path = sys.argv[1]

    my_path = os.path.abspath(os.path.dirname(__file__))
    spec = importlib.util.spec_from_file_location('data', f"{my_path}/{params_path}")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)

    dir_path = os.path.abspath(os.path.dirname(f"{my_path}/{params_path}"))

    line_kinds = defaultdict(list)
    for (start, count), kinds in m.data["lines"].items():
        if not isinstance(kinds, list):
            kinds = [kinds]
        for n in range(start, start + count):
            line_kinds[n].extend(kinds)

    src_filename = f"{dir_path}/{m.data['src_filename']}"
    with open(src_filename, 'r') as src_file:
        src_lines = [src_line.rstrip() for src_line in src_file.readlines()]

    max_src_line_length = max([87] + [len(src_line) for src_line in src_lines])

    css_title = m.data['css_title']
    css_class = m.data['css_class']

    dst_lines = [
        f"<div class='title'>{css_title}</div>",
        f"<div class='{css_class}'>"
    ]
    for n, src_line in enumerate(src_lines, 1):
        dst_line = src_line.ljust(max_src_line_length+5)
        number = "%3s" % n
        kinds = line_kinds.get(n, [])
        kinds = " ".join(kinds)
        sn = "n" if kinds == "" else "s"  # Something or Nothing
        # don't treat dst_line as jinja
        before = f"<span class='line {sn} {kinds}'>{{% raw %}}"
        after = "{% endraw %}</span>"
        dst_lines.append(f"  {before}<span class='number'> {number}</span> {dst_line}{after}")
    dst_lines.append("</div>")

    dst_filename = f"{dir_path}/{m.data['dst_filename']}"
    with open(dst_filename, "w") as dst_file:
        for dst_line in dst_lines:
            dst_file.write(dst_line + "\n")
