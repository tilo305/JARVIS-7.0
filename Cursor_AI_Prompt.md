# JARVIS Chat Bot - Cursor AI Development Prompt

## Project Overview
Create a sophisticated Iron Man JARVIS-themed chat/voice bot website with holographic UI, ElevenLabs voice integration, and comprehensive error handling. This is a React-based application with a futuristic, holographic aesthetic inspired by Tony Stark's AI assistant.

## Core Requirements

### 1. Technology Stack
- **Framework**: React 19+ with Vite
- **Styling**: Tailwind CSS with custom holographic theme
- **Animations**: Framer Motion for smooth transitions
- **Voice Integration**: ElevenLabs ConvAI Widget
- **Error Handling**: React Error Boundaries with comprehensive logging
- **Testing**: Custom test utilities and browser compatibility checks

### 2. Visual Design Requirements
- **Theme**: Iron Man/JARVIS holographic interface
- **Colors**: 
  - Primary: #00D4FF (Jarvis Blue)
  - Secondary: #00FFFF (Cyan)
  - Accent: #FFD700 (Gold)
  - Background: Dark gradient (slate-900 to blue-900)
- **Effects**: Glassmorphism, particle animations, scan lines, holographic borders
- **Typography**: Orbitron for headings, Rajdhani for body text
- **Layout**: Centered chat window (300x400px) at bottom of screen

### 3. Core Components to Build

#### A. UI Components (`src/components/ui/`)
```jsx
// HolographicButton.jsx
- Variants: primary, secondary, accent
- Sizes: small, medium, large
- States: normal, hover, active, disabled, loading
- Glowing border effects and smooth transitions

// HolographicInput.jsx
- Variants: default, chat, search
- Holographic border with focus effects
- Placeholder animations
- Error state styling

// MicrophoneButton.jsx
- Visual states: idle, listening, processing
- Pulsing animation when active
- Color changes: blue (idle) → red (listening)
- Size variants: small, medium, large

// StatusIndicator.jsx
- Status types: idle, listening, speaking, processing, error, connected
- Animated dots and color-coded indicators
- Message display with timestamps
```

#### B. Chat Components (`src/components/chat/`)
```jsx
// ChatWindow.jsx
- 300x400px holographic container
- Message list with auto-scroll
- Input area with text field, mic button, send button
- Real-time status updates
- Keyboard shortcuts (Ctrl+Enter, Esc, Space)
- Error handling and recovery

// Message.jsx
- User vs assistant message styling
- Timestamp formatting
- Message status indicators
- Smooth enter/exit animations
```

#### C. Voice Integration (`src/components/voice/`)
```jsx
// ElevenLabsWidget.jsx
- ElevenLabs ConvAI widget integration
- Agent ID: agent_7601k23b460aeejb2pvyfcvw6atk
- Custom styling to match JARVIS theme
- Event handling for connection, calls, errors
- Holographic overlay effects

// useElevenLabsWidget.js (Hook)
- State management for widget connection
- Voice input/output handling
- Error recovery mechanisms
- Status synchronization
```

#### D. Layout Components (`src/components/layout/`)
```jsx
// MainLayout.jsx
- Full-screen background with Iron Man video
- Particle effects and ambient animations
- Header with JARVIS title and subtitle
- Footer with attribution
- Responsive design for mobile/desktop
```

#### E. Error Handling (`src/components/error/`)
```jsx
// ErrorBoundary.jsx
- Comprehensive error catching
- User-friendly error messages
- Retry mechanisms
- Bug report generation
- Graceful degradation

// DebugPanel.jsx (Development only)
- Real-time error logs
- Test runner interface
- System information display
- Performance monitoring
```

### 4. Utility Systems

#### A. Error Logging (`src/utils/errorLogger.js`)
```javascript
- Global error handling
- Categorized logging (ERROR, WARN, INFO, DEBUG)
- ElevenLabs-specific error handling
- Performance monitoring
- Export functionality for debugging
```

#### B. Testing Utilities (`src/utils/testUtils.js`)
```javascript
- Component testing framework
- Browser compatibility checks
- ElevenLabs widget testing
- Performance benchmarking
- Automated test runner
```

#### C. General Utilities (`src/utils/index.js`)
```javascript
- Tailwind class merging (cn function)
- Message creation and validation
- Timestamp formatting
- Browser feature detection
- Local storage management
```

### 5. Styling Requirements

#### A. CSS Variables (App.css)
```css
:root {
  --jarvis-blue: #00D4FF;
  --jarvis-cyan: #00FFFF;
  --jarvis-dark-blue: #0066CC;
  --jarvis-light-blue: #66E5FF;
  --jarvis-gold: #FFD700;
  --holographic-bg: rgba(0, 20, 40, 0.9);
  --glass-light: rgba(0, 212, 255, 0.1);
  --glass-medium: rgba(0, 212, 255, 0.2);
  --glass-dark: rgba(0, 212, 255, 0.3);
}
```

#### B. Custom Classes
```css
.holographic-text {
  background: linear-gradient(45deg, #00D4FF, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
}

.holographic-container {
  background: rgba(0, 20, 40, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
}

.holographic-button {
  background: linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 255, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.5);
  transition: all 0.3s ease;
}

.holographic-button:hover {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
  border-color: #00D4FF;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D4FF, transparent);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(400px); opacity: 0; }
}

.particle {
  width: 2px;
  height: 2px;
  background: #00D4FF;
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }

.message-user {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 255, 255, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.3);
  margin-left: auto;
}

.message-assistant {
  background: linear-gradient(135deg, rgba(0, 100, 200, 0.2), rgba(0, 150, 255, 0.1));
  border: 1px solid rgba(0, 150, 255, 0.3);
}
```

### 6. ElevenLabs Integration

#### A. Widget Configuration
```html
<elevenlabs-convai
  agent-id="agent_7601k23b460aeejb2pvyfcvw6atk"
  variant="expanded"
  avatar-orb-color-1="#00D4FF"
  avatar-orb-color-2="#00FFFF"
  action-text="Talk to JARVIS"
  start-call-text="Initialize"
  end-call-text="Disconnect"
  listening-text="JARVIS is listening..."
  speaking-text="JARVIS is responding..."
/>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

#### B. Event Handling
```javascript
// Listen for widget events
widget.addEventListener('elevenlabs-convai:connect', handleConnect);
widget.addEventListener('elevenlabs-convai:disconnect', handleDisconnect);
widget.addEventListener('elevenlabs-convai:call', handleCall);
widget.addEventListener('elevenlabs-convai:error', handleError);
```

### 7. File Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── HolographicButton.jsx
│   │   ├── HolographicInput.jsx
│   │   ├── MicrophoneButton.jsx
│   │   └── StatusIndicator.jsx
│   ├── chat/
│   │   ├── ChatWindow.jsx
│   │   └── Message.jsx
│   ├── voice/
│   │   └── ElevenLabsWidget.jsx
│   ├── layout/
│   │   └── MainLayout.jsx
│   ├── error/
│   │   └── ErrorBoundary.jsx
│   └── debug/
│       └── DebugPanel.jsx
├── hooks/
│   └── useElevenLabsWidget.js
├── contexts/
│   └── ErrorContext.jsx
├── utils/
│   ├── index.js
│   ├── errorLogger.js
│   └── testUtils.js
├── types/
│   └── index.js
├── assets/
│   └── IronmanWEBM.webm
├── App.jsx
├── App.css
└── main.jsx
```

### 8. Key Features to Implement

#### A. Chat Functionality
- Real-time message display
- User input with validation
- Auto-scroll to latest messages
- Message timestamps
- Typing indicators
- Error state handling

#### B. Voice Integration
- Microphone permission handling
- Voice input visualization
- Speaking state indicators
- Connection status monitoring
- Automatic reconnection

#### C. Visual Effects
- Particle animations
- Scan line effects
- Holographic borders
- Smooth transitions
- Responsive glowing effects
- Loading states

#### D. Error Handling
- Global error boundaries
- User-friendly error messages
- Automatic retry mechanisms
- Debug information
- Performance monitoring

### 9. Development Guidelines

#### A. Code Quality
- Use TypeScript-style JSDoc comments
- Implement proper error boundaries
- Add comprehensive prop validation
- Use semantic HTML elements
- Follow React best practices

#### B. Performance
- Optimize re-renders with React.memo
- Use useCallback for event handlers
- Implement proper cleanup in useEffect
- Lazy load components when possible
- Monitor memory usage

#### C. Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

### 10. Testing Requirements

#### A. Component Tests
- Button click functionality
- Input field validation
- Status indicator changes
- Error boundary triggers
- Animation completions

#### B. Integration Tests
- ElevenLabs widget loading
- Voice permission requests
- Error recovery flows
- Message sending/receiving
- State synchronization

#### C. Browser Compatibility
- Web Audio API support
- MediaDevices API support
- Custom Elements support
- ES6+ feature detection
- Mobile device testing

### 11. Deployment Considerations

#### A. Build Optimization
- Code splitting
- Asset optimization
- Bundle size analysis
- Performance budgets
- Progressive loading

#### B. Environment Configuration
- Development vs production builds
- Error reporting setup
- Analytics integration
- Feature flags
- Security headers

### 12. Implementation Steps

1. **Setup Project Structure**
   - Initialize React app with Vite
   - Install dependencies (framer-motion, tailwindcss, etc.)
   - Configure Tailwind with custom theme
   - Set up file structure

2. **Build Core UI Components**
   - Create holographic button component
   - Implement holographic input field
   - Build microphone button with states
   - Create status indicator component

3. **Implement Chat System**
   - Build chat window layout
   - Create message components
   - Add input handling and validation
   - Implement auto-scroll functionality

4. **Integrate ElevenLabs Widget**
   - Load ElevenLabs script
   - Configure widget with agent ID
   - Handle widget events
   - Sync with chat interface

5. **Add Error Handling**
   - Implement error boundaries
   - Create error logging system
   - Add user-friendly error messages
   - Build debug panel for development

6. **Style and Animate**
   - Apply holographic theme
   - Add particle effects
   - Implement smooth transitions
   - Create loading states

7. **Test and Debug**
   - Run component tests
   - Test browser compatibility
   - Verify voice functionality
   - Performance optimization

8. **Deploy and Monitor**
   - Build production version
   - Deploy to hosting platform
   - Set up error monitoring
   - Monitor performance metrics

## Expected Outcome
A fully functional JARVIS-themed chat bot with:
- Stunning holographic UI that captures the Iron Man aesthetic
- Seamless voice interaction through ElevenLabs integration
- Robust error handling and recovery mechanisms
- Smooth animations and visual effects
- Mobile and desktop compatibility
- Comprehensive testing and debugging tools

The final application should feel like interacting with Tony Stark's AI assistant, with a professional, futuristic interface that's both visually impressive and highly functional.

