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
        for n in range(start, start + count):
            line_kinds[n] = kind

    src_filename = f"{dir_path}/{m.data['src_filename']}"
    with open(src_filename, 'r') as src_file:
        src_lines = [src_line.rstrip() for src_line in src_file.readlines()]

    max_src_line_length = max(len(src_line) for src_line in src_lines)

    css_title = m.data['css_title']
    css_class = m.data['css_class']

    dst_lines = [
        f"<div class='title'>{css_title}</div>",
        f"<div class='{css_class}'>"
    ]
    for n, src_line in enumerate(src_lines, 1):
        dst_line = src_line.ljust(max_src_line_length+5)
        number = "%3s" % n
        kind = line_kinds.get(n, "")
        sn = "n" if kind == "" else "s"  # Something or Nothing
        # don't treat dst_line as jinja
        before = f"<span class='line {sn} {kind}'>{{% raw %}}"
        after = "{% endraw %}</span>"
        dst_lines.append(f"  {before}<span class='number'> {number}</span> {dst_line}{after}")
    dst_lines.append("</div>")

    dst_filename = f"{dir_path}/{m.data['dst_filename']}"
    with open(dst_filename, "w") as dst_file:
        for dst_line in dst_lines:
            dst_file.write(dst_line + "\n")
