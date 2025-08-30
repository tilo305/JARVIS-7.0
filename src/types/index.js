// Core application types for JARVIS Chat Bot

// Message interface for chat functionality
export const createMessage = (content, sender, type = 'text') => ({
  id: crypto.randomUUID(),
  content,
  sender, // 'user' | 'assistant'
  type, // 'text' | 'voice'
  timestamp: new Date(),
  status: 'sent' // 'sending' | 'sent' | 'error'
});

// Chat state management
export const createChatState = () => ({
  messages: [],
  isConnected: false,
  isListening: false,
  isSpeaking: false,
  error: null
});

// Error types for comprehensive error handling
export const ERROR_TYPES = {
  MICROPHONE_ACCESS_DENIED: 'MICROPHONE_ACCESS_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VOICE_PROCESSING_ERROR: 'VOICE_PROCESSING_ERROR',
  WIDGET_INITIALIZATION_ERROR: 'WIDGET_INITIALIZATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const createAppError = (type, message, details = null, recoverable = true) => ({
  type,
  message,
  details,
  timestamp: new Date(),
  recoverable
});

// Holographic theme configuration
export const HOLOGRAPHIC_THEME = {
  primaryColor: '#00D4FF',
  secondaryColor: '#00FFFF',
  accentColor: '#0099CC',
  glowColor: '#66E5FF',
  backgroundColor: 'rgba(0, 20, 40, 0.9)',
  textColor: '#00D4FF',
  borderColor: 'rgba(0, 212, 255, 0.3)'
};

// Voice widget configuration
export const createVoiceWidgetConfig = (agentId) => ({
  agentId,
  variant: 'expanded',
  avatarOrbColor1: '#00D4FF',
  avatarOrbColor2: '#00FFFF',
  actionText: 'Talk to JARVIS',
  startCallText: 'Initialize',
  endCallText: 'Disconnect'
});

// Component prop validation helpers
export const validateChatWindowProps = (props) => {
  const { className, onVoiceStateChange } = props;
  return {
    className: className || '',
    onVoiceStateChange: typeof onVoiceStateChange === 'function' ? onVoiceStateChange : () => {}
  };
};

export const validateHolographicButtonProps = (props) => {
  const { 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    loading = false, 
    className = '' 
  } = props;
  
  return {
    children,
    onClick: typeof onClick === 'function' ? onClick : () => {},
    variant: ['primary', 'secondary', 'accent'].includes(variant) ? variant : 'primary',
    size: ['small', 'medium', 'large'].includes(size) ? size : 'medium',
    disabled: Boolean(disabled),
    loading: Boolean(loading),
    className
  };
};

