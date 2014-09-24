#!/bin/sh

# release/ に完結したパッケージを置く
mkdir -p release
cp manifest.json release/
mkdir -p release/build
cp build/app.min.js release/build/app.js
cp -r asset release/

# release/ につくったパッケージをまとめてzipする
zip -r demado.zip release/*
