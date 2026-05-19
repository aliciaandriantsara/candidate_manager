# Candidate Manager

Application full-stack de gestion de candidats (Node.js/Express/TypeScript + React/TypeScript + MongoDB).

![CI](https://github.com/YOUR_ORG/candidate-manager/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-%E2%89%A590%25-brightgreen)

## Stack

- **Backend** : Express, TypeScript, Mongoose, Zod, JWT, Winston
- **Frontend** : React, Vite, react-hook-form, react-hot-toast
- **Tests** : Jest, Supertest, Vitest, MSW, Playwright, k6
- **Infra** : Docker Compose, GitHub Actions, Render

## Dépannage Docker

### `lookup registry-1.docker.io: no such host` après modification DNS

La config `{"dns": ["8.8.8.8", "1.1.1.1"]}` seule peut casser Docker sur Ubuntu. **Restaurer** :

```bash
sudo mv /etc/docker/daemon.json /etc/docker/daemon.json.bak
# ou utiliser le modèle avec systemd-resolved :
sudo cp docker/daemon.json.example /etc/docker/daemon.json
sudo systemctl restart docker
docker pull node:20-alpine
```

### `npm error network read ETIMEDOUT` pendant le build

Le réseau est trop lent pour `npm install` **dans** l’image. **Solution recommandée** — MongoDB dans Docker, app en local :

```bash
docker compose -f docker-compose.dev.yml up -d

# Terminal 2 — backend
cd backend && cp .env.example .env
# MONGODB_URI=mongodb://admin:changeme@localhost:27017/candidate_manager?authSource=admin
npm install && npm run dev

# Terminal 3 — frontend
cd frontend && cp .env.example .env
npm install && npm run dev
```

### Build complet (quand le réseau est stable)

```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
docker compose up --build
```

Les `.dockerignore` évitent d’envoyer `node_modules` au builder (contexte ~1 Mo au lieu de ~90 Mo).

### Autres pistes

- `TLS handshake timeout` sur Docker Hub : réessayer, désactiver VPN, `docker pull node:20-alpine`
- Le compose utilise `network: host` pendant le build (Linux) pour réutiliser le DNS de la machine hôte

## Démarrage rapide

```bash
cd candidate-manager   # racine du projet (pas backend/)
cp .env.example .env
# Éditer JWT_SECRET (min. 32 caractères)

# Recommandé : générer les lockfiles avant le build Docker
cd backend && npm install && cd ../frontend && npm install && cd ..

docker compose up --build
```

- Frontend : http://localhost:5173
- API : http://localhost:3000
- MongoDB : localhost:27017

**Identifiants par défaut** : `admin@example.com` / `Admin123!`

## Développement local

```bash
cd backend && npm install && cp .env.example .env && npm run dev
cd frontend && npm install && cp .env.example .env && npm run dev
```

## Tests

```bash
# Backend
cd backend && npm test
cd backend && npm run test:coverage

# Frontend
cd frontend && npm test
cd frontend && npm run test:a11y

# E2E (services démarrés)
cd frontend && npx playwright install && npm run e2e

# Charge k6 (API + token)
k6 run k6/load-test.js -e API_URL=http://localhost:3000
```

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Connexion JWT |
| GET | `/api/candidates` | Liste paginée + filtres |
| POST | `/api/candidates` | Création |
| GET | `/api/candidates/:id` | Détail |
| PUT | `/api/candidates/:id` | Mise à jour partielle |
| DELETE | `/api/candidates/:id` | Soft delete |
| POST | `/api/candidates/:id/validate` | Validation async (~2s) |

## Déploiement Render

1. Connecter le dépôt GitHub
2. Créer un **Web Service** avec Docker (docker-compose ou Dockerfile backend)
3. Définir les variables : `JWT_SECRET`, `MONGODB_URI`, `AUTH_EMAIL`, `AUTH_PASSWORD`, `CORS_ORIGIN`, `VITE_API_URL`
4. MongoDB : MongoDB Atlas ou service Render MongoDB

## Structure

Voir le cahier des charges pour l'arborescence complète (`backend/`, `frontend/`, `.github/workflows/`, `k6/`).
