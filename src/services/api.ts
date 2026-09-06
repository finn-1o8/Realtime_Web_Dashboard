import axios, { AxiosInstance } from 'axios';
import type { System, Camera, RecordingSession, RecordingConfig, SystemStatus, ApiResponse } from '../types';

/**
 * REST client for the dashboard API. Requests go to /api on the page's own origin; in
 * development the Vite dev server proxies that path to the mock server.
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private unwrap<T>(response: { data: ApiResponse<T> }, what: string): T {
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || `${what} not available`);
    }
    return response.data.data;
  }

  async getSystems(): Promise<System[]> {
    return this.unwrap(await this.api.get<ApiResponse<System[]>>('/systems'), 'Systems');
  }

  async getSystem(id: string): Promise<System> {
    return this.unwrap(await this.api.get<ApiResponse<System>>(`/systems/${id}`), 'System');
  }

  async getCameras(systemId: string): Promise<Camera[]> {
    return this.unwrap(await this.api.get<ApiResponse<Camera[]>>(`/systems/${systemId}/cameras`), 'Cameras');
  }

  async updateCameraSettings(cameraId: string, settings: Partial<Camera['settings']>): Promise<void> {
    await this.api.put(`/cameras/${cameraId}/settings`, settings);
  }

  async startRecording(config: Partial<RecordingConfig>): Promise<RecordingSession> {
    return this.unwrap(await this.api.post<ApiResponse<RecordingSession>>('/recording/start', config), 'Recording');
  }

  async stopRecording(): Promise<void> {
    await this.api.post('/recording/stop');
  }

  async getSessions(systemId: string): Promise<RecordingSession[]> {
    return this.unwrap(
      await this.api.get<ApiResponse<RecordingSession[]>>('/recording/sessions', { params: { systemId } }),
      'Sessions'
    );
  }

  async getSystemStatus(systemId: string): Promise<SystemStatus> {
    return this.unwrap(await this.api.get<ApiResponse<SystemStatus>>('/status', { params: { systemId } }), 'Status');
  }
}

export const apiService = new ApiService();
