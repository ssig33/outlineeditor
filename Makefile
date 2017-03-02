glide_install:
	glide install

webpack:
	./node_modules/.bin/webpack --config webpack.build.js

build_static:
	go-bindata -o static/go-bindata.go -pkg static assets

build_linux:
	docker run -ti -v $(PWD):/go/src/outlineeditor golang bash -c "cd src/outlineeditor && go build"

all: glide_install webpack build_static build_linux
