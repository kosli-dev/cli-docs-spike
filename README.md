
Spike of Kosli CLI documentation idea.  
Hovering over content auto-scrolls related/explanatory content in other dom elements into view.  
- Top section is a Trails `.kosli.yml` template file (lhs) and pane for commentary (rhs)   
![Screenshot](https://github.com/kosli-dev/cli-docs-spike/blob/main/docs/template.png?raw=true)
- Middle section is crude mock-up of Trail Attestations on a horizontal "washing line"
![Screenshot](https://github.com/kosli-dev/cli-docs-spike/blob/main/docs/attestations.png?raw=true)
- Bottom section is Github Actions `.yml` workflow (lhs) and pane for commentary (rhs)
![Screenshot](https://github.com/kosli-dev/cli-docs-spike/blob/main/docs/ci-workflow.png?raw=true)

Notes:
- The lhs yml file views are generated from actual yml files.
- Has minimal CSS styling.
- Has no commentary in the rhs panes yet (only lorem ipsum).

To try it out (requires docker, docker-compose, bash):
```shell
git clone git@github.com:kosli-dev/cli-docs-spike.git
cd cli-docs-spike
source scripts/shortcuts.sh
d
```
If port 80 is available, an html page will load in your default browser.
