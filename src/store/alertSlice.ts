import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Alert } from '../types';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>>) => {
      const newAlert: Alert = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        acknowledged: false,
      };
      state.alerts.unshift(newAlert);
      state.unreadCount++;
    },
    acknowledgeAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.acknowledged) {
        alert.acknowledged = true;
        state.unreadCount--;
      }
    },
    acknowledgeAll: (state) => {
      state.alerts.forEach((alert) => {
        if (!alert.acknowledged) {
          alert.acknowledged = true;
        }
      });
      state.unreadCount = 0;
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.acknowledged) {
        state.unreadCount--;
      }
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addAlert,
  acknowledgeAlert,
  acknowledgeAll,
  removeAlert,
  clearAlerts,
} = alertSlice.actions;

export default alertSlice.reducer;

