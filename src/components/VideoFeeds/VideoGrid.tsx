import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { Fullscreen as FullscreenIcon } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import VideoPlayer from './VideoPlayer';
import { useState } from 'react';

function VideoGrid() {
  const { cameras, gridLayout } = useAppSelector((state) => state.camera);
  const [fullscreenCamera, setFullscreenCamera] = useState<string | null>(null);

  if (cameras.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No cameras available
        </Typography>
      </Box>
    );
  }

  const getGridStyles = () => {
    switch (gridLayout) {
      case 1:
        return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' };
      case 4:
        return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
      case 9:
        return {
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
        };
      case 16:
        return {
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr 1fr',
        };
      default:
        return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
    }
  };

  const displayedCameras = cameras.slice(0, gridLayout);

  if (fullscreenCamera) {
    const camera = cameras.find((c) => c.id === fullscreenCamera);
    if (camera) {
      return (
        <Box sx={{ height: '100%', position: 'relative' }}>
          <VideoPlayer camera={camera} />
          <Tooltip title="Exit Fullscreen">
            <IconButton
              onClick={() => setFullscreenCamera(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        p: 1,
        display: 'grid',
        gap: 1,
        ...getGridStyles(),
      }}
    >
      {displayedCameras.map((camera) => (
        <VideoPlayer
          key={camera.id}
          camera={camera}
          onFullscreen={() => setFullscreenCamera(camera.id)}
        />
      ))}
    </Box>
  );
}

export default VideoGrid;

