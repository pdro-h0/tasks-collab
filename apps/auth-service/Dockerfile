FROM node:18-alpine AS base

WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
RUN apk add --no-cache postgresql-client
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM base AS production
RUN apk add --no-cache postgresql-client
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]