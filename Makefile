
clean:
	rm -rf release

beta-release: clean
	mkdir -p release
	pnpm run build
	npx -y tsx ./scripts/optimize-fontawesome.ts
	mv dist/icons/beta/*.png dist/icons/
	sed "s/\"demado\"/\"demado (BETA)\"/" src/public/manifest.json > dist/manifest.json
	cp -r dist release/demado-beta
	zip -r release/demado-beta.zip release/demado-beta/*

release: clean
	mkdir -p release
	pnpm run build
	npx -y tsx ./scripts/optimize-fontawesome.ts
	rm -rf dist/icons/beta
	cp -r dist release/demado
	zip -r release/demado.zip release/demado/*

date := $(shell date '+%Y-%m-%d')
vers := $(shell jq .version package.json)
last := $(shell git describe --tags --abbrev=0)
messages := $(shell git log $(last)..HEAD --no-merges --pretty="{\\\"title\\\": \\\"%s\\\", \\\"hash\\\":\\\"%H\\\"}" | grep -v 'bot' | head -10 | sed '$$!s/$$/,/')
draft:
	# 先に package.json のバージョンを変更してくださいね〜
	jq ".version = \"$(vers)\"" src/public/manifest.json > src/public/manifest.json.tmp
	mv src/public/manifest.json.tmp src/public/manifest.json
	jq ".releases |= [{\"date\":\"$(date)\",\"version\":\"$(vers)\",\"messages\":[$(messages)]}] + ." src/public/release-note.json > src/public/release-note.json.tmp
	mv src/public/release-note.json.tmp src/public/release-note.json
