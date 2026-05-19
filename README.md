# Candidate Manager

![CI](https://github.com/aliciaandriantsara/candidate_manager/actions/workflows/ci.yml/badge.svg)

## Application déployée
- **Frontend** : https://candidate-manager-1.onrender.com
- **Backend** : https://candidate-manager-ke2f.onrender.com

---

## Installation

### Prérequis
- Docker & Docker Compose
- Node.js 20+

### Lancer en local
\`\`\`bash
git clone https://github.com/aliciaandriantsara/candidate_manager.git
cd candidate_manager
docker-compose up --build
\`\`\`

- Frontend : http://localhost:5173
- Backend : http://localhost:3000
- MongoDB : localhost:27017

### Variables d'environnement
Créer un fichier \`.env\` à la racine :
\`\`\`env
MONGODB_URI=mongodb://mongodb:27017/candidate-manager
JWT_SECRET=supersecretjwt2024randomabcdefghijklmnop
NODE_ENV=development
PORT=3000
\`\`\`

---

## Architecture

\`\`\`
candidate-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── validators/
│   └── tests/
│       ├── unit/
│       └── integration/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── tests/
│   └── e2e/
├── k6/
└── .github/workflows/
\`\`\`

### Choix techniques
- **Express** : léger, flexible, ecosystème riche
- **MongoDB/Mongoose** : schéma flexible pour les candidats
- **Zod** : validation stricte avec messages d'erreur personnalisés
- **JWT** : authentification stateless scalable
- **Vitest** : plus rapide que Jest pour les projets Vite
- **Playwright** : tests E2E fiables multi-navigateurs

---

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/login | Connexion JWT |
| POST | /api/candidates | Créer un candidat |
| GET | /api/candidates/:id | Récupérer un candidat |
| PUT | /api/candidates/:id | Modifier un candidat |
| DELETE | /api/candidates/:id | Soft delete |
| POST | /api/candidates/:id/validate | Validation asynchrone (2s) |

---

## Stratégie de tests

### Tests unitaires (Jest/Vitest)
- **Backend** : 100% coverage sur services et modèles
- **Frontend** : 100% coverage sur hooks et utilitaires
\`\`\`bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
\`\`\`

### Tests d'intégration
- **Backend** : Supertest + mongodb-memory-server sur tous les endpoints
- **Frontend** : MSW (Mock Service Worker) pour simuler les API
\`\`\`bash
cd backend && npm run test:integration
\`\`\`

### Tests E2E (Playwright)
Scénario complet : connexion → création candidat → validation → suppression
Screenshots automatiques en cas d'échec
\`\`\`bash
cd frontend && npm run test:e2e
\`\`\`

### Tests de charge (k6)
500 requêtes simultanées sur POST /api/candidates
\`\`\`bash
k6 run k6/load-test.js
\`\`\`

#### Rapport de performance k6
| Métrique | Valeur |
|----------|--------|
| p95 response time | < 2000ms |
| Seuil erreurs | < 50/500 |
| VUs simultanés | 500 |

### Tests de sécurité
- Injection NoSQL sur les endpoints
- Brute force sur /api/auth/login
\`\`\`bash
cd backend && npm run test:integration -- --testPathPattern=security
\`\`\`

---

## Qualité continue

### Pre-commit hooks (Husky)
À chaque commit :
- ESLint + Prettier
- TypeScript check (tsc)
- Tests unitaires sur les fichiers modifiés

### GitHub Actions
À chaque push sur main :
- Lint backend et frontend
- Tests unitaires + couverture
- Blocage du merge si coverage < 90%

---

## Sécurité
- Validation stricte avec Zod (messages d'erreur personnalisés)
- Rate limiting : 100 requêtes / 15 minutes
- JWT avec secret minimum 32 caractères
- Soft delete (les données ne sont jamais supprimées)
- Variables sensibles via .env (jamais committées)
