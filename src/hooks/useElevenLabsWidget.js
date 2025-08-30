import { useState, useCallback, useRef, useEffect } from 'react';
import { useError } from '../contexts/ErrorContext.jsx';
import { createApplicationError, ERROR_TYPES } from '../utils/index.js';

export const useElevenLabsWidget = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [widgetStatus, setWidgetStatus] = useState('idle');
  const widgetRef = useRef(null);
  const { handleError } = useError();

  // Handle widget status changes
  const handleStatusChange = useCallback((status) => {
    console.log('Widget status changed:', status);
    setWidgetStatus(status);
    
    switch (status) {
      case 'connected':
        setIsConnected(true);
        setError(null);
        break;
      case 'disconnected':
      case 'idle':
        setIsConnected(false);
        setIsInCall(false);
        setIsListening(false);
        setIsSpeaking(false);
        break;
      case 'in-call':
        setIsInCall(true);
        break;
      case 'listening':
        setIsListening(true);
        setIsSpeaking(false);
        break;
      case 'speaking':
        setIsListening(false);
        setIsSpeaking(true);
        break;
      case 'error':
        setIsConnected(false);
        setIsInCall(false);
        setIsListening(false);
        setIsSpeaking(false);
        break;
    }
  }, []);

  // Handle conversation start
  const handleConversationStart = useCallback(() => {
    console.log('Conversation started');
    setIsInCall(true);
    setError(null);
  }, []);

  // Handle conversation end
  const handleConversationEnd = useCallback(() => {
    console.log('Conversation ended');
    setIsInCall(false);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  // Handle widget errors
  const handleWidgetError = useCallback((errorMessage) => {
    console.error('Widget error:', errorMessage);
    const appError = createApplicationError(
      ERROR_TYPES.WIDGET_INITIALIZATION_ERROR,
      errorMessage,
      'ElevenLabs widget error',
      true
    );
    setError(appError);
    handleError(new Error(errorMessage), 'ElevenLabs widget');
  }, [handleError]);

  // Connect to widget
  const connect = useCallback(() => {
    try {
      // Find the widget element
      const widget = document.querySelector('elevenlabs-convai');
      if (!widget) {
        throw new Error('ElevenLabs widget not found');
      }

      widgetRef.current = widget;
      
      // Trigger connection (this would be handled by the widget's internal logic)
      setIsConnected(true);
      setError(null);
      console.log('Connected to ElevenLabs widget');
    } catch (err) {
      const appError = createApplicationError(
        ERROR_TYPES.WIDGET_INITIALIZATION_ERROR,
        'Failed to connect to voice service',
        err.message,
        true
      );
      setError(appError);
      handleError(err, 'Widget connection');
    }
  }, [handleError]);

  // Disconnect from widget
  const disconnect = useCallback(() => {
    try {
      setIsConnected(false);
      setIsInCall(false);
      setIsListening(false);
      setIsSpeaking(false);
      setError(null);
      console.log('Disconnected from ElevenLabs widget');
    } catch (err) {
      const appError = createApplicationError(
        ERROR_TYPES.UNKNOWN_ERROR,
        'Failed to disconnect from voice service',
        err.message,
        true
      );
      setError(appError);
      handleError(err, 'Widget disconnection');
    }
  }, [handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Start voice input
  const startVoiceInput = useCallback(() => {
    if (!isConnected) {
      const appError = createApplicationError(
        ERROR_TYPES.WIDGET_INITIALIZATION_ERROR,
        'Voice service not connected',
        'Cannot start voice input without connection',
        true
      );
      setError(appError);
      return false;
    }

    try {
      setIsListening(true);
      setIsSpeaking(false);
      console.log('Started voice input');
      return true;
    } catch (err) {
      const appError = createApplicationError(
        ERROR_TYPES.VOICE_PROCESSING_ERROR,
        'Failed to start voice input',
        err.message,
        true
      );
      setError(appError);
      handleError(err, 'Voice input start');
      return false;
    }
  }, [isConnected, handleError]);

  // Stop voice input
  const stopVoiceInput = useCallback(() => {
    try {
      setIsListening(false);
      console.log('Stopped voice input');
      return true;
    } catch (err) {
      const appError = createApplicationError(
        ERROR_TYPES.VOICE_PROCESSING_ERROR,
        'Failed to stop voice input',
        err.message,
        true
      );
      setError(appError);
      handleError(err, 'Voice input stop');
      return false;
    }
  }, [handleError]);

  // Toggle voice input
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      return stopVoiceInput();
    } else {
      return startVoiceInput();
    }
  }, [isListening, startVoiceInput, stopVoiceInput]);

  // Check if widget is available
  const isWidgetAvailable = useCallback(() => {
    return typeof window !== 'undefined' && 
           document.querySelector('script[src*="convai-widget-embed"]') !== null;
  }, []);

  // Get current state summary
  const getState = useCallback(() => {
    return {
      isConnected,
      isInCall,
      isListening,
      isSpeaking,
      widgetStatus,
      error,
      isAvailable: isWidgetAvailable()
    };
  }, [isConnected, isInCall, isListening, isSpeaking, widgetStatus, error, isWidgetAvailable]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInCall) {
        disconnect();
      }
    };
  }, [isInCall, disconnect]);

  return {
    // State
    isConnected,
    isInCall,
    isListening,
    isSpeaking,
    error,
    widgetStatus,
    
    // Actions
    connect,
    disconnect,
    clearError,
    startVoiceInput,
    stopVoiceInput,
    toggleVoiceInput,
    
    // Event handlers for widget component
    handleStatusChange,
    handleConversationStart,
    handleConversationEnd,
    handleWidgetError,
    
    // Utilities
    isWidgetAvailable,
    getState
  };
};

