# Use the official Playwright image with browsers + system deps preinstalled
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

WORKDIR /app

# Copy package manifest(s). The wildcard keeps working even if you later add a lockfile.
COPY package*.json ./

# Since you don't have package-lock.json, use npm install (not npm ci)
RUN npm install --omit=dev --no-audit --no-fund

# Copy the rest of your app
COPY . .

# Render will set PORT; provide a default for local runs
ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
