# Use Node 20 as the base for 2026 standards
FROM node:20-slim

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install all dependencies so we can build TS to JS
RUN npm install

# Copy the rest of your backend source code
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

EXPOSE 3000

# Run the compiled JS output
CMD ["npm", "start"]