# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# arm64 builds run under QEMU on CI and are slow: be patient with the registry
RUN npm config set fetch-retries 5 && npm config set fetch-retry-maxtimeout 120000 && npm config set fetch-timeout 600000 \
    && npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
USER app
EXPOSE 3000
# OBSERVER_URLS and OBSERVER_TOKEN are read at request time: pass them with -e at run time.
CMD ["node", "server.js"]
