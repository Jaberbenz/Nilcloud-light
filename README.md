# Nilcloud - Next-Gen Deployment Solution

## Overview

Nilcloud est une solution moderne de déploiement qui permet de créer et gérer des environnements de test de manière simple et efficace. Notre plateforme offre une interface intuitive pour la création de workflows de déploiement.

## Features

- 🚀 Déploiement rapide et automatisé
- 🔄 Workflow Builder interactif
- 🔒 Authentification sécurisée
- 💳 Intégration Stripe pour les paiements
- 🎨 Interface utilisateur moderne et responsive
- 📱 Design adaptatif pour tous les appareils

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**:
  - Redux Toolkit pour l'état global et RTK Query pour les API
  - Zustand pour les stores spécifiques (authentification, sessions)
- **Animation**: Framer Motion
- **Authentication**: Custom Auth Service
- **Payment**: Stripe Integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm ou yarn
- Compte Stripe (pour les paiements)

### Installation

1. Clonez le repository

```bash
git clone https://github.com/Jaberbenz/Nilcloud-light.git
cd Nilcloud-light
```

2. Installez les dépendances

```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_URL=your_public_url
```

4. Lancez le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication Pages
│   ├── dashboard/         # Dashboard Pages
│   └── layout.tsx         # Root Layout
├── assets/                # Static Assets
├── components/            # React Components
│   ├── sections/          # Page Sections
│   ├── WorkflowBuilder/   # Workflow Builder Components
│   ├── ReactFlowCanva/    # Flow Canvas Components
│   └── CustomNode/        # Custom Node Components
├── services/              # API Services
├── store/                 # Redux Store
└── providers/             # Context Providers
```

## Key Features

### Authentication

- Système d'authentification personnalisé
- Protection des routes avec AuthGuard
- Gestion des sessions
- Intégration avec les providers d'authentification

### Dashboard

- Interface moderne et responsive
- Navigation par sidebar
- Chargement dynamique du contenu
- Routes protégées

### Workflow Builder

- Interface interactive de création de workflow
- Implémentation de nœuds personnalisés
- Bibliothèque de nœuds avec drag-and-drop
- Visualisation en temps réel

### Payment Integration

- Intégration Stripe
- Gestion des abonnements
- Traitement sécurisé des paiements
- Configuration des clés API

## Development

### Code Style

- ESLint pour le linting
- Prettier pour le formatage
- TypeScript pour le typage statique

### Testing

```bash
npm run test
# ou
yarn test
```

### Build

```bash
npm run build
# ou
yarn build
```

### Environment Variables

Variables d'environnement requises :

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_URL`
- Autres clés API et configurations

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Stripe](https://stripe.com)
