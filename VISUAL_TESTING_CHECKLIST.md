# Visual Testing Checklist

## Quick Visual Reference

### What You Should See When You Open http://localhost:3000

```
╔═══════════════════════════════════════════════════════════════════╗
║  SYSTEM MONITORING DASHBOARD              [⚙️ Settings] [⊞ Grid]  ║
╠═══════════╦═══════════════════════════════════╦═══════════════════╣
║           ║                                   ║                   ║
║  CAMERA   ║                                   ║   SYSTEM STATUS   ║
║  CONTROLS ║                                   ║                   ║
║           ║                                   ║  System Health    ║
║  Front    ║        VIDEO FEEDS                ║  ───────────────  ║
║  Camera   ║                                   ║  CPU: ████░░░ 35% ║
║  ───────  ║   ┌────────────┬────────────┐    ║  Memory: ███░░ 62%║
║           ║   │            │            │    ║  Disk: ███░░░ 46% ║
║  Exposure ║   │   Camera 1 │   Camera 2 │    ║  Temp: 52°C      ║
║  ━━━━━●━━ ║   │            │            │    ║                   ║
║   50      ║   │  🟢 30 FPS │  🟢 30 FPS │    ║  Network         ║
║           ║   │            │            │    ║  ───────────────  ║
║  Gain     ║   └────────────┴────────────┘    ║  Bandwidth: 45.2  ║
║  ━━━━━●━━ ║                                   ║  Latency: 12.5ms  ║
║   50      ║   ┌────────────┬────────────┐    ║  Packet Loss: 0.1%║
║           ║   │            │            │    ║                   ║
║  White    ║   │   Camera 3 │   Camera 4 │    ║  Components       ║
║  Balance  ║   │            │            │    ║  ───────────────  ║
║  ━━━━━●━━ ║   │  🟢 30 FPS │  🟢 30 FPS │    ║  Cameras: 4/4 🟢  ║
║   50      ║   │            │            │    ║  LiDAR: Connected 🟢║
║           ║   └────────────┴────────────┘    ║                   ║
║  [Apply]  ║                                   ║                   ║
║  [Reset]  ║                                   ║                   ║
║           ║                                   ║                   ║
║  RECORDING║                                   ║                   ║
║  ──────── ║                                   ║                   ║
║  [▶ Start]║                                   ║                   ║
║           ║                                   ║                   ║
║  Quality  ║                                   ║                   ║
║  Medium ▼ ║                                   ║                   ║
║           ║                                   ║                   ║
║  Storage  ║                                   ║                   ║
║  ████░░░░ ║                                   ║                   ║
║  60%      ║                                   ║                   ║
╚═══════════╩═══════════════════════════════════╩═══════════════════╝
```

## Step-by-Step Visual Testing

### 1️⃣ First Look - Layout Check

**Open http://localhost:3000 and verify:**

```
✅ Dark background (almost black)
✅ Three main sections visible:
   - Left: Controls Panel (narrow)
   - Center: Video Feeds (wide)
   - Right: Status Panel (narrow)
✅ Header bar at top with title
✅ No horizontal scrolling
✅ No overlapping elements
```

### 2️⃣ Left Panel - Controls

**What to look for:**

```
┌─────────────────────────┐
│ Camera Controls         │ ← Bold heading
│ Front Camera            │ ← Dropdown with camera name
│ ─────────────────────── │
│ Exposure                │ ← Label
│ ━━━━━━●━━━              │ ← Slider (blue)
│ 50                      │ ← Number input
│                         │
│ Gain                    │ ← Label
│ ━━━━━━●━━━              │ ← Slider (blue)
│ 50                      │ ← Number input
│                         │
│ White Balance           │ ← Label
│ ━━━━━━●━━━              │ ← Slider (blue)
│ 50                      │ ← Number input
│                         │
│ [Apply Settings]        │ ← Blue button
│ [Reset to Defaults]     │ ← Gray button
│                         │
│ Recording Controls      │ ← Section divider
│ ─────────────────────── │
│ [▶ Start Recording]     │ ← Red button
│                         │
│ Video Quality           │
│ Medium ▼                │ ← Dropdown
│                         │
│ Codec                   │
│ H.264 ▼                 │ ← Dropdown
│                         │
│ Storage                 │
│ ████░░░░░░ 40%          │ ← Progress bar
└─────────────────────────┘
```

**Test interactions:**
- [ ] Click and drag sliders - they move smoothly
- [ ] Click number fields - you can type
- [ ] Click dropdowns - menu appears
- [ ] Click buttons - they respond (no errors)

### 3️⃣ Center - Video Grid

**What to look for:**

```
┌─────────────────┬─────────────────┐
│  Front Camera   │   Rear Camera   │
│                 │                 │
│   [VIDEO]       │    [VIDEO]      │
│                 │                 │
│  🟢 Connected   │   🟢 Connected  │
│     30 FPS      │      30 FPS     │
│                 │                 │
│      [⛶]        │       [⛶]       │ ← Fullscreen button
└─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┐
│   Side Camera   │   Top Camera    │
│                 │                 │
│   [VIDEO]       │    [VIDEO]      │
│                 │                 │
│  🟢 Connected   │   🟢 Connected  │
│     30 FPS      │      30 FPS     │
│                 │                 │
│      [⛶]        │       [⛶]       │
└─────────────────┴─────────────────┘
```

**Test interactions:**
- [ ] Videos play automatically (or show placeholders)
- [ ] Green indicator shows "Connected"
- [ ] FPS counter shows ~30
- [ ] Click fullscreen button - camera expands
- [ ] Press ESC - returns to grid

### 4️⃣ Right Panel - Status

**What to look for:**

```
┌──────────────────────────┐
│ System Status            │ ← Bold heading
│                          │
│ System Health            │
│ ──────────────────────── │
│ CPU: ████░░░░░ 35%       │ ← Progress bar (blue)
│ Memory: ███░░░░░░ 62%    │ ← Progress bar (blue)
│ Disk: ███░░░░░░░ 46%     │ ← Progress bar (blue)
│ Temperature: 52°C        │ ← Text
│                          │
│ Network                  │
│ ──────────────────────── │
│ Bandwidth: 45.2 Mbps     │ ← Text
│ Latency: 12.5 ms         │ ← Text
│ Packet Loss: 0.1%        │ ← Text
│                          │
│ Components               │
│ ──────────────────────── │
│ Cameras: 4/4 🟢          │ ← Green indicator
│ LiDAR: Connected 🟢      │ ← Green indicator
└──────────────────────────┘
```

**Test interactions:**
- [ ] Numbers update every 2 seconds
- [ ] Progress bars are colored (green = good, yellow = warning, red = critical)
- [ ] All sections visible

### 5️⃣ Header Bar

**What to look for:**

```
╔═══════════════════════════════════════════════════════════════╗
║  System Monitoring Dashboard        [⚙️] [⊞]                 ║
╚═══════════════════════════════════════════════════════════════╝
```

**Test interactions:**
- [ ] Click settings icon (⚙️) - controls panel toggles
- [ ] Click grid icon (⊞) - status panel toggles

## Color Reference

### Dark Theme Colors

```
Background:   #121212  (Very dark gray, almost black)
Cards:        #1e1e1e  (Dark gray)
Text:         #ffffff  (White)
Text Dim:     rgba(255,255,255,0.7)  (70% white)
Primary:      #2196f3  (Blue)
Success:      #4caf50  (Green)
Warning:      #ff9800  (Orange)
Error:        #f44336  (Red)
```

### Status Colors

```
🟢 Green:   Healthy, Connected, Good
🟡 Yellow:  Warning, Caution
🔴 Red:     Error, Critical, Disconnected
🔵 Blue:    Info, Primary actions
```

## Quick Test Checklist

### ✅ 30-Second Test

1. **Open browser** → http://localhost:3000
2. **Check layout** → 3 panels visible?
3. **Check videos** → 4 feeds showing?
4. **Check status** → Numbers updating?
5. **Check controls** → Sliders work?
6. **Check console** → No red errors? (Press F12)

### ✅ 2-Minute Test

1. **Test fullscreen** → Click ⛶ on any camera
2. **Test controls** → Move exposure slider
3. **Test recording** → Click "Start Recording"
4. **Test grid** → Click ⊞ icon, change layout
5. **Test responsiveness** → Resize browser window

### ✅ 5-Minute Test

1. **All above tests**
2. **Test all cameras** → Select each from dropdown
3. **Test all settings** → Exposure, gain, white balance
4. **Test recording** → Start, pause, stop
5. **Test WebSocket** → Watch console for updates
6. **Test alerts** → Wait for system updates

## Common Visual Issues

### ❌ Problem: Blank White Screen

**Possible causes:**
- Server not running
- Wrong URL (using 3001 instead of 3000)
- JavaScript error

**Fix:**
```bash
# Check terminal - should see "VITE" output
# Make sure URL is http://localhost:3000
# Check browser console (F12) for errors
```

### ❌ Problem: Layout Broken

**Possible causes:**
- CSS not loading
- Browser cache issue
- Viewport too small

**Fix:**
```bash
# Hard refresh: Ctrl+F5
# Clear cache: Ctrl+Shift+Delete
# Check browser window size
```

### ❌ Problem: Videos Not Showing

**Possible causes:**
- Internet connection
- External video URLs blocked
- CORS issues

**Fix:**
```bash
# Check internet connection
# Check browser console for errors
# Videos load from external sources
```

### ❌ Problem: Controls Not Responding

**Possible causes:**
- JavaScript error
- WebSocket not connected
- Redux state issue

**Fix:**
```bash
# Check browser console (F12)
# Look for red errors
# Try refreshing page
```

## Browser Compatibility

### ✅ Recommended Browsers

```
Chrome 90+     ⭐⭐⭐⭐⭐  Best support
Firefox 88+    ⭐⭐⭐⭐⭐  Best support
Edge 90+       ⭐⭐⭐⭐⭐  Best support
Safari 14+     ⭐⭐⭐⭐   Good support
```

### ⚠️ Known Issues

```
IE 11          ❌ Not supported
Safari < 14    ⚠️  May have issues
Mobile Safari  ⚠️  Limited testing
```

## Performance Expectations

### Load Times

```
Initial Load:    < 3 seconds
Video Start:     < 1 second
Control Response: < 100ms
Status Update:   Every 2 seconds
```

### Frame Rate

```
UI Animations:   60 FPS
Video Playback:  30 FPS (depends on source)
Status Updates:  Smooth, no jank
```

## Success Indicators

### ✅ Everything Working

```
✓ Dark theme applied
✓ All panels visible
✓ Videos playing
✓ Controls responding
✓ Status updating
✓ No console errors
✓ Smooth animations
✓ Responsive layout
```

### ❌ Something Wrong

```
✗ Blank screen
✗ White background
✗ Overlapping elements
✗ Controls not working
✗ Console errors
✗ Layout broken
```

## Quick Reference Card

```
┌─────────────────────────────────────┐
│  QUICK TEST REFERENCE              │
├─────────────────────────────────────┤
│  URL: http://localhost:3000         │
│  Start: npm run dev:all             │
│  Console: F12                       │
│  Refresh: Ctrl+F5                   │
│  Fullscreen: Click ⛶               │
│  Grid: Click ⊞                     │
│  Settings: Click ⚙️                │
└─────────────────────────────────────┘
```

---

**Need help?** Check TESTING_GUIDE.md for detailed instructions!

