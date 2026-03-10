FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run demo:build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/demo-dist ./demo-dist

ENV PORT=3000
EXPOSE 3000

CMD ["node", "demo-dist/server.js"]
