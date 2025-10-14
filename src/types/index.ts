// System Types
export interface System {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastHeartbeat: number;
  location?: string;
}

// Camera Types
export interface CameraSettings {
  exposure: number;
  gain: number;
  whiteBalance: number;
  focus?: number;
  zoom?: number;
}

export interface CameraMetrics {
  fps: number;
  resolution: string;
  temperature: number;
  errors: string[];
}

export interface Camera {
  id: string;
  name: string;
  systemId: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  settings: CameraSettings;
  metrics: CameraMetrics;
  lastUpdate: number;
}

// LiDAR Types
export interface LidarMetrics {
  pointRate: number;
  rotationSpeed: number;
  temperature: number;
  errors: string[];
}

export interface Lidar {
  connected: boolean;
  systemId: string;
  metrics: LidarMetrics;
  lastUpdate: number;
}

// Recording Types
export interface RecordingSession {
  id: string;
  systemId: string;
  startTime: number;
  endTime?: number;
  duration: number;
  status: 'recording' | 'stopped' | 'paused';
  config: RecordingConfig;
}

export interface RecordingConfig {
  videoQuality: 'low' | 'medium' | 'high';
  codec: string;
  lidarPointDensity: number;
  outputPath: string;
  naming: string;
}

// System Status Types
export interface NetworkStatus {
  bandwidthUsage: number;
  latency: number;
  packetLoss: number;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temperature: number;
  warnings: string[];
}

export interface SystemStatus {
  systemId: string;
  network: NetworkStatus;
  health: SystemHealth;
  timestamp: number;
}

// Alert Types
export interface Alert {
  id: string;
  systemId: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  payload: any;
  timestamp: number;
}

// Grid Layout Types
export type GridLayout = 1 | 4 | 9 | 16;

// View Types
export type ViewMode = 'video' | 'lidar' | 'combined';

