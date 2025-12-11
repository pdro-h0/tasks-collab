FROM node:18-alpine AS base

WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3004
CMD ["npm", "run", "start:dev"]

FROM base AS production
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build
EXPOSE 3004
CMD ["node", "dist/main.js"]