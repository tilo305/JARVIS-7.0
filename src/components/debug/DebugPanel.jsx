import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/index.js';
import errorLogger from '../../utils/errorLogger.js';
import testRunner from '../../utils/testUtils.js';

const DebugPanel = ({ isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Refresh logs
  const refreshLogs = useCallback(() => {
    const recentLogs = errorLogger.getRecentLogs(100);
    setLogs(recentLogs);
  }, []);

  // Run tests
  const runTests = useCallback(async () => {
    setIsRunningTests(true);
    try {
      const results = await testRunner.runAllTests();
      setTestResults(results);
    } catch (error) {
      errorLogger.error('Failed to run tests', error, 'Debug Panel');
    } finally {
      setIsRunningTests(false);
    }
  }, []);

  // Get system info
  const getSystemInfo = useCallback(() => {
    const info = errorLogger.getSystemInfo();
    setSystemInfo(info);
  }, []);

  // Clear logs
  const clearLogs = useCallback(() => {
    errorLogger.clearLogs();
    refreshLogs();
  }, [refreshLogs]);

  // Export logs
  const exportLogs = useCallback(() => {
    const logsData = errorLogger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Auto-refresh logs
  useEffect(() => {
    if (isVisible && activeTab === 'logs') {
      refreshLogs();
      const interval = setInterval(refreshLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible, activeTab, refreshLogs]);

  // Load system info on mount
  useEffect(() => {
    if (isVisible && activeTab === 'system') {
      getSystemInfo();
    }
  }, [isVisible, activeTab, getSystemInfo]);

  if (!isVisible) return null;

  const tabs = [
    { id: 'logs', label: 'Error Logs', icon: '📋' },
    { id: 'tests', label: 'Tests', icon: '🧪' },
    { id: 'system', label: 'System Info', icon: '💻' },
    { id: 'performance', label: 'Performance', icon: '⚡' }
  ];

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return 'text-red-400 bg-red-500/20';
      case 'WARN': return 'text-yellow-400 bg-yellow-500/20';
      case 'INFO': return 'text-blue-400 bg-blue-500/20';
      case 'DEBUG': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTestStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-4 left-4 z-50 w-96 h-[600px] bg-black/90 border border-jarvis-blue/30 rounded-lg backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-jarvis-blue/20">
        <h3 className="font-orbitron text-lg font-semibold text-jarvis-blue">
          🔧 Debug Panel
        </h3>
        <button
          onClick={onToggle}
          className="text-jarvis-blue/50 hover:text-jarvis-blue/80 transition-colors"
          aria-label="Close debug panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-jarvis-blue/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-rajdhani transition-colors',
              activeTab === tab.id
                ? 'text-jarvis-blue bg-jarvis-blue/10 border-b-2 border-jarvis-blue'
                : 'text-jarvis-blue/60 hover:text-jarvis-blue/80'
            )}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              {/* Logs header */}
              <div className="flex items-center justify-between p-3 border-b border-jarvis-blue/10">
                <span className="text-sm font-rajdhani text-jarvis-blue/80">
                  {logs.length} entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={refreshLogs}
                    className="px-2 py-1 text-xs bg-jarvis-blue/20 text-jarvis-blue rounded hover:bg-jarvis-blue/30 transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={clearLogs}
                    className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={exportLogs}
                    className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Logs list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {logs.length === 0 ? (
                  <div className="text-center text-jarvis-blue/50 text-sm py-8">
                    No logs available
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded border border-jarvis-blue/10 bg-jarvis-blue/5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-xs px-2 py-1 rounded', getLogLevelColor(log.level))}>
                          {log.level}
                        </span>
                        <span className="text-xs text-jarvis-blue/50">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-jarvis-blue/80 mb-1">
                        {log.message}
                      </div>
                      {log.context && (
                        <div className="text-xs text-jarvis-blue/60">
                          Context: {log.context}
                        </div>
                      )}
                      {log.details && (
                        <details className="text-xs text-jarvis-blue/50 mt-1">
                          <summary className="cursor-pointer hover:text-jarvis-blue/70">
                            Details
                          </summary>
                          <pre className="mt-1 p-2 bg-black/20 rounded overflow-auto">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              {/* Tests header */}
              <div className="flex items-center justify-between p-3 border-b border-jarvis-blue/10">
                <span className="text-sm font-rajdhani text-jarvis-blue/80">
                  Test Suite
                </span>
                <button
                  onClick={runTests}
                  disabled={isRunningTests}
                  className="px-3 py-1 text-xs bg-jarvis-blue/20 text-jarvis-blue rounded hover:bg-jarvis-blue/30 transition-colors disabled:opacity-50"
                >
                  {isRunningTests ? 'Running...' : 'Run Tests'}
                </button>
              </div>

              {/* Test results */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {testResults.length === 0 ? (
                  <div className="text-center text-jarvis-blue/50 text-sm py-8">
                    {isRunningTests ? 'Running tests...' : 'No test results available. Click "Run Tests" to start.'}
                  </div>
                ) : (
                  testResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 rounded border border-jarvis-blue/10 bg-jarvis-blue/5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-xs px-2 py-1 rounded', getTestStatusColor(result.status))}>
                          {result.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-jarvis-blue/50">
                          {result.duration.toFixed(2)}ms
                        </span>
                      </div>
                      <div className="text-sm text-jarvis-blue/80 mb-1">
                        {result.name}
                      </div>
                      <div className="text-xs text-jarvis-blue/60">
                        Category: {result.category}
                      </div>
                      {result.error && (
                        <details className="text-xs text-red-400 mt-1">
                          <summary className="cursor-pointer hover:text-red-300">
                            Error Details
                          </summary>
                          <pre className="mt-1 p-2 bg-red-500/10 rounded overflow-auto">
                            {result.error.message}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              {/* System header */}
              <div className="flex items-center justify-between p-3 border-b border-jarvis-blue/10">
                <span className="text-sm font-rajdhani text-jarvis-blue/80">
                  System Information
                </span>
                <button
                  onClick={getSystemInfo}
                  className="px-2 py-1 text-xs bg-jarvis-blue/20 text-jarvis-blue rounded hover:bg-jarvis-blue/30 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {/* System info */}
              <div className="flex-1 overflow-y-auto p-3">
                {systemInfo ? (
                  <div className="space-y-3">
                    {Object.entries(systemInfo).map(([key, value]) => (
                      <div key={key} className="p-2 rounded border border-jarvis-blue/10 bg-jarvis-blue/5">
                        <div className="text-sm font-semibold text-jarvis-blue/80 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                        <div className="text-xs text-jarvis-blue/60">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-jarvis-blue/50 text-sm py-8">
                    Click "Refresh" to load system information
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col p-3"
            >
              <div className="text-center text-jarvis-blue/50 text-sm py-8">
                Performance monitoring tools coming soon...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DebugPanel;

