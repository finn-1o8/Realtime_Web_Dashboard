# System Monitoring Dashboard

A professional web-based dashboard application for real-time monitoring and control of camera/LiDAR systems. Built with React 18, TypeScript, and modern web technologies.

## Features

### Core Capabilities
- **Live Video Feeds**: Display multiple camera feeds simultaneously with configurable grid layouts (1, 4, 9, or 16 views)
- **Camera Controls**: Real-time adjustment of exposure, gain, white balance, focus, and zoom
- **LiDAR Visualization**: 3D point cloud rendering with interactive controls
- **System Monitoring**: Real-time status monitoring for cameras, LiDAR, network, and system health
- **Data Capture**: Start, stop, and manage recording sessions with configurable parameters
- **Alert System**: Real-time alerts and notifications for system events

### Technical Highlights
- **Low Latency**: WebSocket-based real-time communication
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Optimized for extended monitoring sessions
- **Modular Architecture**: Clean separation of concerns with Redux state management
- **Type Safety**: Full TypeScript implementation

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI)
- **Real-time Communication**: Socket.io-client
- **3D Visualization**: Three.js / React-Three-Fiber (ready for integration)
- **Charts**: Recharts
- **Build Tool**: Vite

### Backend (Mock Server)
- **Runtime**: Node.js with Express
- **WebSocket**: Socket.io
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   cd Web_Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev:all
   ```
   
   This will start both the frontend (port 3000) and mock backend server (port 3001).

   Or run them separately:
   ```bash
   # Frontend only
   npm run dev
   
   # Backend only
   npm run dev:server
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
Web_Dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard/       # Layout components
│   │   ├── VideoFeeds/      # Video grid and players
│   │   ├── LidarView/       # LiDAR visualization
│   │   ├── Controls/        # Control panels
│   │   ├── Status/          # Status monitoring
│   │   └── common/          # Shared components
│   ├── services/            # API and WebSocket services
│   ├── store/               # Redux store and slices
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── theme/               # MUI theme configuration
│   ├── pages/               # Page components
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── server/                  # Mock backend server
│   └── index.ts             # Express + Socket.io server
├── public/                  # Static assets
└── docs/                    # Documentation
```

## Usage Guide

### Viewing Video Feeds
1. The dashboard opens with the video feed view
2. Use the grid layout selector to switch between 1, 4, 9, or 16 camera views
3. Click the fullscreen icon on any camera to expand it
4. Camera status indicators show connection state and FPS

### Controlling Cameras
1. Select a camera from the control panel
2. Adjust exposure, gain, and white balance using sliders or direct input
3. Click "Apply Settings" to send changes to the camera
4. Use "Reset to Defaults" to restore factory settings

### Recording Sessions
1. Configure recording settings (quality, codec)
2. Click "Start Recording" to begin capture
3. Monitor recording progress and storage usage
4. Click "Stop Recording" to end the session

### Monitoring System Status
- View real-time system health metrics (CPU, memory, disk)
- Monitor network performance (bandwidth, latency, packet loss)
- Check component status (cameras, LiDAR)
- Review active alerts and notifications

## API Integration

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/systems` | List all systems |
| GET | `/api/systems/:id` | Get system details |
| GET | `/api/systems/:id/cameras` | List cameras for system |
| PUT | `/api/cameras/:id/settings` | Update camera settings |
| POST | `/api/recording/start` | Start recording |
| POST | `/api/recording/stop` | Stop recording |
| GET | `/api/recording/sessions` | List recording sessions |
| GET | `/api/status` | Get system status |

### WebSocket Events

**Client → Server:**
- `camera:updateSettings` - Update camera settings
- `recording:start` - Start recording
- `recording:stop` - Stop recording
- `lidar:updateView` - Update LiDAR view configuration

**Server → Client:**
- `system:status` - System status updates
- `camera:settingsUpdated` - Camera settings confirmation
- `recording:update` - Recording status updates
- `lidar:viewUpdated` - LiDAR view confirmation

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

### Customization

- **Theme**: Edit `src/theme/theme.ts` to customize colors and styling
- **Grid Layouts**: Modify `src/components/VideoFeeds/VideoGrid.tsx`
- **API Endpoints**: Update `src/services/api.ts`

## Development

### Code Style
- ESLint is configured for TypeScript and React
- Run `npm run lint` to check for issues

### Adding New Features

1. **New Component**: Create in `src/components/[category]/`
2. **New API Endpoint**: Add to `src/services/api.ts`
3. **New State Slice**: Create in `src/store/`
4. **New Type**: Add to `src/types/index.ts`

### Testing

Unit tests and integration tests are recommended for:
- Utility functions
- Redux reducers
- API service methods
- Critical user flows

## Deployment

### Docker (Recommended)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Cloud Platforms

The application is designed to be deployed on:
- **Azure**: Use Azure App Service or Azure Static Web Apps
- **AWS**: Deploy to S3 + CloudFront or Elastic Beanstalk
- **Vercel/Netlify**: Zero-config deployment for frontend

## Troubleshooting

### Common Issues

**Video feeds not loading:**
- Check that the backend server is running on port 3001
- Verify WebSocket connection in browser console
- Ensure CORS is properly configured

**Controls not responding:**
- Check browser console for errors
- Verify Redux DevTools for state updates
- Ensure WebSocket is connected

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the API documentation in `docs/API.md`

## Roadmap

### Phase 1: MVP (Current)
- ✅ Basic video feed display
- ✅ Camera controls
- ✅ System status monitoring
- ✅ Recording controls
- ⏳ LiDAR visualization (Three.js integration)

### Phase 2: Enhanced Features
- Historical metrics and graphing
- Advanced alert system
- Preset management
- User authentication
- Role-based access control

### Phase 3: Production Ready
- Comprehensive testing
- Performance optimization
- Azure integration
- Monitoring and logging
- Deployment automation

## Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Socket.io](https://socket.io/)
- [Three.js](https://threejs.org/)
- [Vite](https://vitejs.dev/)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development

