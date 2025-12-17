# Multi-stage build for Angular frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Ensure esbuild installs platform-appropriate binary (Linux x64) inside image
ENV npm_config_platform=linux
ENV npm_config_arch=x64

# Install dependencies (include dev dependencies so Angular CLI is available)
RUN npm ci --include=dev --unsafe-perm

# Copy source code
COPY . .

# Build the application - use npx with local package instead of registry
RUN npx --package @angular/cli ng build --configuration production

# Runtime stage with Nginx
FROM nginx:alpine

# Copy built files from build stage (Angular 17 outputs to browser subdirectory)
COPY --from=build /app/dist/ifoto-frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
