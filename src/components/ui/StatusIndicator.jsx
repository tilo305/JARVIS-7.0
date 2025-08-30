import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/index.js';

const StatusIndicator = ({
  status = 'idle',
  message,
  className,
  showDot = true,
  showText = true
}) => {
  const statusConfig = {
    idle: {
      color: 'text-jarvis-blue/70',
      dotColor: 'bg-jarvis-blue',
      text: message || 'Ready',
      animation: 'pulse'
    },
    connecting: {
      color: 'text-yellow-400',
      dotColor: 'bg-yellow-400',
      text: message || 'Connecting...',
      animation: 'pulse'
    },
    connected: {
      color: 'text-green-400',
      dotColor: 'bg-green-400',
      text: message || 'Connected',
      animation: 'steady'
    },
    listening: {
      color: 'text-green-300',
      dotColor: 'bg-green-300',
      text: message || 'Listening...',
      animation: 'pulse-fast'
    },
    speaking: {
      color: 'text-orange-400',
      dotColor: 'bg-orange-400',
      text: message || 'Speaking...',
      animation: 'pulse-fast'
    },
    processing: {
      color: 'text-blue-400',
      dotColor: 'bg-blue-400',
      text: message || 'Processing...',
      animation: 'pulse'
    },
    error: {
      color: 'text-red-400',
      dotColor: 'bg-red-400',
      text: message || 'Error',
      animation: 'pulse-slow'
    },
    disconnected: {
      color: 'text-gray-500',
      dotColor: 'bg-gray-500',
      text: message || 'Disconnected',
      animation: 'none'
    }
  };

  const config = statusConfig[status] || statusConfig.idle;

  const animationVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    'pulse-fast': {
      scale: [1, 1.3, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    'pulse-slow': {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    steady: {
      scale: 1,
      opacity: 1
    },
    none: {
      scale: 1,
      opacity: 0.5
    }
  };

  return (
    <div className={cn('status-indicator', className)}>
      <div className="flex items-center gap-2">
        {showDot && (
          <motion.div
            className={cn('status-dot w-2 h-2 rounded-full', config.dotColor)}
            variants={animationVariants}
            animate={config.animation}
            aria-hidden="true"
          />
        )}
        
        {showText && (
          <span className={cn('font-tech text-xs uppercase tracking-wide', config.color)}>
            {config.text}
          </span>
        )}
      </div>
      
      {/* Screen reader announcement */}
      <span className="sr-only">
        Status: {config.text}
      </span>
    </div>
  );
};

export default StatusIndicator;

