#!/bin/sh
set -e

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
	set -- node "$@"
fi

cp /app/android/app/build/outputs/apk/release/app-release.apk /app/build/app-release.apk

exec "$@"
