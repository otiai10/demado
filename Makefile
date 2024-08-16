
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
pkgv := $(shell jq .version package.json)
manv := $(shell jq .version src/public/manifest.json)
relv := $(shell jq .releases[0].version src/release-note.json)
last := $(shell git describe --tags --abbrev=0)
commits := $(shell git log $(last)..HEAD --no-merges --pretty="{\\\"title\\\": \\\"%s\\\", \\\"hash\\\":\\\"%H\\\"}" | grep -v 'bot' | head -20 | sed '$$!s/$$/,/')

draft:
	##################################################
	# 先に package.json のバージョンを変更してください
	#   packages.json     	$(pkgv)
	#   manifest.json     	$(manv)
	#   release-note.json	$(relv)
	##################################################
	@if [ $(pkgv) = $(manv) ]; then echo "\033[0;31m[ERROR]\033[0m package.json と manifest.json のバージョンが同じです"; exit 1; fi
	@jq ".version = \"$(pkgv)\"" src/public/manifest.json > src/public/manifest.json.tmp
	@echo "\033[0;32m[UPDATED]\033[0m manifest.json\t\t $(manv) =>  $(pkgv)"
	@mv src/public/manifest.json.tmp src/public/manifest.json
	@jq ".releases |= [{\"date\":\"$(date)\",\"version\":\"v$(pkgv)\",\"commits\":[$(commits)]}] + ." src/release-note.json > src/release-note.json.tmp
	@mv src/release-note.json.tmp src/release-note.json
	@echo "\033[0;32m[UPDATED]\033[0m release-note.json\t$(relv) => v$(pkgv)"
	##################################################
	@echo "\033[0;36m[PLEASE EDIT]\033[0m "`pwd`/src/release-note.json
