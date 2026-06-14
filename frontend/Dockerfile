# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────────────────────
# SAATHI Frontend — PRODUCTION image only.
#
# For local development use `npm run dev` on the host — Next.js hot
# reload inside a container (especially on Windows) is slow.
#
# NEXT_PUBLIC_* values are inlined at BUILD time, so the backend URL
# must be supplied as a build arg:
#   docker build --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.example.com -t saathi-frontend ./frontend
# ──────────────────────────────────────────────────────────────

# ── Stage 1: install dependencies ─────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci


# ── Stage 2: build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public env consumed by the Next.js bundle at build time
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ── Stage 3: runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Run as the unprivileged user that ships with the node image
USER node

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
