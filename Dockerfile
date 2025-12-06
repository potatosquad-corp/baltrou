# Builder
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
COPY .env.build .env
RUN pnpm run build
RUN pnpm prune --prod

# Runner
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p /app/data/soundboard && chown -R node:node /app/data
USER node

ENV HOST=0.0.0.0
ENV PORT=4000
ENV NODE_ENV=production

# Commande de démarrage
CMD ["node", "build/index.js"]