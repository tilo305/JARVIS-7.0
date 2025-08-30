// Comprehensive error logging system for JARVIS Chat Bot

class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.isProduction = process.env.NODE_ENV === 'production';
    this.initializeLogger();
  }

  initializeLogger() {
    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    // Log initialization
    this.info('ErrorLogger initialized', {
      environment: this.isProduction ? 'production' : 'development',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    });
  }

  createLogEntry(level, message, details = null, context = null) {
    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      context,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };

    // Add to logs array
    this.logs.push(entry);

    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    return entry;
  }

  error(message, details = null, context = null) {
    const entry = this.createLogEntry('ERROR', message, details, context);
    
    // Always log errors to console
    console.error(`[JARVIS ERROR] ${message}`, {
      details,
      context,
      timestamp: entry.timestamp
    });

    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToExternalLogger(entry);
    }

    return entry;
  }

  warn(message, details = null, context = null) {
    const entry = this.createLogEntry('WARN', message, details, context);
    
    console.warn(`[JARVIS WARN] ${message}`, {
      details,
      context,
      timestamp: entry.timestamp
    });

    return entry;
  }

  info(message, details = null, context = null) {
    const entry = this.createLogEntry('INFO', message, details, context);
    
    if (!this.isProduction) {
      console.info(`[JARVIS INFO] ${message}`, {
        details,
        context,
        timestamp: entry.timestamp
      });
    }

    return entry;
  }

  debug(message, details = null, context = null) {
    if (this.isProduction) return null;

    const entry = this.createLogEntry('DEBUG', message, details, context);
    
    console.debug(`[JARVIS DEBUG] ${message}`, {
      details,
      context,
      timestamp: entry.timestamp
    });

    return entry;
  }

  handleGlobalError(event) {
    this.error('Global JavaScript Error', {
      message: event.error?.message || event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }, 'Global Error Handler');
  }

  handleUnhandledRejection(event) {
    this.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: event.promise
    }, 'Promise Rejection Handler');
  }

  // ElevenLabs specific error logging
  logElevenLabsError(error, context = 'ElevenLabs Widget') {
    return this.error('ElevenLabs Integration Error', {
      errorType: error.type || 'unknown',
      errorMessage: error.message,
      errorDetails: error.details,
      widgetStatus: error.widgetStatus,
      connectionState: error.connectionState
    }, context);
  }

  // Voice processing error logging
  logVoiceError(error, context = 'Voice Processing') {
    return this.error('Voice Processing Error', {
      errorType: error.name || 'VoiceError',
      errorMessage: error.message,
      mediaDevicesSupported: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
      permissions: error.permission || 'unknown'
    }, context);
  }

  // Network error logging
  logNetworkError(error, url, context = 'Network Request') {
    return this.error('Network Error', {
      url,
      status: error.status,
      statusText: error.statusText,
      errorMessage: error.message,
      networkState: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown'
    }, context);
  }

  // Component error logging
  logComponentError(componentName, error, props = null) {
    return this.error(`Component Error: ${componentName}`, {
      errorMessage: error.message,
      errorStack: error.stack,
      componentProps: props,
      reactVersion: React?.version || 'unknown'
    }, `React Component: ${componentName}`);
  }

  // Performance logging
  logPerformance(operation, duration, details = null) {
    const level = duration > 1000 ? 'WARN' : 'INFO';
    const message = `Performance: ${operation} took ${duration}ms`;
    
    return this.createLogEntry(level, message, {
      operation,
      duration,
      details,
      performanceNow: performance.now()
    }, 'Performance Monitor');
  }

  // Get logs by level
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  // Get recent logs
  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  // Get logs by context
  getLogsByContext(context) {
    return this.logs.filter(log => log.context === context);
  }

  // Export logs for debugging
  exportLogs() {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      environment: this.isProduction ? 'production' : 'development',
      logs: this.logs
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Clear logs
  clearLogs() {
    const clearedCount = this.logs.length;
    this.logs = [];
    this.info(`Cleared ${clearedCount} log entries`, null, 'Log Management');
    return clearedCount;
  }

  // Send to external logging service (placeholder for production)
  async sendToExternalLogger(entry) {
    try {
      // In a real implementation, this would send to services like:
      // - Sentry
      // - LogRocket
      // - DataDog
      // - Custom logging endpoint
      
      if (this.isProduction) {
        // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
        console.log('Would send to external logger:', entry);
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  // Get system information for debugging
  getSystemInfo() {
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
      cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : 'unknown',
      onLine: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown',
      screen: typeof screen !== 'undefined' ? {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      } : 'unknown',
      viewport: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    this.debug('System Information Collected', info, 'System Info');
    return info;
  }
}

// Create singleton instance
const errorLogger = new ErrorLogger();

// Export both the class and the singleton
export { ErrorLogger, errorLogger };
export default errorLogger;

