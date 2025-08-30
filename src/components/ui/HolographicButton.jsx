import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/index.js';
import { validateHolographicButtonProps } from '../../types/index.js';

const HolographicButton = (props) => {
  const {
    children,
    onClick,
    variant,
    size,
    disabled,
    loading,
    className
  } = validateHolographicButtonProps(props);

  const baseClasses = 'holographic-button relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jarvis-blue/50 focus:ring-offset-2 focus:ring-offset-transparent';
  
  const variantClasses = {
    primary: 'text-jarvis-blue border-jarvis-blue/50 hover:border-jarvis-blue hover:shadow-jarvis-blue/60',
    secondary: 'text-jarvis-cyan border-jarvis-cyan/50 hover:border-jarvis-cyan hover:shadow-jarvis-cyan/60',
    accent: 'text-jarvis-gold border-jarvis-gold/50 hover:border-jarvis-gold hover:shadow-jarvis-gold/60'
  };
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const handleClick = (e) => {
    if (!disabled && !loading) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98, y: 0 } : {}}
      transition={{ duration: 0.2 }}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <div className="loading-dots" aria-label="Loading">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}
        {children}
      </span>
      
      {/* Scan line effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="scan-line opacity-50" />
        </div>
      )}
    </motion.button>
  );
};

export default HolographicButton;

