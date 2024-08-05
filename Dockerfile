# Utilise l'image officielle de Node.js 20
FROM node:20

# Crée un répertoire pour contenir le code de l'application dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package.json ./

# Installe les dépendances de l'application
RUN npm install

# Copie tout le code source dans le répertoire de travail
COPY . .

# Expose le port 3000 pour le serveur
EXPOSE 3000

# Définit la commande à exécuter au démarrage du conteneur
CMD ["node", "index.js"]
