# Multi-stage build for smaller, secure production runtime
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# Prune dev dependencies after build
RUN npm prune --production

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /server

# Create non-root user and group are available by default in node image (user: node)

# Copy only production artifacts
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/uploads ./uploads
COPY --chown=node:node package.json package-lock.json ./

EXPOSE 3001

# Basic healthcheck hitting the health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD wget -qO- http://localhost:3001/health >/dev/null 2>&1 || exit 1

# Drop privileges
USER node

CMD ["node", "dist/server.js"]
