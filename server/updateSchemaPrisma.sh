#!/bin/sh

docker compose run -it --rm server npx prisma migrate dev
docker compose run -it --rm server npx prisma generate
