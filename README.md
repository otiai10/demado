# demado

ブラゲーのランチャー

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

* `make release`
* `make beta-release`

# 不具合など報告

* https://github.com/otiai10/demado/issues

# ほしいものリスト

* https://www.amazon.co.jp/hz/wishlist/ls/2TM2C8W3AIRMH?tag=otiai10-22
