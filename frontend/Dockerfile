FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm config set fetch-retries 10 \
  && npm config set fetch-retry-mintimeout 30000 \
  && npm config set fetch-retry-maxtimeout 300000 \
  && npm config set fetch-timeout 600000
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit; else npm install --no-audit; fi
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
