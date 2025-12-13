# ifoto Deployment Guide

## Prerequisites

### System Requirements

#### Minimum Requirements (CPU-only)
- **CPU**: 4+ cores (x86_64)
- **RAM**: 8 GB
- **Storage**: 500 GB SSD (depends on photo volume)
- **OS**: Linux (Ubuntu 22.04 LTS recommended)
- **Docker**: 24.0+
- **Docker Compose**: 2.20+

#### Recommended Requirements (Production)
- **CPU**: 8+ cores
- **RAM**: 16 GB
- **Storage**: 1 TB+ SSD
- **Network**: 100 Mbps+ bandwidth
- **Backup**: Additional storage for backups

#### GPU Acceleration (Optional)
- **GPU**: NVIDIA GPU with 8GB+ VRAM
- **CUDA**: 11.8+
- **nvidia-docker**: Latest version

### Software Requirements
- Docker Engine 24.0+
- Docker Compose 2.20+
- Git
- (Optional) NVIDIA Container Toolkit for GPU support

## Quick Start (Development)

### 1. Clone Repository
```bash
git clone https://github.com/nim3a/ifoto.git
cd ifoto
```

### 2. Configure Environment
```bash
cd docker
cp .env.example .env
# Edit .env with your configuration
nano .env
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Initialize Database
The database will be automatically initialized on first run. Create an admin user:

```bash
docker exec -it ifoto-backend /bin/sh
# Inside container, use Spring Boot CLI or create via SQL
```

### 5. Access Services
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Minio Console**: http://localhost:9001
- **Qdrant Dashboard**: http://localhost:6333/dashboard

## Production Deployment

### Step 1: Server Setup

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Prepare Application

#### Clone Repository
```bash
cd /opt
sudo git clone https://github.com/nim3a/ifoto.git
cd ifoto
```

#### Configure Environment Variables
```bash
cd docker
sudo nano .env
```

**Important Configuration (.env)**:
```bash
# Database
POSTGRES_DB=ifoto
POSTGRES_USER=ifoto
POSTGRES_PASSWORD=CHANGE_THIS_SECURE_PASSWORD

# JWT Secret (minimum 512 bits)
JWT_SECRET=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING_AT_LEAST_64_CHARACTERS

# Minio
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=CHANGE_THIS_SECURE_PASSWORD

# Backend
SERVER_PORT=8080

# Qdrant
QDRANT_HOST=qdrant
QDRANT_PORT=6333
QDRANT_COLLECTION=face_embeddings

# Storage
STORAGE_TYPE=minio
```

### Step 3: SSL/TLS Setup (Production)

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate
```bash
sudo certbot certonly --standalone -d ifoto.ir -d www.ifoto.ir
```

#### Update Nginx Configuration
Edit `frontend/nginx.conf` to include SSL configuration:
```nginx
server {
    listen 443 ssl http2;
    server_name ifoto.ir www.ifoto.ir;
    
    ssl_certificate /etc/letsencrypt/live/ifoto.ir/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ifoto.ir/privkey.pem;
    
    # ... rest of configuration
}

server {
    listen 80;
    server_name ifoto.ir www.ifoto.ir;
    return 301 https://$server_name$request_uri;
}
```

Update `docker-compose.yml` to mount certificates:
```yaml
frontend:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

### Step 4: Build and Deploy

#### Build Services
```bash
cd docker
sudo docker-compose build
```

#### Start Services
```bash
sudo docker-compose up -d
```

#### Verify Services
```bash
sudo docker-compose ps
sudo docker-compose logs -f
```

### Step 5: Initialize Application

#### Create Admin User
Create SQL script `init-admin.sql`:
```sql
INSERT INTO users (username, email, password, full_name, role, active, created_at, updated_at)
VALUES (
    'admin',
    'admin@ifoto.ir',
    '$2a$10$HASH_PASSWORD_HERE',  -- Use BCrypt hash
    'Admin',
    'ADMIN',
    true,
    NOW(),
    NOW()
);
```

Run the script:
```bash
sudo docker exec -i ifoto-postgres psql -U ifoto -d ifoto < init-admin.sql
```

### Step 6: Configure Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Step 7: Set Up Backups

#### Database Backup Script
Create `/opt/ifoto/scripts/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/opt/ifoto/backups/db"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
docker exec ifoto-postgres pg_dump -U ifoto ifoto > $BACKUP_DIR/ifoto_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "ifoto_*.sql" -mtime +7 -delete
```

#### Storage Backup
Set up Minio bucket replication or use file system backup:
```bash
rsync -av /var/lib/docker/volumes/docker_minio_data /backup/minio/
```

#### Automate with Cron
```bash
sudo crontab -e
# Add daily backup at 2 AM
0 2 * * * /opt/ifoto/scripts/backup-db.sh
```

## GPU Acceleration Setup

### Install NVIDIA Drivers
```bash
sudo apt install nvidia-driver-535 -y
sudo reboot
```

### Install NVIDIA Container Toolkit
```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt update
sudo apt install nvidia-container-toolkit -y
sudo systemctl restart docker
```

### Enable GPU in Docker Compose
Uncomment the GPU section in `docker/docker-compose.yml`:
```yaml
face-service:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

### Restart Services
```bash
sudo docker-compose down
sudo docker-compose up -d
```

## Monitoring

### Service Health Checks
```bash
# Check all services
sudo docker-compose ps

# Check logs
sudo docker-compose logs -f backend
sudo docker-compose logs -f face-service

# Check resource usage
docker stats
```

### Application Monitoring
- Backend health: http://localhost:8080/actuator/health
- Face service health: http://localhost:5000/health

### Log Management
Set up log rotation in `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

## Performance Tuning

### PostgreSQL
Edit PostgreSQL configuration in docker-compose.yml:
```yaml
postgres:
  command: postgres -c shared_buffers=256MB -c max_connections=200
```

### Java Backend
Set JVM options in docker-compose.yml:
```yaml
backend:
  environment:
    JAVA_OPTS: "-Xmx2g -Xms1g"
```

### Face Service
For CPU optimization:
```yaml
face-service:
  environment:
    OMP_NUM_THREADS: 4
```

## Scaling

### Horizontal Scaling (Future)

#### Backend Scaling
```yaml
backend:
  deploy:
    replicas: 3
```

Add load balancer (Nginx or HAProxy) in front.

#### Face Service Scaling
```yaml
face-service:
  deploy:
    replicas: 2
```

Share Qdrant and use load balancing.

### Database Scaling
- Set up PostgreSQL read replicas
- Use connection pooling
- Implement caching (Redis)

## Troubleshooting

### Service Won't Start
```bash
# Check logs
sudo docker-compose logs servicename

# Check disk space
df -h

# Check memory
free -m
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
sudo docker-compose logs postgres

# Verify connection
docker exec -it ifoto-postgres psql -U ifoto -d ifoto
```

### Face Recognition Errors
```bash
# Check face service logs
sudo docker-compose logs face-service

# Verify model download
docker exec -it ifoto-face-service ls -la /root/.insightface
```

### Storage Issues
```bash
# Check Minio
docker exec -it ifoto-minio mc admin info local

# Verify bucket
docker exec -it ifoto-minio mc ls local/ifoto
```

## Maintenance

### Update Services
```bash
cd /opt/ifoto
sudo git pull
cd docker
sudo docker-compose build
sudo docker-compose up -d
```

### Database Maintenance
```bash
# Vacuum database
docker exec -it ifoto-postgres psql -U ifoto -d ifoto -c "VACUUM ANALYZE;"

# Backup database
docker exec ifoto-postgres pg_dump -U ifoto ifoto > backup.sql
```

### Clean Docker Resources
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full cleanup
docker system prune -a --volumes
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (64+ characters)
- [ ] Enable SSL/TLS with valid certificates
- [ ] Configure firewall (ufw)
- [ ] Set up regular backups
- [ ] Enable log monitoring
- [ ] Restrict database access
- [ ] Use non-root users in containers
- [ ] Keep Docker and system updated
- [ ] Implement rate limiting
- [ ] Set up intrusion detection

## Support

For issues and support:
- GitHub Issues: https://github.com/nim3a/ifoto/issues
- Documentation: https://github.com/nim3a/ifoto/docs
- Email: support@ifoto.ir

## License

Copyright © 2024 ifoto. All rights reserved.
