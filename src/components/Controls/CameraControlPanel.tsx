import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Divider,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateCameraSettings } from '../../store/cameraSlice';
import { useState } from 'react';

function CameraControlPanel() {
  const dispatch = useAppDispatch();
  const { cameras, selectedCameraIds } = useAppSelector((state) => state.camera);

  const selectedCamera = cameras.find((c) => selectedCameraIds.includes(c.id)) || cameras[0];

  const [exposure, setExposure] = useState(selectedCamera?.settings.exposure || 50);
  const [gain, setGain] = useState(selectedCamera?.settings.gain || 50);
  const [whiteBalance, setWhiteBalance] = useState(
    selectedCamera?.settings.whiteBalance || 50
  );

  const handleExposureChange = (_event: Event, newValue: number | number[]) => {
    setExposure(newValue as number);
  };

  const handleGainChange = (_event: Event, newValue: number | number[]) => {
    setGain(newValue as number);
  };

  const handleWhiteBalanceChange = (_event: Event, newValue: number | number[]) => {
    setWhiteBalance(newValue as number);
  };

  const handleApplySettings = () => {
    if (selectedCamera) {
      dispatch(
        updateCameraSettings({
          cameraId: selectedCamera.id,
          settings: {
            exposure,
            gain,
            whiteBalance,
          },
        })
      );
    }
  };

  const handleResetToDefaults = () => {
    setExposure(50);
    setGain(50);
    setWhiteBalance(50);
  };

  if (!selectedCamera) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No camera selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Camera Controls
        </Typography>
        <Chip label={selectedCamera.name} size="small" />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Exposure Control */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Exposure
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            0
          </Typography>
          <Slider
            value={exposure}
            onChange={handleExposureChange}
            min={0}
            max={100}
            step={1}
            marks={[
              { value: 0, label: 'Min' },
              { value: 50, label: 'Mid' },
              { value: 100, label: 'Max' },
            ]}
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            100
          </Typography>
        </Stack>
        <TextField
          size="small"
          value={exposure}
          onChange={(e) => setExposure(Number(e.target.value))}
          inputProps={{ min: 0, max: 100, step: 1 }}
          type="number"
          sx={{ mt: 1, width: '100%' }}
        />
      </Box>

      {/* Gain Control */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Gain
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            0
          </Typography>
          <Slider
            value={gain}
            onChange={handleGainChange}
            min={0}
            max={100}
            step={1}
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            100
          </Typography>
        </Stack>
        <TextField
          size="small"
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          inputProps={{ min: 0, max: 100, step: 1 }}
          type="number"
          sx={{ mt: 1, width: '100%' }}
        />
      </Box>

      {/* White Balance Control */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          White Balance
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            0
          </Typography>
          <Slider
            value={whiteBalance}
            onChange={handleWhiteBalanceChange}
            min={0}
            max={100}
            step={1}
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            100
          </Typography>
        </Stack>
        <TextField
          size="small"
          value={whiteBalance}
          onChange={(e) => setWhiteBalance(Number(e.target.value))}
          inputProps={{ min: 0, max: 100, step: 1 }}
          type="number"
          sx={{ mt: 1, width: '100%' }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Action Buttons */}
      <Stack spacing={1}>
        <Button
          variant="contained"
          onClick={handleApplySettings}
          fullWidth
          size="large"
        >
          Apply Settings
        </Button>
        <Button variant="outlined" onClick={handleResetToDefaults} fullWidth>
          Reset to Defaults
        </Button>
      </Stack>
    </Box>
  );
}

export default CameraControlPanel;

