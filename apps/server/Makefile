DIR := ${CURDIR}

build-prod-server:
	sh deployment/build_prod.sh

run-dev-server:
	docker run --rm -it -p 5000:5000 --mount type=bind,source="$(DIR)/server",target=//app/server server:prod

run-prod-server:
	docker run --rm -it -p 5000:5000 server:prod