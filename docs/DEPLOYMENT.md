# Deployment notes

The front-end is a static Vite build. The mock server is a development aid; a real deployment replaces it with a backend that implements the same REST and Socket.IO contract (see `API.md`) and adds authentication.

## Building the front-end

```bash
npm ci
npm run build      # output in dist/
```

The build expects `/api` and `/socket.io` on the same origin, so serve `dist/` behind the same reverse proxy as the backend and route those two prefixes to it. Socket.IO needs WebSocket upgrades passed through.

## Example: nginx in front of a backend on port 3001

```nginx
server {
    listen 443 ssl;
    server_name dashboard.example.org;

    root /var/www/dashboard/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Running the mock behind a proxy

If the mock itself is used for a demo:

```bash
NODE_ENV=production CORS_ORIGIN=https://dashboard.example.org TRUST_PROXY=true PORT=3001 npx tsx server/index.ts
```

`CORS_ORIGIN` is required in production; without it every browser origin is rejected. `TRUST_PROXY=true` makes the rate limiter key on the real client address.

## Docker

A minimal multi-stage image for the static front-end:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

Pair it with the nginx configuration above, mounted over `/etc/nginx/conf.d/default.conf`.
