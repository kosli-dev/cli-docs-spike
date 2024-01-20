#!/usr/bin/env bash
set -Eeu

export_env_vars()
{
  local -r kind="${1}"
  case "${kind}" in
    demo) local -r port=80   ;;
    unit) local -r port=3001 ;;
  system) local -r port=3002 ;;
  esac
  export $(echo_env_vars "${port}" "${kind}")
}

echo_env_vars()
{
  local -r port="${1}"  # See export_env_vars() above
  local -r kind="${2}"  # demo | system | unit
  local -r host_dir="$(git rev-parse --show-toplevel)"
  echo XY_KIND="${kind}"
  echo XY_HOST_PORT="${port}"
  echo XY_HOST_ROOT_DIR="${host_dir}"
  echo XY_HOST_COV_DIR="${host_dir}/coverage/${kind}"  # git ignored
  echo XY_CONTAINER_PORT=8001
  echo XY_CONTAINER_NAME="xy_${kind}"
  echo XY_CONTAINER_ROOT_DIR=/xy
  echo XY_CONTAINER_COV_DIR="/tmp/coverage/${kind}"
  echo XY_IMAGE_NAME=xy_image
  echo XY_NETWORK_NAME=xy_net # Also in docker-compose.yaml
  echo XY_USER_NAME=xy
  echo XY_GIT_COMMIT_SHA="$(git rev-parse HEAD)"
  if [ "${CI:-}" != 'true' ]; then
    # breakpoint() needs tty
    echo XY_TTY=--tty
  fi
}

ip_address()
{
  echo "http://localhost:${XY_HOST_PORT}"
}

die()
{
  echo >&2
  echo "Error: $*" >&2
  echo >&2
  exit 43
}

create_assets_builder()
{
  docker build --tag $(assets_builder_name) -f Dockerfile.assets "${XY_HOST_ROOT_DIR}"
}

refresh_static_assets()
{
  docker run \
    --rm \
    --volume "${XY_HOST_ROOT_DIR}/package.json:/app/package.json:ro" \
    --volume "${XY_HOST_ROOT_DIR}/source/static/scss:/app/scss:rw" \
    --volume "${XY_HOST_ROOT_DIR}/source/static/js:/app/js:rw" \
    --workdir /app \
    $(assets_builder_name) \
    bash -c "npm run build" \
      || die "refresh_assets.sh failed. Your docker image might be outdated. " \
         "Run 'docker image rm $(assets_builder_name)' and then try again"
}

assets_builder_name()
{
  echo assets-builder:v1
}

build_image()
{
  docker build \
    --build-arg XY_CONTAINER_ROOT_DIR \
    --build-arg XY_CONTAINER_PORT \
    --build-arg XY_USER_NAME \
    --build-arg XY_GIT_COMMIT_SHA \
    --file Dockerfile \
    --tag "${XY_IMAGE_NAME}" \
    "${XY_HOST_ROOT_DIR}"
}

bring_network_up()
{
  docker network inspect "${XY_NETWORK_NAME}" >/dev/null \
    || docker network create --driver bridge "${XY_NETWORK_NAME}"
}

bring_server_up()
{
  # The --project-name option is to silence warnings about orphan containers.
  sed "s/{NAME}/${XY_KIND}/" "${XY_HOST_ROOT_DIR}/docker-compose.yaml" \
    | docker-compose \
      --env-file="${XY_HOST_ROOT_DIR}/env_vars/test_${XY_KIND}_up.env" \
      --file - \
      --project-name "${XY_KIND}" \
      up --no-build --detach
}

restart_server()
{
  # There are several processes with the name gunicorn.
  # One for the 'master' and one each for the workers.
  # Send SIGHUP to the master which is the oldest (-o).
  docker exec \
    --interactive \
    "${XY_CONTAINER_NAME}" \
    sh -c "pkill -SIGHUP -o gunicorn"
}

wait_till_server_ready()
{
  local -r max_tries=15
  local -r url="$(ip_address)/api/health/ready"
  echo -n "Waiting for $(ip_address) readiness"
  for _ in $(seq 1 ${max_tries}); do
    echo -n .
    if [ $(curl --silent --write-out '%{http_code}' --output /dev/null "${url}") -eq 200 ]; then
      echo
      return 0
    else
      sleep 0.2
    fi
  done
  echo
  echo "Failed $(ip_address) readiness"
  docker container logs "${XY_CONTAINER_NAME}" || true
  exit 42
}
