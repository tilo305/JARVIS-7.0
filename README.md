# JARVIS Chat Bot 🤖

A sophisticated Iron Man JARVIS-themed chat/voice bot with holographic UI, ElevenLabs voice integration, and comprehensive error handling.

![JARVIS Interface](https://img.shields.io/badge/Interface-Holographic-00D4FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Voice%20AI-FF6B35?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 Visual Design
- **Holographic UI**: Stunning Iron Man/JARVIS-inspired interface
- **Glassmorphism Effects**: Transparent containers with blur effects
- **Particle Animations**: Dynamic background particles and scan lines
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Custom Typography**: Orbitron and Rajdhani fonts for futuristic feel

### 🎤 Voice Integration
- **ElevenLabs ConvAI**: Advanced voice conversation capabilities
- **Real-time Voice Processing**: Instant voice-to-text and text-to-voice
- **Visual Voice Indicators**: Animated microphone states and status displays
- **Automatic Permissions**: Seamless microphone access handling

### 💬 Chat Features
- **Real-time Messaging**: Instant message display and processing
- **Holographic Chat Window**: 300x400px centered chat interface
- **Message History**: Persistent conversation tracking
- **Typing Indicators**: Visual feedback during processing
- **Keyboard Shortcuts**: Ctrl+Enter to send, Esc to clear

### 🛡️ Error Handling
- **Comprehensive Error Boundaries**: Graceful error recovery
- **Real-time Error Logging**: Detailed error tracking and reporting
- **User-friendly Error Messages**: Clear, actionable error displays
- **Automatic Retry Mechanisms**: Smart error recovery
- **Debug Panel**: Development tools for monitoring and testing

### 🧪 Testing & Debugging
- **Component Testing**: Automated UI component validation
- **Browser Compatibility**: Cross-browser feature detection
- **Performance Monitoring**: Real-time performance metrics
- **Voice Testing**: ElevenLabs integration validation
- **Error Simulation**: Comprehensive error scenario testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Modern web browser
- ElevenLabs account (for voice features)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd jarvis-chatbot

# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm run dev
# or
npm run dev
```

### Environment Setup
Create a `.env.local` file:
```env
VITE_ELEVENLABS_AGENT_ID=agent_7601k23b460aeejb2pvyfcvw6atk
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── HolographicButton.jsx
│   │   ├── HolographicInput.jsx
│   │   ├── MicrophoneButton.jsx
│   │   └── StatusIndicator.jsx
│   ├── chat/               # Chat-specific components
│   │   ├── ChatWindow.jsx
│   │   └── Message.jsx
│   ├── voice/              # Voice integration
│   │   └── ElevenLabsWidget.jsx
│   ├── layout/             # Layout components
│   │   └── MainLayout.jsx
│   ├── error/              # Error handling
│   │   └── ErrorBoundary.jsx
│   └── debug/              # Development tools
│       └── DebugPanel.jsx
├── hooks/                  # Custom React hooks
│   └── useElevenLabsWidget.js
├── contexts/               # React contexts
│   └── ErrorContext.jsx
├── utils/                  # Utility functions
│   ├── index.js
│   ├── errorLogger.js
│   └── testUtils.js
├── types/                  # Type definitions
│   └── index.js
├── assets/                 # Static assets
│   └── IronmanWEBM.webm
├── App.jsx                 # Main application
├── App.css                 # Global styles
└── main.jsx               # Application entry point
```

## 🎨 Design System

### Color Palette
```css
--jarvis-blue: #00D4FF      /* Primary brand color */
--jarvis-cyan: #00FFFF      /* Secondary accent */
--jarvis-dark-blue: #0066CC /* Dark variant */
--jarvis-light-blue: #66E5FF /* Light variant */
--jarvis-gold: #FFD700      /* Accent highlights */
```

### Typography
- **Headings**: Orbitron (futuristic, tech-inspired)
- **Body Text**: Rajdhani (clean, readable)
- **Monospace**: JetBrains Mono (code and technical text)

### Component Variants
- **Buttons**: primary, secondary, accent
- **Inputs**: default, chat, search
- **Status**: idle, listening, speaking, processing, error
- **Sizes**: small, medium, large

## 🔧 Development

### Available Scripts
```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint

# Testing
pnpm run test         # Run test suite
pnpm run test:watch   # Run tests in watch mode
pnpm run test:coverage # Generate coverage report

# Utilities
pnpm run analyze      # Analyze bundle size
pnpm run clean        # Clean build artifacts
```

### Development Tools

#### Debug Panel
Access the debug panel in development mode:
- **Error Logs**: Real-time error monitoring
- **Test Runner**: Component and integration tests
- **System Info**: Browser and device information
- **Performance**: Memory usage and render times

#### Error Logging
Comprehensive error tracking with:
- Categorized logging (ERROR, WARN, INFO, DEBUG)
- Component-specific error handling
- Performance monitoring
- Export functionality for debugging

### Testing Framework
Built-in testing utilities for:
- **Component Testing**: UI component validation
- **Browser Compatibility**: Feature detection
- **ElevenLabs Integration**: Voice functionality testing
- **Performance Benchmarking**: Render time and memory usage

## 🎤 ElevenLabs Integration

### Configuration
The application uses ElevenLabs ConvAI widget with:
- **Agent ID**: `agent_7601k23b460aeejb2pvyfcvw6atk`
- **Custom Styling**: JARVIS-themed appearance
- **Event Handling**: Connection, call, and error events
- **State Synchronization**: Chat and voice state coordination

### Voice Features
- **Voice Input**: Natural speech recognition
- **Voice Output**: High-quality text-to-speech
- **Real-time Processing**: Instant voice conversation
- **Visual Feedback**: Animated status indicators
- **Error Recovery**: Automatic reconnection and retry

### Permissions
The application automatically handles:
- Microphone permission requests
- Audio input/output management
- Connection state monitoring
- Error recovery and user feedback

## 🚀 Deployment

### Supported Platforms
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Docker**
- **Custom hosting**

### Quick Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_ELEVENLABS_AGENT_ID
```

### Environment Variables
```env
# Required
VITE_ELEVENLABS_AGENT_ID=your-agent-id

# Optional
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

## 🔒 Security

### Security Features
- **Content Security Policy**: Strict CSP headers
- **XSS Protection**: Input sanitization and validation
- **HTTPS Enforcement**: Secure communication only
- **Error Sanitization**: Safe error message display
- **Permission Handling**: Secure microphone access

### Security Headers
```javascript
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000"
}
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy-loaded components
- **Bundle Optimization**: Efficient chunk splitting
- **Asset Optimization**: Compressed images and fonts
- **Caching Strategy**: Proper cache headers
- **Performance Monitoring**: Real-time metrics

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 500KB gzipped

## 🐛 Troubleshooting

### Common Issues

#### ElevenLabs Widget Not Loading
```bash
# Check agent ID configuration
echo $VITE_ELEVENLABS_AGENT_ID

# Verify script loading
# Check browser console for errors
# Ensure HTTPS is enabled
```

#### Voice Permissions Denied
```bash
# Check browser permissions
# Verify HTTPS connection
# Test in different browsers
# Clear browser cache
```

#### Build Failures
```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version

# Verify environment variables
env | grep VITE_
```

### Debug Commands
```bash
# Bundle analysis
pnpm run build && npx vite-bundle-analyzer dist

# Performance audit
npx lighthouse http://localhost:4173

# Security scan
npm audit

# Dependency check
npx depcheck
```

## 📚 Documentation

### Additional Resources
- [Product Requirements Document](./PRD_Iron_Man_Jarvis_ChatBot.md)
- [Implementation Guide](./Implementation_Guide.md)
- [Deployment Guide](./Deployment_Guide.md)
- [Cursor AI Prompt](./Cursor_AI_Prompt.md)

### API Documentation
- [ElevenLabs ConvAI API](https://elevenlabs.io/docs/conversational-ai)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Use TypeScript-style JSDoc comments
- Follow React best practices
- Implement proper error handling
- Add comprehensive tests
- Maintain accessibility standards

### Commit Convention
```bash
feat: add new holographic button component
fix: resolve voice permission handling
docs: update deployment guide
test: add component testing utilities
style: improve holographic effects
refactor: optimize error logging system
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ElevenLabs** for advanced voice AI technology
- **Iron Man/Marvel** for design inspiration
- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

## 📞 Support

### Getting Help
1. Check the [troubleshooting section](#-troubleshooting)
2. Review [documentation](#-documentation)
3. Search existing issues
4. Create a new issue with detailed information

### Contact
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@jarvis-chatbot.com

---

**Built with ❤️ and cutting-edge technology to bring the JARVIS experience to life.**

