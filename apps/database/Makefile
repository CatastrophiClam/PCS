
build-postgres:
	docker build -f deployment/Dockerfile -t database:prod .

run-postgres:
	docker run -p 5431:5432 -e POSTGRES_PASSWORD=testpass database:prod

deploy-postgres:
	make build-postgres && make run-postgres