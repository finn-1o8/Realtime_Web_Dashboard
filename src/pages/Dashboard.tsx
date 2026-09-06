import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Paper, Tabs, Tab, ToggleButton, ToggleButtonGroup, Typography, IconButton, Tooltip } from '@mui/material';
import {
  VideoLibrary as VideoLibraryIcon,
  ViewInAr as LidarIcon,
  GridOn as GridIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { apiService } from '../services/api';
import { websocketService } from '../services/websocket';
import { setSystems, setSystemStatus } from '../store/systemSlice';
import { setCameras, setGridLayout } from '../store/cameraSlice';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import VideoGrid from '../components/VideoFeeds/VideoGrid';
import LidarView from '../components/LidarView/LidarView';
import CameraControlPanel from '../components/Controls/CameraControlPanel';
import RecordingControls from '../components/Controls/RecordingControls';
import SystemStatus from '../components/Status/SystemStatus';
import AlertPanel from '../components/common/AlertPanel';
import type { Camera, GridLayout, System, ViewMode } from '../types';

const STATUS_POLL_MS = 5000;
const GRID_LAYOUTS: GridLayout[] = [1, 4, 9, 16];

function Dashboard() {
  const dispatch = useAppDispatch();
  const { selectedSystemId } = useAppSelector((state) => state.system);
  const { gridLayout } = useAppSelector((state) => state.camera);
  const { alerts } = useAppSelector((state) => state.alert);

  const [currentView, setCurrentView] = useState<ViewMode>('video');
  const [showControls, setShowControls] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  const loadSystems = useCallback(async () => {
    try {
      dispatch(setSystems(await apiService.getSystems()));
    } catch (error) {
      console.error('Failed to load systems:', error);
    }
  }, [dispatch]);

  const loadSystemDetails = useCallback(
    async (systemId: string) => {
      try {
        const [cameras, status] = await Promise.all([apiService.getCameras(systemId), apiService.getSystemStatus(systemId)]);
        dispatch(setCameras(cameras));
        dispatch(setSystemStatus(status));
      } catch (error) {
        console.error('Failed to load system details:', error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  // Initial load, then poll the health and network metrics.
  useEffect(() => {
    if (!selectedSystemId) return;
    loadSystemDetails(selectedSystemId);
    const timer = window.setInterval(async () => {
      try {
        dispatch(setSystemStatus(await apiService.getSystemStatus(selectedSystemId)));
      } catch (error) {
        console.error('Failed to refresh system status:', error);
      }
    }, STATUS_POLL_MS);
    return () => window.clearInterval(timer);
  }, [selectedSystemId, loadSystemDetails, dispatch]);

  // System and camera state pushed by the server every two seconds.
  useEffect(
    () =>
      websocketService.on('system:status', (payload) => {
        const data = payload as { systems?: System[]; cameras?: Camera[] };
        if (data.systems) dispatch(setSystems(data.systems));
        if (data.cameras) dispatch(setCameras(data.cameras));
      }),
    [dispatch]
  );

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1">
            System Monitoring Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {currentView !== 'lidar' && (
              <Tooltip title="Cameras per view">
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={gridLayout}
                  onChange={(_event, value: GridLayout | null) => value && dispatch(setGridLayout(value))}
                >
                  {GRID_LAYOUTS.map((n) => (
                    <ToggleButton key={n} value={n}>
                      {n}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Tooltip>
            )}
            <Tooltip title="Toggle Controls">
              <IconButton onClick={() => setShowControls(!showControls)} color={showControls ? 'primary' : 'default'}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Status">
              <IconButton onClick={() => setShowStatus(!showStatus)} color={showStatus ? 'primary' : 'default'}>
                <GridIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {showControls && (
            <Paper elevation={2} sx={{ width: 320, borderRadius: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Tabs
                value={currentView}
                onChange={(_event, value: ViewMode) => setCurrentView(value)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<VideoLibraryIcon />} label="Video" value="video" />
                <Tab icon={<LidarIcon />} label="LiDAR" value="lidar" />
              </Tabs>

              <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
                {currentView === 'video' && <CameraControlPanel />}
                {currentView === 'lidar' && (
                  <Typography variant="body2" color="text.secondary">
                    Use the buttons on the point-cloud view to zoom, rotate and reset. The view shows a simulated
                    scene because the mock server provides no LiDAR frames.
                  </Typography>
                )}
                <RecordingControls />
              </Box>
            </Paper>
          )}

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {currentView === 'video' && <VideoGrid />}
            {currentView === 'lidar' && <LidarView />}
            {currentView === 'combined' && (
              <Grid container spacing={1} sx={{ height: '100%', p: 1 }}>
                <Grid item xs={8}>
                  <VideoGrid />
                </Grid>
                <Grid item xs={4}>
                  <LidarView />
                </Grid>
              </Grid>
            )}
          </Box>

          {showStatus && (
            <Paper elevation={2} sx={{ width: 320, borderRadius: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">System Status</Typography>
              </Box>
              <Box sx={{ overflow: 'auto', flex: 1 }}>
                <SystemStatus />
              </Box>
            </Paper>
          )}
        </Box>

        {alerts.length > 0 && (
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <AlertPanel />
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
