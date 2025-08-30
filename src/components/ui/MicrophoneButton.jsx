import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '../../utils/index.js';

const MicrophoneButton = ({
  isListening = false,
  isProcessing = false,
  disabled = false,
  onToggle,
  className,
  size = 'medium'
}) => {
  const sizeConfig = {
    small: {
      button: 'w-10 h-10',
      icon: 'w-4 h-4'
    },
    medium: {
      button: 'w-12 h-12',
      icon: 'w-5 h-5'
    },
    large: {
      button: 'w-16 h-16',
      icon: 'w-6 h-6'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  const getButtonState = () => {
    if (disabled) return 'disabled';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const buttonState = getButtonState();

  const stateClasses = {
    idle: 'microphone-button border-jarvis-blue/50 text-jarvis-blue hover:border-jarvis-blue hover:shadow-[0_0_20px_rgba(0,212,255,0.6)]',
    listening: 'microphone-button active border-red-400/60 text-red-400 bg-red-500/20',
    processing: 'microphone-button border-yellow-400/60 text-yellow-400 bg-yellow-500/20',
    disabled: 'microphone-button opacity-50 cursor-not-allowed pointer-events-none border-gray-500/30 text-gray-500'
  };

  const buttonClasses = cn(
    'relative rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jarvis-blue/50 focus:ring-offset-2 focus:ring-offset-transparent',
    config.button,
    stateClasses[buttonState],
    className
  );

  const handleClick = () => {
    if (!disabled && !isProcessing && onToggle) {
      onToggle();
    }
  };

  const getIcon = () => {
    if (isProcessing) {
      return <Loader2 className={cn(config.icon, 'animate-spin')} />;
    }
    
    if (isListening) {
      return <Mic className={config.icon} />;
    }
    
    return disabled ? <MicOff className={config.icon} /> : <Mic className={config.icon} />;
  };

  const getAriaLabel = () => {
    if (disabled) return 'Microphone disabled';
    if (isProcessing) return 'Processing voice input';
    if (isListening) return 'Stop voice input';
    return 'Start voice input';
  };

  return (
    <motion.button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isProcessing}
      aria-label={getAriaLabel()}
      aria-pressed={isListening}
      whileHover={!disabled && !isProcessing ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isProcessing ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Background pulse effect when listening */}
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      
      {/* Icon */}
      <motion.div
        animate={isListening ? {
          scale: [1, 1.1, 1],
          transition: { duration: 0.8, repeat: Infinity }
        } : {}}
      >
        {getIcon()}
      </motion.div>
      
      {/* Holographic glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 hover:opacity-10" />
      
      {/* Status indicator ring */}
      {(isListening || isProcessing) && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full border-2',
            isListening ? 'border-red-400/50' : 'border-yellow-400/50'
          )}
          animate={{
            rotate: isProcessing ? 360 : 0
          }}
          transition={{
            duration: isProcessing ? 2 : 0,
            repeat: isProcessing ? Infinity : 0,
            ease: 'linear'
          }}
        />
      )}
    </motion.button>
  );
};

export default MicrophoneButton;

