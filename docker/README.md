# Docker Setup Guide

This guide will help you run the complete ifoto platform using Docker.

## Prerequisites

- Docker Desktop installed and running
- At least 8GB RAM allocated to Docker
- At least 20GB free disk space

## Quick Start

1. **Copy environment file:**
   ```bash
   cd docker
   cp .env.example .env
   ```

2. **Edit `.env` file and set secure passwords:**
   ```bash
   # Required: Change these values
   POSTGRES_PASSWORD=your_secure_postgres_password
   JWT_SECRET=your_jwt_secret_minimum_64_characters_long
   MINIO_ROOT_PASSWORD=your_secure_minio_password
   ```

3. **Start all services:**
   ```bash
   docker compose up -d
   ```

4. **Wait for services to be ready (first time takes 5-10 minutes):**
   ```bash
   docker compose logs -f
   ```

5. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - MinIO Console: http://localhost:9001
   - Qdrant Dashboard: http://localhost:6333/dashboard

## Services

The platform consists of 6 services:

- **postgres**: PostgreSQL database for application data
- **qdrant**: Vector database for face embeddings
- **minio**: S3-compatible object storage for photos
- **backend**: Spring Boot REST API
- **face-service**: Python face recognition service
- **frontend**: Angular web application (Nginx)

## Common Commands

### View logs
```bash
docker compose logs -f [service-name]
```

### Stop all services
```bash
docker compose down
```

### Stop and remove volumes (clean slate)
```bash
docker compose down -v
```

### Rebuild a specific service
```bash
docker compose up -d --build backend
```

### Check service health
```bash
docker compose ps
```

## Troubleshooting

### Backend fails to start
- Check if PostgreSQL is ready: `docker compose logs postgres`
- Verify `.env` file has all required variables
- Ensure JWT_SECRET is at least 64 characters

### Face service fails to start
- First run downloads AI models (~200MB) - this is normal
- Check logs: `docker compose logs face-service`
- Verify Qdrant is running: `docker compose ps qdrant`

### Frontend shows connection errors
- Verify backend is running: `curl http://localhost:8080/api/auth/health`
- Check browser console for errors
- Verify nginx proxy configuration

### Cannot upload photos
- Check MinIO is accessible: http://localhost:9001
- Verify backend can connect to MinIO
- Check backend logs: `docker compose logs backend`

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  Frontend   │──────▶│   Backend    │
│  (Nginx)    │      │ (Spring Boot)│
└─────────────┘      └──────┬───────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
          ┌──────────┐ ┌────────┐ ┌─────────┐
          │ MinIO    │ │Postgres│ │  Face   │
          │(Storage) │ │  (DB)  │ │ Service │
          └──────────┘ └────────┘ └────┬────┘
                                       ▼
                                  ┌─────────┐
                                  │ Qdrant  │
                                  │(Vectors)│
                                  └─────────┘
```

## Network Configuration

All services communicate via the `ifoto-network` Docker bridge network:

- Services reference each other by container name (e.g., `backend`, `postgres`)
- Frontend proxies API requests through Nginx to backend
- Backend uses internal network URLs for MinIO and face-service

## Data Persistence

Data is stored in Docker volumes:

- `postgres_data`: Database data
- `qdrant_data`: Vector embeddings
- `minio_data`: Uploaded photos
- `face_models`: Downloaded AI models

To backup data, use Docker volume backup commands or stop containers and copy volume data.

## Development Mode

For local development without Docker:

1. Start only infrastructure services:
   ```bash
   docker compose up -d postgres qdrant minio
   ```

2. Run backend locally:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. Run frontend locally:
   ```bash
   cd frontend
   npm start
   ```

4. Run face-service locally:
   ```bash
   cd face-service
   pip install -r requirements.txt
   python app.py
   ```

Remember to update environment variables in `application.yml` and `environment.ts` to point to `localhost` instead of service names.
