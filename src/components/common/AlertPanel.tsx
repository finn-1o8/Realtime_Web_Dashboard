import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Collapse,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeAlert, acknowledgeAlert } from '../../store/alertSlice';
import { useState } from 'react';

function AlertPanel() {
  const dispatch = useAppDispatch();
  const { alerts } = useAppSelector((state) => state.alert);
  const [expanded, setExpanded] = useState(true);

  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'info':
        return <InfoIcon color="info" fontSize="small" />;
      case 'success':
        return <SuccessIcon color="success" fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getSeverityColor = (severity: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const handleDismiss = (alertId: string) => {
    dispatch(removeAlert(alertId));
  };

  const handleAcknowledge = (alertId: string) => {
    dispatch(acknowledgeAlert(alertId));
  };

  if (unacknowledgedAlerts.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 0,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        {getSeverityIcon(unacknowledgedAlerts[0].severity)}
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          Alerts ({unacknowledgedAlerts.length})
        </Typography>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Collapse in={expanded}>
        <Stack spacing={1}>
          {unacknowledgedAlerts.slice(0, 3).map((alert) => (
            <Paper
              key={alert.id}
              elevation={1}
              sx={{
                p: 1.5,
                bgcolor: 'background.default',
                borderLeft: 3,
                borderColor: `${getSeverityColor(alert.severity)}.main`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Chip
                      label={alert.severity.toUpperCase()}
                      size="small"
                      color={getSeverityColor(alert.severity)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Stack>
                  <Typography variant="body2">{alert.message}</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDismiss(alert.id)}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
          {unacknowledgedAlerts.length > 3 && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              +{unacknowledgedAlerts.length - 3} more alerts
            </Typography>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
}

export default AlertPanel;

