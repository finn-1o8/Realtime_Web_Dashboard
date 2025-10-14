import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Camera, CameraSettings } from '../types';

interface CameraState {
  cameras: Camera[];
  selectedCameraIds: string[];
  gridLayout: 1 | 4 | 9 | 16;
  loading: boolean;
  error: string | null;
}

const initialState: CameraState = {
  cameras: [],
  selectedCameraIds: [],
  gridLayout: 4,
  loading: false,
  error: null,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCameras: (state, action: PayloadAction<Camera[]>) => {
      state.cameras = action.payload;
    },
    updateCamera: (state, action: PayloadAction<Camera>) => {
      const index = state.cameras.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cameras[index] = action.payload;
      }
    },
    updateCameraSettings: (
      state,
      action: PayloadAction<{ cameraId: string; settings: CameraSettings }>
    ) => {
      const camera = state.cameras.find((c) => c.id === action.payload.cameraId);
      if (camera) {
        camera.settings = action.payload.settings;
        camera.lastUpdate = Date.now();
      }
    },
    selectCamera: (state, action: PayloadAction<string>) => {
      if (!state.selectedCameraIds.includes(action.payload)) {
        state.selectedCameraIds.push(action.payload);
      }
    },
    deselectCamera: (state, action: PayloadAction<string>) => {
      state.selectedCameraIds = state.selectedCameraIds.filter(
        (id) => id !== action.payload
      );
    },
    setGridLayout: (state, action: PayloadAction<1 | 4 | 9 | 16>) => {
      state.gridLayout = action.payload;
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
  setCameras,
  updateCamera,
  updateCameraSettings,
  selectCamera,
  deselectCamera,
  setGridLayout,
  setLoading,
  setError,
} = cameraSlice.actions;

export default cameraSlice.reducer;

