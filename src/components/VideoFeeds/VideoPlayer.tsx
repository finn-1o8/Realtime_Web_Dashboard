import { Box, Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import {
  Fullscreen as FullscreenIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from '@mui/icons-material';
import { Camera } from '../../types';
import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  camera: Camera;
  onFullscreen?: () => void;
}

function VideoPlayer({ camera, onFullscreen }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setError('Failed to load video stream');
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const getStatusColor = () => {
    switch (camera.status) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
      }}
    >
      {/* Video Element */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          src={camera.url}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Connection Status Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Chip
            label={camera.status}
            color={getStatusColor()}
            size="small"
            icon={isPlaying ? <VideocamIcon /> : <VideocamOffIcon />}
          />
          {camera.metrics.fps > 0 && (
            <Chip label={`${camera.metrics.fps} FPS`} size="small" variant="outlined" />
          )}
        </Box>

        {/* Camera Name */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="white">
            {camera.name}
          </Typography>
        </Box>

        {/* Fullscreen Button */}
        {onFullscreen && (
          <Tooltip title="Fullscreen">
            <IconButton
              onClick={onFullscreen}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <FullscreenIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Error Message */}
        {error && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default VideoPlayer;

