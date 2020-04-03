
build-postgres:
	docker build -f deployment/Dockerfile -t database:prod .

run-postgres:
	docker run --rm -it --name postgres_db -p 5431:5432 --network pcs_net -e POSTGRES_PASSWORD=testpass database:prod

deploy-postgres:
	make build-postgres && make run-postgres