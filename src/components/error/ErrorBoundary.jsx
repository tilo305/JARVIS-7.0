import React from 'react';
import { motion } from 'framer-motion';
import errorLogger from '../../utils/errorLogger.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID()
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    const errorId = errorLogger.logComponentError(
      this.props.componentName || 'Unknown Component',
      error,
      {
        props: this.props,
        errorInfo,
        retryCount: this.state.retryCount
      }
    );

    this.setState({
      error,
      errorInfo,
      errorId: errorId.id
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to external error tracking service
    this.reportErrorToService(error, errorInfo);
  }

  reportErrorToService = (error, errorInfo) => {
    // In production, this would send to error tracking services like Sentry
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.log('Would report to error tracking service:', { error, errorInfo });
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }));

    errorLogger.info('Error boundary retry attempted', {
      retryCount: this.state.retryCount + 1,
      errorId: this.state.errorId
    }, 'Error Recovery');
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportBug = () => {
    const bugReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        name: this.state.error?.name
      },
      errorInfo: this.state.errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
      systemInfo: errorLogger.getSystemInfo()
    };

    // Create downloadable bug report
    const blob = new Blob([JSON.stringify(bugReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-bug-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    errorLogger.info('Bug report generated', { errorId: this.state.errorId }, 'Bug Reporting');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-6"
          >
            {/* Error icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <svg
                className="w-10 h-10 text-red-400"
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
            </motion.div>

            {/* Error content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-orbitron font-bold text-red-400">
                  System Error
                </h1>
                <p className="text-red-300/80 font-rajdhani">
                  JARVIS encountered an unexpected error and needs to restart.
                </p>
              </div>

              {/* Error details */}
              {this.state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left"
                >
                  <div className="text-sm text-red-300 mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorId && (
                    <div className="text-xs text-red-400/70">
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                  )}
                  {this.state.retryCount > 0 && (
                    <div className="text-xs text-red-400/70">
                      <strong>Retry Count:</strong> {this.state.retryCount}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Technical details (collapsible) */}
              {this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-red-400/70 hover:text-red-400 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 bg-black/20 rounded text-xs text-red-300/60 font-mono">
                    <div className="mb-2">
                      <strong>Stack Trace:</strong>
                    </div>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <div className="mt-2">
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 font-rajdhani font-semibold"
                >
                  🔄 Restart JARVIS
                </button>

                <button
                  onClick={this.handleReload}
                  className="w-full px-4 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300 font-rajdhani"
                >
                  🔃 Reload Page
                </button>

                <button
                  onClick={this.handleReportBug}
                  className="w-full px-4 py-3 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 font-rajdhani text-sm"
                >
                  🐛 Download Bug Report
                </button>
              </div>

              {/* Help text */}
              <div className="text-center text-xs text-red-400/50 space-y-1">
                <p>If the problem persists, try refreshing the page.</p>
                <p>You can download a bug report to help with debugging.</p>
              </div>
            </motion.div>

            {/* Retry count warning */}
            {this.state.retryCount >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center"
              >
                <div className="text-sm text-yellow-300">
                  ⚠️ Multiple errors detected
                </div>
                <div className="text-xs text-yellow-400/70 mt-1">
                  Consider reloading the page or checking your internet connection.
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error reporting
export const useErrorReporting = () => {
  const reportError = React.useCallback((error, context = 'Manual Report') => {
    errorLogger.error('Manual Error Report', error, context);
  }, []);

  const reportWarning = React.useCallback((message, details = null, context = 'Manual Warning') => {
    errorLogger.warn(message, details, context);
  }, []);

  const reportInfo = React.useCallback((message, details = null, context = 'Manual Info') => {
    errorLogger.info(message, details, context);
  }, []);

  return {
    reportError,
    reportWarning,
    reportInfo
  };
};

export default ErrorBoundary;

