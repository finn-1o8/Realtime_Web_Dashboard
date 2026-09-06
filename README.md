# System Monitoring Dashboard

A React and TypeScript front-end for monitoring and controlling camera and LiDAR systems, running against a mock Socket.IO backend. It is a UI prototype: the server fabricates systems, cameras, metrics and recording sessions so the interface can be developed and demonstrated without hardware, and it has no authentication.

![CI](https://github.com/finn-1o8/Realtime_Web_Dashboard/actions/workflows/ci.yml/badge.svg)

## What is implemented

- Video feed grid with a 1, 4, 9 or 16 tile layout selector and fullscreen per camera (sample MP4 streams from the mock).
- Camera control panel: exposure, gain and white balance with sliders and direct input, applied through the store and the mock API.
- LiDAR view: a canvas-rendered point cloud with zoom, rotate, reset and depth colouring. The scene is simulated because the mock produces no LiDAR frames; a real feed would replace the generator in `LidarView.tsx`.
- System status panel: CPU, memory, disk, temperature and network metrics polled every five seconds, plus system and camera state pushed by the server every two seconds over Socket.IO.
- Recording controls: start, pause and stop with quality and codec selection, plus storage usage.
- Alert panel with severity levels, acknowledge and dismiss.

Not implemented: authentication, real video or LiDAR ingestion, persistence, undo/redo, historical charts.

## Stack

React 18, TypeScript (strict), Redux Toolkit, Material UI, Socket.IO client, Axios, Vite. The mock server is Express plus Socket.IO in TypeScript, run with `tsx`.

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/finn-1o8/Realtime_Web_Dashboard.git
cd Realtime_Web_Dashboard
npm ci
npm run dev:all
```

Frontend on http://localhost:3000, mock API and Socket.IO on http://localhost:3001. The Vite dev server proxies `/api` and `/socket.io` to the mock, so no environment variables are needed for local development.

Checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Project structure

```
src/components/   VideoFeeds, LidarView, Controls, Status, common (AlertPanel)
src/services/     REST client (api.ts) and Socket.IO wrapper (websocket.ts)
src/store/        Redux slices: system, camera, recording, lidar, alert
src/types/        Shared TypeScript types
src/theme/        MUI dark theme
server/index.ts   Mock Express + Socket.IO backend
docs/             API reference, architecture notes, deployment notes
```

## API

REST endpoints served by the mock:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/systems` | List systems |
| GET | `/api/systems/:id` | System details |
| GET | `/api/systems/:id/cameras` | Cameras of a system |
| PUT | `/api/cameras/:id/settings` | Update camera settings |
| POST | `/api/recording/start` | Start a recording session |
| POST | `/api/recording/stop` | Stop the recording session |
| GET | `/api/recording/sessions` | Past sessions |
| GET | `/api/status?systemId=` | Health and network metrics |

Socket.IO events: client sends `camera:updateSettings`, `recording:start`, `recording:stop`, `lidar:updateView`; server sends `system:status`, `camera:settingsUpdated`, `recording:update`, `lidar:viewUpdated`. Details in `docs/API.md`.

## Configuration

The mock reads `PORT` (default 3001), `CORS_ORIGIN` (comma-separated browser origins; defaults to the Vite dev origins outside production) and `TRUST_PROXY=true` when it sits behind a reverse proxy. The front-end talks to `/api` and `/socket.io` on its own origin, so put it behind the same proxy as the backend in any real deployment.

## Security notes

The mock validates and bounds every input it accepts, rate-limits `/api` per client address and restricts browser origins. It does not authenticate anyone. Treat it as a development tool. See `docs/SECURITY.md`.

## License

MIT, see `LICENSE`.
