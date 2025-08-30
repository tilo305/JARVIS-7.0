import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/index.js';
import { useError } from '../../contexts/ErrorContext.jsx';

const ElevenLabsWidget = ({
  agentId = 'agent_7601k23b460aeejb2pvyfcvw6atk',
  className,
  onStatusChange,
  onConversationStart,
  onConversationEnd,
  onError
}) => {
  const widgetRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [widgetStatus, setWidgetStatus] = useState('idle');
  const [isVisible, setIsVisible] = useState(true);
  const { handleError } = useError();

  // Load ElevenLabs widget script
  useEffect(() => {
    const loadScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="convai-widget-embed"]')) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        console.log('ElevenLabs widget script loaded successfully');
        setIsScriptLoaded(true);
        setWidgetStatus('idle');
        onStatusChange?.('idle');
      };
      
      script.onerror = (error) => {
        console.error('Failed to load ElevenLabs widget script:', error);
        setWidgetStatus('error');
        onStatusChange?.('error');
        const errorMessage = 'Failed to load ElevenLabs widget script';
        onError?.(errorMessage);
        handleError(new Error(errorMessage), 'ElevenLabs script loading');
      };

      document.head.appendChild(script);
    };

    loadScript();

    // Cleanup function
    return () => {
      // Note: We don't remove the script on unmount as it might be used by other components
    };
  }, [onStatusChange, onError, handleError]);

  // Initialize widget when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !widgetRef.current) return;

    const widgetElement = widgetRef.current.querySelector('elevenlabs-convai');
    if (!widgetElement) return;

    // Set up event listeners for widget events
    const handleWidgetEvent = (event) => {
      const { type, detail } = event;
      console.log('ElevenLabs widget event:', type, detail);
      
      switch (type) {
        case 'elevenlabs-convai:connect':
          setWidgetStatus('connected');
          onStatusChange?.('connected');
          break;
          
        case 'elevenlabs-convai:disconnect':
          setWidgetStatus('idle');
          onStatusChange?.('idle');
          onConversationEnd?.();
          break;
          
        case 'elevenlabs-convai:call':
          setWidgetStatus('in-call');
          onConversationStart?.();
          break;
          
        case 'elevenlabs-convai:error':
          setWidgetStatus('error');
          onStatusChange?.('error');
          const errorMessage = detail?.message || 'Widget error occurred';
          onError?.(errorMessage);
          handleError(new Error(errorMessage), 'ElevenLabs widget');
          break;
          
        default:
          console.log('Unknown ElevenLabs widget event:', type, detail);
      }
    };

    // Add event listeners
    const events = [
      'elevenlabs-convai:connect',
      'elevenlabs-convai:disconnect', 
      'elevenlabs-convai:call',
      'elevenlabs-convai:error'
    ];

    events.forEach(eventType => {
      widgetElement.addEventListener(eventType, handleWidgetEvent);
    });

    // Cleanup event listeners
    return () => {
      events.forEach(eventType => {
        widgetElement.removeEventListener(eventType, handleWidgetEvent);
      });
    };
  }, [isScriptLoaded, onStatusChange, onConversationStart, onConversationEnd, onError, handleError]);

  const getStatusColor = () => {
    switch (widgetStatus) {
      case 'connected': return 'bg-green-400';
      case 'in-call': return 'bg-blue-400 animate-pulse';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (widgetStatus) {
      case 'idle': return 'Ready';
      case 'connected': return 'Connected';
      case 'in-call': return 'In Call';
      case 'error': return 'Error';
      default: return 'Loading...';
    }
  };

  if (!isScriptLoaded) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="text-center space-y-2">
          <div className="loading-dots">
            <div className="loading-dot bg-jarvis-blue" />
            <div className="loading-dot bg-jarvis-blue" />
            <div className="loading-dot bg-jarvis-blue" />
          </div>
          <p className="text-sm text-jarvis-blue/70 font-rajdhani">
            Loading voice interface...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={widgetRef}
      className={cn(
        'elevenlabs-widget-container relative',
        'holographic-container p-4',
        !isVisible && 'hidden',
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Widget header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full transition-colors duration-300', getStatusColor())} />
          <span className="text-sm font-rajdhani text-jarvis-blue/80">
            Voice: {getStatusText()}
          </span>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-jarvis-blue/50 hover:text-jarvis-blue/80 transition-colors"
          aria-label="Hide voice widget"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ElevenLabs ConvAI Widget */}
      <div className="elevenlabs-widget-wrapper">
        <elevenlabs-convai
          agent-id={agentId}
          variant="expanded"
          avatar-orb-color-1="#00D4FF"
          avatar-orb-color-2="#00FFFF"
          action-text="Talk to JARVIS"
          start-call-text="Initialize"
          end-call-text="Disconnect"
          listening-text="JARVIS is listening..."
          speaking-text="JARVIS is responding..."
        />
      </div>

      {/* Custom styling for the widget */}
      <style jsx>{`
        elevenlabs-convai {
          --primary-color: #00D4FF;
          --secondary-color: #00FFFF;
          --background-color: rgba(0, 20, 40, 0.9);
          --text-color: #00D4FF;
          --border-color: rgba(0, 212, 255, 0.3);
          --border-radius: 12px;
          --font-family: 'Rajdhani', sans-serif;
        }
        
        .elevenlabs-widget-wrapper {
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0, 20, 40, 0.5);
          backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Holographic overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-line opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-jarvis-blue/5 via-transparent to-jarvis-cyan/5" />
      </div>
    </motion.div>
  );
};

// Widget toggle button component
export const ElevenLabsWidgetToggle = ({ onToggle, isVisible }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-50 holographic-button w-12 h-12 rounded-full flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isVisible ? "Hide voice widget" : "Show voice widget"}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
        />
      </svg>
    </motion.button>
  );
};

export default ElevenLabsWidget;

