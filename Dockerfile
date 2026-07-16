FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321 DATA_DIR=/data
ARG IMAGE_VERSION=dev
ENV IMAGE_VERSION=$IMAGE_VERSION
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY migrations ./migrations
USER node
EXPOSE 4321
# ponytail: migrations run on first db import — the healthcheck hits /healthz
# within 30s; add a start script if ordering ever matters.
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:4321/healthz || exit 1
CMD ["node", "./dist/server/entry.mjs"]
