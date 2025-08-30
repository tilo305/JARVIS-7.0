import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { createAppError, ERROR_TYPES } from '../types/index.js';

// Error state management
const errorReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.timestamp.getTime().toString() !== action.payload),
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
      };
    case 'SET_RECOVERING':
      return {
        ...state,
        isRecovering: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  errors: [],
  isRecovering: false,
};

// Create context
const ErrorContext = createContext(undefined);

// Error provider component
export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const createError = useCallback((type, message, details = null, recoverable = true) => {
    return createAppError(type, message, details, recoverable);
  }, []);

  const addError = useCallback((error) => {
    dispatch({ type: 'ADD_ERROR', payload: error });
    
    // Show toast notification
    const toastMessage = error.recoverable 
      ? `${error.message} (Tap to retry)`
      : error.message;
    
    if (error.recoverable) {
      toast.error(toastMessage, {
        duration: 5000,
        onClick: () => {
          removeError(error.timestamp.getTime().toString());
        },
        style: {
          background: 'rgba(0, 20, 40, 0.9)',
          color: '#00D4FF',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
        },
      });
    } else {
      toast.error(toastMessage, {
        duration: 8000,
        style: {
          background: 'rgba(40, 0, 0, 0.9)',
          color: '#ff6b6b',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
        },
      });
    }

    // Log error for debugging
    console.error('Application Error:', {
      type: error.type,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      recoverable: error.recoverable,
    });
  }, []);

  const removeError = useCallback((errorId) => {
    dispatch({ type: 'REMOVE_ERROR', payload: errorId });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const handleError = useCallback((error, context = '') => {
    let appError;

    if (error instanceof Error) {
      // Determine error type based on error message or context
      let errorType = ERROR_TYPES.UNKNOWN_ERROR;
      
      if (error.message.includes('microphone') || error.message.includes('getUserMedia')) {
        errorType = ERROR_TYPES.MICROPHONE_ACCESS_DENIED;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorType = ERROR_TYPES.NETWORK_ERROR;
      } else if (error.message.includes('voice') || error.message.includes('speech')) {
        errorType = ERROR_TYPES.VOICE_PROCESSING_ERROR;
      } else if (error.message.includes('widget') || error.message.includes('elevenlabs')) {
        errorType = ERROR_TYPES.WIDGET_INITIALIZATION_ERROR;
      }

      appError = createError(
        errorType,
        error.message,
        context ? `Context: ${context}` : undefined,
        errorType !== ERROR_TYPES.MICROPHONE_ACCESS_DENIED // Microphone errors usually require user action
      );
    } else {
      appError = createError(
        ERROR_TYPES.UNKNOWN_ERROR,
        'An unexpected error occurred',
        context ? `Context: ${context}, Error: ${String(error)}` : String(error)
      );
    }

    addError(appError);
  }, [createError, addError]);

  const setRecovering = useCallback((isRecovering) => {
    dispatch({ type: 'SET_RECOVERING', payload: isRecovering });
  }, []);

  const value = {
    state,
    addError,
    removeError,
    clearErrors,
    createError,
    handleError,
    setRecovering,
    isRecovering: state.isRecovering,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Error boundary component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
          <div className="holographic-container max-w-md w-full p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-orbitron text-red-400">
                System Error
              </h2>
              <p className="text-sm text-jarvis-blue/70 font-rajdhani">
                JARVIS encountered an unexpected error and needs to restart.
              </p>
              {this.state.error && (
                <details className="text-xs text-jarvis-blue/50 mt-4">
                  <summary className="cursor-pointer hover:text-jarvis-blue/70">
                    Technical Details
                  </summary>
                  <pre className="mt-2 p-2 bg-black/20 rounded text-left overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="holographic-button w-full px-4 py-2 text-jarvis-blue border border-jarvis-blue/50 rounded-lg hover:border-jarvis-blue hover:shadow-[0_0_20px_rgba(0,212,255,0.6)] transition-all duration-300"
              >
                Restart JARVIS
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="holographic-button w-full px-4 py-2 text-jarvis-cyan/70 border border-jarvis-cyan/30 rounded-lg hover:border-jarvis-cyan/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-300 text-sm"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

