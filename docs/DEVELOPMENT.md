# ifoto Development Guide

## Development Environment Setup

### Prerequisites

- **Java Development Kit (JDK) 17+**
- **Maven 3.8+**
- **Node.js 20+** and npm 10+
- **Python 3.11+**
- **Docker 24.0+** and Docker Compose 2.20+
- **Git**
- **IDE**: IntelliJ IDEA (for Java), VS Code (for frontend/Python)

### Clone Repository

```bash
git clone https://github.com/nim3a/ifoto.git
cd ifoto
```

## Backend Development

### Setup

1. **Install Java 17**
   ```bash
   # Ubuntu/Debian
   sudo apt install openjdk-17-jdk
   
   # Verify
   java -version
   ```

2. **Start Dependencies**
   ```bash
   cd docker
   docker-compose up -d postgres minio qdrant
   ```

3. **Configure Application**
   - Copy `backend/src/main/resources/application.yml`
   - Update database credentials if needed

4. **Build Project**
   ```bash
   cd backend
   mvn clean install
   ```

5. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

   Or from IDE: Run `IFotoApplication.java`

### Backend Structure

```
backend/
├── src/main/java/ir/ifoto/
│   ├── IFotoApplication.java      # Main application class
│   ├── model/                     # JPA entities
│   │   ├── User.java
│   │   ├── Event.java
│   │   ├── Photo.java
│   │   └── FaceEmbedding.java
│   ├── dto/                       # Data transfer objects
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── EventRequest.java
│   │   └── EventResponse.java
│   ├── repository/                # Data access layer
│   │   ├── UserRepository.java
│   │   ├── EventRepository.java
│   │   ├── PhotoRepository.java
│   │   └── FaceEmbeddingRepository.java
│   ├── service/                   # Business logic
│   │   ├── AuthService.java
│   │   └── EventService.java
│   ├── controller/                # REST controllers
│   │   ├── AuthController.java
│   │   └── EventController.java
│   ├── security/                  # Security configuration
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   └── config/                    # Configuration classes
│       └── SecurityConfig.java
└── src/main/resources/
    ├── application.yml            # Application configuration
    └── db/migration/              # Database migrations
```

### Testing Backend

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=EventServiceTest

# Run with coverage
mvn test jacoco:report
```

### API Testing

Use tools like Postman, Insomnia, or curl:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Create Event
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Event",
    "slug": "test-event",
    "eventDate": "2024-12-31",
    "accessType": "PUBLIC",
    "published": true
  }'
```

## Face Service Development

### Setup

1. **Install Python 3.11**
   ```bash
   # Ubuntu/Debian
   sudo apt install python3.11 python3.11-venv
   ```

2. **Create Virtual Environment**
   ```bash
   cd face-service
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start Qdrant**
   ```bash
   docker run -d -p 6333:6333 qdrant/qdrant
   ```

5. **Run Service**
   ```bash
   python app.py
   ```

### Face Service Structure

```
face-service/
├── app.py                         # Main Flask application
├── app/
│   ├── __init__.py
│   ├── face_processor.py          # Face detection & embedding
│   └── vector_store.py            # Qdrant integration
├── requirements.txt               # Python dependencies
└── Dockerfile
```

### Testing Face Service

```bash
# Health check
curl http://localhost:5000/health

# Detect faces
curl -X POST http://localhost:5000/api/face/detect \
  -F "file=@test_image.jpg"

# Extract embeddings
curl -X POST http://localhost:5000/api/face/extract \
  -F "file=@test_image.jpg" \
  -F "photo_id=1" \
  -F "event_id=1"
```

### Python Code Style

Follow PEP 8:
```bash
# Install tools
pip install black flake8 pylint

# Format code
black .

# Check style
flake8 .

# Lint
pylint app/
```

## Frontend Development

### Setup

1. **Install Node.js 20+**
   ```bash
   # Using nvm
   nvm install 20
   nvm use 20
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   # or
   ng serve
   ```

   Frontend will be available at http://localhost:4200

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                  # Core services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   │       └── auth.interceptor.ts
│   │   ├── shared/                # Shared components, directives, pipes
│   │   │   └── components/
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Authentication module
│   │   │   ├── gallery/           # Gallery module
│   │   │   └── dashboard/         # Dashboard module
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   └── app-routing.module.ts
│   ├── assets/                    # Static assets
│   │   ├── images/
│   │   └── i18n/                  # Translation files
│   │       ├── fa.json
│   │       └── en.json
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.scss                # Global styles
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

### Building Frontend

```bash
# Development build
npm run build

# Production build
npm run build -- --configuration production

# Build and watch
npm run watch
```

### Testing Frontend

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run e2e tests
npm run e2e
```

### Frontend Code Style

```bash
# Lint
npm run lint

# Fix lint issues
npm run lint -- --fix
```

## Database Management

### PostgreSQL

```bash
# Connect to database
docker exec -it ifoto-postgres psql -U ifoto -d ifoto

# Common SQL commands
\dt                    # List tables
\d users               # Describe table
SELECT * FROM users;   # Query
```

### Database Migrations

Using Flyway or Liquibase (optional):

```bash
# Add to pom.xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Place migration files in `src/main/resources/db/migration/`

## Docker Development

### Build Images

```bash
# Build all services
cd docker
docker-compose build

# Build specific service
docker-compose build backend
```

### Run Services

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d postgres qdrant

# View logs
docker-compose logs -f backend
docker-compose logs -f face-service

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

### Debugging in Containers

```bash
# Execute bash in container
docker exec -it ifoto-backend /bin/sh

# View container stats
docker stats

# Inspect container
docker inspect ifoto-backend
```

## Common Development Tasks

### Add New API Endpoint

1. **Create DTO** (if needed): `dto/NewRequest.java`, `dto/NewResponse.java`
2. **Update Service**: Add business logic in `service/`
3. **Create Controller Method**: Add endpoint in `controller/`
4. **Add Tests**: Create test in `src/test/`
5. **Update API Documentation**: Add to `docs/API.md`

### Add New Frontend Feature

1. **Generate Module**: `ng generate module features/new-feature`
2. **Generate Components**: `ng generate component features/new-feature/component-name`
3. **Add Routing**: Update `app-routing.module.ts`
4. **Create Services**: `ng generate service features/new-feature/service-name`
5. **Add i18n**: Update translation files in `assets/i18n/`

### Update Dependencies

Backend:
```bash
cd backend
mvn versions:display-dependency-updates
mvn versions:use-latest-versions
```

Frontend:
```bash
cd frontend
npm outdated
npm update
```

Face Service:
```bash
cd face-service
pip list --outdated
pip install --upgrade package-name
```

## Git Workflow

### Branch Naming

- `feature/feature-name`: New features
- `bugfix/bug-description`: Bug fixes
- `hotfix/critical-fix`: Critical production fixes
- `refactor/description`: Code refactoring
- `docs/description`: Documentation updates

### Commit Messages

Follow conventional commits:
```
feat: add face search API endpoint
fix: resolve JWT token expiration issue
docs: update API documentation
refactor: improve event service performance
test: add unit tests for auth service
```

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Run linters and tests
5. Push branch and create PR
6. Request code review
7. Address review comments
8. Merge after approval

## Code Quality

### Backend (Java)

```bash
# Checkstyle
mvn checkstyle:check

# SpotBugs
mvn spotbugs:check

# PMD
mvn pmd:check
```

### Frontend (TypeScript)

```bash
# ESLint
npm run lint

# Prettier
npm run format

# Type checking
npm run type-check
```

### Python

```bash
# Format
black .

# Lint
flake8 .
pylint app/

# Type checking
mypy app/
```

## Performance Profiling

### Backend

Use Spring Boot Actuator:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
```

Access metrics at: http://localhost:8080/actuator/metrics

### Face Service

Use Python profilers:
```python
import cProfile
cProfile.run('your_function()')
```

### Frontend

Use Chrome DevTools:
- Performance tab
- Network tab
- Lighthouse audit

## Debugging

### Backend (IntelliJ IDEA)

1. Set breakpoints in code
2. Run in debug mode (Shift+F9)
3. Step through code (F8, F7)

### Frontend (VS Code)

1. Install "Debugger for Chrome" extension
2. Add configuration to `.vscode/launch.json`:
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "ng serve",
  "url": "http://localhost:4200",
  "webRoot": "${workspaceFolder}"
}
```

### Face Service (VS Code)

1. Add configuration to `.vscode/launch.json`:
```json
{
  "type": "python",
  "request": "launch",
  "name": "Flask",
  "module": "flask",
  "env": {
    "FLASK_APP": "app.py",
    "FLASK_ENV": "development"
  },
  "args": ["run"]
}
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8080
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 PID
```

### Docker Issues

```bash
# Clean Docker system
docker system prune -a --volumes

# Remove specific volume
docker volume rm docker_postgres_data
```

### Database Connection Failed

- Check PostgreSQL is running
- Verify credentials in `application.yml`
- Check firewall rules
- Ensure database exists

### Face Service Model Download Issues

- Check internet connection
- Verify Hugging Face access
- Models stored in `~/.insightface/models/`
- Delete and re-download if corrupted

## Resources

### Documentation
- Spring Boot: https://spring.io/projects/spring-boot
- Angular: https://angular.io/docs
- InsightFace: https://github.com/deepinsight/insightface
- Qdrant: https://qdrant.tech/documentation/

### Learning
- Spring Boot Guide: https://spring.io/guides
- Angular Tutorial: https://angular.io/tutorial
- Python Face Recognition: https://github.com/ageitgey/face_recognition

### Tools
- Postman: https://www.postman.com/
- Docker Desktop: https://www.docker.com/products/docker-desktop
- DBeaver: https://dbeaver.io/ (Database client)
- pgAdmin: https://www.pgadmin.org/

## Support

For development questions:
- GitHub Issues: https://github.com/nim3a/ifoto/issues
- Email: dev@ifoto.ir
- Internal Wiki: https://wiki.ifoto.ir

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
