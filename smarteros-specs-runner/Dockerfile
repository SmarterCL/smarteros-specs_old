FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de build
RUN apk add --no-cache git

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production && \
    npm install -g typescript ts-node

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)"

CMD ["npm", "start"]
