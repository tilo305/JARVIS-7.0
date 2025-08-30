import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/index.js';

const HolographicInput = forwardRef(({
  className,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  variant = 'default',
  ...props
}, ref) => {
  const baseClasses = 'holographic-input w-full px-4 py-2.5 rounded-lg transition-all duration-300 focus:outline-none placeholder:text-jarvis-blue/50';
  
  const variantClasses = {
    default: 'bg-holographic-bg/60 border-jarvis-blue/30 text-jarvis-blue focus:border-jarvis-blue/60 focus:shadow-[0_0_15px_rgba(0,212,255,0.3)]',
    chat: 'bg-holographic-bg/40 border-jarvis-cyan/30 text-jarvis-cyan focus:border-jarvis-cyan/60 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]',
    search: 'bg-holographic-bg/50 border-jarvis-light-blue/30 text-jarvis-light-blue focus:border-jarvis-light-blue/60 focus:shadow-[0_0_15px_rgba(102,229,255,0.3)]'
  };

  const inputClasses = cn(
    baseClasses,
    variantClasses[variant],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  return (
    <div className="relative">
      <motion.input
        ref={ref}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      />
      
      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-lg pointer-events-none">
        <div className="absolute inset-0 rounded-lg border border-transparent bg-gradient-to-r from-jarvis-blue/20 via-transparent to-jarvis-cyan/20 opacity-0 transition-opacity duration-300 focus-within:opacity-100" />
      </div>
      
      {/* Particle effects on focus */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <div className="particle-field opacity-0 transition-opacity duration-300 focus-within:opacity-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${20 + i * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

HolographicInput.displayName = 'HolographicInput';

export default HolographicInput;

