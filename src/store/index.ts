import { configureStore } from '@reduxjs/toolkit';
import systemReducer from './systemSlice';
import cameraReducer from './cameraSlice';
import recordingReducer from './recordingSlice';
import lidarReducer from './lidarSlice';
import alertReducer from './alertSlice';

export const store = configureStore({
  reducer: {
    system: systemReducer,
    camera: cameraReducer,
    recording: recordingReducer,
    lidar: lidarReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['camera/updateFeed'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

