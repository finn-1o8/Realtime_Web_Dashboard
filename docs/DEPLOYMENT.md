# Deployment Guide

This guide covers deploying the System Monitoring Dashboard to various platforms and environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Production Checklist](#production-checklist)
- [Monitoring & Logging](#monitoring--logging)

## Prerequisites

- Node.js 18+ installed
- Docker (optional, for containerized deployment)
- Git for version control
- Access to your target deployment platform

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Environment
NODE_ENV=production

# Server Configuration
PORT=3001
CORS_ORIGIN=https://yourdomain.com

# Security
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here

# Database (if applicable)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Azure Storage (if using)
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER=recordings

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## Docker Deployment

### Option 1: Multi-Stage Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.json ./

# Expose ports
EXPOSE 3000 3001

# Start the application
CMD ["npm", "run", "start:prod"]
```

### Option 2: Separate Frontend and Backend

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server ./server
COPY tsconfig.json ./
EXPOSE 3001
CMD ["node", "server/index.js"]
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:3001
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - ./recordings:/app/recordings
    restart: unless-stopped

  # Optional: Add a reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

### Building and Running

```bash
# Build the image
docker build -t system-monitoring-dashboard .

# Run the container
docker run -d \
  -p 3000:3000 \
  -p 3001:3001 \
  -e NODE_ENV=production \
  --name dashboard \
  system-monitoring-dashboard

# Or use docker-compose
docker-compose up -d
```

## Cloud Platforms

### Azure App Service

1. **Install Azure CLI:**
```bash
npm install -g azure-cli
az login
```

2. **Create App Service:**
```bash
az group create --name dashboard-rg --location eastus
az appservice plan create --name dashboard-plan --resource-group dashboard-rg --sku B1
az webapp create --name dashboard-app --resource-group dashboard-rg --plan dashboard-plan
```

3. **Deploy:**
```bash
# Build the application
npm run build

# Deploy using Azure CLI
az webapp deploy --name dashboard-app --resource-group dashboard-rg --src-path ./dist
```

4. **Configure Environment Variables:**
```bash
az webapp config appsettings set \
  --name dashboard-app \
  --resource-group dashboard-rg \
  --settings \
    VITE_API_URL=https://api.yourdomain.com \
    NODE_ENV=production
```

### Azure Static Web Apps

1. **Install SWA CLI:**
```bash
npm install -g @azure/static-web-apps-cli
```

2. **Deploy:**
```bash
swa build
swa deploy ./dist --app-name dashboard-app --resource-group dashboard-rg
```

### AWS (S3 + CloudFront)

1. **Build the application:**
```bash
npm run build
```

2. **Upload to S3:**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Create CloudFront Distribution:**
```bash
aws cloudfront create-distribution \
  --origin-domain-name your-bucket-name.s3.amazonaws.com \
  --default-root-object index.html
```

### Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Configure environment variables in Vercel dashboard**

### Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

## Production Checklist

### Before Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Update all environment variables
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging
- [ ] Set up monitoring and alerts
- [ ] Test all API endpoints
- [ ] Verify WebSocket connections
- [ ] Test recording functionality
- [ ] Check storage permissions
- [ ] Review security settings
- [ ] Backup database (if applicable)

### Security

- [ ] Use strong JWT secrets
- [ ] Enable rate limiting
- [ ] Implement authentication
- [ ] Set up HTTPS only
- [ ] Configure CORS properly
- [ ] Sanitize all inputs
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Run security audits: `npm audit`
- [ ] Enable Content Security Policy (CSP)

### Performance

- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Implement caching headers
- [ ] Use CDN for static assets
- [ ] Enable HTTP/2
- [ ] Minimize bundle size
- [ ] Lazy load components
- [ ] Optimize WebSocket connections

## Monitoring & Logging

### Application Monitoring

**Using PM2:**
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "dashboard" -- start

# Monitor
pm2 monit

# Save configuration
pm2 save
pm2 startup
```

**Using Node.js cluster mode:**
```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.id} died`);
    cluster.fork();
  });
} else {
  // Start your application
}
```

### Logging

**Using Winston:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Health Checks

Add a health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

### Error Tracking

**Using Sentry:**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Capture exceptions
app.use(Sentry.Handlers.errorHandler());
```

## Scaling

### Horizontal Scaling

For high-traffic scenarios:

1. **Load Balancer**: Use nginx or AWS ELB
2. **Multiple Instances**: Run multiple backend instances
3. **Session Management**: Use Redis for shared sessions
4. **Database**: Use connection pooling and read replicas

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching (Redis)
- Use CDN for static assets

## Backup & Recovery

### Database Backups

```bash
# PostgreSQL backup
pg_dump -h localhost -U user -d database > backup.sql

# Restore
psql -h localhost -U user -d database < backup.sql
```

### Application Backups

```bash
# Backup recordings
tar -czf recordings-backup.tar.gz /path/to/recordings

# Backup configuration
tar -czf config-backup.tar.gz .env config/
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

**Out of memory:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

**WebSocket connection issues:**
- Check firewall rules
- Verify CORS configuration
- Check SSL/TLS certificates

## Support

For deployment issues:
- Check application logs
- Review error tracking (Sentry)
- Consult platform-specific documentation
- Open an issue on GitHub

