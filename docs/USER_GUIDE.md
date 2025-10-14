# User Guide

Welcome to the System Monitoring Dashboard! This guide will help you get started with monitoring and controlling your camera/LiDAR systems.

## Table of Contents
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Viewing Video Feeds](#viewing-video-feeds)
- [Controlling Cameras](#controlling-cameras)
- [Managing Recordings](#managing-recordings)
- [Monitoring System Status](#monitoring-system-status)
- [LiDAR Visualization](#lidar-visualization)
- [Alerts and Notifications](#alerts-and-notifications)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

1. **Open the Dashboard**
   - Navigate to `http://localhost:3000` in your web browser
   - The dashboard will automatically connect to the backend server

2. **System Selection**
   - If multiple systems are available, select one from the dropdown
   - The dashboard will load cameras and sensors for the selected system

3. **Verify Connection**
   - Check the status indicators in the top-right corner
   - Green indicates a healthy connection

## Dashboard Overview

### Layout

The dashboard is organized into several key areas:

```
┌─────────────────────────────────────────────────────────┐
│  Header: System Selector | Recording Status | Health    │
├──────────────┬──────────────────────────────┬───────────┤
│              │                              │           │
│  Controls    │     Main View Area           │  Status   │
│  Panel       │     (Video/LiDAR)            │  Panel    │
│              │                              │           │
│  - Camera    │                              │  - System │
│    Settings  │                              │    Health │
│  - Recording │                              │  - Network│
│    Controls  │                              │  - Metrics│
│              │                              │           │
├──────────────┴──────────────────────────────┴───────────┤
│  Alerts Panel                                           │
└─────────────────────────────────────────────────────────┘
```

### Main Components

1. **Header Bar**: System selector, recording status, and health indicators
2. **Controls Panel**: Camera settings and recording controls
3. **Main View**: Video feeds or LiDAR visualization
4. **Status Panel**: System health, network status, and component status
5. **Alerts Panel**: System alerts and notifications (appears when needed)

## Viewing Video Feeds

### Grid Layouts

Switch between different grid layouts:

- **1 Camera**: Full-screen single camera view
- **4 Cameras**: 2x2 grid
- **9 Cameras**: 3x3 grid
- **16 Cameras**: 4x4 grid

**To change layout:**
1. Click the grid icon in the header
2. Select your desired layout

### Camera Feed Information

Each camera feed displays:

- **Camera Name**: Bottom-left corner
- **Connection Status**: Top-left (Green = Connected, Red = Disconnected)
- **Frame Rate**: Shows current FPS
- **Fullscreen Button**: Top-right corner

### Fullscreen Mode

1. Click the fullscreen icon on any camera feed
2. Press `ESC` or click the exit button to return to grid view

### Camera Status Indicators

- 🟢 **Connected**: Camera is streaming normally
- 🔴 **Disconnected**: Camera is offline or not responding
- 🟡 **Error**: Camera has encountered an error

## Controlling Cameras

### Accessing Controls

1. Click on the **Controls Panel** on the left side
2. Ensure the **Video** tab is selected
3. Select a camera from the dropdown (if multiple cameras)

### Exposure Control

Adjust the camera's exposure to control brightness:

- **Range**: 0-100
- **Default**: 50
- **Lower values**: Darker image (less light)
- **Higher values**: Brighter image (more light)

**To adjust:**
1. Use the slider for quick adjustment
2. Or enter a value directly in the text field
3. Click **Apply Settings** to send to the camera

### Gain Control

Control the camera's gain (amplification):

- **Range**: 0-100
- **Default**: 50
- **Lower values**: Less noise, darker image
- **Higher values**: Brighter image, more noise

### White Balance

Adjust color temperature:

- **Range**: 0-100
- **Default**: 50
- **Lower values**: Cooler (blue) tones
- **Higher values**: Warmer (orange) tones

### Applying Settings

1. Adjust any combination of settings
2. Click **Apply Settings** to send changes to the camera
3. The camera will update within 1-2 seconds
4. Current values are displayed in real-time

### Resetting to Defaults

Click **Reset to Defaults** to restore factory settings for all controls.

## Managing Recordings

### Starting a Recording

1. Navigate to the **Recording Controls** section
2. Configure recording settings:
   - **Video Quality**: Low, Medium, or High
   - **Codec**: H.264, H.265, or VP9
3. Click **Start Recording**
4. A confirmation dialog will appear
5. Click **Confirm** to begin

### Recording Status

While recording:
- Red **REC** indicator appears in the header
- Session ID and duration are displayed
- Storage usage is shown in real-time

### Pausing a Recording

1. Click **Pause** button
2. Recording will pause (data is retained)
3. Click **Resume** to continue

### Stopping a Recording

1. Click **Stop Recording**
2. Confirm the action
3. Recording session will be saved
4. Session appears in the recordings list

### Viewing Recording Sessions

1. Click **View Sessions** button
2. See list of all recordings with:
   - Session ID
   - Start/End times
   - Duration
   - Quality and codec used
3. Click on a session to download or view details

### Storage Management

Monitor storage usage:
- **Used**: Current storage in use
- **Available**: Remaining storage
- **Progress bar**: Visual indicator
- **Color coding**:
  - Green: < 60% used
  - Yellow: 60-80% used
  - Red: > 80% used

## Monitoring System Status

### System Health

View real-time health metrics:

- **CPU Usage**: Processor utilization percentage
- **Memory Usage**: RAM usage percentage
- **Disk Usage**: Storage utilization
- **Temperature**: System temperature in Celsius

**Color indicators:**
- 🟢 Green: Normal (< 60%)
- 🟡 Yellow: Warning (60-80%)
- 🔴 Red: Critical (> 80%)

### Network Status

Monitor network performance:

- **Bandwidth Usage**: Current data transfer rate (Mbps)
- **Latency**: Response time to server (ms)
- **Packet Loss**: Percentage of lost packets

**Good values:**
- Latency: < 50ms
- Packet Loss: < 1%
- Bandwidth: Sufficient for stream quality

### Component Status

View status of all system components:

- **Cameras**: Number connected / total
- **LiDAR**: Connected or Disconnected
- **Recording**: Active or Inactive

### Last Heartbeat

Shows when the system last communicated with the dashboard:
- Updates every 2 seconds
- Indicates system responsiveness

## LiDAR Visualization

### Viewing Point Cloud

1. Click the **LiDAR** tab in the main view
2. The 3D point cloud will load
3. Use controls to manipulate the view

### View Controls

Located in the bottom-right corner:

- **Zoom In/Out**: Adjust viewing distance
- **Rotate**: Spin the point cloud
- **Reset View**: Return to default position

### Point Cloud Information

- **Point Rate**: Points per second being captured
- **Rotation Speed**: LiDAR rotation speed
- **Temperature**: LiDAR sensor temperature

## Alerts and Notifications

### Alert Types

Alerts appear at the bottom of the screen:

- 🔴 **Critical**: System failures requiring immediate attention
- 🟡 **Warning**: Issues that may affect performance
- 🔵 **Info**: Informational messages
- 🟢 **Success**: Successful operations

### Acknowledging Alerts

1. Click the **X** button to dismiss individual alerts
2. Or click **Acknowledge All** to clear all alerts

### Alert History

- Alerts are logged with timestamps
- View full history in the Status panel
- Export logs for analysis

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F` | Toggle fullscreen (on selected camera) |
| `G` | Cycle through grid layouts |
| `R` | Start/Stop recording |
| `P` | Pause recording |
| `Esc` | Exit fullscreen / Close dialogs |
| `Ctrl/Cmd + K` | Focus search (if available) |
| `Ctrl/Cmd + R` | Refresh system status |

## Troubleshooting

### Video Feeds Not Loading

**Symptoms**: Black screens or "Failed to load" messages

**Solutions**:
1. Check camera connection status
2. Verify network connectivity
3. Refresh the page (F5)
4. Check browser console for errors
5. Ensure backend server is running

### Controls Not Responding

**Symptoms**: Settings don't apply or buttons don't work

**Solutions**:
1. Check WebSocket connection (top-right indicator)
2. Verify camera is selected
3. Look for error messages in alerts
4. Try refreshing the page
5. Check browser console for errors

### Recording Fails to Start

**Symptoms**: "Recording already in progress" or timeout errors

**Solutions**:
1. Check if another recording is active
2. Verify sufficient storage space
3. Check system health indicators
4. Ensure all cameras are connected
5. Try stopping and restarting

### High Latency or Lag

**Symptoms**: Delayed video or slow controls

**Solutions**:
1. Check network latency in Status panel
2. Reduce number of active cameras
3. Lower video quality settings
4. Check system CPU and memory usage
5. Close other bandwidth-intensive applications

### Browser Issues

**Recommended Browsers**:
- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**If experiencing issues**:
1. Clear browser cache
2. Disable browser extensions
3. Try incognito/private mode
4. Update browser to latest version

### Performance Tips

1. **Reduce Grid Size**: Use fewer cameras for better performance
2. **Lower Quality**: Use medium or low quality for better frame rates
3. **Close Other Tabs**: Free up system resources
4. **Check Hardware**: Ensure adequate CPU and RAM
5. **Network**: Use wired connection instead of WiFi

## Tips and Best Practices

### For Operators

1. **Regular Monitoring**: Check system health every hour
2. **Storage Management**: Monitor storage usage to prevent overflow
3. **Alert Response**: Acknowledge and investigate alerts promptly
4. **Recording Naming**: Use descriptive names for easy retrieval
5. **Backup**: Regularly backup important recordings

### For Administrators

1. **User Training**: Ensure all users are trained on the system
2. **Maintenance Windows**: Schedule regular system maintenance
3. **Log Review**: Regularly review system logs
4. **Updates**: Keep software and firmware updated
5. **Documentation**: Maintain detailed system documentation

## Getting Help

### Support Resources

- **Documentation**: Check the docs/ folder for detailed guides
- **API Reference**: See docs/API.md for API documentation
- **GitHub Issues**: Report bugs or request features
- **Logs**: Check browser console and server logs for errors

### Contact Information

For technical support or questions:
- Email: support@yourdomain.com
- Documentation: https://docs.yourdomain.com
- GitHub: https://github.com/yourorg/dashboard

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active

