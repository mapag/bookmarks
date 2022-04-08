db-dev-rm:
	docker compose rm dev-db -s -f -v

db-dev-up:
	docker compose up dev-db -d
	timeout 1

prisma-dev-deploy:
	npx prisma migrate deploy

db-dev-restart: db-dev-rm db-dev-up prisma-dev-deploy 

dev-prisma-studio:
	dotenv -e ./.env -- npx prisma studio

db-test-rm:
	docker compose rm test-db -s -f -v

db-test-up:
	docker compose up test-db -d
	timeout 1

prisma-test-deploy:
	dotenv -e ./.env.test -- npx prisma migrate deploy

db-test-restart: db-test-rm db-test-up prisma-test-deploy 

test-e2e: db-test-restart
	dotenv -e ./.env.test -- jest --watch --no-cache --config ./test/jest-e2e.json

test-prisma-studio:
	dotenv -e ./.env.test -- npx prisma studio
