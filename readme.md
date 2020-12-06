# Memory Game

Memory Game - Procédure d'installation

## Démo

Démonstration : [ici](https://memory.cukicsasha.fr)

## Préparation

Veuillez-suivre ces instructions pour lancer le projet

### Prérequis

Memory Game requires php 7.3^ and composer/node/npm/yarn

Dupliquer le fichier .env pour créer un fichier .env.local, puis créer une base de données et la configurer dans le fichier .env.local

```bash
# .env
DATABASE_URL=mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=5.7
```

Installation des paquets

```bash
composer install
npm install
npm run build
```

Création de la base de données

```bash
php bin/console d:s:u --force
```

Lancer le serveur de développement pour tester le projet

```bash
symfony server:start
```
