import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/index.js';

const ElevenLabsWidget = ({
  agentId = 'agent_7601k23b460aeejb2pvyfcvw6atk',
  className,
  onStatusChange,
  onConversationStart,
  onConversationEnd,
  onError
}) => {
  const widgetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load the ElevenLabs script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
      createWidget();
    };
    
    script.onerror = (error) => {
      console.error('Failed to load ElevenLabs script:', error);
      setHasError(true);
      setIsLoading(false);
      onStatusChange?.('error');
      onError?.('Failed to load ElevenLabs script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const createWidget = () => {
    if (!widgetRef.current) return;

    try {
      // Wait for the custom element to be registered
      const waitForElement = () => {
        if (customElements.get('elevenlabs-convai')) {
          // Create the widget element using the official embed code
          const widgetElement = document.createElement('elevenlabs-convai');
          widgetElement.setAttribute('agent-id', agentId);
          
          // Clear the container and add the widget
          widgetRef.current.innerHTML = '';
          widgetRef.current.appendChild(widgetElement);

          // Set up event listeners
          widgetElement.addEventListener('elevenlabs-widget-state', (event) => {
            const { state } = event.detail;
            console.log('ElevenLabs widget state:', state);
            
            switch (state) {
              case 'connected':
                setIsLoading(false);
                setHasError(false);
                onStatusChange?.('connected');
                break;
              case 'disconnected':
                onStatusChange?.('idle');
                onConversationEnd?.();
                break;
              case 'in-call':
                onConversationStart?.();
                break;
              case 'listening':
                onStatusChange?.('listening');
                break;
              case 'speaking':
                onStatusChange?.('speaking');
                break;
              case 'error':
                setHasError(true);
                setIsLoading(false);
                onStatusChange?.('error');
                onError?.('Widget error occurred');
                break;
            }
          });

          console.log('ElevenLabs widget created successfully');
        } else {
          setTimeout(waitForElement, 100);
        }
      };

      waitForElement();
    } catch (error) {
      console.error('Failed to create widget:', error);
      setHasError(true);
      setIsLoading(false);
      onStatusChange?.('error');
      onError?.(error.message);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Compact Floating Widget */}
      <div
        ref={widgetRef}
        className={cn(
          'w-full h-full flex items-center justify-center',
          isExpanded ? 'min-h-[200px]' : 'min-h-[48px]'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isLoading && !hasError && (
          <div className="text-center space-y-2">
            <div className="loading-dots">
              <div className="loading-dot bg-white w-2 h-2" />
              <div className="loading-dot bg-white w-2 h-2" />
              <div className="loading-dot bg-white w-2 h-2" />
            </div>
            <p className="text-xs text-white/70 font-rajdhani">
              Loading...
            </p>
          </div>
        )}
        
        {hasError && (
          <div className="text-center space-y-2">
            <div className="w-6 h-6 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <p className="text-xs text-red-300 font-rajdhani">
              Error
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasError(false);
                setIsLoading(true);
                window.location.reload();
              }}
              className="px-2 py-1 text-xs bg-white/20 text-white rounded border border-white/30 hover:bg-white/30 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Voice Icon when not expanded */}
        {!isLoading && !hasError && !isExpanded && (
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        )}
      </div>

      {/* Expand/Collapse indicator */}
      {!isLoading && !hasError && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-jarvis-cyan rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default ElevenLabsWidget;

