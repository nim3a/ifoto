# Docker Configuration Summary

## Changes Made

### 1. Frontend Configuration

**File: `frontend/nginx.conf`**
- Added API proxy configuration to forward `/api/*` requests to backend service
- Set `proxy_pass http://backend:8080` to use Docker service name
- Added support for large file uploads (50MB) via `client_max_body_size`
- Configured proper proxy headers for backend communication

**File: `frontend/src/environments/environment.ts`**
- Changed `apiUrl` from `http://localhost:8080` to empty string `''`
- This allows the frontend to use relative URLs which nginx will proxy to backend
- Frontend now works seamlessly in Docker without hardcoded backend URLs

**File: `frontend/src/environments/environment.prod.ts`** (Created)
- Added production environment configuration
- Uses empty string for apiUrl (proxied via nginx)

### 2. Backend Configuration

**File: `backend/src/main/java/ir/ifoto/config/SecurityConfig.java`**
- Updated CORS configuration to allow Docker frontend access
- Added `http://localhost` and `http://localhost:80` to allowed origins
- Maintains existing origins for development and production

### 3. Docker Setup Files

**File: `docker/README.md`** (Created)
- Comprehensive setup guide for running ifoto with Docker
- Prerequisites, quick start, service descriptions
- Common commands and troubleshooting tips
- Architecture diagram and network configuration details
- Development mode instructions

**File: `docker/start.ps1`** (Created)
- Windows PowerShell quick start script
- Automated Docker health check
- .env file creation and validation
- Color-coded output for better UX
- Helpful error messages

**File: `docker/start.sh`** (Created)
- Linux/Mac bash quick start script
- Same functionality as PowerShell version
- Cross-platform compatibility

### 4. Existing Files (No Changes Needed)

**Dockerfiles**: All existing Dockerfiles are production-ready and correct:
- `backend/Dockerfile` - Multi-stage Maven build
- `frontend/Dockerfile` - Multi-stage npm build with nginx
- `face-service/Dockerfile` - Python with all dependencies

**docker-compose.yml**: Already properly configured with:
- Correct service networking via `ifoto-network`
- Proper environment variable passing
- Service dependencies defined
- Volume persistence for data
- Port mappings for external access

**`.env.example`**: Already contains all required environment variables

## How It Works

### Request Flow

1. **Browser** → `http://localhost` → **Frontend (nginx:80)**
2. **Frontend** makes API call → `/api/photos/upload`
3. **Nginx** proxies → `http://backend:8080/api/photos/upload`
4. **Backend** processes request:
   - Stores photo in **MinIO**
   - Saves metadata in **PostgreSQL**
   - Calls **face-service** for face extraction
5. **Face-service**:
   - Extracts embeddings
   - Stores in **Qdrant**
6. **Backend** saves face embeddings to **PostgreSQL**
7. Response flows back to browser

### Service Communication

All services communicate via Docker's internal network (`ifoto-network`):
- Services use container names as hostnames
- No external network calls between services
- Secure internal communication
- Frontend proxies external requests to backend

### Data Persistence

- `postgres_data`: Database tables and data
- `qdrant_data`: Vector embeddings storage
- `minio_data`: Original photo files
- `face_models`: Pre-downloaded AI models (InsightFace)

## Running the Stack

### Option 1: Quick Start Scripts

**Windows:**
```powershell
cd docker
.\start.ps1
```

**Linux/Mac:**
```bash
cd docker
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

```bash
cd docker
cp .env.example .env
# Edit .env and set passwords
docker compose up -d
```

## Verification Steps

1. **Check all services are running:**
   ```bash
   docker compose ps
   ```
   All should show "Up" status

2. **Test frontend:**
   - Open http://localhost in browser
   - Should load Angular app

3. **Test backend API:**
   ```bash
   curl http://localhost:8080/api/health
   ```

4. **Test face service:**
   ```bash
   curl http://localhost:5000/health
   ```

5. **Check logs for errors:**
   ```bash
   docker compose logs
   ```

## Troubleshooting

### Services won't start
- Ensure .env file is configured with valid passwords
- Check if ports are already in use: 80, 8080, 5000, 5432, 6333, 9000, 9001
- Verify Docker has enough resources (8GB RAM minimum)

### Backend can't connect to services
- Check service names match docker-compose.yml
- Verify all services are on ifoto-network
- Check logs: `docker compose logs backend`

### Frontend shows API errors
- Verify nginx proxy configuration in nginx.conf
- Check backend is accessible: `docker compose logs backend`
- Verify CORS settings in SecurityConfig.java

### Face service slow on first run
- First run downloads AI models (~200MB)
- This is normal and only happens once
- Models are cached in `face_models` volume

## Security Notes

**Before deploying to production:**

1. Change all default passwords in .env
2. Generate a strong JWT_SECRET (64+ characters)
3. Use proper TLS/SSL certificates
4. Update CORS origins in SecurityConfig.java
5. Review and harden nginx configuration
6. Enable Docker secrets for sensitive data
7. Set up proper backup strategy for volumes

## Development vs Production

**Development (current setup):**
- Plain HTTP
- Default ports exposed
- Debug logging enabled
- CORS allows localhost

**Production (recommendations):**
- HTTPS with valid certificates
- Reverse proxy (Traefik/Nginx) in front
- Restricted CORS origins
- Production logging levels
- Secrets management
- Monitoring and alerting
- Regular backups

## Next Steps

After successful Docker deployment:

1. Create admin user via API
2. Create test event
3. Upload sample photos
4. Test face search functionality
5. Verify MinIO storage
6. Check Qdrant vectors
7. Monitor resource usage

## Support

For issues:
1. Check logs: `docker compose logs -f`
2. Review docker/README.md
3. Verify .env configuration
4. Check GitHub issues
