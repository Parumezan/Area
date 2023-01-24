#!/bin/sh
set -e

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
	set -- node "$@"
fi

npm rebuild esbuild

if [ "$APP_ENV" == 'prod' ]; then
	npm install --production
else
	npm install --prefer-offline
fi

exec "$@"
