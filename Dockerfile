FROM node:18-alpine
WORKDIR /app

# Juste installer npm (vide au départ)
RUN npm install -g npm

EXPOSE 3000
CMD ["npm", "run", "dev"]
