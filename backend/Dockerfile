FROM node:22-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

EXPOSE 3000
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]