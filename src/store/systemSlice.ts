import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { System, SystemStatus } from '../types';

interface SystemState {
  selectedSystemId: string | null;
  systems: System[];
  status: SystemStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: SystemState = {
  selectedSystemId: null,
  systems: [],
  status: null,
  loading: false,
  error: null,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setSystems: (state, action: PayloadAction<System[]>) => {
      state.systems = action.payload;
      if (!state.selectedSystemId && action.payload.length > 0) {
        state.selectedSystemId = action.payload[0].id;
      }
    },
    selectSystem: (state, action: PayloadAction<string>) => {
      state.selectedSystemId = action.payload;
    },
    updateSystemStatus: (state, action: PayloadAction<System>) => {
      const index = state.systems.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.systems[index] = action.payload;
      }
    },
    setSystemStatus: (state, action: PayloadAction<SystemStatus>) => {
      state.status = action.payload;
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
  setSystems,
  selectSystem,
  updateSystemStatus,
  setSystemStatus,
  setLoading,
  setError,
} = systemSlice.actions;

export default systemSlice.reducer;

