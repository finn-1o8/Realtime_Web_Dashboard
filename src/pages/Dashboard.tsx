import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  VideoLibrary as VideoLibraryIcon,
  ViewInAr as LidarIcon,
  GridOn as GridIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { apiService } from '../services/api';
import { setSystems, setSystemStatus } from '../store/systemSlice';
import { setCameras } from '../store/cameraSlice';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import VideoGrid from '../components/VideoFeeds/VideoGrid';
import LidarView from '../components/LidarView/LidarView';
import CameraControlPanel from '../components/Controls/CameraControlPanel';
import RecordingControls from '../components/Controls/RecordingControls';
import SystemStatus from '../components/Status/SystemStatus';
import AlertPanel from '../components/common/AlertPanel';

type ViewMode = 'video' | 'lidar' | 'combined';

function Dashboard() {
  const dispatch = useAppDispatch();
  const { selectedSystemId, systems } = useAppSelector((state) => state.system);
  const { cameras } = useAppSelector((state) => state.camera);
  const { alerts } = useAppSelector((state) => state.alert);

  const [currentView, setCurrentView] = useState<ViewMode>('video');
  const [showControls, setShowControls] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  // Load initial data
  useEffect(() => {
    loadSystems();
  }, []);

  useEffect(() => {
    if (selectedSystemId) {
      loadCameras(selectedSystemId);
      loadSystemStatus(selectedSystemId);
    }
  }, [selectedSystemId]);

  const loadSystems = async () => {
    try {
      const systemsData = await apiService.getSystems();
      dispatch(setSystems(systemsData));
    } catch (error) {
      console.error('Failed to load systems:', error);
    }
  };

  const loadCameras = async (systemId: string) => {
    try {
      const camerasData = await apiService.getCameras(systemId);
      dispatch(setCameras(camerasData));
    } catch (error) {
      console.error('Failed to load cameras:', error);
    }
  };

  const loadSystemStatus = async (systemId: string) => {
    try {
      const status = await apiService.getSystemStatus(systemId);
      dispatch(setSystemStatus(status));
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  const handleViewChange = (_event: React.SyntheticEvent, newValue: ViewMode) => {
    setCurrentView(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" component="h1">
            System Monitoring Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Toggle Controls">
              <IconButton
                onClick={() => setShowControls(!showControls)}
                color={showControls ? 'primary' : 'default'}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Status">
              <IconButton
                onClick={() => setShowStatus(!showStatus)}
                color={showStatus ? 'primary' : 'default'}
              >
                <GridIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Sidebar - Controls */}
          {showControls && (
            <Paper
              elevation={2}
              sx={{
                width: 320,
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={currentView}
                onChange={handleViewChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<VideoLibraryIcon />} label="Video" value="video" />
                <Tab icon={<LidarIcon />} label="LiDAR" value="lidar" />
              </Tabs>

              <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
                {currentView === 'video' && <CameraControlPanel />}
                {currentView === 'lidar' && <div>LiDAR Controls (Coming Soon)</div>}
                <RecordingControls />
              </Box>
            </Paper>
          )}

          {/* Center - Main View */}
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

          {/* Right Sidebar - Status */}
          {showStatus && (
            <Paper
              elevation={2}
              sx={{
                width: 320,
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">System Status</Typography>
              </Box>
              <Box sx={{ overflow: 'auto', flex: 1 }}>
                <SystemStatus />
              </Box>
            </Paper>
          )}
        </Box>

        {/* Bottom Panel - Alerts */}
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

