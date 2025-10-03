# chemins des compose
BASE_COMPOSE = docker-compose.yml
DEV_COMPOSE = docker-compose.dev.yml
PROD_COMPOSE = docker-compose.prod.yml

.PHONY: dev prod stop

dev:
	@echo "🚀 Lancement de la stack en mode DEV..."
	docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) up -d --build
	$(MAKE) studio

prod:
	@echo "🚀 Lancement de la stack en mode PROD..."
	docker compose -f $(BASE_COMPOSE) -f $(PROD_COMPOSE) up -d --build

stop:
	@echo "🛑 Arrêt des containers backend et frontend (DB + Redis conservés)..."
	- docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) rm -sf backend frontend
	- docker compose -f $(BASE_COMPOSE) -f $(PROD_COMPOSE) rm -sf backend frontend
	@echo "✅ Backend et frontend stoppés. DB + Redis tournent toujours."

logs-back:
	docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) logs -f backend

logs-front:
	docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) logs -f frontend

logs-db:
	docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) logs -f db

logs-redis:
	docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) logs -f redis

studio:
	@echo "🔍 Ouverture de Prisma Studio..."
	npx -w backend prisma studio