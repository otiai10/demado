FROM ubuntu:20.04 AS builder

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -qq
RUN apt-get install -y \
  python2 nodejs npm zip

COPY . /app
WORKDIR /app
RUN npm install
RUN npm rebuild node-sass
RUN npm test
RUN npm run release

FROM alpine
WORKDIR /release
COPY --from=builder /app/demado.zip /release/demado.zip
COPY --from=builder /app/demado.xpi /release/demado.xpi

# How to use
#
# docker build -t demado .
# docker run demado
# docker cp demado:/release ./release
