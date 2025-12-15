# Docker Deployment Checklist

## Pre-Deployment

- [ ] Docker Desktop installed and running
- [ ] At least 8GB RAM allocated to Docker
- [ ] At least 20GB free disk space
- [ ] Git repository cloned

## Configuration

- [ ] Navigate to `docker` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Update `POSTGRES_PASSWORD` in `.env`
- [ ] Update `JWT_SECRET` in `.env` (minimum 64 characters)
- [ ] Update `MINIO_ROOT_PASSWORD` in `.env`
- [ ] Review other settings in `.env` if needed

## Build & Start

- [ ] Run `docker compose up -d` (or use start scripts)
- [ ] Wait for all services to start (5-10 minutes first time)
- [ ] Check all containers are running: `docker compose ps`

## Verification

### Infrastructure Services
- [ ] PostgreSQL is running: `docker compose logs postgres | grep "ready to accept"`
- [ ] Qdrant is accessible: `curl http://localhost:6333/dashboard`
- [ ] MinIO console opens: `http://localhost:9001`

### Application Services
- [ ] Face service health: `curl http://localhost:5000/health`
- [ ] Backend health: `curl http://localhost:8080/actuator/health` or check logs
- [ ] Frontend loads: Open `http://localhost` in browser

### Functional Tests
- [ ] Can view landing page
- [ ] Can register new user (if registration enabled)
- [ ] Can create event (after login)
- [ ] Can upload photo to event
- [ ] Photo appears in gallery
- [ ] Can search by face
- [ ] Search returns results

## Troubleshooting

### Services not starting
```bash
docker compose logs [service-name]
```

### Reset everything
```bash
docker compose down -v
docker compose up -d
```

### Rebuild specific service
```bash
docker compose up -d --build [service-name]
```

## Success Criteria

✅ All 6 services running
✅ Frontend accessible at http://localhost
✅ Backend API responding at http://localhost:8080/api
✅ Can complete full photo upload workflow
✅ Can complete full face search workflow
✅ No errors in any service logs

## Quick Commands Reference

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# Check service status
docker compose ps

# Stop all services
docker compose down

# Stop and remove all data
docker compose down -v

# Restart specific service
docker compose restart backend

# Rebuild and restart
docker compose up -d --build backend
```

## Network Verification

```bash
# Test backend from frontend container
docker exec ifoto-frontend wget -qO- http://backend:8080/actuator/health

# Test face-service from backend container  
docker exec ifoto-backend curl http://face-service:5000/health

# Test MinIO from backend container
docker exec ifoto-backend curl http://minio:9000
```

## Data Verification

```bash
# Check PostgreSQL data
docker exec ifoto-postgres psql -U ifoto -d ifoto -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"

# Check MinIO buckets
docker exec ifoto-minio mc ls local

# Check Qdrant collections
curl http://localhost:6333/collections
```

## Performance Check

```bash
# Check container resource usage
docker stats

# Check logs for warnings
docker compose logs | grep -i warning
docker compose logs | grep -i error
```

## Next Steps After Successful Deployment

1. Create admin user account
2. Create test event
3. Upload sample photos (10-20 images with faces)
4. Test face search with selfie
5. Monitor logs for any issues
6. Document any environment-specific configurations
7. Set up monitoring (if production)
8. Configure backups (if production)

## Shutdown

```bash
# Stop all services (data persists)
docker compose down

# Stop and remove all data
docker compose down -v

# Stop specific service
docker compose stop backend
```

## Notes

- First startup downloads Docker images (~2GB total)
- Face service downloads AI models (~200MB) on first run
- Backend may retry connections while services initialize
- Allow 2-3 minutes for full stack readiness
- Check logs if any service shows "Restarting" status
