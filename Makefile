db-dev-rm:
	docker compose rm dev-db -s -f -v

db-dev-up:
	docker compose up dev-db -d
	timeout 1

prisma-dev-deploy:
	npx prisma migrate deploy

db-dev-restart: db-dev-rm db-dev-up prisma-dev-deploy 
	
