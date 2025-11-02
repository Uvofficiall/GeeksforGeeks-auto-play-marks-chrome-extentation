# GFG Auto Play Chrome Extension

A Chrome extension that automates GeeksforGeeks course learning by auto-playing videos, auto-scrolling articles, and controlling video playback speed.

## Features

### 🎥 Video Automation
- **Auto Next**: Automatically clicks "next>>" button when video ends
- **Speed Control**: Play videos at 5x, 10x, 16x, or 20x speed
- **Instant Response**: Ultra-fast transitions (10ms delays)

### 📖 Article Automation  
- **Auto Scroll**: Automatically scrolls through articles
- **Mark as Read**: Auto-clicks "Mark as Read" button
- **Auto Next**: Proceeds to next article automatically
- **Fast Reading**: 20px scroll jumps every 10ms

### ⚙️ Controls
- **Toggle Features**: Enable/disable each feature independently
- **Speed Selection**: Choose video playback speed
- **Persistent Settings**: Remembers your preferences

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the extension folder

## Usage

1. **Click the extension icon** in Chrome toolbar
2. **Toggle features** on/off as needed:
   - Auto-play (videos)
   - Auto-scroll (articles) 
   - Video Speed (5x-20x)
3. **Navigate to GeeksforGeeks** course pages
4. **Enjoy automated learning!**

## How It Works

### Videos
- Detects when video ends
- Finds "next>>" button in top-right area
- Clicks automatically for continuous playback
- Applies selected speed (default 16x)

### Articles
- Detects article pages (non-video)
- Scrolls automatically to bottom
- Clicks "Mark as Read" button
- Proceeds to next article

## Speed Benefits

| Speed | 10min Video | Time Saved |
|-------|-------------|------------|
| 5x    | 2 minutes   | 8 minutes  |
| 10x   | 1 minute    | 9 minutes  |
| 16x   | 37 seconds  | 9.4 minutes |
| 20x   | 30 seconds  | 9.5 minutes |

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main automation logic
- `popup.html` - GUI interface
- `popup.js` - GUI controls
- `background.js` - Service worker

## Permissions

- `activeTab` - Access current tab
- `storage` - Save preferences
- `host_permissions` - GeeksforGeeks access

## Browser Support

- Chrome (Manifest V3)
- Edge (Chromium-based)

## Contributing

Feel free to submit issues and pull requests!

- ## License

This project is licensed under the [MIT License](LICENSE).

## Authors

- [YUVRAJ SHARMA](https://github.com/Uvofficiall)
