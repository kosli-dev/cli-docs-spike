# See README.md

demo() { "$(scripts_dir)/run_demo.sh"; }

scripts_dir()
{
  # BASH_SOURCE is empty inside a 'sourced' script
  local -r repo_home=$(git rev-parse --show-toplevel)
  echo "${repo_home}/scripts"
}

d()
{
  ./source/app/templates/build-simple-yml-html.sh
  demo
}