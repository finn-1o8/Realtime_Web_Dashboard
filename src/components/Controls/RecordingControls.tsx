import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  CloudDownload as DownloadIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { startRecording, stopRecording, pauseRecording } from '../../store/recordingSlice';
import { useState } from 'react';

function RecordingControls() {
  const dispatch = useAppDispatch();
  const { isRecording, currentSession, storageUsed, storageAvailable } = useAppSelector(
    (state) => state.recording
  );

  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [codec, setCodec] = useState('h264');

  const handleStartRecording = () => {
    dispatch(
      startRecording({
        id: `session_${Date.now()}`,
        systemId: 'system_1',
        startTime: Date.now(),
        duration: 0,
        status: 'recording',
        config: {
          videoQuality,
          codec,
          lidarPointDensity: 100000,
          outputPath: '/recordings',
          naming: 'timestamp',
        },
      })
    );
  };

  const handleStopRecording = () => {
    if (currentSession) {
      dispatch(stopRecording());
    }
  };

  const handlePauseRecording = () => {
    dispatch(pauseRecording());
  };

  const storagePercentage = storageAvailable > 0 ? (storageUsed / storageAvailable) * 100 : 0;

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Recording Controls
      </Typography>

      {/* Recording Status */}
      {isRecording && currentSession && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'error.dark',
            color: 'error.contrastText',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip label="REC" color="error" size="small" />
            <Typography variant="body2">
              Session: {currentSession.id.split('_')[1]}
            </Typography>
          </Stack>
          <Typography variant="caption">
            Duration: {Math.floor(currentSession.duration / 1000)}s
          </Typography>
        </Paper>
      )}

      {/* Recording Buttons */}
      <Stack spacing={1} sx={{ mb: 2 }}>
        {!isRecording ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<PlayIcon />}
            onClick={handleStartRecording}
            fullWidth
            size="large"
          >
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<PauseIcon />}
              onClick={handlePauseRecording}
              fullWidth
            >
              Pause
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              onClick={handleStopRecording}
              fullWidth
            >
              Stop Recording
            </Button>
          </>
        )}
      </Stack>

      {/* Recording Settings */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Video Quality</InputLabel>
          <Select
            value={videoQuality}
            label="Video Quality"
            onChange={(e) => setVideoQuality(e.target.value as any)}
            disabled={isRecording}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Codec</InputLabel>
          <Select
            value={codec}
            label="Codec"
            onChange={(e) => setCodec(e.target.value)}
            disabled={isRecording}
          >
            <MenuItem value="h264">H.264</MenuItem>
            <MenuItem value="h265">H.265</MenuItem>
            <MenuItem value="vp9">VP9</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Storage Info */}
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2">Storage</Typography>
          <Typography variant="body2" color="text.secondary">
            {(storageUsed / 1024 / 1024).toFixed(1)} GB / {(storageAvailable / 1024 / 1024).toFixed(1)} GB
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={storagePercentage}
          color={storagePercentage > 80 ? 'error' : storagePercentage > 60 ? 'warning' : 'primary'}
        />
      </Box>
    </Box>
  );
}

export default RecordingControls;

