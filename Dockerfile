FROM ubuntu:20.04 AS builder

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -qq
RUN apt-get install -y \
  python2 nodejs npm zip

COPY . /app
WORKDIR /app
RUN npm ci && npm rebuild node-sass
RUN npm test
RUN npm run release

FROM alpine
WORKDIR /dest
COPY --from=builder /app/demado.zip /dest/demado.zip
COPY --from=builder /app/demado.xpi /dest/demado.xpi
