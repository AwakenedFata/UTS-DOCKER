# ---------- TAHAP 1: BUILD ----------
FROM node:24-alpine AS build
WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package.json package-lock.json .npmrc ./
RUN npm ci

# MONGODB_URI hanya nilai sementara agar build tidak error.
# Alamat database asli diberikan saat container dijalankan.
COPY . .
RUN MONGODB_URI=mongodb://placeholder:27017/build npm run build

RUN npm prune --omit=dev


# ---------- TAHAP 2: RUNTIME (image final) ----------
FROM node:24-alpine AS runtime
WORKDIR /app

# Install Chromium dan font untuk fitur PDF di Alpine Linux
RUN apk add --no-cache chromium font-noto

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

USER node

EXPOSE 3000
CMD ["node", "build"]