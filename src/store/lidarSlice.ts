import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Lidar } from '../types';

interface LidarState {
  lidar: Lidar | null;
  pointCloudData: ArrayBuffer | null;
  viewConfig: {
    rotationX: number;
    rotationY: number;
    zoom: number;
    showDepth: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LidarState = {
  lidar: null,
  pointCloudData: null,
  viewConfig: {
    rotationX: 0,
    rotationY: 0,
    zoom: 1,
    showDepth: true,
  },
  loading: false,
  error: null,
};

const lidarSlice = createSlice({
  name: 'lidar',
  initialState,
  reducers: {
    setLidar: (state, action: PayloadAction<Lidar>) => {
      state.lidar = action.payload;
    },
    updateLidarMetrics: (state, action: PayloadAction<Lidar>) => {
      if (state.lidar) {
        state.lidar = action.payload;
      }
    },
    setPointCloudData: (state, action: PayloadAction<ArrayBuffer>) => {
      state.pointCloudData = action.payload;
    },
    updateViewConfig: (state, action: PayloadAction<Partial<LidarState['viewConfig']>>) => {
      state.viewConfig = { ...state.viewConfig, ...action.payload };
    },
    resetView: (state) => {
      state.viewConfig = initialState.viewConfig;
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
  setLidar,
  updateLidarMetrics,
  setPointCloudData,
  updateViewConfig,
  resetView,
  setLoading,
  setError,
} = lidarSlice.actions;

export default lidarSlice.reducer;

