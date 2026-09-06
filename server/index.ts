/**
 * Mock backend for the dashboard.
 *
 * Serves fabricated systems, cameras and status metrics over REST and Socket.IO so the
 * front-end can be developed and demonstrated without hardware. There is no
 * authentication: do not expose this process to the internet as is.
 */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

type CameraSettings = { exposure: number; gain: number; whiteBalance: number; focus: number; zoom: number };
type RecordingConfig = {
  videoQuality: 'low' | 'medium' | 'high';
  codec: string;
  lidarPointDensity: number;
  outputPath: string;
  naming: string;
};
type RecordingSession = {
  id: string;
  systemId: string;
  startTime: number;
  endTime?: number;
  duration: number;
  status: 'recording' | 'stopped' | 'paused';
  config: RecordingConfig;
};

const app = express();
const httpServer = createServer(app);

// When the mock runs behind a reverse proxy, set TRUST_PROXY=true so req.ip is the client address.
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:5173'];

const originCheck = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  // Requests without an Origin header come from non-browser clients (curl, tests); allow them in development.
  if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
  if (origin && allowedOrigins.includes(origin)) return callback(null, true);
  callback(new Error('Not allowed by CORS'));
};

const io = new Server(httpServer, {
  cors: { origin: originCheck, methods: ['GET', 'POST'] },
});

app.use(cors({ origin: originCheck, optionsSuccessStatus: 200 }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.use(express.json({ limit: '1mb' }));

// Simple fixed-window rate limit per client address. Entries are evicted once their window expires.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 600;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) rateLimitMap.delete(key);
  }
}, RATE_LIMIT_WINDOW_MS).unref();

app.use('/api', (req, res, next) => {
  const clientId = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    });
  }
  entry.count++;
  next();
});

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockSystems = [
  { id: 'system_1', name: 'Primary Monitoring System', status: 'online' as const, lastHeartbeat: Date.now(), location: 'Building A - Floor 3' },
  { id: 'system_2', name: 'Secondary Monitoring System', status: 'online' as const, lastHeartbeat: Date.now() - 5000, location: 'Building B - Floor 1' },
];

const sampleVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];

const mockCameras = ['Front Camera', 'Rear Camera', 'Side Camera', 'Top Camera'].map((name, i) => ({
  id: `camera_${i + 1}`,
  name,
  systemId: 'system_1',
  url: sampleVideos[i],
  status: 'connected' as const,
  settings: { exposure: 50, gain: 50, whiteBalance: 50, focus: 50, zoom: 1 } as CameraSettings,
  metrics: { fps: 30, resolution: '1920x1080', temperature: 43 + i, errors: [] as string[] },
  lastUpdate: Date.now(),
}));

let recordingSession: RecordingSession | null = null;

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const SETTING_KEYS: Array<keyof CameraSettings> = ['exposure', 'gain', 'whiteBalance', 'focus', 'zoom'];
const QUALITIES = ['low', 'medium', 'high'] as const;

const isValidId = (id: unknown): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id);

const isCameraSettings = (value: unknown): value is Partial<CameraSettings> => {
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).every(
    ([key, v]) => (SETTING_KEYS as string[]).includes(key) && typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1000
  );
};

const isRecordingConfig = (value: unknown): value is Partial<RecordingConfig> => {
  if (!value || typeof value !== 'object') return false;
  const cfg = value as Record<string, unknown>;
  if (cfg.videoQuality !== undefined && !(QUALITIES as readonly string[]).includes(String(cfg.videoQuality))) return false;
  if (cfg.codec !== undefined && typeof cfg.codec !== 'string') return false;
  if (cfg.lidarPointDensity !== undefined && (typeof cfg.lidarPointDensity !== 'number' || cfg.lidarPointDensity < 0)) return false;
  return true;
};

const cleanString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim().slice(0, 200) : fallback;

const applySettings = (camera: (typeof mockCameras)[number], settings: Partial<CameraSettings>) => {
  for (const key of SETTING_KEYS) {
    const v = settings[key];
    if (v !== undefined) camera.settings[key] = Math.max(0, Math.min(1000, v));
  }
  camera.lastUpdate = Date.now();
};

const startSession = (config: Partial<RecordingConfig>): RecordingSession => ({
  id: `session_${Date.now()}`,
  systemId: 'system_1',
  startTime: Date.now(),
  duration: 0,
  status: 'recording',
  config: {
    videoQuality: config.videoQuality ?? 'high',
    codec: cleanString(config.codec, 'h264'),
    lidarPointDensity: Math.max(0, Number(config.lidarPointDensity) || 0),
    outputPath: cleanString(config.outputPath),
    naming: cleanString(config.naming),
  },
});

// ---------------------------------------------------------------------------
// REST API
// ---------------------------------------------------------------------------

app.get('/api/systems', (_req, res) => {
  res.json({ success: true, data: mockSystems });
});

app.get('/api/systems/:id', (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid system ID format' });
  const system = mockSystems.find((s) => s.id === req.params.id);
  if (!system) return res.status(404).json({ success: false, error: 'System not found' });
  res.json({ success: true, data: system });
});

app.get('/api/systems/:id/cameras', (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid system ID format' });
  res.json({ success: true, data: mockCameras.filter((c) => c.systemId === req.params.id) });
});

app.put('/api/cameras/:id/settings', (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid camera ID format' });
  if (!isCameraSettings(req.body)) return res.status(400).json({ success: false, error: 'Invalid camera settings format' });
  const camera = mockCameras.find((c) => c.id === req.params.id);
  if (!camera) return res.status(404).json({ success: false, error: 'Camera not found' });
  applySettings(camera, req.body);
  res.json({ success: true });
});

app.post('/api/recording/start', (req, res) => {
  if (recordingSession) return res.status(400).json({ success: false, error: 'Recording already in progress' });
  if (!isRecordingConfig(req.body)) return res.status(400).json({ success: false, error: 'Invalid recording configuration' });
  recordingSession = startSession(req.body);
  res.json({ success: true, data: recordingSession });
});

app.post('/api/recording/stop', (_req, res) => {
  if (!recordingSession) return res.status(400).json({ success: false, error: 'No active recording' });
  recordingSession = null;
  res.json({ success: true });
});

app.get('/api/recording/sessions', (_req, res) => {
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
  const systemId = isValidId(req.query.systemId) ? req.query.systemId : 'system_1';
  res.json({
    success: true,
    data: {
      systemId,
      network: { bandwidthUsage: Math.random() * 100, latency: Math.random() * 50, packetLoss: Math.random() * 5 },
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

// ---------------------------------------------------------------------------
// Socket.IO events
// ---------------------------------------------------------------------------

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('camera:updateSettings', (data: unknown) => {
    const payload = (data ?? {}) as { cameraId?: unknown; settings?: unknown };
    if (!isValidId(payload.cameraId)) return socket.emit('error', { message: 'Invalid camera ID' });
    if (!isCameraSettings(payload.settings)) return socket.emit('error', { message: 'Invalid camera settings' });
    const camera = mockCameras.find((c) => c.id === payload.cameraId);
    if (!camera) return socket.emit('error', { message: 'Camera not found' });
    applySettings(camera, payload.settings);
    socket.emit('camera:settingsUpdated', { cameraId: camera.id, settings: camera.settings });
  });

  socket.on('recording:start', (data: unknown) => {
    if (!isRecordingConfig(data)) return socket.emit('error', { message: 'Invalid recording configuration' });
    if (recordingSession) return socket.emit('error', { message: 'Recording already in progress' });
    recordingSession = startSession(data);
    socket.emit('recording:update', recordingSession);
  });

  socket.on('recording:stop', () => {
    if (!recordingSession) return socket.emit('error', { message: 'No active recording' });
    recordingSession.status = 'stopped';
    recordingSession.endTime = Date.now();
    socket.emit('recording:update', recordingSession);
    recordingSession = null;
  });

  socket.on('lidar:updateView', (data: unknown) => {
    if (!data || typeof data !== 'object') return socket.emit('error', { message: 'Invalid data format' });
    socket.emit('lidar:viewUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Periodic status updates
setInterval(() => {
  for (const system of mockSystems) {
    if (system.status === 'online') system.lastHeartbeat = Date.now();
  }
  for (const camera of mockCameras) {
    camera.metrics.fps = 28 + Math.random() * 4;
    camera.metrics.temperature = 40 + Math.random() * 10;
    camera.lastUpdate = Date.now();
  }
  io.emit('system:status', { systems: mockSystems, cameras: mockCameras });

  if (recordingSession) {
    recordingSession.duration = Date.now() - recordingSession.startTime;
    io.emit('recording:update', recordingSession);
  }
}, 2000);

const PORT = Number(process.env.PORT) || 3001;
httpServer.listen(PORT, () => {
  console.log(`Mock server listening on http://localhost:${PORT}`);
});
