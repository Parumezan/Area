#!/bin/sh
set -e

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
	set -- node "$@"
fi

# npm rebuild esbuild
npm i -g prisma
npm i --prefer-offline

# # update db
prisma migrate deploy
prisma generate

npm run start:dev

exec "$@"
