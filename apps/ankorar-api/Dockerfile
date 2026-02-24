# Build a partir da raiz do monorepo:
#   docker build -f apps/ankorar-api/Dockerfile .
#
# Gera bundle com tsup (ESM) e sobe essa versão para o Docker Hub.

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
WORKDIR /app

# ---- Dependências ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ankorar-api/package.json apps/ankorar-api/
RUN pnpm install --frozen-lockfile

# ---- Build: Prisma Client + tsup (bundle ESM) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run --filter ankorar-api build:prod

# ---- Imagem final: só o bundle + node (sem tsx, sem src) ----
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/apps/ankorar-api/package.json ./
COPY --from=builder /app/apps/ankorar-api/build ./build

RUN pnpm install --prod --ignore-workspace

USER node
EXPOSE 3000

CMD ["node", "build/index.js"]
