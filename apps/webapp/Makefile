build-prod-webapp:
	sh deployment/build_prod.sh

run-prod-webapp:
	docker run --rm -it -p 80:80 webapp:prod

run-dev-webapp:
	cd app && npm start