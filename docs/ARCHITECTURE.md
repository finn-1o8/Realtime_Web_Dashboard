# Architecture Documentation

## Overview

The System Monitoring Dashboard is built with a modern, scalable architecture that separates concerns between frontend and backend, uses real-time communication, and follows industry best practices.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (Frontend)              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │  │
│  │  │   UI     │  │  State   │  │      Services        │ │  │
│  │  │Components│  │Management│  │  - API Client        │ │  │
│  │  │          │  │ (Redux)  │  │  - WebSocket         │ │  │
│  │  └──────────┘  └──────────┘  │  - Video Stream      │ │  │
│  │                              └──────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    HTTP REST + WebSocket
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        Server Layer                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Node.js + Express + Socket.io             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │  │
│  │  │   REST   │  │ WebSocket│  │     Business         │ │  │
│  │  │  API     │  │  Server  │  │     Logic            │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      Hardware Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Cameras  │  │  LiDAR   │  │ Storage  │  │ Network  │    │
│  │          │  │          │  │          │  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── ThemeProvider (MUI)
├── Router
│   └── Dashboard (Main Page)
│       ├── DashboardLayout
│       │   ├── Header
│       │   │   ├── SystemSelector
│       │   │   ├── RecordingStatus
│       │   │   └── HealthIndicator
│       │   ├── MainContent
│       │   │   ├── VideoGrid (or LidarView)
│       │   │   │   └── VideoPlayer[]
│       │   │   └── ControlsPanel
│       │   │       ├── CameraControlPanel
│       │   │       └── RecordingControls
│       │   ├── StatusPanel
│       │   │   └── SystemStatus
│       │   └── AlertPanel
│       └── Provider (Redux)
```

### State Management

**Redux Store Structure:**

```typescript
{
  system: {
    selectedSystemId: string,
    systems: System[],
    status: SystemStatus,
    loading: boolean,
    error: string | null
  },
  camera: {
    cameras: Camera[],
    selectedCameraIds: string[],
    gridLayout: 1 | 4 | 9 | 16,
    loading: boolean,
    error: string | null
  },
  lidar: {
    lidar: Lidar,
    pointCloudData: ArrayBuffer,
    viewConfig: ViewConfig,
    loading: boolean,
    error: string | null
  },
  recording: {
    currentSession: RecordingSession,
    sessions: RecordingSession[],
    isRecording: boolean,
    storageUsed: number,
    storageAvailable: number,
    loading: boolean,
    error: string | null
  },
  alert: {
    alerts: Alert[],
    unreadCount: number
  }
}
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Dispatch Redux Action
    ↓
Reducer Updates State
    ↓
Component Re-renders
    ↓
Service Layer (API/WebSocket)
    ↓
Server Response
    ↓
Update Redux State
    ↓
UI Updates
```

## Backend Architecture

### Server Structure

```
server/
├── index.ts (Main entry point)
├── routes/
│   ├── systems.ts
│   ├── cameras.ts
│   ├── recording.ts
│   └── status.ts
├── services/
│   ├── cameraService.ts
│   ├── recordingService.ts
│   └── storageService.ts
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── logger.ts
└── types/
    └── index.ts
```

### Request Flow

```
Client Request
    ↓
Express Middleware
    ├── CORS
    ├── Body Parser
    ├── Authentication
    └── Logging
    ↓
Route Handler
    ↓
Service Layer
    ↓
Business Logic
    ↓
Data Access Layer
    ↓
Response to Client
```

### WebSocket Architecture

```javascript
Client connects
    ↓
Socket.io connection established
    ↓
Client joins rooms (system-specific)
    ↓
Server emits initial state
    ↓
Client subscribes to events
    ↓
Server broadcasts updates
    ↓
Client receives and updates UI
```

## Key Design Decisions

### 1. Separation of Concerns

**Frontend:**
- Presentation logic only
- No business logic
- Stateless components where possible
- State managed by Redux

**Backend:**
- Business logic
- Data validation
- API contracts
- Real-time communication

### 2. Real-time Communication

**Why WebSocket over REST for updates:**
- Lower latency for status updates
- Bi-directional communication
- Reduced server load (no polling)
- Better user experience

**Why REST for commands:**
- Standard HTTP methods
- Better error handling
- Easier caching
- Simpler debugging

### 3. State Management

**Why Redux Toolkit:**
- Predictable state updates
- Time-travel debugging
- Middleware support
- DevTools integration
- TypeScript support

**Alternative considered:** Zustand
- Simpler API
- Less boilerplate
- Good for smaller apps

### 4. Component Design

**Atomic Design Principles:**
- **Atoms**: Basic UI elements (Button, Input)
- **Molecules**: Simple combinations (FormField)
- **Organisms**: Complex components (CameraControlPanel)
- **Templates**: Page layouts (Dashboard)
- **Pages**: Full pages with data

### 5. Type Safety

**TypeScript throughout:**
- Compile-time error checking
- Better IDE support
- Self-documenting code
- Refactoring safety

## Technology Choices

### Frontend Stack

| Technology | Purpose | Alternative Considered |
|------------|---------|------------------------|
| React 18 | UI Framework | Vue.js, Angular |
| TypeScript | Type Safety | JavaScript, Flow |
| Redux Toolkit | State Management | Zustand, MobX |
| Material-UI | Component Library | Ant Design, Chakra UI |
| Socket.io-client | Real-time | Native WebSocket |
| Three.js | 3D Graphics | Babylon.js, D3.js |
| Vite | Build Tool | Webpack, Parcel |

### Backend Stack

| Technology | Purpose | Alternative Considered |
|------------|---------|------------------------|
| Node.js | Runtime | Python, Go |
| Express | Web Framework | Fastify, Koa |
| Socket.io | WebSocket | ws, uWebSockets |
| TypeScript | Type Safety | JavaScript |
| Axios | HTTP Client | Fetch, Got |

## Scalability Considerations

### Horizontal Scaling

**Frontend:**
- Stateless components
- CDN for static assets
- No session storage in frontend
- Works with multiple backend instances

**Backend:**
- Stateless API design
- Load balancer required
- Shared session storage (Redis)
- Database connection pooling

### Vertical Scaling

**Frontend:**
- Code splitting
- Lazy loading
- Bundle optimization
- Tree shaking

**Backend:**
- Connection pooling
- Query optimization
- Caching strategies
- Resource monitoring

### Performance Optimization

**Frontend:**
- React.memo for expensive components
- useMemo/useCallback for computations
- Virtual scrolling for long lists
- Debouncing for user inputs

**Backend:**
- Response compression (gzip)
- HTTP/2 support
- Caching headers
- Database indexing

## Security Architecture

### Authentication & Authorization

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. Login Request
     ↓
┌─────────────────┐
│  Auth Service   │
│  - Validate     │
│  - Generate JWT │
└────┬────────────┘
     │ 2. JWT Token
     ↓
┌──────────┐
│  Client  │
└────┬─────┘
     │ 3. Request with JWT
     ↓
┌─────────────────┐
│  API Gateway    │
│  - Verify JWT   │
│  - Check Roles  │
└────┬────────────┘
     │ 4. Authorized Request
     ↓
┌──────────┐
│  Service │
└──────────┘
```

### Security Layers

1. **Network Layer**
   - HTTPS/TLS encryption
   - WSS for WebSocket
   - Firewall rules

2. **Application Layer**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - CSRF tokens

3. **Data Layer**
   - Encrypted storage
   - Access control
   - Audit logging

## Monitoring & Observability

### Logging Strategy

```
Application Logs
    ├── Error Logs (Sentry)
    ├── Access Logs (File)
    ├── Audit Logs (Database)
    └── Performance Logs (Metrics)
```

### Metrics Collection

- **Application Metrics**: Response times, error rates
- **System Metrics**: CPU, memory, disk
- **Business Metrics**: Active users, recordings
- **Custom Metrics**: Camera FPS, LiDAR point rate

### Health Checks

```typescript
GET /health
Response: {
  status: "healthy",
  timestamp: "2024-01-01T00:00:00Z",
  uptime: 3600,
  memory: {...},
  checks: {
    database: "ok",
    storage: "ok",
    cameras: "ok"
  }
}
```

## Deployment Architecture

### Development Environment

```
Developer Machine
    ├── Frontend (Vite Dev Server)
    ├── Backend (Node.js)
    └── Mock Hardware
```

### Production Environment

```
Load Balancer
    ├── Frontend Instance 1 (CDN)
    ├── Frontend Instance 2 (CDN)
    └── Backend Instances
        ├── Backend 1
        ├── Backend 2
        └── Backend 3
            ├── Redis (Sessions)
            ├── PostgreSQL (Data)
            └── S3 (Storage)
```

## Future Enhancements

### Phase 2 Features

1. **Microservices Architecture**
   - Separate services for cameras, LiDAR, recording
   - Message queue (RabbitMQ/Kafka)
   - Service mesh (Istio)

2. **Advanced Analytics**
   - Time-series database (InfluxDB)
   - Machine learning for anomaly detection
   - Predictive maintenance

3. **Multi-tenancy**
   - Organization isolation
   - Role-based access control
   - Resource quotas

4. **Edge Computing**
   - Local processing
   - Reduced latency
   - Offline capability

## Conclusion

This architecture provides:
- ✅ Scalability for growth
- ✅ Maintainability for long-term development
- ✅ Security for sensitive operations
- ✅ Performance for real-time requirements
- ✅ Flexibility for future enhancements

The system is designed to evolve with changing requirements while maintaining stability and performance.

