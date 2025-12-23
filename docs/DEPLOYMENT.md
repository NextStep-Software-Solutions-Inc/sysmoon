# Deployment Guide

This guide covers deploying Sysmoon in various environments.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm 8+
- (Optional) Docker & Docker Compose
- (Optional) Kubernetes cluster

---

## Local Development

### 1. Setup

```bash
# Clone repository
git clone https://github.com/NextStep-Software-Solutions-Inc/sysmoon.git
cd sysmoon

# Install dependencies
pnpm install
```

### 2. Configure Environment

Create environment files:

**packages/database/.env**:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"
```

**apps/server-api/.env.local**:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"
PORT=3001
NODE_ENV=development
NEXT_PUBLIC_DASHBOARD_URL="http://localhost:3000"
```

**apps/dashboard/.env.local**:
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Initialize Database

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Start Development Servers

```bash
pnpm dev
```

Access:
- Dashboard: http://localhost:3000
- API: http://localhost:3001

---

## Production Deployment

### Manual Deployment

#### 1. Build All Packages

```bash
pnpm install
pnpm build
```

#### 2. Setup PostgreSQL

```bash
# Create database
createdb sysmoon

# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"

# Run migrations
pnpm db:migrate
```

#### 3. Start Services

**API Server**:
```bash
cd apps/server-api
PORT=3001 NODE_ENV=production pnpm start
```

**Dashboard**:
```bash
cd apps/dashboard
PORT=3000 NODE_ENV=production pnpm start
```

#### 4. Use Process Manager

For production, use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start API
cd apps/server-api
pm2 start npm --name "sysmoon-api" -- start

# Start Dashboard
cd apps/dashboard
pm2 start npm --name "sysmoon-dashboard" -- start

# Save configuration
pm2 save
pm2 startup
```

---

## Docker Deployment

### Using Docker Compose

Create `docker-compose.yml` in the repository root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: sysmoon
      POSTGRES_USER: sysmoon
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sysmoon"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: apps/server-api/Dockerfile
    environment:
      DATABASE_URL: postgresql://sysmoon:${DB_PASSWORD}@postgres:5432/sysmoon
      PORT: 3001
      NODE_ENV: production
      NEXT_PUBLIC_DASHBOARD_URL: ${DASHBOARD_URL}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  dashboard:
    build:
      context: .
      dockerfile: apps/dashboard/Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
```

Create `.env` file:
```bash
DB_PASSWORD=your-secure-password
API_URL=http://localhost:3001
DASHBOARD_URL=http://localhost:3000
```

Start services:
```bash
docker-compose up -d
```

### Dockerfiles

**apps/server-api/Dockerfile**:
```dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm@8

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server-api/package.json ./apps/server-api/
COPY packages/database/package.json ./packages/database/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm db:generate
RUN pnpm --filter @sysmoon/server-api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/server-api/.next ./apps/server-api/.next
COPY --from=builder /app/apps/server-api/public ./apps/server-api/public
COPY --from=builder /app/apps/server-api/package.json ./apps/server-api/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3001
CMD ["pnpm", "--filter", "@sysmoon/server-api", "start"]
```

**apps/dashboard/Dockerfile**:
```dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm@8

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @sysmoon/dashboard build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/dashboard/.next ./apps/dashboard/.next
COPY --from=builder /app/apps/dashboard/public ./apps/dashboard/public
COPY --from=builder /app/apps/dashboard/package.json ./apps/dashboard/
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "--filter", "@sysmoon/dashboard", "start"]
```

---

## Cloud Deployment

### AWS Deployment

#### Using EC2

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Open ports: 22, 80, 443, 3000, 3001

2. **Install Dependencies**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

3. **Deploy Application**:
```bash
# Clone repository
git clone https://github.com/your-org/sysmoon.git
cd sysmoon

# Install & build
pnpm install
pnpm build

# Setup database
sudo -u postgres psql -c "CREATE DATABASE sysmoon;"
sudo -u postgres psql -c "CREATE USER sysmoon WITH PASSWORD 'secure-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sysmoon TO sysmoon;"

# Run migrations
DATABASE_URL="postgresql://sysmoon:secure-password@localhost:5432/sysmoon" pnpm db:migrate

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Setup Nginx Reverse Proxy**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Using ECS/Fargate

1. **Build and push Docker images**:
```bash
# Build images
docker build -t sysmoon-api:latest -f apps/server-api/Dockerfile .
docker build -t sysmoon-dashboard:latest -f apps/dashboard/Dockerfile .

# Tag for ECR
docker tag sysmoon-api:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sysmoon-api:latest
docker tag sysmoon-dashboard:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sysmoon-dashboard:latest

# Push to ECR
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sysmoon-api:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sysmoon-dashboard:latest
```

2. **Create RDS PostgreSQL database**

3. **Create ECS task definitions and services**

4. **Setup Application Load Balancer**

### Azure Deployment

#### Using Azure App Service

1. **Create Azure Database for PostgreSQL**

2. **Create two App Services**:
   - One for API
   - One for Dashboard

3. **Deploy via GitHub Actions or Azure CLI**:
```bash
# Build and deploy API
az webapp up --name sysmoon-api --resource-group sysmoon-rg --runtime "NODE|18-lts"

# Build and deploy Dashboard
az webapp up --name sysmoon-dashboard --resource-group sysmoon-rg --runtime "NODE|18-lts"
```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and push to Container Registry**:
```bash
# Build images
gcloud builds submit --tag gcr.io/${PROJECT_ID}/sysmoon-api apps/server-api
gcloud builds submit --tag gcr.io/${PROJECT_ID}/sysmoon-dashboard apps/dashboard
```

2. **Deploy to Cloud Run**:
```bash
# Deploy API
gcloud run deploy sysmoon-api \
  --image gcr.io/${PROJECT_ID}/sysmoon-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy Dashboard
gcloud run deploy sysmoon-dashboard \
  --image gcr.io/${PROJECT_ID}/sysmoon-dashboard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

3. **Create Cloud SQL PostgreSQL instance**

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Helm 3+ (optional)

### Using kubectl

**1. Create namespace**:
```bash
kubectl create namespace sysmoon
```

**2. Create secrets**:
```bash
kubectl create secret generic sysmoon-db \
  --from-literal=url="postgresql://user:pass@postgres:5432/sysmoon" \
  -n sysmoon
```

**3. Deploy PostgreSQL**:
```yaml
# postgres.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: sysmoon
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: sysmoon
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: sysmoon
        - name: POSTGRES_USER
          value: sysmoon
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: sysmoon-db
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

**4. Deploy API**:
```yaml
# api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sysmoon-api
  namespace: sysmoon
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sysmoon-api
  template:
    metadata:
      labels:
        app: sysmoon-api
    spec:
      containers:
      - name: api
        image: sysmoon-api:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: sysmoon-db
              key: url
        - name: NODE_ENV
          value: production
---
apiVersion: v1
kind: Service
metadata:
  name: sysmoon-api
  namespace: sysmoon
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3001
  selector:
    app: sysmoon-api
```

**5. Deploy Dashboard**:
```yaml
# dashboard.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sysmoon-dashboard
  namespace: sysmoon
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sysmoon-dashboard
  template:
    metadata:
      labels:
        app: sysmoon-dashboard
    spec:
      containers:
      - name: dashboard
        image: sysmoon-dashboard:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: http://sysmoon-api
---
apiVersion: v1
kind: Service
metadata:
  name: sysmoon-dashboard
  namespace: sysmoon
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: sysmoon-dashboard
```

**6. Apply configurations**:
```bash
kubectl apply -f postgres.yaml
kubectl apply -f api.yaml
kubectl apply -f dashboard.yaml
```

---

## Environment Variables

### Required Variables

#### API Server
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: API server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

#### Dashboard
- `NEXT_PUBLIC_API_URL`: API server URL

### Optional Variables

#### API Server
- `NEXT_PUBLIC_DASHBOARD_URL`: Dashboard URL for CORS

---

## Monitoring & Logging

### Production Recommendations

1. **Application Monitoring**:
   - Use APM tools (New Relic, Datadog, etc.)
   - Monitor event ingestion rate
   - Track WebSocket connections
   - Monitor database performance

2. **Logging**:
   - Centralized logging (ELK, Splunk, CloudWatch)
   - Log levels: error, warn, info, debug
   - Structured JSON logs

3. **Alerts**:
   - Database connection failures
   - High error rates
   - Memory/CPU thresholds
   - Disk space warnings

---

## Backup & Recovery

### Database Backups

```bash
# Backup
pg_dump -h localhost -U sysmoon sysmoon > backup.sql

# Restore
psql -h localhost -U sysmoon sysmoon < backup.sql
```

### Automated Backups

Set up cron job:
```bash
0 2 * * * pg_dump -h localhost -U sysmoon sysmoon | gzip > /backups/sysmoon-$(date +\%Y\%m\%d).sql.gz
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Secure DATABASE_URL (use secrets management)
- [ ] Enable PostgreSQL SSL
- [ ] Configure firewall rules
- [ ] Use strong passwords
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Implement rate limiting
- [ ] Add CORS restrictions
- [ ] Regular backups

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check network connectivity
   - Verify credentials

2. **WebSocket Connection Issues**:
   - Check firewall rules
   - Verify CORS configuration
   - Check proxy/load balancer settings (must support WebSocket)

3. **Build Failures**:
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify all dependencies are installed

---

## Performance Tuning

### Database

```sql
-- Add indexes for common queries
CREATE INDEX idx_events_timestamp ON events(timestamp DESC);
CREATE INDEX idx_events_system_type ON events(system_id, event_type);
```

### Application

- Enable gzip compression
- Use CDN for static assets
- Configure connection pooling
- Implement caching layer

---

## Support

For deployment issues:
- Check documentation
- Review logs
- Open GitHub issue
- Contact support team
