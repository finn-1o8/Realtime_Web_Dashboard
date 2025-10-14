import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  ViewInAr as ViewInArIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateViewConfig, resetView } from '../../store/lidarSlice';

function LidarView() {
  const dispatch = useAppDispatch();
  const { lidar, viewConfig } = useAppSelector((state) => state.lidar);

  const handleZoomIn = () => {
    dispatch(updateViewConfig({ zoom: Math.min(viewConfig.zoom + 0.1, 3) }));
  };

  const handleZoomOut = () => {
    dispatch(updateViewConfig({ zoom: Math.max(viewConfig.zoom - 0.1, 0.5) }));
  };

  const handleRotate = () => {
    dispatch(updateViewConfig({ rotationY: viewConfig.rotationY + 15 }));
  };

  const handleReset = () => {
    dispatch(resetView());
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
      }}
    >
      {/* 3D View Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Placeholder for Three.js canvas */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed rgba(255,255,255,0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <ViewInArIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              LiDAR Point Cloud Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Three.js integration coming soon
            </Typography>
          </Box>
        </Box>

        {/* Status Overlay */}
        {lidar && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(0,0,0,0.7)',
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="success.main">
              Connected
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {lidar.metrics.pointRate} pts/s
            </Typography>
          </Box>
        )}

        {/* Controls */}
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            p: 1,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Rotate">
            <IconButton size="small" onClick={handleRotate}>
              <RotateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton size="small" onClick={handleReset}>
              <ViewInArIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>
    </Paper>
  );
}

export default LidarView;

