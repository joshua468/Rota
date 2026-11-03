# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app
ENV CI=true

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tools/check-package-manager.mjs tools/check-package-manager.mjs
COPY backend/package.json backend/package.json
COPY packages/contract/package.json packages/contract/package.json
RUN pnpm install --frozen-lockfile --prod --filter @rota/backend...

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/packages/contract/node_modules ./packages/contract/node_modules
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY backend ./backend
COPY packages/contract ./packages/contract
USER node
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/healthz || exit 1
# tsx runs the TypeScript workspace directly so the backend and the shared
# contract resolve without a separate build step.
CMD ["pnpm", "--filter", "@rota/backend", "start"]
