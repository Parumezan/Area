ARG NODE_VERSION=18.12.0

FROM node:${NODE_VERSION}-alpine AS server

COPY docker/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

RUN apk add --no-cache \
	git \
	curl \
	;

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["docker-healthcheck"]

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

WORKDIR /app

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

COPY . .

RUN npm install

ENTRYPOINT [ "docker-entrypoint" ]
