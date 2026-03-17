# Use latest matching Playwright image
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

# Copy manifests
COPY package*.json ./

# Install node dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy the rest
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
