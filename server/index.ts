import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
});

app.use(cors());
app.use(express.json());

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

// REST API Routes
app.get('/api/systems', (req, res) => {
  res.json({ success: true, data: mockSystems });
});

app.get('/api/systems/:id', (req, res) => {
  const system = mockSystems.find((s) => s.id === req.params.id);
  if (system) {
    res.json({ success: true, data: system });
  } else {
    res.status(404).json({ success: false, error: 'System not found' });
  }
});

app.get('/api/systems/:id/cameras', (req, res) => {
  const cameras = mockCameras.filter((c) => c.systemId === req.params.id);
  res.json({ success: true, data: cameras });
});

app.put('/api/cameras/:id/settings', (req, res) => {
  const camera = mockCameras.find((c) => c.id === req.params.id);
  if (camera) {
    Object.assign(camera.settings, req.body);
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

  recordingSession = {
    id: `session_${Date.now()}`,
    systemId: 'system_1',
    startTime: Date.now(),
    duration: 0,
    status: 'recording',
    config: req.body,
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
  res.json({
    success: true,
    data: {
      systemId: req.query.systemId || 'system_1',
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

// WebSocket Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('camera:updateSettings', (data) => {
    console.log('Camera settings update:', data);
    const camera = mockCameras.find((c) => c.id === data.cameraId);
    if (camera) {
      Object.assign(camera.settings, data.settings);
      camera.lastUpdate = Date.now();
      socket.emit('camera:settingsUpdated', { cameraId: data.cameraId, settings: camera.settings });
    }
  });

  socket.on('recording:start', (data) => {
    console.log('Recording start:', data);
    if (!recordingSession) {
      recordingSession = {
        id: `session_${Date.now()}`,
        systemId: 'system_1',
        startTime: Date.now(),
        duration: 0,
        status: 'recording',
        config: data,
      };
      socket.emit('recording:update', recordingSession);
    }
  });

  socket.on('recording:stop', (data) => {
    console.log('Recording stop:', data);
    if (recordingSession) {
      recordingSession.status = 'stopped';
      recordingSession.endTime = Date.now();
      socket.emit('recording:update', recordingSession);
      recordingSession = null;
    }
  });

  socket.on('lidar:updateView', (data) => {
    console.log('LiDAR view update:', data);
    socket.emit('lidar:viewUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
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

