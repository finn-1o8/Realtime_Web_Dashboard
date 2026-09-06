import { io, Socket } from 'socket.io-client';
import type { CameraSettings, RecordingConfig } from '../types';

type EventCallback = (data: unknown) => void;

export interface LidarViewConfig {
  rotationX?: number;
  rotationY?: number;
  zoom?: number;
  showDepth?: boolean;
}

class WebSocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, EventCallback[]> = new Map();

  connect(url: string = '/socket.io'): void {
    if (this.socket?.connected) return;

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
      autoConnect: true,
    });

    this.socket.on('connect', () => this.dispatchLocal('connected', {}));
    this.socket.on('disconnect', (reason) => this.dispatchLocal('disconnected', { reason }));
    this.socket.on('connect_error', (error) => {
      console.warn('WebSocket connection error:', error.message);
      this.dispatchLocal('error', { error: error.message });
    });

    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => this.socket?.on(event, handler));
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: EventCallback): () => void {
    if (!this.eventHandlers.has(event)) this.eventHandlers.set(event, []);
    this.eventHandlers.get(event)!.push(callback);
    this.socket?.on(event, callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) handlers.splice(index, 1);
    }
    this.socket?.off(event, callback);
  }

  /** Send an event to the server. */
  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit:', event);
    }
  }

  /** Notify local subscribers of connection lifecycle events. */
  private dispatchLocal(event: string, data: unknown): void {
    this.eventHandlers.get(event)?.forEach((handler) => handler(data));
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  updateCameraSettings(cameraId: string, settings: Partial<CameraSettings>): void {
    this.emit('camera:updateSettings', { cameraId, settings });
  }

  startRecording(config: Partial<RecordingConfig>): void {
    this.emit('recording:start', config);
  }

  stopRecording(sessionId: string): void {
    this.emit('recording:stop', { sessionId });
  }

  updateLidarView(viewConfig: LidarViewConfig): void {
    this.emit('lidar:updateView', viewConfig);
  }
}

export const websocketService = new WebSocketService();
