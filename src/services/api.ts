import axios, { AxiosInstance, AxiosError } from 'axios';
import type { System, Camera, RecordingSession, RecordingConfig, ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth tokens
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // System endpoints
  async getSystems(): Promise<System[]> {
    const response = await this.api.get<ApiResponse<System[]>>('/systems');
    return response.data.data || [];
  }

  async getSystem(id: string): Promise<System> {
    const response = await this.api.get<ApiResponse<System>>(`/systems/${id}`);
    if (!response.data.data) throw new Error('System not found');
    return response.data.data;
  }

  // Camera endpoints
  async getCameras(systemId: string): Promise<Camera[]> {
    const response = await this.api.get<ApiResponse<Camera[]>>(
      `/systems/${systemId}/cameras`
    );
    return response.data.data || [];
  }

  async updateCameraSettings(
    cameraId: string,
    settings: Partial<Camera['settings']>
  ): Promise<void> {
    await this.api.put(`/cameras/${cameraId}/settings`, settings);
  }

  // Recording endpoints
  async startRecording(config: RecordingConfig): Promise<RecordingSession> {
    const response = await this.api.post<ApiResponse<RecordingSession>>(
      '/recording/start',
      config
    );
    if (!response.data.data) throw new Error('Failed to start recording');
    return response.data.data;
  }

  async stopRecording(sessionId: string): Promise<void> {
    await this.api.post(`/recording/stop`, { sessionId });
  }

  async getSessions(systemId: string): Promise<RecordingSession[]> {
    const response = await this.api.get<ApiResponse<RecordingSession[]>>(
      '/recording/sessions',
      { params: { systemId } }
    );
    return response.data.data || [];
  }

  // Status endpoint
  async getSystemStatus(systemId: string) {
    const response = await this.api.get(`/status`, {
      params: { systemId },
    });
    return response.data;
  }
}

export const apiService = new ApiService();

