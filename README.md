# TicTacTrip Justify API

Une API REST Node.js pour justifier du texte avec une limite de 80 caractères par ligne et un système de limitation de
tokens (80 000 mots/jour par utilisateur).

## 📋 Description

Cette API permet de justifier automatiquement du texte en respectant une largeur maximale de 80 caractères par ligne.
Elle intègre un système d'authentification par token et une limitation d'utilisation quotidienne pour chaque
utilisateur.

## 🚀 Fonctionnalités

- ✅ Justification de texte (80 caractères max par ligne)
- 🔐 Authentification par token JWT
- 📊 Limitation de 80 000 mots par jour et par utilisateur

## 🛠️ Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **TypeScript** - Typage statique pour JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL (avec Mongoose ODM)
- **Redis** - Cache en mémoire et gestion des sessions
- **JWT** - JSON Web Tokens pour l'authentification
- **Zod** - Validation de schémas et typage
- **Swagger** - Documentation API interactive
- **Jest** - Framework de tests unitaires
- **Docker** - Conteneurisation de l'application

## 📦 Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Docker et Docker Compose (optionnel)

### Étapes d'installation

1. Clonez le repository

```bash
git clone https://github.com/Ameur-bellil/tictactrip-justify-api.git
cd tictactrip-justify-api
```

2. Installez les dépendances

```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/justify-api
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key-change-this-in-production
```

4. Lancez le serveur

```bash
npm start
# ou
yarn start
```

Le serveur démarre par défaut sur `http://localhost:3000`

### 🐳 Installation avec Docker

1. Assurez-vous que Docker et Docker Compose sont installés

2. Lancez l'application avec Docker Compose

```bash
docker-compose up -d
```

3. L'API sera accessible sur `http://localhost:3000`

4. Pour arrêter les conteneurs

```bash
docker-compose down
```

## 📚 Utilisation

### 📖 Documentation API (Swagger)

Une fois le serveur lancé, accédez à la documentation interactive Swagger :

```
http://localhost:3000/api-docs
```

### 1. Inscription

authentication par token JWT:

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
  }'
```

Réponse :

```json
{
  "token": "votre_token_jwt"
}
```

### 3. Justification de texte

Utilisez votre token pour justifier du texte :

```bash
curl -X POST http://localhost:3000/api/justify \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer votre_token_jwt" \
  -d "Votre texte à justifier ici. Il peut être long et contenir plusieurs phrases. L'API le formatera automatiquement avec une largeur de 80 caractères par ligne."
```

## 📐 Endpoints

| Méthode | Endpoint       | Description                     | Auth requise |
|---------|----------------|---------------------------------|--------------|
| POST    | `/api-docs`    | consulter documentation swagger | Non          |
| POST    | `/api/token`   | obtenir un token                | Non          |
| POST    | `/api/justify` | Justifier du texte              | Oui          |

## ⚠️ Limitations

- Maximum **80 000 mots** par jour et par utilisateur

## 🔒 Sécurité

- Authentification par JWT (JSON Web Tokens)
- Rate limiting par utilisateur

## 🧪 Tests

```bash
npm test
# ou
yarn test
```

## 📝 Exemple de réponse justifiée

**Entrée :**

```
Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. 

Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. 
 Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.
```

**Sortie (80 caractères par ligne) :**

```
  'Longtemps,  je  me  suis  couché  de  bonne heure. Parfois, à peine ma bougie
éteinte,  mes  yeux se fermaient si vite que je n’avais pas le temps de me dire:
«Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher
le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les
mains  et  souffler  ma  lumière;  je  n’avais pas cessé en dormant de faire des
réflexions  sur  ce  que  je venais de lire, mais ces réflexions avaient pris un
tour  un  peu  particulier;  il me semblait que j’étais moi-même ce dont parlait
l’ouvrage:   une  église,  un  quatuor,  la  rivalité  de  François  Ier  et  de
Charles-Quint.  \n' + '\n' + 'Cette croyance survivait pendant quelques secondes
à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur
mes  yeux  et  les  empêchait  de  se rendre compte que le bougeoir n’était plus
allumé. \n' + ' Puis elle commençait à me devenir inintelligible, comme après la
métempsycose  les  pensées  d’une  existence  antérieure;  le  sujet du livre se
détachait  de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais
la  vue  et j’étais bien étonné de trouver autour de moi une obscurité, douce et
reposante  pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle
apparaissait  comme  une  chose  sans  cause,  incompréhensible, comme une chose
vraiment  obscure.  Je me demandais quelle heure il pouvait être; j’entendais le
sifflement  des  trains  qui,  plus ou moins éloigné, comme le chant d’un oiseau
dans  une  forêt,  relevant les distances, me décrivait l’étendue de la campagne
déserte  où  le  voyageur  se hâte vers la station prochaine; et le petit chemin
qu’il  suit  va  être  gravé dans son souvenir par l’excitation qu’il doit à des
lieux  nouveaux,  à  des actes inaccoutumés, à la causerie récente et aux adieux
sous  la  lampe étrangère qui le suivent encore dans le silence de la nuit, à la
douceur prochaine du retour.'
```

# 🌐 Déploiement

## Déploiement en Production

L'API est déployée sur Azure Cloud et accessible publiquement à l'adresse suivante :

🔗 URL de l'API : http://api-justify-tictac.francecentral.cloudapp.azure.com:8080

### Accès à la Documentation en Production

Visitez la documentation Swagger interactive en production :

http://api-justify-tictac.francecentral.cloudapp.azure.com:8080/api-docs/



