# Stage 1: Build stage
FROM node:22-slim AS build

WORKDIR /app

# Enable corepack to use pnpm version from package.json
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy all source (JS-only project)
COPY . .

# Build with an argument for the API URL
ARG VITE_API_BASE_URL=http://localhost:5050
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN pnpm run build

# Stage 2: Production stage
FROM nginx:stable-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
