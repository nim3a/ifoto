# ifoto Architecture Documentation

## System Overview

ifoto is a production-ready, self-hosted event photography platform designed for B2B event photography services. The platform enables photographers to upload thousands of photos from events, and attendees to find their photos using face recognition technology.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.1 with Java 17
- **Database**: PostgreSQL 16 (relational data)
- **Object Storage**: Minio (S3-compatible, self-hosted)
- **Vector Database**: Qdrant (face embeddings)
- **Security**: Spring Security with JWT authentication
- **Build Tool**: Maven

### Face Recognition Service
- **Language**: Python 3.11
- **Framework**: Flask
- **Face Recognition**: InsightFace (ArcFace model)
- **Computer Vision**: OpenCV
- **Vector Operations**: NumPy, scikit-learn
- **Vector Database Client**: qdrant-client

### Frontend
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Language**: TypeScript 5.2
- **Styling**: SCSS with RTL support
- **Build Tool**: Angular CLI

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **Deployment**: Self-hosted (CPU-based, GPU-ready)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (Angular Frontend)                        │
│                   Mobile-First, RTL, i18n                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│                         (Nginx)                              │
│                  Routing, SSL, Compression                   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     Backend Service       │   │  Face Recognition Service │
│    (Spring Boot/Java)     │   │     (Flask/Python)        │
│                           │   │                           │
│  • Authentication & JWT   │   │  • Face Detection         │
│  • Event Management       │   │  • Face Alignment         │
│  • Photo Upload/Storage   │   │  • Embedding Extraction   │
│  • Gallery Access Control │   │  • Vector Search          │
│  • Business Logic         │   │  • InsightFace (ArcFace)  │
└───────────────────────────┘   └───────────────────────────┘
         │         │                        │
         │         │                        │
         ▼         ▼                        ▼
┌──────────┐ ┌──────────┐         ┌──────────────┐
│PostgreSQL│ │  Minio   │         │   Qdrant     │
│   DB     │ │ Storage  │         │  Vector DB   │
└──────────┘ └──────────┘         └──────────────┘
```

## Core Components

### 1. Backend Service (Spring Boot)

**Responsibilities:**
- User authentication and authorization (JWT-based)
- Event CRUD operations
- Photo upload and metadata management
- Gallery access control (public/private/password-protected)
- Integration with face recognition service
- File storage coordination (Minio)

**Key Layers:**
- **Controller Layer**: REST API endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access (Spring Data JPA)
- **Security Layer**: JWT authentication, authorization
- **Config Layer**: Application configuration

**Database Schema:**
- `users`: Photographers and admins
- `events`: Event metadata
- `photos`: Photo metadata and references
- `face_embeddings`: Face detection metadata (links to vector DB)

### 2. Face Recognition Service (Python)

**Responsibilities:**
- Face detection using InsightFace
- Face alignment and normalization
- Embedding extraction (512-dimensional vectors)
- Vector database operations (insert, search)
- Similarity calculation

**Technology Choices:**
- **InsightFace**: State-of-the-art face recognition (ArcFace model)
- **buffalo_l model**: High accuracy, suitable for production
- **Qdrant**: High-performance vector database with filtering
- **CPU-first design**: Runs on CPU with GPU acceleration support

**API Endpoints:**
- `POST /api/face/detect`: Detect faces in an image
- `POST /api/face/extract`: Extract and store embeddings
- `POST /api/face/search`: Search for similar faces
- `DELETE /api/face/delete-event`: Delete event embeddings

### 3. Frontend (Angular)

**Responsibilities:**
- User-facing gallery interface
- Face search (selfie upload)
- Photo viewing and downloading
- Admin/photographer dashboard
- Bulk photo upload

**Key Features:**
- **RTL Support**: Complete right-to-left layout for Persian
- **i18n**: Persian language support
- **Mobile-First**: Responsive design optimized for mobile
- **Progressive Loading**: Efficient handling of large galleries
- **Lazy Loading**: Module-based code splitting

### 4. Storage Systems

#### PostgreSQL
- Relational data (users, events, photos)
- Transaction support
- Full-text search capabilities
- Robust and production-proven

#### Minio
- S3-compatible object storage
- Self-hosted, no cloud dependency
- High-performance file storage
- Bucket-based organization

#### Qdrant
- Vector similarity search
- Filtering by event_id for scoped searches
- Cosine similarity metric
- GPU-ready for future scaling

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **BCrypt Password Hashing**: Secure password storage
- **Role-Based Access Control**: Admin vs Photographer roles
- **CORS Configuration**: Controlled cross-origin requests

### Data Protection
- **Gallery Access Control**:
  - Public galleries: No authentication required
  - Password-protected: Custom password per event
  - JWT-protected: Token-based access
- **Secure File Upload**: Validation and sanitization
- **SQL Injection Prevention**: Parameterized queries (JPA)
- **XSS Protection**: Angular's built-in sanitization

## Face Recognition Pipeline

### 1. Photo Upload Phase
```
Photo Upload → Backend Storage (Minio) → Database Record → 
Background Processing → Face Service → Detect & Extract → 
Store in Vector DB → Update Photo Metadata
```

### 2. Face Search Phase
```
User Uploads Selfie → Face Service → Extract Embedding → 
Vector Search in Qdrant (filtered by event_id) → 
Return Similar Faces → Backend Maps to Photos → 
Return Photo URLs to User
```

### Performance Characteristics
- **Detection Speed**: ~100-200ms per image (CPU)
- **Embedding Extraction**: ~50-100ms per face (CPU)
- **Vector Search**: <50ms for 30,000 embeddings
- **Accuracy**: >99% with ArcFace on LFW benchmark
- **Scalability**: Horizontal scaling of face service

## Deployment Architecture

### Self-Hosted Deployment
```
┌─────────────────────────────────────────┐
│           Docker Host Server            │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ Frontend │  │ Backend  │           │
│  │  (Nginx) │  │  (Java)  │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │   Face   │  │PostgreSQL│           │
│  │  Service │  │          │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │  Minio   │  │  Qdrant  │           │
│  │          │  │          │           │
│  └──────────┘  └──────────┘           │
│                                         │
│         Docker Compose Network          │
└─────────────────────────────────────────┘
```

### GPU Acceleration (Optional)
- Uncomment GPU configuration in docker-compose.yml
- Requires NVIDIA GPU with CUDA support
- 3-5x performance improvement for face processing
- Recommended for events with >10,000 photos

## Scalability Considerations

### Current Architecture (Phase 1)
- Single-server deployment
- CPU-based face recognition
- Suitable for: 5,000 - 30,000 photos per event

### Future Scaling (Phase 2+)
- **Face Service**: Multiple instances behind load balancer
- **Backend**: Horizontal scaling with session-less JWT
- **Database**: Read replicas for queries
- **Storage**: Distributed Minio cluster
- **Vector DB**: Qdrant cluster mode
- **GPU Acceleration**: Multi-GPU support

## High-Level Data Flow

### Event Creation Flow
1. Photographer logs in (JWT authentication)
2. Creates event with metadata
3. Sets access control (public/private)
4. Uploads photos in bulk
5. Backend stores in Minio
6. Async job processes faces
7. Face service extracts embeddings
8. Embeddings stored in Qdrant
9. Photo marked as processed

### Face Search Flow
1. User opens gallery (public or authenticated)
2. Uploads selfie for search
3. Face service extracts embedding
4. Searches Qdrant (filtered by event_id)
5. Returns similar faces with scores
6. Backend maps to photo URLs
7. Frontend displays matched photos
8. User can view/download photos

## Code Organization

### Backend Structure
```
backend/
├── src/main/java/ir/ifoto/
│   ├── model/          # Domain entities
│   ├── dto/            # Data transfer objects
│   ├── repository/     # Data access layer
│   ├── service/        # Business logic
│   ├── controller/     # REST endpoints
│   ├── security/       # JWT, authentication
│   ├── config/         # Configuration classes
│   └── exception/      # Exception handling
└── src/main/resources/
    └── application.yml # Configuration
```

### Face Service Structure
```
face-service/
├── app/
│   ├── face_processor.py  # InsightFace integration
│   ├── vector_store.py    # Qdrant operations
│   └── __init__.py
├── app.py                 # Flask application
└── requirements.txt       # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/app/
│   ├── core/          # Core services, guards, interceptors
│   ├── shared/        # Shared components, pipes, directives
│   ├── features/      # Feature modules
│   │   ├── auth/      # Authentication
│   │   ├── gallery/   # Gallery viewing
│   │   └── dashboard/ # Admin/photographer dashboard
│   └── assets/        # Static assets, i18n
```

## Configuration Management

### Environment Variables
All services use environment variables for configuration:
- Database credentials
- Storage configuration
- API endpoints
- JWT secrets
- Service URLs

### Production Considerations
- Change default passwords
- Use strong JWT secrets (minimum 512 bits)
- Enable HTTPS with SSL certificates
- Configure backup strategies
- Monitor resource usage
- Set up logging and alerting

## Monitoring & Maintenance

### Health Checks
- Backend: Spring Boot Actuator
- Face Service: `/health` endpoint
- Database: Connection pool monitoring
- Storage: Minio health API

### Logging
- Structured logging with timestamps
- Log levels: DEBUG (dev), INFO (prod)
- Centralized log collection recommended

### Backup Strategy
- Database: Daily automated backups
- Object Storage: Redundancy with Minio
- Vector DB: Periodic snapshots
- Configuration: Version controlled

## Performance Optimization

### Backend
- Connection pooling (HikariCP)
- JPA query optimization
- Lazy loading for associations
- Caching strategies

### Face Service
- Batch processing for bulk uploads
- Model pre-loading at startup
- Memory-efficient embedding storage
- GPU acceleration when available

### Frontend
- Lazy loading of modules
- Image lazy loading
- Virtual scrolling for large galleries
- Progressive Web App (PWA) ready

## Compliance & Privacy

### Data Handling
- Face embeddings are vectors, not images
- No personal data stored in vectors
- GDPR considerations for EU users
- User consent for face recognition

### Storage
- User photos stored securely
- Access control enforced
- Deletion capabilities
- Data retention policies

This architecture provides a solid foundation for a production-ready event photography platform with enterprise-grade face recognition capabilities, designed for self-hosted deployment in Iran with full Persian/RTL support.
