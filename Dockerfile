# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx configuration to avoid read-only file system issues
RUN rm -f /etc/nginx/conf.d/default.conf

# Create nginx cache directories and set proper permissions for nginx user (UID 101)
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/scgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /var/log/nginx

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Set proper ownership for the web content
RUN chown -R nginx:nginx /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (non-privileged port)
EXPOSE 8080

# Switch to nginx user for security
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 