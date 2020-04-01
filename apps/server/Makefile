DIR := ${CURDIR}

build-prod-server:
	sh deployment/build_prod.sh

run-dev-server:
	docker run --rm -it -p 5000:5000 --mount type=bind,source="$(DIR)/server",target=//app/server --net=host server:prod

run-prod-server:
	docker run --rm -it -p 5000:5000 --net=host server:prod