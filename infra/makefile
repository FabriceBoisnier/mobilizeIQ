# chemins des compose
BASE_COMPOSE = docker-compose.yml
DEV_COMPOSE = docker-compose.dev.yml
PROD_COMPOSE = docker-compose.prod.yml

.PHONY: dev prod stop

dev:
	@echo "🚀 Lancement de la stack en mode DEV..."
	docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) up -d --build

prod:
	@echo "🚀 Lancement de la stack en mode PROD..."
	docker compose -f $(BASE_COMPOSE) -f $(PROD_COMPOSE) up -d --build

stop:
	@echo "🛑 Arrêt des containers backend et frontend (DB + Redis conservés)..."
	- docker compose -f $(BASE_COMPOSE) -f $(DEV_COMPOSE) rm -sf backend frontend
	- docker compose -f $(BASE_COMPOSE) -f $(PROD_COMPOSE) rm -sf backend frontend
	@echo "✅ Backend et frontend stoppés. DB + Redis tournent toujours."
