# Use Node 20 as the base for 2026 standards
FROM node:22-slim

WORKDIR /app

# Enable corepack to use pnpm version from package.json
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first to leverage Docker caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your backend source code
COPY . .

# Build TypeScript -> JavaScript
RUN pnpm run build

EXPOSE 5050

# Run the compiled JS output
CMD ["pnpm", "start"]