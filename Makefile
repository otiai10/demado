
clean:
	rm -rf release

beta-release: clean
	mkdir -p release
	pnpm run build

	npx -y tsx ./scripts/optimize-fontawesome.ts
	./node_modules/.bin/fontconv ./dist/assets/fontawesome-webfont.svg ./dist/assets/fontawesome-webfont.woff2
	./node_modules/.bin/fontconv ./dist/assets/fontawesome-webfont.svg ./dist/assets/fontawesome-webfont.woff
	./node_modules/.bin/fontconv ./dist/assets/fontawesome-webfont.svg ./dist/assets/fontawesome-webfont.ttf
	./node_modules/.bin/fontconv ./dist/assets/fontawesome-webfont.svg ./dist/assets/fontawesome-webfont.eot

	mv dist/icons/beta/*.png dist/icons/
	sed "s/\"demado\"/\"demado (BETA)\"/" src/public/manifest.json > dist/manifest.json
	cp -r dist release/demado-beta
	zip -r release/demado-beta.zip release/demado-beta/*

release: clean
	mkdir -p release
	pnpm run build
	rm -rf dist/icons/beta
	cp -r dist release/demado
	zip -r release/demado.zip release/demado/*
