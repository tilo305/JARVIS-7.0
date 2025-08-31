# JARVIS Chatbot - Iron Man AI Assistant

A futuristic, Iron Man-inspired AI chatbot built with React, featuring voice control, holographic UI effects, and ElevenLabs integration.

## 🚀 Quick Start (Automatic)

**To ensure the project works automatically every time you pull it up:**

### Option 1: PowerShell (Recommended)
```powershell
# Right-click in the project folder and select "Run with PowerShell"
# OR open PowerShell and run:
.\start.ps1
```

### Option 2: Batch File
```cmd
# Double-click the start.bat file
# OR open Command Prompt and run:
start.bat
```

### Option 3: Manual Commands
```bash
# Install dependencies (only needed first time or after pulling updates)
pnpm install

# Start development server
pnpm dev
```

## 🌐 Access Your JARVIS

Once the server starts, open your browser and go to:
**http://localhost:5173**

## ✨ Features

- 🎭 **Holographic UI** - Animated text effects and particle animations
- 🎥 **Iron Man Video Background** - Immersive experience
- 🗣️ **Voice Control** - ElevenLabs conversational AI integration
- 💬 **Chat Interface** - Modern, responsive chat window
- 🎨 **Futuristic Design** - Glass morphism and neon effects
- 📱 **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Animations**: Framer Motion
- **Voice AI**: ElevenLabs Conversational AI
- **UI Components**: Radix UI + Custom Components
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── chat/           # Chat functionality
│   ├── voice/          # Voice control
│   ├── layout/         # Main layout
│   └── ui/             # UI components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── assets/              # Images and videos
└── index.css            # Global styles
```

## 🔧 Troubleshooting

### If you see "Yallist is not a constructor" error:
The auto-startup scripts will automatically fix this by reinstalling dependencies.

### If the page appears blank:
1. Check the browser console (F12) for errors
2. Ensure the development server is running
3. Try refreshing the page

### If fonts don't load:
The project automatically imports Google Fonts (Orbitron, Rajdhani, Inter).

## 🎯 Voice Control Setup

The ElevenLabs widget is pre-configured with an agent ID. To customize:
1. Create your own agent at [ElevenLabs](https://elevenlabs.io)
2. Update the `agentId` in `src/components/voice/ElevenLabsWidget.jsx`

## 📝 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌟 Why Auto-Startup Scripts?

These scripts ensure:
- ✅ **Dependencies are always installed** - No more "module not found" errors
- ✅ **Server starts automatically** - One click to launch
- ✅ **Error handling** - Clear feedback if something goes wrong
- ✅ **Cross-platform compatibility** - Works on Windows, Mac, and Linux
- ✅ **Consistent experience** - Same setup every time

## 🎨 Customization

The project uses CSS custom properties for easy theming:
- `--jarvis-blue`: Primary blue color
- `--jarvis-cyan`: Secondary cyan color  
- `--jarvis-red`: Accent red color
- And many more...

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the auto-startup scripts
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**"Sometimes you gotta run before you can walk."** - Tony Stark

Built with ❤️ and lots of ☕

