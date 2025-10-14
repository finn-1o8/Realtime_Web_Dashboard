import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RecordingSession, RecordingConfig } from '../types';

interface RecordingState {
  currentSession: RecordingSession | null;
  sessions: RecordingSession[];
  isRecording: boolean;
  storageUsed: number;
  storageAvailable: number;
  loading: boolean;
  error: string | null;
}

const initialState: RecordingState = {
  currentSession: null,
  sessions: [],
  isRecording: false,
  storageUsed: 0,
  storageAvailable: 0,
  loading: false,
  error: null,
};

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    startRecording: (state, action: PayloadAction<RecordingSession>) => {
      state.isRecording = true;
      state.currentSession = action.payload;
    },
    stopRecording: (state) => {
      state.isRecording = false;
      if (state.currentSession) {
        state.currentSession.status = 'stopped';
        state.currentSession.endTime = Date.now();
        state.sessions.push(state.currentSession);
        state.currentSession = null;
      }
    },
    pauseRecording: (state) => {
      if (state.currentSession) {
        state.currentSession.status = 'paused';
      }
    },
    resumeRecording: (state) => {
      if (state.currentSession) {
        state.currentSession.status = 'recording';
      }
    },
    updateRecordingProgress: (
      state,
      action: PayloadAction<{ storageUsed: number; duration: number }>
    ) => {
      state.storageUsed = action.payload.storageUsed;
      if (state.currentSession) {
        state.currentSession.duration = action.payload.duration;
      }
    },
    setStorageInfo: (
      state,
      action: PayloadAction<{ used: number; available: number }>
    ) => {
      state.storageUsed = action.payload.used;
      state.storageAvailable = action.payload.available;
    },
    setSessions: (state, action: PayloadAction<RecordingSession[]>) => {
      state.sessions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  updateRecordingProgress,
  setStorageInfo,
  setSessions,
  setLoading,
  setError,
} = recordingSlice.actions;

export default recordingSlice.reducer;

