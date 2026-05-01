# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build tools
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source
COPY . .

# Build arguments injected at build time from docker-compose / CI
ARG VITE_SALEOR_API_URL
ARG VITE_SITE_NAME
ARG VITE_SHIPROCKET_APP_URL
ARG VITE_TOKEN_STORAGE_KEY
ARG VITE_REFRESH_TOKEN_KEY

ENV VITE_SALEOR_API_URL=${VITE_SALEOR_API_URL}
ENV VITE_SITE_NAME=${VITE_SITE_NAME}
ENV VITE_SHIPROCKET_APP_URL=${VITE_SHIPROCKET_APP_URL}
ENV VITE_TOKEN_STORAGE_KEY=${VITE_TOKEN_STORAGE_KEY}
ENV VITE_REFRESH_TOKEN_KEY=${VITE_REFRESH_TOKEN_KEY}

# Build the app
RUN npm run build

# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.25-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
