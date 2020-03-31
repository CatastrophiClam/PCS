# Build apps
build-postgres:
	cd apps/database && make build-postgres

build-prod-server:
	cd apps/server && make build-prod-server

build-prod-webapp:
	cd apps/webapp && make build-prod-webapp

# Run apps
run-postgres:
	cd apps/database && make run-postgres

run-dev-server:
	cd apps/server && make run-dev-server

run-prod-server:
	cd apps/server && make run-prod-server

run-dev-webapp:
	cd apps/webapp/app make run-dev-webapp

run-prod-webapp:
	cd apps/webapp && make run-prod-webapp

# Deploy apps
deploy-postgres:
	cd apps/database && make deploy-postgres

deploy-prod-server:
	make build-prod-server && make run-prod-server

deploy-prod-webapp:
	make build-prod-webapp && make run-prod-webapp