# demado

[![Dependabot Updates](https://github.com/otiai10/demado/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/otiai10/demado/actions/workflows/dependabot/dependabot-updates)
[![Node.js CI](https://github.com/otiai10/demado/actions/workflows/node-ci.yaml/badge.svg)](https://github.com/otiai10/demado/actions/workflows/node-ci.yaml)
[![codecov](https://codecov.io/gh/otiai10/demado/graph/badge.svg?token=2vdGdzZZkq)](https://codecov.io/gh/otiai10/demado)

[![Webstore PROD Publish](https://github.com/otiai10/demado/actions/workflows/webstore-prod.yaml/badge.svg)](https://github.com/otiai10/demado/actions/workflows/webstore-prod.yaml)
[![Webstore BETA Publish](https://github.com/otiai10/demado/actions/workflows/webstore-beta.yaml/badge.svg)](https://github.com/otiai10/demado/actions/workflows/webstore-beta.yaml)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dfmhlfpfpbijchleocfbpcdjgnbpdigh.svg)](https://chrome.google.com/webstore/detail/demado/dfmhlfpfpbijchleocfbpcdjgnbpdigh?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/dfmhlfpfpbijchleocfbpcdjgnbpdigh.svg)](https://chrome.google.com/webstore/detail/demado/dfmhlfpfpbijchleocfbpcdjgnbpdigh?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/dfmhlfpfpbijchleocfbpcdjgnbpdigh.svg)](https://chrome.google.com/webstore/detail/demado/dfmhlfpfpbijchleocfbpcdjgnbpdigh)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating-count/dfmhlfpfpbijchleocfbpcdjgnbpdigh.svg)](https://chromewebstore.google.com/detail/demado/dfmhlfpfpbijchleocfbpcdjgnbpdigh)

ブラゲーのランチャー

[![Beta Version](https://img.shields.io/badge/BETA%E3%83%86%E3%82%B9%E3%83%88%E7%89%88-%E5%8F%82%E5%8A%A0%E3%81%99%E3%82%8B-blue)](https://chromewebstore.google.com/detail/demado-beta/cmgapdlnfeimachfnigblaopoichmijf)

# 開発

* node 20.15.1
* pnpm 9.6.0

```sh
## (0) 環境チェック (or equivalent)
nvm use v20
npm install -g pnpm

## (1) ソースのダウンロード
git clone git@github.com:otiai10/demado.git
cd demado
pnpm install

## (2) 自動ビルドのスタート
pnpm start

## (3) 拡張のインストール
## (3-a) Chromeブラウザからロードする場合
# https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=ja#load-unpacked

## (3-b) コマンドラインからロードする場合
open -a "Google Chrome" --args \
  --load-extension=${PWD}/dist \
  --force-dev-mode-highlighting \
  --no-default-browser-check

## (4) 開発
# src以下のファイルを編集すると自動ビルドが走ります
```

# リリース

### 前提

* 開発はすべて`develop`で行う. `main`は完全にbackup branchとしての役割しかない
* リリーススクリプトによりtagがpushされている可能性があるため、開発を始める前に `git pull origin develop --tags` を忘れない

### 準備

1. `develop`にすべての変更がcommitされpushされる
2. [package.json](./package.json)の`version`を更新
3. `make draft` する
4. [release-note.json](./src/release-note.json)がドラフトされているので、編集する
5. この編集で生まれた`package.json`,`manifest.json`,`release-note.json`のdiffを、2で変更したバージョン名としてコミットする
6. GitHubにdevelopブランチをpushし、準備完了（これ以降cliでの作業はなし）

### BETAリリース（GitHubのウェブUIで完結）

1. `develop`->`main`へのpull-requestを作成する
2. **適当なタイミングで**pull-requestのタイトルを `[vX.X.X] xxxxx` の形式にrenameする（上記 準備[2]と同様のバージョン名がのぞましい）
3. このrenameをトリガーに、`vX.X.X` がBETA版にリリースされる

### PRODリリース（GitHubのウェブUIで完結）

1. 上記のdevelop→mainのpull_requestがマージする
2. あとは自動で公開版にリリースしてtagもつけてくれる

# テストとカバレッジ

```sh
pnpm test run -- --coverage
```

[![Coverage](https://codecov.io/gh/otiai10/demado/graphs/tree.svg?token=2vdGdzZZkq)](https://app.codecov.io/gh/otiai10/demado)

# 不具合など報告

* https://github.com/otiai10/demado/issues

# ほしいものリスト

* https://www.amazon.co.jp/hz/wishlist/ls/2TM2C8W3AIRMH?tag=otiai10-22
