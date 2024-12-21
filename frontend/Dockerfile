FROM nginx:alpine

# Copy static files
COPY *.html /usr/share/nginx/html/
COPY scripts/ /usr/share/nginx/html/scripts/

# Configure Nginx
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index login.html; \
    location / { \
        try_files $uri $uri/ =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Create required directories with correct permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

EXPOSE 80