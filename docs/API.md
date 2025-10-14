# API Documentation

## Overview

The System Monitoring Dashboard API provides RESTful endpoints and WebSocket events for managing camera/LiDAR systems, recording sessions, and monitoring system status.

**Base URL**: `http://localhost:3001/api`  
**WebSocket URL**: `ws://localhost:3001`

## Authentication

Currently, the API uses a simple token-based authentication system. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## REST API

### Systems

#### Get All Systems
```http
GET /api/systems
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "system_1",
      "name": "Primary Monitoring System",
      "status": "online",
      "lastHeartbeat": 1704067200000,
      "location": "Building A - Floor 3"
    }
  ]
}
```

#### Get System by ID
```http
GET /api/systems/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "system_1",
    "name": "Primary Monitoring System",
    "status": "online",
    "lastHeartbeat": 1704067200000,
    "location": "Building A - Floor 3"
  }
}
```

### Cameras

#### Get Cameras for System
```http
GET /api/systems/:id/cameras
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "camera_1",
      "name": "Front Camera",
      "systemId": "system_1",
      "url": "https://example.com/stream",
      "status": "connected",
      "settings": {
        "exposure": 50,
        "gain": 50,
        "whiteBalance": 50,
        "focus": 50,
        "zoom": 1
      },
      "metrics": {
        "fps": 30,
        "resolution": "1920x1080",
        "temperature": 45,
        "errors": []
      },
      "lastUpdate": 1704067200000
    }
  ]
}
```

#### Update Camera Settings
```http
PUT /api/cameras/:id/settings
Content-Type: application/json

{
  "exposure": 60,
  "gain": 55,
  "whiteBalance": 50
}
```

**Response:**
```json
{
  "success": true
}
```

**Settings Parameters:**
- `exposure` (number, 0-100): Camera exposure level
- `gain` (number, 0-100): Camera gain level
- `whiteBalance` (number, 0-100): White balance adjustment
- `focus` (number, 0-100, optional): Focus distance
- `zoom` (number, 1-10, optional): Zoom level

### Recording

#### Start Recording
```http
POST /api/recording/start
Content-Type: application/json

{
  "videoQuality": "medium",
  "codec": "h264",
  "lidarPointDensity": 100000,
  "outputPath": "/recordings",
  "naming": "timestamp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session_1704067200000",
    "systemId": "system_1",
    "startTime": 1704067200000,
    "duration": 0,
    "status": "recording",
    "config": {
      "videoQuality": "medium",
      "codec": "h264",
      "lidarPointDensity": 100000,
      "outputPath": "/recordings",
      "naming": "timestamp"
    }
  }
}
```

**Parameters:**
- `videoQuality` (string): "low" | "medium" | "high"
- `codec` (string): "h264" | "h265" | "vp9"
- `lidarPointDensity` (number): Points per second
- `outputPath` (string): Storage location
- `naming` (string): "timestamp" | "sequential" | "custom"

#### Stop Recording
```http
POST /api/recording/stop
Content-Type: application/json

{
  "sessionId": "session_1704067200000"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Get Recording Sessions
```http
GET /api/recording/sessions?systemId=system_1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "session_1704067200000",
      "systemId": "system_1",
      "startTime": 1704067200000,
      "endTime": 1704067260000,
      "duration": 60000,
      "status": "stopped",
      "config": {
        "videoQuality": "medium",
        "codec": "h264"
      }
    }
  ]
}
```

### Status

#### Get System Status
```http
GET /api/status?systemId=system_1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "systemId": "system_1",
    "network": {
      "bandwidthUsage": 45.2,
      "latency": 12.5,
      "packetLoss": 0.1
    },
    "health": {
      "cpuUsage": 35.5,
      "memoryUsage": 62.3,
      "diskUsage": 45.8,
      "temperature": 52.3,
      "warnings": []
    },
    "timestamp": 1704067200000
  }
}
```

## WebSocket API

### Connection

Connect to the WebSocket server:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Events

#### Client → Server Events

##### Update Camera Settings
```javascript
socket.emit('camera:updateSettings', {
  cameraId: 'camera_1',
  settings: {
    exposure: 60,
    gain: 55,
    whiteBalance: 50
  }
});
```

##### Start Recording
```javascript
socket.emit('recording:start', {
  videoQuality: 'medium',
  codec: 'h264',
  lidarPointDensity: 100000,
  outputPath: '/recordings',
  naming: 'timestamp'
});
```

##### Stop Recording
```javascript
socket.emit('recording:stop', {
  sessionId: 'session_1704067200000'
});
```

##### Update LiDAR View
```javascript
socket.emit('lidar:updateView', {
  rotationX: 0,
  rotationY: 45,
  zoom: 1.5,
  showDepth: true
});
```

#### Server → Client Events

##### System Status Update
```javascript
socket.on('system:status', (data) => {
  console.log('System status:', data);
  // data contains: systems, cameras arrays
});
```

##### Camera Settings Updated
```javascript
socket.on('camera:settingsUpdated', (data) => {
  console.log('Camera settings updated:', data);
  // data: { cameraId, settings }
});
```

##### Recording Update
```javascript
socket.on('recording:update', (session) => {
  console.log('Recording status:', session);
  // session: { id, status, duration, config }
});
```

##### LiDAR View Updated
```javascript
socket.on('lidar:viewUpdated', (config) => {
  console.log('LiDAR view updated:', config);
  // config: { rotationX, rotationY, zoom, showDepth }
});
```

##### Error Alert
```javascript
socket.on('alert:error', (alert) => {
  console.error('Alert:', alert);
  // alert: { id, systemId, severity, message, timestamp }
});
```

## Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider:
- 100 requests per minute per IP
- 10 WebSocket messages per second per connection

## Data Models

### System
```typescript
interface System {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastHeartbeat: number;
  location?: string;
}
```

### Camera
```typescript
interface Camera {
  id: string;
  name: string;
  systemId: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  settings: {
    exposure: number;
    gain: number;
    whiteBalance: number;
    focus?: number;
    zoom?: number;
  };
  metrics: {
    fps: number;
    resolution: string;
    temperature: number;
    errors: string[];
  };
  lastUpdate: number;
}
```

### RecordingSession
```typescript
interface RecordingSession {
  id: string;
  systemId: string;
  startTime: number;
  endTime?: number;
  duration: number;
  status: 'recording' | 'stopped' | 'paused';
  config: {
    videoQuality: 'low' | 'medium' | 'high';
    codec: string;
    lidarPointDensity: number;
    outputPath: string;
    naming: string;
  };
}
```

### SystemStatus
```typescript
interface SystemStatus {
  systemId: string;
  network: {
    bandwidthUsage: number;
    latency: number;
    packetLoss: number;
  };
  health: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    temperature: number;
    warnings: string[];
  };
  timestamp: number;
}
```

## Examples

### Complete Recording Flow

```javascript
// 1. Start recording
const response = await fetch('http://localhost:3001/api/recording/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoQuality: 'high',
    codec: 'h264',
    lidarPointDensity: 100000,
    outputPath: '/recordings',
    naming: 'timestamp'
  })
});

const { data: session } = await response.json();

// 2. Monitor recording via WebSocket
socket.on('recording:update', (update) => {
  console.log(`Recording ${update.id}: ${update.duration}ms`);
});

// 3. Stop recording
await fetch('http://localhost:3001/api/recording/stop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId: session.id })
});
```

### Camera Control Flow

```javascript
// 1. Get cameras
const camerasResponse = await fetch('http://localhost:3001/api/systems/system_1/cameras');
const { data: cameras } = await camerasResponse.json();

// 2. Update settings via REST
await fetch(`http://localhost:3001/api/cameras/${cameras[0].id}/settings`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    exposure: 60,
    gain: 55,
    whiteBalance: 50
  })
});

// 3. Receive confirmation via WebSocket
socket.on('camera:settingsUpdated', (data) => {
  console.log('Settings applied to camera:', data.cameraId);
});
```

## Changelog

### Version 1.0.0 (2024)
- Initial API release
- REST endpoints for systems, cameras, recording
- WebSocket support for real-time updates
- Mock backend server implementation

## Support

For API issues or questions:
- Check the examples above
- Review the TypeScript types in `src/types/index.ts`
- Open an issue on GitHub

