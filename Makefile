
clean:
	rm -rf release

release:
	mkdir -p release
	pnpm run build
	cp -r dist release/demado-beta
	zip -r release/demado-beta.zip release/demado-beta/*
