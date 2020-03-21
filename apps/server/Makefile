DIR := ${CURDIR}

build-prod-server:
	sh deployment/build_prod.sh

run-dev-server:
	winpty docker run -it -p 5000:5000 --mount type=bind,source="$(DIR)/server",target=//app/server server:prod

run-prod-server:
	winpty docker run -it -p 5000:5000 server:prod