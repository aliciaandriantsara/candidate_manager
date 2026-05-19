FROM node:20-alpine AS builder
WORKDIR /app
# Timeouts adaptés aux connexions lentes (évite ETIMEDOUT après ~10 min)
RUN npm config set fetch-retries 10 \
  && npm config set fetch-retry-mintimeout 30000 \
  && npm config set fetch-retry-maxtimeout 300000 \
  && npm config set fetch-timeout 600000
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit; else npm install --no-audit; fi
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm config set fetch-retries 10 \
  && npm config set fetch-retry-mintimeout 30000 \
  && npm config set fetch-retry-maxtimeout 300000 \
  && npm config set fetch-timeout 600000
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --no-audit; else npm install --omit=dev --no-audit; fi
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
