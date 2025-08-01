.PHONY: check-dep
check-dep:
	cd ./babelfishchat/client && ncu
	cd ./babelfishchat/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./capacitor-push/client && ncu
	cd ./capacitor-push/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./chat/client && ncu
	cd ./chat/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./cryptochat/client && ncu
	cd ./cryptochat/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./geophotos/app && ncu
	cd ./geophotos/appmaptiler && ncu
	cd ./geophotos/extract && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./hashupgrade/argon2 && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./hashupgrade/jooq && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./hashupgrade/md5 && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./hCaptcha/basic && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./hCaptcha/ionic && ncu
	cd ./locationvideo && ncu
	cd ./protobuf-js2/client && ncu
	cd ./protobuf-js2/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./rxjs-websocket/client && ncu
	cd ./rxjs-websocket/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
