import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Speed as CpuIcon,
  NetworkCheck as NetworkIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';

function SystemStatus() {
  const { systems, selectedSystemId, status } = useAppSelector((state) => state.system);
  const { cameras } = useAppSelector((state) => state.camera);
  const { lidar } = useAppSelector((state) => state.lidar);

  const currentSystem = systems.find((s) => s.id === selectedSystemId);

  if (!currentSystem) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No system selected
        </Typography>
      </Box>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckIcon color="success" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'offline':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'online':
        return 'success';
      case 'warning':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* System Overview */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          {getStatusIcon(currentSystem.status)}
          <Typography variant="h6">{currentSystem.name}</Typography>
        </Stack>
        <Chip
          label={currentSystem.status.toUpperCase()}
          color={getStatusColor(currentSystem.status)}
          size="small"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Last heartbeat: {new Date(currentSystem.lastHeartbeat).toLocaleTimeString()}
        </Typography>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* System Health */}
      {status && status.health && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            System Health
          </Typography>

          {/* CPU Usage */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CpuIcon fontSize="small" />
                <Typography variant="body2">CPU</Typography>
              </Stack>
              <Typography variant="body2">{status.health.cpuUsage}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={status.health.cpuUsage}
              color={status.health.cpuUsage > 80 ? 'error' : status.health.cpuUsage > 60 ? 'warning' : 'primary'}
            />
          </Box>

          {/* Memory Usage */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <MemoryIcon fontSize="small" />
                <Typography variant="body2">Memory</Typography>
              </Stack>
              <Typography variant="body2">{status.health.memoryUsage}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={status.health.memoryUsage}
              color={status.health.memoryUsage > 80 ? 'error' : status.health.memoryUsage > 60 ? 'warning' : 'primary'}
            />
          </Box>

          {/* Disk Usage */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <StorageIcon fontSize="small" />
                <Typography variant="body2">Disk</Typography>
              </Stack>
              <Typography variant="body2">{status.health.diskUsage}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={status.health.diskUsage}
              color={status.health.diskUsage > 80 ? 'error' : status.health.diskUsage > 60 ? 'warning' : 'primary'}
            />
          </Box>

          {/* Temperature */}
          <Box>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Temperature</Typography>
              <Typography variant="body2">{status.health.temperature}°C</Typography>
            </Stack>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Network Status */}
      {status && status.network && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Network
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Bandwidth</Typography>
              <Typography variant="body2">{status.network.bandwidthUsage} Mbps</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Latency</Typography>
              <Typography variant="body2">{status.network.latency} ms</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Packet Loss</Typography>
              <Typography variant="body2">{status.network.packetLoss}%</Typography>
            </Stack>
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Component Status */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Components
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">Cameras</Typography>
            <Chip
              label={`${cameras.filter((c) => c.status === 'connected').length}/${cameras.length}`}
              size="small"
              color="success"
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">LiDAR</Typography>
            <Chip
              label={lidar?.connected ? 'Connected' : 'Disconnected'}
              size="small"
              color={lidar?.connected ? 'success' : 'default'}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default SystemStatus;

