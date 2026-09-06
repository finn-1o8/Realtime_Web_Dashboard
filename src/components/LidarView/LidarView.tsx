import { useEffect, useMemo, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateViewConfig, resetView } from '../../store/lidarSlice';

/**
 * Deterministic synthetic scene: a ground plane, two walls and a few boxes, as a
 * stand-in for real LiDAR frames (the mock server does not produce any).
 */
function generatePointCloud(count: number): Float32Array {
  const points = new Float32Array(count * 3);
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const boxes = [
    { x: -3, z: -2, w: 1.5, d: 1.5, h: 1.2 },
    { x: 2.5, z: 1, w: 1, d: 2, h: 0.8 },
    { x: 0.5, z: -4, w: 2, d: 1, h: 1.8 },
  ];
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number;
    let y: number;
    let z: number;
    if (r < 0.55) {
      x = rand() * 16 - 8;
      z = rand() * 16 - 8;
      y = (rand() - 0.5) * 0.05;
    } else if (r < 0.75) {
      const side = rand() < 0.5;
      x = side ? -8 : rand() * 16 - 8;
      z = side ? rand() * 16 - 8 : -8;
      y = rand() * 3;
    } else {
      const b = boxes[Math.floor(rand() * boxes.length)];
      const face = rand();
      if (face < 0.35) {
        x = b.x + (rand() - 0.5) * b.w;
        z = b.z + (rand() - 0.5) * b.d;
        y = b.h;
      } else if (face < 0.7) {
        x = b.x + (rand() < 0.5 ? -b.w / 2 : b.w / 2);
        z = b.z + (rand() - 0.5) * b.d;
        y = rand() * b.h;
      } else {
        x = b.x + (rand() - 0.5) * b.w;
        z = b.z + (rand() < 0.5 ? -b.d / 2 : b.d / 2);
        y = rand() * b.h;
      }
    }
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

function LidarView() {
  const dispatch = useAppDispatch();
  const { lidar, viewConfig } = useAppSelector((state) => state.lidar);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useMemo(() => generatePointCloud(7000), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 600;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const yaw = (viewConfig.rotationY * Math.PI) / 180;
    const pitch = ((viewConfig.rotationX + 35) * Math.PI) / 180;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const scale = (Math.min(width, height) / 22) * viewConfig.zoom;

    for (let i = 0; i < points.length; i += 3) {
      const x0 = points[i];
      const y0 = points[i + 1];
      const z0 = points[i + 2];
      // rotate around the vertical axis, then tilt the camera
      const x1 = x0 * cosY - z0 * sinY;
      const z1 = x0 * sinY + z0 * cosY;
      const y2 = y0 * cosP - z1 * sinP;
      const depth = y0 * sinP + z1 * cosP;
      const sx = width / 2 + x1 * scale;
      const sy = height / 2 - y2 * scale;
      if (sx < 0 || sx > width || sy < 0 || sy > height) continue;
      const t = Math.max(0, Math.min(1, (depth + 10) / 20));
      ctx.fillStyle = viewConfig.showDepth
        ? `hsl(${200 - t * 160}, 90%, ${45 + t * 20}%)`
        : `rgba(0, 200, 255, ${0.35 + (1 - t) * 0.5})`;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
  }, [points, viewConfig]);

  return (
    <Paper
      elevation={2}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#000', position: 'relative' }}
    >
      <Box sx={{ flex: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <Box sx={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', px: 2, py: 1, borderRadius: 1 }}>
          <Typography variant="caption" color={lidar?.connected ? 'success.main' : 'text.secondary'}>
            {lidar?.connected ? 'Connected' : 'No LiDAR feed'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {lidar ? `${lidar.metrics.pointRate} pts/s` : 'showing a simulated point cloud'}
          </Typography>
        </Box>

        <Paper elevation={4} sx={{ position: 'absolute', bottom: 16, right: 16, p: 1, display: 'flex', gap: 0.5 }}>
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={() => dispatch(updateViewConfig({ zoom: Math.min(viewConfig.zoom + 0.1, 3) }))}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={() => dispatch(updateViewConfig({ zoom: Math.max(viewConfig.zoom - 0.1, 0.5) }))}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Rotate">
            <IconButton size="small" onClick={() => dispatch(updateViewConfig({ rotationY: viewConfig.rotationY + 15 }))}>
              <RotateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton size="small" onClick={() => dispatch(resetView())}>
              <ResetIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>
    </Paper>
  );
}

export default LidarView;
