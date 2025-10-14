# Getting Started Guide

Welcome to the System Monitoring Dashboard! This quick start guide will have you up and running in minutes.

## Prerequisites

Before you begin, ensure you have:
- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies. It may take a few minutes.

### Step 2: Start the Development Servers

Run both the frontend and backend servers simultaneously:

```bash
npm run dev:all
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Step 3: Open the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the System Monitoring Dashboard!

## What You'll See

### Initial View

When you first open the dashboard, you'll see:

1. **Header Bar** - System selector and status indicators
2. **Video Grid** - 4 camera feeds (using sample videos)
3. **Controls Panel** - Camera settings and recording controls
4. **Status Panel** - System health metrics

### Sample Data

The mock backend provides:
- 2 monitoring systems
- 4 cameras with live video streams
- Real-time system status updates
- Recording session management

## First Steps

### 1. Explore the Video Feeds

- Click the fullscreen icon on any camera to expand it
- Try switching between different grid layouts (1, 4, 9, or 16 views)

### 2. Adjust Camera Settings

1. In the Controls Panel, select a camera
2. Adjust the exposure slider
3. Click "Apply Settings"
4. Watch the settings update in real-time

### 3. Start a Recording

1. Scroll down in the Controls Panel
2. Select video quality and codec
3. Click "Start Recording"
4. Watch the recording status in the header

### 4. Monitor System Status

Check the Status Panel on the right:
- System health (CPU, memory, disk)
- Network performance
- Component status

## Common Tasks

### Changing Grid Layout

Click the grid icon in the header and select:
- **1 Camera** - Full screen single view
- **4 Cameras** - 2x2 grid
- **9 Cameras** - 3x3 grid
- **16 Cameras** - 4x4 grid

### Controlling Cameras

1. Select a camera from the dropdown
2. Adjust sliders for:
   - **Exposure** (0-100) - Brightness
   - **Gain** (0-100) - Amplification
   - **White Balance** (0-100) - Color temperature
3. Click "Apply Settings" to send to camera

### Recording Sessions

**Start Recording:**
1. Configure quality and codec
2. Click "Start Recording"
3. Confirm the action

**Monitor Recording:**
- Red "REC" indicator in header
- Duration and storage usage displayed
- Pause or stop as needed

## Troubleshooting

### "Cannot connect to server"

**Problem**: Dashboard shows connection errors

**Solution**:
1. Ensure the backend server is running on port 3001
2. Check terminal for any error messages
3. Try restarting both servers: `npm run dev:all`

### Video feeds not loading

**Problem**: Black screens or "Failed to load" messages

**Solution**:
1. Check your internet connection (videos load from external URLs)
2. Try refreshing the page (F5)
3. Check browser console for errors (F12)

### Controls not responding

**Problem**: Settings don't apply or buttons don't work

**Solution**:
1. Check WebSocket connection indicator (top-right)
2. Ensure backend server is running
3. Try refreshing the page

## Next Steps

### Learn More

- **User Guide**: See `docs/USER_GUIDE.md` for detailed instructions
- **API Documentation**: See `docs/API.md` for API reference
- **Architecture**: See `docs/ARCHITECTURE.md` for technical details

### Customization

- **Theme**: Edit `src/theme/theme.ts` to customize colors
- **Layout**: Modify components in `src/components/`
- **API**: Update endpoints in `src/services/api.ts`

### Development

- **Add Features**: Follow the component structure in `src/components/`
- **Add API Endpoints**: Update `server/index.ts`
- **Add State**: Create new slices in `src/store/`

## Project Structure

```
Web_Dashboard/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/           # API and WebSocket
│   ├── store/              # Redux state management
│   ├── types/              # TypeScript types
│   └── theme/              # MUI theme
├── server/                 # Backend server
│   └── index.ts            # Express + Socket.io
├── docs/                   # Documentation
└── public/                 # Static assets
```

## Running Individual Servers

If you need to run servers separately:

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run dev:server
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Getting Help

### Resources

- **Documentation**: Check the `docs/` folder
- **README**: See `README.md` for overview
- **Code Comments**: Well-documented throughout

### Common Issues

- **Port already in use**: Stop other applications using ports 3000 or 3001
- **Module not found**: Run `npm install` again
- **Type errors**: Ensure TypeScript is properly configured

### Support

- Check browser console (F12) for errors
- Review server terminal for backend errors
- See troubleshooting section in `docs/USER_GUIDE.md`

## Development Tips

### Hot Reload

Both servers support hot reload:
- Frontend changes update automatically
- Backend changes require restart

### Redux DevTools

Install the Redux DevTools browser extension to:
- Inspect Redux state
- Time-travel through actions
- Debug state changes

### TypeScript

The project uses TypeScript for type safety:
- Type errors will show in your IDE
- Run `npm run lint` to check for issues

## What's Next?

Now that you're up and running:

1. ✅ Explore the dashboard features
2. ✅ Try adjusting camera settings
3. ✅ Start a test recording
4. ✅ Monitor system status
5. 🚀 Customize for your needs!

## Additional Resources

- **Material-UI Docs**: https://mui.com/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **Socket.io**: https://socket.io/
- **Three.js**: https://threejs.org/

---

**Happy Monitoring!** 🎉

If you have questions or need help, check the documentation or open an issue on GitHub.

