
Spike of Kosli CLI documentation idea.  
Hovering over and clicking content auto scrolls related content in other dom elements into view.  
- Top section is Trails .kosli.yml file (rhs) and pane for commentary (lhs)   
![Screenshot](https://github.com/kosli-dev/cli-docs-spike/blob/main/docs/template.png?raw=true)
- Middle section is crude mock-up of Trail Attestations on a "washing line"
![Screenshot](https://github.com/kosli-dev/cli-docs-spike/blob/main/docs/attestations.png?raw=true)
- Bottom section is Github Actions yml workflow (rhs) and pane for commentary (lhs)
![Screenshot](https://github.com/kosli-dev/cli-docs-spike/blob/main/docs/ci-workflow.png?raw=true)

Note:
- Has minimal CSS styling
- Has minimal actual commentary in the lhs panes
- Requires docker, docker-compose, bash.  

To try it out:
```shell
git clone git@github.com:kosli-dev/cli-docs-spike.git
cd cli-docs-spike
source scripts/shortcuts.sh
d
```
If port 80 is available, an html page will load in your default browser.

