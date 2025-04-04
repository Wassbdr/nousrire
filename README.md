# Maraude 92 - Site Web de l'Association

![Maraude 92](/public/images/maraude_logo.svg)

Ce projet est le site web officiel de l'association Maraude 92, une organisation dédiée à la distribution alimentaire et à la lutte contre la précarité dans le département des Hauts-de-Seine (92).

## 📋 Table des matières
- [Aperçu](#aperçu)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration Firebase](#configuration-firebase)
- [Déploiement](#déploiement)
- [Développement](#développement)
- [Contribution](#contribution)
- [Contact](#contact)

## 🌟 Aperçu

Maraude 92 est une plateforme web qui permet à l'association de présenter ses activités, partager des actualités, planifier des événements et faciliter l'engagement des bénévoles et donateurs potentiels.

## 🛠️ Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **React Router** - Gestion des routes
- **React PayPal JS** - Intégration des paiements

### Backend & Services
- **Firebase**
  - Firestore - Base de données NoSQL
  - Authentication - Gestion des utilisateurs
  - Storage - Stockage des images et fichiers
  - Hosting - Hébergement du site
- **EmailJS** - Envoi d'emails depuis le frontend
- **GitHub Actions** - CI/CD

## 💡 Fonctionnalités

### Publiques
- Page d'accueil avec présentation de l'association
- Section "Notre Mission" détaillant les objectifs
- Section "Nos Actions" présentant les activités
- Actualités et événements dynamiques
- Calendrier des distributions alimentaires
- Formulaire d'inscription pour les bénévoles
- Système de dons en ligne via PayPal
- Design responsive et animations fluides

### Administration
- Interface d'administration sécurisée
- Gestion des actualités (création, modification, suppression)
- Gestion des événements et du calendrier
- Upload d'images avec compression automatique

## 🏗️ Architecture

```
src/
  ├── components/     # Composants React réutilisables
  ├── config/         # Configuration (Firebase, etc.)
  ├── context/        # Contextes React (Auth, etc.)
  ├── hooks/          # Hooks personnalisés
  ├── pages/          # Pages principales de l'application
  ├── services/       # Services (Firestore, Email, etc.)
  ├── styles/         # Styles globaux et variables
  ├── types/          # Définitions de types TypeScript
  ├── utils/          # Fonctions utilitaires
  ├── App.tsx         # Composant principal
  └── index.tsx       # Point d'entrée
```

## ⚙️ Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/nourir.git
cd nourir
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet en utilisant le modèle `.env.example` :
```bash
cp .env.example .env
```
Et complétez avec vos informations Firebase et EmailJS.

4. Lancez le serveur de développement :
```bash
npm start
```

Le site sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## 🔥 Configuration Firebase

Ce projet utilise Firebase pour plusieurs fonctionnalités :

1. **Firestore** : Stockage des données (actualités, événements)
2. **Authentication** : Authentification des administrateurs
3. **Storage** : Stockage des images
4. **Hosting** : Déploiement de l'application

Les règles de sécurité pour Firestore et Storage sont définies dans `firestore.rules` et `storage.rules` respectivement.

## 🚀 Déploiement

Le déploiement se fait automatiquement via GitHub Actions lorsqu'un push est effectué sur la branche `main`.

Pour un déploiement manuel :
```bash
npm run build
firebase deploy
```

## 💻 Développement

### Scripts disponibles

- `npm start` : Lance le serveur de développement
- `npm run build` : Crée une version optimisée pour la production
- `npm test` : Lance les tests
- `npm run eject` : Éjecte la configuration (⚠️ opération irréversible)

### Monitoring et performances

Le projet inclut des outils de monitoring pour suivre l'utilisation des services Firebase :
- Nombre de documents dans les collections
- Utilisation du stockage
- Statistiques d'accès

## 👥 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout de nouvelle-fonctionnalite'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📞 Contact

Pour toute question ou suggestion concernant ce projet, contactez-nous à [nousrire.contact@gmail.com](mailto:nousrire.contact@gmail.com)

---

Développé avec ❤️ pour Maraude 92
