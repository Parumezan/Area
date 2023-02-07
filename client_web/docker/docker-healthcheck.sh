#!/bin/sh
set -e

if curl --fail http://localhost:8081; then
	exit 0
fi

exit 1
