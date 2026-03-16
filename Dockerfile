# Dockerfile (place this at your repo root)
# Use the official Playwright image — comes with browsers and all dependencies preinstalled
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

# App working directory
WORKDIR /app

# Install Node dependencies (use lockfile if you have one)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the rest of your app
COPY . .

# Render will send PORT env; expose and use it
ENV PORT=3001
EXPOSE 3001

# Start your server
CMD ["node", "server.js"]
