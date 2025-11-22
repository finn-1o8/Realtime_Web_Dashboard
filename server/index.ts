import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Security: Configure CORS with allowed origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : process.env.NODE_ENV === 'production'
  ? []
  : ['http://localhost:3000', 'http://localhost:5173'];

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests) only in development
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (origin && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
});

// Security: Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests) only in development
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (origin && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Security: Add security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:;"
  );
  // Strict Transport Security (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Security: Limit request body size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: Simple rate limiting middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

const rateLimitMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
  }

  clientData.count++;
  next();
};

// Apply rate limiting to API routes
app.use('/api', rateLimitMiddleware);

// Mock data
const mockSystems = [
  {
    id: 'system_1',
    name: 'Primary Monitoring System',
    status: 'online' as const,
    lastHeartbeat: Date.now(),
    location: 'Building A - Floor 3',
  },
  {
    id: 'system_2',
    name: 'Secondary Monitoring System',
    status: 'online' as const,
    lastHeartbeat: Date.now() - 5000,
    location: 'Building B - Floor 1',
  },
];

const mockCameras = [
  {
    id: 'camera_1',
    name: 'Front Camera',
    systemId: 'system_1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    status: 'connected' as const,
    settings: {
      exposure: 50,
      gain: 50,
      whiteBalance: 50,
      focus: 50,
      zoom: 1,
    },
    metrics: {
      fps: 30,
      resolution: '1920x1080',
      temperature: 45,
      errors: [],
    },
    lastUpdate: Date.now(),
  },
  {
    id: 'camera_2',
    name: 'Rear Camera',
    systemId: 'system_1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    status: 'connected' as const,
    settings: {
      exposure: 55,
      gain: 45,
      whiteBalance: 50,
      focus: 50,
      zoom: 1,
    },
    metrics: {
      fps: 30,
      resolution: '1920x1080',
      temperature: 43,
      errors: [],
    },
    lastUpdate: Date.now(),
  },
  {
    id: 'camera_3',
    name: 'Side Camera',
    systemId: 'system_1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    status: 'connected' as const,
    settings: {
      exposure: 50,
      gain: 50,
      whiteBalance: 50,
      focus: 50,
      zoom: 1,
    },
    metrics: {
      fps: 30,
      resolution: '1920x1080',
      temperature: 47,
      errors: [],
    },
    lastUpdate: Date.now(),
  },
  {
    id: 'camera_4',
    name: 'Top Camera',
    systemId: 'system_1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    status: 'connected' as const,
    settings: {
      exposure: 50,
      gain: 50,
      whiteBalance: 50,
      focus: 50,
      zoom: 1,
    },
    metrics: {
      fps: 30,
      resolution: '1920x1080',
      temperature: 44,
      errors: [],
    },
    lastUpdate: Date.now(),
  },
];

let recordingSession: any = null;

// Security: Input validation helpers
const validateId = (id: string): boolean => {
  // Allow alphanumeric, underscore, and hyphen, max 100 chars
  return /^[a-zA-Z0-9_-]{1,100}$/.test(id);
};

const validateCameraSettings = (settings: any): boolean => {
  if (!settings || typeof settings !== 'object') return false;
  const validKeys = ['exposure', 'gain', 'whiteBalance', 'focus', 'zoom'];
  for (const key in settings) {
    if (!validKeys.includes(key)) return false;
    const value = settings[key];
    if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 1000) {
      return false;
    }
  }
  return true;
};

const validateRecordingConfig = (config: any): boolean => {
  if (!config || typeof config !== 'object') return false;
  const validQualities = ['low', 'medium', 'high'];
  if (config.videoQuality && !validQualities.includes(config.videoQuality)) {
    return false;
  }
  if (config.codec && typeof config.codec !== 'string') {
    return false;
  }
  if (config.lidarPointDensity && (typeof config.lidarPointDensity !== 'number' || config.lidarPointDensity < 0)) {
    return false;
  }
  return true;
};

// Security: Sanitize string input
const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// REST API Routes
app.get('/api/systems', (req, res) => {
  res.json({ success: true, data: mockSystems });
});

app.get('/api/systems/:id', (req, res) => {
  const id = req.params.id;
  if (!validateId(id)) {
    return res.status(400).json({ success: false, error: 'Invalid system ID format' });
  }
  const system = mockSystems.find((s) => s.id === id);
  if (system) {
    res.json({ success: true, data: system });
  } else {
    res.status(404).json({ success: false, error: 'System not found' });
  }
});

app.get('/api/systems/:id/cameras', (req, res) => {
  const id = req.params.id;
  if (!validateId(id)) {
    return res.status(400).json({ success: false, error: 'Invalid system ID format' });
  }
  const cameras = mockCameras.filter((c) => c.systemId === id);
  res.json({ success: true, data: cameras });
});

app.put('/api/cameras/:id/settings', (req, res) => {
  const id = req.params.id;
  if (!validateId(id)) {
    return res.status(400).json({ success: false, error: 'Invalid camera ID format' });
  }
  if (!validateCameraSettings(req.body)) {
    return res.status(400).json({ success: false, error: 'Invalid camera settings format' });
  }
  const camera = mockCameras.find((c) => c.id === id);
  if (camera) {
    // Only update allowed settings
    const allowedSettings = ['exposure', 'gain', 'whiteBalance', 'focus', 'zoom'];
    allowedSettings.forEach((key) => {
      if (req.body[key] !== undefined) {
        camera.settings[key as keyof typeof camera.settings] = Math.max(0, Math.min(1000, Number(req.body[key])));
      }
    });
    camera.lastUpdate = Date.now();
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Camera not found' });
  }
});

app.post('/api/recording/start', (req, res) => {
  if (recordingSession) {
    res.status(400).json({ success: false, error: 'Recording already in progress' });
    return;
  }

  if (!validateRecordingConfig(req.body)) {
    return res.status(400).json({ success: false, error: 'Invalid recording configuration' });
  }

  recordingSession = {
    id: `session_${Date.now()}`,
    systemId: 'system_1',
    startTime: Date.now(),
    duration: 0,
    status: 'recording',
    config: {
      videoQuality: req.body.videoQuality || 'high',
      codec: sanitizeString(req.body.codec || 'h264'),
      lidarPointDensity: Math.max(0, Number(req.body.lidarPointDensity) || 0),
      outputPath: sanitizeString(req.body.outputPath || ''),
      naming: sanitizeString(req.body.naming || ''),
    },
  };

  res.json({ success: true, data: recordingSession });
});

app.post('/api/recording/stop', (req, res) => {
  if (recordingSession) {
    recordingSession.status = 'stopped';
    recordingSession.endTime = Date.now();
    recordingSession = null;
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'No active recording' });
  }
});

app.get('/api/recording/sessions', (req, res) => {
  // Mock sessions
  res.json({
    success: true,
    data: [
      {
        id: 'session_1',
        systemId: 'system_1',
        startTime: Date.now() - 3600000,
        endTime: Date.now() - 1800000,
        duration: 1800000,
        status: 'stopped',
        config: { videoQuality: 'high', codec: 'h264' },
      },
    ],
  });
});

app.get('/api/status', (req, res) => {
  const systemId = req.query.systemId as string;
  const validatedSystemId = systemId && validateId(systemId) ? systemId : 'system_1';
  
  res.json({
    success: true,
    data: {
      systemId: validatedSystemId,
      network: {
        bandwidthUsage: Math.random() * 100,
        latency: Math.random() * 50,
        packetLoss: Math.random() * 5,
      },
      health: {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        temperature: 40 + Math.random() * 20,
        warnings: [],
      },
      timestamp: Date.now(),
    },
  });
});

// Security: WebSocket authentication middleware
// Note: Authentication implementation is required for production use
// In production, verify JWT token from handshake auth before allowing connections
const authenticateSocket = (socket: any, next: any) => {
  // Authentication is currently disabled for development/demo purposes
  // For production deployment, implement JWT token verification:
  // const token = socket.handshake.auth?.token;
  // if (!token || !verifyToken(token)) {
  //   return next(new Error('Authentication error'));
  // }
  next();
};

// WebSocket Events
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('camera:updateSettings', (data) => {
    // Security: Validate input
    if (!data || typeof data !== 'object') {
      socket.emit('error', { message: 'Invalid data format' });
      return;
    }
    if (!data.cameraId || !validateId(data.cameraId)) {
      socket.emit('error', { message: 'Invalid camera ID' });
      return;
    }
    if (!validateCameraSettings(data.settings)) {
      socket.emit('error', { message: 'Invalid camera settings' });
      return;
    }

    console.log('Camera settings update:', data);
    const camera = mockCameras.find((c) => c.id === data.cameraId);
    if (camera) {
      // Only update allowed settings
      const allowedSettings = ['exposure', 'gain', 'whiteBalance', 'focus', 'zoom'];
      allowedSettings.forEach((key) => {
        if (data.settings[key] !== undefined) {
          camera.settings[key as keyof typeof camera.settings] = Math.max(0, Math.min(1000, Number(data.settings[key])));
        }
      });
      camera.lastUpdate = Date.now();
      socket.emit('camera:settingsUpdated', { cameraId: data.cameraId, settings: camera.settings });
    } else {
      socket.emit('error', { message: 'Camera not found' });
    }
  });

  socket.on('recording:start', (data) => {
    // Security: Validate input
    if (!validateRecordingConfig(data)) {
      socket.emit('error', { message: 'Invalid recording configuration' });
      return;
    }

    console.log('Recording start:', data);
    if (!recordingSession) {
      recordingSession = {
        id: `session_${Date.now()}`,
        systemId: 'system_1',
        startTime: Date.now(),
        duration: 0,
        status: 'recording',
        config: {
          videoQuality: data.videoQuality || 'high',
          codec: sanitizeString(data.codec || 'h264'),
          lidarPointDensity: Math.max(0, Number(data.lidarPointDensity) || 0),
          outputPath: sanitizeString(data.outputPath || ''),
          naming: sanitizeString(data.naming || ''),
        },
      };
      socket.emit('recording:update', recordingSession);
    } else {
      socket.emit('error', { message: 'Recording already in progress' });
    }
  });

  socket.on('recording:stop', (data) => {
    console.log('Recording stop:', data);
    if (recordingSession) {
      recordingSession.status = 'stopped';
      recordingSession.endTime = Date.now();
      socket.emit('recording:update', recordingSession);
      recordingSession = null;
    } else {
      socket.emit('error', { message: 'No active recording' });
    }
  });

  socket.on('lidar:updateView', (data) => {
    // Security: Basic validation
    if (!data || typeof data !== 'object') {
      socket.emit('error', { message: 'Invalid data format' });
      return;
    }
    console.log('LiDAR view update:', data);
    socket.emit('lidar:viewUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Periodic status updates
setInterval(() => {
  // Update system heartbeat
  mockSystems.forEach((system) => {
    if (system.status === 'online') {
      system.lastHeartbeat = Date.now();
    }
  });

  // Update camera metrics
  mockCameras.forEach((camera) => {
    camera.metrics.fps = 28 + Math.random() * 4;
    camera.metrics.temperature = 40 + Math.random() * 10;
    camera.lastUpdate = Date.now();
  });

  // Emit status updates to all connected clients
  io.emit('system:status', {
    systems: mockSystems,
    cameras: mockCameras,
  });

  // Update recording session if active
  if (recordingSession) {
    recordingSession.duration = Date.now() - recordingSession.startTime;
    io.emit('recording:update', recordingSession);
  }
}, 2000);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});

