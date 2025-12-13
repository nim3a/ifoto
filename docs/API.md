# ifoto API Documentation

## Base URLs

- **Backend API**: `http://localhost:8080/api`
- **Face Service API**: `http://localhost:5000/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Backend API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "username": "admin",
  "email": "admin@ifoto.ir",
  "role": "ADMIN"
}
```

**Status Codes:**
- `200 OK`: Successful authentication
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Validation error

---

### Events

#### POST /api/events
Create a new event.

**Authentication:** Required (PHOTOGRAPHER or ADMIN)

**Request Body:**
```json
{
  "name": "ماراتن تهران 2024",
  "description": "ماراتن بین‌المللی تهران",
  "eventDate": "2024-05-15",
  "location": "میدان آزادی، تهران",
  "slug": "tehran-marathon-2024",
  "accessType": "PUBLIC",
  "coverImageUrl": "https://example.com/cover.jpg",
  "published": true
}
```

**Access Types:**
- `PUBLIC`: Open to everyone
- `PASSWORD_PROTECTED`: Requires password
- `JWT_PROTECTED`: Requires JWT token

**Response:**
```json
{
  "id": 1,
  "name": "ماراتن تهران 2024",
  "description": "ماراتن بین‌المللی تهران",
  "eventDate": "2024-05-15",
  "location": "میدان آزادی، تهران",
  "slug": "tehran-marathon-2024",
  "accessType": "PUBLIC",
  "coverImageUrl": "https://example.com/cover.jpg",
  "watermarkUrl": null,
  "sponsorLogoUrl": null,
  "published": true,
  "photoCount": 0,
  "photographerName": "John Doe",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

**Status Codes:**
- `200 OK`: Event created successfully
- `400 Bad Request`: Validation error or slug already exists
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions

---

#### GET /api/events/public
Get all published events (no authentication required).

**Response:**
```json
[
  {
    "id": 1,
    "name": "ماراتن تهران 2024",
    "slug": "tehran-marathon-2024",
    "eventDate": "2024-05-15",
    "photoCount": 1250,
    "coverImageUrl": "https://example.com/cover.jpg"
  }
]
```

---

#### GET /api/events/public/{slug}
Get event details by slug (no authentication for public events).

**Path Parameters:**
- `slug`: Event slug (e.g., "tehran-marathon-2024")

**Response:**
```json
{
  "id": 1,
  "name": "ماراتن تهران 2024",
  "description": "ماراتن بین‌المللی تهران",
  "eventDate": "2024-05-15",
  "location": "میدان آزادی، تهران",
  "slug": "tehran-marathon-2024",
  "accessType": "PUBLIC",
  "photoCount": 1250,
  "coverImageUrl": "https://example.com/cover.jpg"
}
```

**Status Codes:**
- `200 OK`: Event found
- `404 Not Found`: Event not found

---

#### GET /api/events/my
Get events created by the authenticated user.

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 1,
    "name": "ماراتن تهران 2024",
    "slug": "tehran-marathon-2024",
    "published": true,
    "photoCount": 1250
  }
]
```

---

#### PUT /api/events/{id}
Update an existing event.

**Authentication:** Required (Owner or ADMIN)

**Path Parameters:**
- `id`: Event ID

**Request Body:** Same as create event

**Response:** Updated event object

---

### Photos

#### POST /api/photos/upload
Upload photos to an event.

**Authentication:** Required

**Request:** Multipart form data
- `eventId`: Event ID
- `files`: Array of image files (multiple)

**Response:**
```json
{
  "uploaded": 150,
  "failed": 2,
  "photos": [
    {
      "id": 1001,
      "fileName": "IMG_1234.jpg",
      "fileSize": 2048576,
      "processed": false
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Photos uploaded
- `400 Bad Request`: Invalid files or event ID
- `401 Unauthorized`: Authentication required
- `413 Payload Too Large`: File size exceeds limit

---

#### GET /api/photos/{eventId}
Get photos for an event (paginated).

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 50)

**Response:**
```json
{
  "content": [
    {
      "id": 1001,
      "fileName": "IMG_1234.jpg",
      "thumbnailUrl": "https://storage.ifoto.ir/thumbs/...",
      "photoUrl": "https://storage.ifoto.ir/photos/...",
      "faceCount": 3,
      "uploadedAt": "2024-01-15T11:00:00"
    }
  ],
  "totalElements": 1250,
  "totalPages": 25,
  "currentPage": 0,
  "pageSize": 50
}
```

---

#### GET /api/photos/{id}/download
Download a photo.

**Path Parameters:**
- `id`: Photo ID

**Response:** Photo file (image/jpeg)

---

### Face Search

#### POST /api/face/search
Search for photos containing similar faces.

**Authentication:** Required for private events

**Request:** Multipart form data
- `file`: Query image (selfie)
- `eventId`: Event ID
- `limit`: Maximum results (default: 50)
- `threshold`: Similarity threshold (default: 0.6, range: 0-1)

**Response:**
```json
{
  "matches": [
    {
      "photoId": 1001,
      "photoUrl": "https://storage.ifoto.ir/photos/...",
      "thumbnailUrl": "https://storage.ifoto.ir/thumbs/...",
      "similarity": 0.92,
      "faceLocation": {
        "x": 120,
        "y": 80,
        "width": 200,
        "height": 240
      }
    }
  ],
  "totalMatches": 23
}
```

**Status Codes:**
- `200 OK`: Search completed
- `400 Bad Request`: No face detected in query image
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Event not found

---

## Face Service API Endpoints

### Health Check

#### GET /health
Check service health and GPU availability.

**Response:**
```json
{
  "status": "healthy",
  "service": "ifoto-face-service",
  "version": "1.0.0",
  "gpu_available": true
}
```

---

### Face Detection

#### POST /api/face/detect
Detect faces in an image.

**Request:** Multipart form data
- `file`: Image file

**Response:**
```json
{
  "face_count": 3,
  "faces": [
    {
      "bbox": [120, 80, 320, 320],
      "confidence": 0.998,
      "landmarks": [[x1, y1], [x2, y2], ...]
    }
  ]
}
```

---

### Embedding Extraction

#### POST /api/face/extract
Extract and store face embeddings.

**Request:** Multipart form data
- `file`: Image file
- `photo_id`: Photo ID (integer)
- `event_id`: Event ID (integer)

**Response:**
```json
{
  "face_count": 3,
  "embeddings": [
    {
      "vector_id": "photo_1001_face_0",
      "face_index": 0,
      "bbox": [120, 80, 320, 320],
      "confidence": 0.998
    }
  ]
}
```

---

### Face Search

#### POST /api/face/search
Search for similar faces.

**Request:** Multipart form data
- `file`: Query image (selfie)
- `event_id`: Event ID (integer)
- `limit`: Maximum results (default: 50)
- `threshold`: Similarity threshold (default: 0.6)

**Response:**
```json
{
  "matches": [
    {
      "vector_id": "photo_1001_face_0",
      "similarity": 0.92,
      "photo_id": 1001,
      "event_id": 1,
      "face_index": 0,
      "bbox": [120, 80, 320, 320],
      "confidence": 0.998
    }
  ],
  "total_matches": 23
}
```

---

### Delete Event Embeddings

#### DELETE /api/face/delete-event
Delete all face embeddings for an event.

**Request Body:**
```json
{
  "event_id": 1
}
```

**Response:**
```json
{
  "message": "Event embeddings deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "status": 400,
  "timestamp": "2024-01-15T12:00:00"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `413 Payload Too Large`: File size exceeds limit
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Upload endpoints**: 10 requests per minute
- **Search endpoints**: 20 requests per minute
- **Other endpoints**: 100 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time until rate limit resets (Unix timestamp)

---

## Pagination

Paginated endpoints support the following query parameters:

- `page`: Page number (0-indexed)
- `size`: Items per page (max: 100)
- `sort`: Sort field and direction (e.g., `createdAt,desc`)

**Example:**
```
GET /api/photos/1?page=0&size=50&sort=uploadedAt,desc
```

---

## File Upload Limits

- **Maximum file size**: 50 MB per file
- **Maximum request size**: 500 MB (for bulk uploads)
- **Supported formats**: JPEG, PNG, WebP
- **Recommended size**: 2000x2000 pixels or less for optimal performance

---

## Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (not in localStorage for sensitive applications)
3. **Implement token refresh** for long-lived sessions
4. **Handle rate limiting** with exponential backoff
5. **Validate file types** on client side before upload
6. **Use pagination** for large result sets
7. **Compress images** before upload when possible
8. **Cache public event data** on client side
9. **Implement proper error handling** for all API calls
10. **Use appropriate similarity thresholds** (0.6-0.7 for general use, 0.8+ for strict matching)

---

## Webhooks (Future)

Planned webhook support for:
- Photo processing completion
- Face detection completion
- Event publication
- User registration

---

## SDK Support (Future)

Official SDKs planned for:
- JavaScript/TypeScript
- Python
- Java
- PHP

---

## Support

For API support and questions:
- **Email**: api@ifoto.ir
- **Documentation**: https://docs.ifoto.ir
- **GitHub Issues**: https://github.com/nim3a/ifoto/issues
