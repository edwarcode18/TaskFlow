FROM node:22-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

RUN npx tsc

EXPOSE 3000
CMD ["npx", "ts-node-dev", "src/index.ts"]