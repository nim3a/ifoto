# GitHub Copilot Instructions for ifoto

## Project Overview

**ifoto** is a production-ready, self-hosted event photography platform with advanced face recognition capabilities, designed specifically for the Persian/Iranian B2B market. The platform enables professional photographers to manage large-scale events (marathons, conferences, weddings) with thousands of photos, while attendees can easily find their photos using AI-powered face recognition.

### Key Characteristics
- **Commercial Product**: Production-grade quality, not a demo or MVP
- **Self-Hosted**: Complete independence from cloud providers (AWS/GCP/Azure)
- **Microservices Architecture**: Separate backend, face recognition service, and frontend
- **Bilingual**: English and Persian (فارسی) with full RTL support
- **Scale**: Designed to handle 5,000-30,000 photos per event

## Technology Stack

### Backend (Java/Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.1
- **Security**: Spring Security with JWT authentication (HS512)
- **Database**: PostgreSQL 16 with Spring Data JPA
- **Object Storage**: Minio (S3-compatible, self-hosted)
- **Build Tool**: Maven
- **Key Dependencies**:
  - JJWT 0.12.3 for JWT
  - Lombok for boilerplate reduction
  - Jakarta Validation for input validation
  - Minio 8.6.0 for object storage

### Face Recognition Service (Python/Flask)
- **Language**: Python 3.11
- **Framework**: Flask 3.0.0 with Flask-CORS
- **Face Recognition**: InsightFace 0.7.3 (ArcFace model)
- **Computer Vision**: OpenCV 4.9.0.80
- **Vector Database**: Qdrant 1.9.0 (self-hosted)
- **Key Libraries**:
  - ONNX Runtime 1.16.3 for model inference
  - NumPy, scikit-learn for data processing
  - Pillow 10.3.0 for image handling

### Frontend (Angular)
- **Framework**: Angular 17
- **UI Library**: Angular Material 17
- **Language**: TypeScript 5.2.2
- **Styling**: SCSS with RTL support
- **Build Tool**: Angular CLI
- **Testing**: Jasmine + Karma

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx (for frontend)
- **Vector Database**: Qdrant
- **Relational Database**: PostgreSQL 16
- **Object Storage**: Minio

## Project Structure

```
ifoto/
├── backend/                    # Spring Boot backend service
│   ├── src/main/java/ir/ifoto/
│   │   ├── config/            # Security and application config
│   │   ├── controller/        # REST API controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── exception/         # Custom exceptions and handlers
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── security/          # JWT and authentication
│   │   └── service/           # Business logic layer
│   ├── pom.xml                # Maven dependencies
│   └── Dockerfile             # Multi-stage build
├── face-service/              # Python face recognition service
│   ├── app/
│   │   ├── face_processor.py # InsightFace integration
│   │   └── vector_store.py   # Qdrant integration
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
├── frontend/                  # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Services, guards, interceptors
│   │   │   └── app-routing.module.ts
│   │   └── styles.scss        # Global RTL styles
│   ├── angular.json
│   ├── package.json
│   └── Dockerfile             # Angular + Nginx
├── docker/                    # Docker Compose setup
│   ├── docker-compose.yml     # All services configuration
│   └── .env.example           # Environment variables template
└── docs/                      # Comprehensive documentation
    ├── ARCHITECTURE.md        # System architecture
    ├── API.md                 # API documentation
    ├── DEPLOYMENT.md          # Deployment guide
    └── DEVELOPMENT.md         # Development guide
```

## Architecture Patterns

### Backend Architecture
- **Clean Architecture**: Clear separation between layers (controller → service → repository)
- **RESTful API**: Standard REST endpoints with proper HTTP methods
- **DTO Pattern**: Separate request/response DTOs from domain models
- **Repository Pattern**: Spring Data JPA repositories for data access
- **Service Layer**: Business logic isolated in service classes
- **Global Exception Handling**: Centralized exception handling with proper HTTP status codes

### Security Patterns
- **JWT Authentication**: Stateless authentication using JWT tokens
- **BCrypt Password Hashing**: Secure password storage
- **Role-Based Access Control (RBAC)**: ADMIN and PHOTOGRAPHER roles
- **Gallery Access Control**: PUBLIC, PASSWORD_PROTECTED, JWT_PROTECTED
- **CORS Configuration**: Configured for microservices communication
- **Input Validation**: Jakarta Validation annotations on DTOs

### Data Patterns
- **Event-Based Organization**: Photos organized by events
- **Slugs for URLs**: Human-readable event URLs
- **Timestamps**: CreationTimestamp and UpdateTimestamp on entities
- **Lazy Loading**: Efficient JPA relationships
- **Enums for Types**: Type-safe access control and role definitions

## Code Style and Conventions

### Java/Spring Boot
- **Package Structure**: `ir.ifoto.{layer}` (e.g., `ir.ifoto.service`)
- **Naming Conventions**:
  - Classes: PascalCase (e.g., `EventService`, `EventController`)
  - Methods: camelCase (e.g., `createEvent`, `getEventBySlug`)
  - Variables: camelCase (e.g., `eventRepository`, `jwtToken`)
  - Constants: UPPER_SNAKE_CASE (e.g., `JWT_SECRET_KEY`)
- **Annotations**:
  - Use Lombok: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`
  - Use Spring: `@Service`, `@RestController`, `@RequestMapping`
  - Use JPA: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
  - Use Validation: `@NotNull`, `@NotBlank`, `@Size`, `@Valid`
- **REST Controllers**:
  - Base path: `/api/{resource}` (e.g., `/api/events`)
  - Use `@RequestMapping` at class level
  - Return `ResponseEntity<?>` with proper HTTP status codes
  - Use `@Valid` for request body validation
- **Services**:
  - Mark with `@Service`
  - Use constructor injection with `@RequiredArgsConstructor`
  - Use `@Transactional` for database operations
  - Throw custom exceptions for error handling
- **Exception Handling**:
  - Use custom exceptions: `ResourceNotFoundException`, `DuplicateResourceException`
  - Global handler with `@RestControllerAdvice`
  - Return proper error response DTOs

### Python/Flask
- **Code Style**: Follow PEP 8
- **Naming Conventions**:
  - Functions/variables: snake_case (e.g., `detect_faces`, `face_processor`)
  - Classes: PascalCase (e.g., `FaceProcessor`, `VectorStore`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MODEL_NAME`, `COLLECTION_NAME`)
- **Flask Routes**:
  - Use Blueprint pattern for organization
  - Base path: `/api/face/{action}`
  - Return JSON responses with proper status codes
  - Use try-except for error handling
- **Type Hints**: Use Python type hints for function parameters and return values
- **Error Handling**: Return JSON error responses with status codes

### TypeScript/Angular
- **Naming Conventions**:
  - Components: kebab-case files, PascalCase classes (e.g., `event-list.component.ts`)
  - Services: kebab-case files, PascalCase classes (e.g., `auth.service.ts`)
  - Interfaces: PascalCase (e.g., `Event`, `User`)
  - Variables: camelCase (e.g., `eventList`, `currentUser`)
- **Angular Style Guide**: Follow official Angular style guide
- **Services**: Injectable services in `core/services/`
- **RxJS**: Use observables for async operations
- **HTTP**: Use HttpClient with proper error handling
- **Interceptors**: Auth interceptor for JWT token injection

### RTL and Persian Support
- **RTL Layout**: Use `dir="rtl"` attribute and CSS logical properties
- **Persian Text**: Support Persian content alongside English
- **Date/Time**: Consider Persian calendar (Jalali) for date display
- **Font**: Use Vazirmatn or similar Persian-friendly fonts
- **Text Direction**: Use CSS logical properties (`margin-inline-start` instead of `margin-left`)

## Development Guidelines

### Adding New Features

#### Backend Endpoint
1. Create/update DTO in `dto/` package
2. Add repository method if needed in `repository/`
3. Implement business logic in `service/` package
4. Create controller endpoint in `controller/` package
5. Update security config if needed
6. Test with Postman/curl

#### Face Recognition Feature
1. Add processing logic in `face_processor.py`
2. Update vector store operations in `vector_store.py`
3. Create Flask route in `app.py`
4. Handle errors appropriately
5. Test with sample images

#### Frontend Component
1. Generate component: `ng generate component feature/component-name`
2. Create service if needed: `ng generate service feature/service-name`
3. Add routing in appropriate routing module
4. Implement component logic
5. Add RTL-aware styles
6. Test responsive design

### Database Changes
- Create JPA entity in `model/` package
- Add repository interface in `repository/`
- Update relationships in related entities
- Spring Boot will handle schema creation (development)
- For production, use Flyway/Liquibase migrations (future)

### API Integration
- Backend exposes REST APIs at `/api/*`
- Face service exposes APIs at `/api/face/*`
- Frontend calls backend APIs through `ApiService`
- Use environment files for API base URLs
- Handle errors with appropriate HTTP status codes

### Security Considerations
- **Never commit secrets**: Use environment variables
- **JWT Secret**: Must be 64+ characters in production
- **Password Hashing**: Always use BCrypt
- **Input Validation**: Validate all user inputs
- **File Uploads**: Validate file types and sizes (max 50MB)
- **SQL Injection**: Use JPA parameterized queries (automatic)
- **XSS Protection**: Angular provides built-in protection
- **CORS**: Configure properly for allowed origins
- **Dependencies**: Keep dependencies updated, scan for vulnerabilities

### Testing Approach
- **Backend**: JUnit 5 + Spring Boot Test + MockMvc
- **Face Service**: pytest with mock data
- **Frontend**: Jasmine + Karma for unit tests
- **Integration**: Docker Compose for full stack testing
- **E2E**: Protractor or Cypress (future)

### Build and Run

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Or with Docker
docker build -t ifoto-backend .
docker run -p 8080:8080 ifoto-backend
```

#### Face Service
```bash
cd face-service
pip install -r requirements.txt
python app.py
# Or with Docker
docker build -t ifoto-face-service .
docker run -p 5000:5000 ifoto-face-service
```

#### Frontend
```bash
cd frontend
npm install
ng serve
# Or build for production
ng build --configuration production
# Or with Docker
docker build -t ifoto-frontend .
docker run -p 80:80 ifoto-frontend
```

#### Full Stack
```bash
cd docker
cp .env.example .env
# Edit .env with proper values
docker-compose up -d
```

## Common Patterns and Examples

### Creating a New REST Endpoint

**1. Create DTO:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @Size(max = 500)
    private String description;
}
```

**2. Add Service Method:**
```java
@Service
@RequiredArgsConstructor
public class MyService {
    private final MyRepository myRepository;
    
    @Transactional
    public MyResponse createItem(MyRequest request) {
        // Business logic here
        MyEntity entity = myRepository.save(item);
        return mapToResponse(entity);
    }
}
```

**3. Create Controller:**
```java
@RestController
@RequestMapping("/api/my-resource")
@RequiredArgsConstructor
public class MyController {
    private final MyService myService;
    
    @PostMapping
    public ResponseEntity<MyResponse> create(@Valid @RequestBody MyRequest request) {
        MyResponse response = myService.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### Face Recognition Integration

**Backend calls Face Service:**
```java
// Use RestTemplate or WebClient to call face service
String faceServiceUrl = "http://face-service:5000/api/face/search";
// Send request with image and get results
```

**Face Service processes images:**
```python
@app.route('/api/face/search', methods=['POST'])
def search_faces():
    try:
        file = request.files['image']
        # Process with InsightFace
        embedding = face_processor.extract_embedding(file)
        # Search in Qdrant
        results = vector_store.search(embedding, limit=50)
        return jsonify({'results': results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Angular Service Pattern

```typescript
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  createEvent(event: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }
}
```

## Performance Considerations

- **Database Indexing**: Add indexes on frequently queried fields (slug, username, eventId)
- **Lazy Loading**: Use JPA lazy loading for relationships
- **Pagination**: Implement pagination for large result sets
- **Caching**: Consider Redis for frequently accessed data (future)
- **Image Processing**: Async processing for bulk uploads
- **Vector Search**: Qdrant optimized for similarity search
- **Connection Pooling**: Configure Hikari CP properly
- **File Storage**: Use Minio for scalable object storage
- **GPU Acceleration**: Face service supports GPU (optional)

## Persian/RTL Specific Guidelines

### UI Text
- Always provide both English and Persian translations
- Use translation keys/i18n for all user-facing text
- Persian text should be contextually appropriate

### Layout
- Support both LTR and RTL layouts
- Use CSS logical properties for directional styles
- Test all components in RTL mode
- Icons and images should be RTL-aware

### Dates and Numbers
- Support Persian (Jalali) calendar display
- Format numbers according to locale
- Consider Persian number formatting (۱۲۳ vs 123)

### Fonts
- Use web-safe Persian fonts (Vazirmatn, IRANSans)
- Ensure proper font loading and fallbacks
- Test readability on different screen sizes

## Important Notes

### For AI Assistants (Copilot)
- This is a **production-grade commercial product**, not a toy or demo
- **Quality matters**: Write clean, maintainable, secure code
- **Follow patterns**: Use existing code patterns and conventions
- **Security first**: Never compromise on security
- **Test thoroughly**: Ensure code works before committing
- **Document**: Add comments for complex logic
- **Bilingual**: Remember to support both English and Persian
- **RTL-aware**: Always consider RTL layout implications
- **Performance**: Consider scalability and performance

### Project Goals
- Enable photographers to manage large events efficiently
- Provide attendees with easy photo discovery via face recognition
- Maintain high accuracy (>99%) in face recognition
- Support 5,000-30,000 photos per event
- Self-hosted solution with no cloud dependencies
- Production-ready security and performance
- Excellent UX for Persian-speaking users

### Future Enhancements (Phase 2+)
- User registration for attendees
- Photo selection and cart system
- Payment integration
- Email notifications
- Social media sharing
- Advanced search and filters
- Analytics dashboard
- Mobile applications (iOS/Android)
- Multi-language support expansion
- Machine learning improvements

## Resources

- **Documentation**: See `/docs` folder for comprehensive guides
- **API Docs**: `/docs/API.md` for complete API reference
- **Architecture**: `/docs/ARCHITECTURE.md` for system design
- **Deployment**: `/docs/DEPLOYMENT.md` for deployment instructions
- **Development**: `/docs/DEVELOPMENT.md` for development setup

## Contact and Support

- **Repository**: https://github.com/nim3a/ifoto
- **Website**: https://ifoto.ir
- **License**: Commercial/Proprietary - See LICENSE file

---

**Remember**: This is a real commercial product serving real customers. Every line of code should reflect production-grade quality, security, and performance standards. When in doubt, prioritize security and maintainability over convenience.
