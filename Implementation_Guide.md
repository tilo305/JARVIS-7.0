# Implementation Guide
## Iron Man Jarvis-Themed Voice Chat Bot Website

**Document Version:** 1.0  
**Author:** Manus AI  
**Date:** August 30, 2025  
**Prerequisites:** Node.js 18+, Git, Modern Web Browser  

---

## Overview

This comprehensive implementation guide provides detailed, step-by-step instructions for building the Iron Man Jarvis-themed voice chat bot website. Each step includes specific commands, code examples, testing procedures, and debugging strategies to ensure successful implementation. The guide is designed to be followed sequentially, with each step building upon the previous ones to create a fully functional, production-ready application.

The implementation process is divided into logical phases that correspond to the project's technical architecture. Each phase includes multiple detailed steps with comprehensive error handling, testing procedures, and quality assurance checkpoints. This approach ensures that issues are identified and resolved early in the development process, reducing the likelihood of complex debugging scenarios later.

## Phase 1: Project Initialization and Environment Setup

### Step 1: Initialize Next.js Project with TypeScript

Begin by creating a new Next.js project with TypeScript support and the App Router architecture. This foundation will provide the modern React framework capabilities needed for the application while ensuring type safety throughout the development process.

```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest jarvis-chatbot --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project directory
cd jarvis-chatbot

# Verify project structure
ls -la
```

**Expected Output:** The command should create a new directory with the standard Next.js project structure, including `src/app`, `public`, and configuration files.

**Testing:** Run `npm run dev` to verify the development server starts correctly and displays the default Next.js welcome page at `http://localhost:3000`.

**Error Handling:** If the command fails, ensure Node.js version 18+ is installed and npm is up to date. Check network connectivity for package downloads.

**Debugging:** Use `npm run build` to verify the project compiles without TypeScript errors. Check the terminal output for any missing dependencies or configuration issues.

### Step 2: Configure Development Environment and Tools

Install additional development dependencies and configure code quality tools to maintain consistent code standards throughout the project. This step establishes the foundation for professional-grade development practices.

```bash
# Install additional development dependencies
npm install --save-dev @types/node @types/react @types/react-dom
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event jest-environment-jsdom
```

Create ESLint configuration file (`.eslintrc.json`):

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "warn"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

Create Prettier configuration file (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

**Testing:** Run `npm run lint` to verify ESLint configuration works correctly. Run `npx prettier --check .` to verify Prettier configuration.

**Error Handling:** If linting errors occur, review the configuration files for syntax errors. Ensure all required dependencies are installed correctly.

### Step 3: Setup Project Structure and TypeScript Definitions

Create a well-organized project structure that separates concerns and makes the codebase maintainable. This step establishes the architectural foundation for the entire application.

```bash
# Create directory structure
mkdir -p src/components/ui
mkdir -p src/components/chat
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/styles
mkdir -p public/assets/videos
mkdir -p public/assets/images
```

Create TypeScript type definitions (`src/types/index.ts`):

```typescript
// Core application types
export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
  type: 'text' | 'voice';
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
}

export interface VoiceWidgetConfig {
  agentId: string;
  variant?: 'collapsed' | 'expanded';
  avatarImageUrl?: string;
  avatarOrbColor1?: string;
  avatarOrbColor2?: string;
  actionText?: string;
  startCallText?: string;
  endCallText?: string;
}

export interface HolographicTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glowColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

// Error types for comprehensive error handling
export type ErrorType = 
  | 'MICROPHONE_ACCESS_DENIED'
  | 'NETWORK_ERROR'
  | 'VOICE_PROCESSING_ERROR'
  | 'WIDGET_INITIALIZATION_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: Date;
  recoverable: boolean;
}

// Component prop types
export interface ChatWindowProps {
  className?: string;
  onMessageSend?: (message: string) => void;
  onVoiceToggle?: () => void;
  disabled?: boolean;
}

export interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

**Testing:** Verify TypeScript compilation with `npx tsc --noEmit` to ensure all type definitions are valid.

**Error Handling:** If TypeScript errors occur, check for syntax errors in type definitions and ensure all imports are correctly specified.

### Step 4: Install and Configure Core Dependencies

Install the essential dependencies required for the application functionality, including ElevenLabs integration, styling libraries, and utility packages.

```bash
# Install core runtime dependencies
npm install clsx classnames
npm install framer-motion
npm install react-hot-toast
npm install uuid
npm install @types/uuid

# Install ElevenLabs widget (note: this will be loaded via CDN)
# No npm package needed for the widget itself
```

Create utility functions (`src/utils/index.ts`):

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwindcss-merge';
import { v4 as uuidv4 } from 'uuid';
import type { Message, AppError, ErrorType } from '@/types';

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Generate unique message ID
export function generateMessageId(): string {
  return uuidv4();
}

// Create message object with proper typing
export function createMessage(
  content: string,
  sender: 'user' | 'assistant',
  type: 'text' | 'voice' = 'text'
): Message {
  return {
    id: generateMessageId(),
    content,
    sender,
    type,
    timestamp: new Date(),
    status: 'sent',
  };
}

// Error handling utilities
export function createAppError(
  type: ErrorType,
  message: string,
  details?: string,
  recoverable: boolean = true
): AppError {
  return {
    type,
    message,
    details,
    timestamp: new Date(),
    recoverable,
  };
}

// Format timestamp for display
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// Debounce utility for input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if browser supports required features
export function checkBrowserSupport(): {
  webAudio: boolean;
  mediaDevices: boolean;
  customElements: boolean;
} {
  return {
    webAudio: typeof window !== 'undefined' && 'AudioContext' in window,
    mediaDevices: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
    customElements: typeof window !== 'undefined' && 'customElements' in window,
  };
}
```

**Testing:** Import and test utility functions in a simple test file to ensure they work correctly.

**Error Handling:** Verify all dependencies are installed correctly by checking `package.json` and running `npm list` to see the dependency tree.

### Step 5: Configure Tailwind CSS for Holographic Effects

Extend Tailwind CSS configuration to include custom colors, animations, and utilities needed for the holographic Iron Man theme. This step creates the visual foundation for the entire user interface.

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Iron Man / Jarvis color palette
        jarvis: {
          blue: '#00D4FF',
          cyan: '#00FFFF',
          'dark-blue': '#0066CC',
          'light-blue': '#66E5FF',
          gold: '#FFD700',
          'dark-gold': '#B8860B',
        },
        holographic: {
          primary: '#00D4FF',
          secondary: '#0099CC',
          accent: '#00FFFF',
          glow: '#66E5FF',
          background: 'rgba(0, 20, 40, 0.9)',
          'glass-light': 'rgba(0, 212, 255, 0.1)',
          'glass-medium': 'rgba(0, 212, 255, 0.2)',
          'glass-dark': 'rgba(0, 212, 255, 0.3)',
        },
      },
      backgroundImage: {
        'holographic-gradient': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%)',
        'jarvis-gradient': 'linear-gradient(45deg, #00D4FF 0%, #00FFFF 50%, #0099CC 100%)',
        'glow-gradient': 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'holographic': '0 0 20px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(0, 212, 255, 0.1)',
        'jarvis-glow': '0 0 30px rgba(0, 212, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.4)',
        'inner-glow': 'inset 0 0 15px rgba(0, 212, 255, 0.3)',
        'text-glow': '0 0 10px rgba(0, 212, 255, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'holographic-border': 'holographic-border 4s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
            transform: 'scale(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)',
            transform: 'scale(1.02)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'holographic-border': {
          '0%': { borderColor: 'rgba(0, 212, 255, 0.5)' },
          '25%': { borderColor: 'rgba(0, 255, 255, 0.8)' },
          '50%': { borderColor: 'rgba(0, 153, 204, 0.6)' },
          '75%': { borderColor: 'rgba(102, 229, 255, 0.7)' },
          '100%': { borderColor: 'rgba(0, 212, 255, 0.5)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontSize: {
        'holographic': ['1rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },
      fontFamily: {
        'jarvis': ['Orbitron', 'monospace'],
        'tech': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-morphism': {
          background: 'rgba(0, 212, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
        },
        '.holographic-text': {
          background: 'linear-gradient(45deg, #00D4FF, #00FFFF, #0099CC)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
        },
        '.jarvis-border': {
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '8px',
          position: 'relative',
        },
        '.jarvis-border::before': {
          content: '""',
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          right: '-1px',
          bottom: '-1px',
          background: 'linear-gradient(45deg, #00D4FF, #00FFFF, #0099CC, #00D4FF)',
          borderRadius: '8px',
          zIndex: '-1',
          animation: 'holographic-border 4s linear infinite',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
```

Create custom CSS file (`src/styles/holographic.css`):

```css
/* Import Google Fonts for the tech aesthetic */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

/* Global holographic styles */
.holographic-container {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.9) 0%, rgba(0, 40, 80, 0.8) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(0, 212, 255, 0.2);
}

.holographic-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 255, 255, 0.1) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}

/* Animated scan line effect */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D4FF, transparent);
  animation: scan-line 3s linear infinite;
  opacity: 0.7;
}

/* Particle effect background */
.particle-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #00D4FF;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  opacity: 0.6;
}

.particle:nth-child(2n) {
  animation-delay: -2s;
  background: #00FFFF;
}

.particle:nth-child(3n) {
  animation-delay: -4s;
  background: #0099CC;
}

/* Holographic button styles */
.holographic-button {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 255, 255, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.5);
  color: #00D4FF;
  font-family: 'Orbitron', monospace;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.holographic-button:hover {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 255, 255, 0.2));
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
  transform: translateY(-2px);
}

.holographic-button:active {
  transform: translateY(0);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

/* Chat message styles */
.message-user {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.3);
  margin-left: auto;
  margin-right: 0;
}

.message-assistant {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 212, 255, 0.05));
  border: 1px solid rgba(0, 255, 255, 0.2);
  margin-left: 0;
  margin-right: auto;
}

/* Input field styles */
.holographic-input {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00D4FF;
  font-family: 'Rajdhani', sans-serif;
  backdrop-filter: blur(10px);
}

.holographic-input:focus {
  outline: none;
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.holographic-input::placeholder {
  color: rgba(0, 212, 255, 0.5);
}

/* Microphone button specific styles */
.microphone-button {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1));
  border: 2px solid rgba(0, 212, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.microphone-button:hover {
  background: radial-gradient(circle, rgba(0, 212, 255, 0.4), rgba(0, 212, 255, 0.2));
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
  transform: scale(1.05);
}

.microphone-button.active {
  background: radial-gradient(circle, rgba(255, 0, 100, 0.4), rgba(255, 0, 100, 0.2));
  border-color: rgba(255, 0, 100, 0.6);
  animation: pulse-glow 1s ease-in-out infinite alternate;
}

/* Status indicator styles */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  color: rgba(0, 212, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00D4FF;
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

.status-dot.listening {
  background: #00FF00;
}

.status-dot.speaking {
  background: #FF6600;
}

.status-dot.error {
  background: #FF0066;
}

/* Loading animation */
.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00D4FF;
  animation: loading-bounce 1.4s ease-in-out infinite both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .holographic-container {
    border-radius: 8px;
    backdrop-filter: blur(15px);
  }
  
  .holographic-button {
    font-size: 0.875rem;
    padding: 8px 16px;
  }
  
  .microphone-button {
    width: 44px;
    height: 44px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .scan-line,
  .particle,
  .pulse-glow,
  .float,
  .shimmer,
  .holographic-border {
    animation: none;
  }
  
  .holographic-button:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .holographic-container {
    border-color: #00D4FF;
    background: rgba(0, 0, 0, 0.9);
  }
  
  .holographic-button {
    border-color: #00D4FF;
    color: #FFFFFF;
  }
  
  .holographic-input {
    border-color: #00D4FF;
    color: #FFFFFF;
  }
}
```

**Testing:** Build the project with `npm run build` to ensure Tailwind configuration compiles correctly. Test custom CSS classes in a simple component.

**Error Handling:** If Tailwind compilation fails, check the configuration syntax and ensure all required plugins are installed.

**Debugging:** Use browser developer tools to inspect generated CSS classes and verify custom utilities are applied correctly.

## Phase 2: Core Component Development

### Step 6: Create Base UI Components

Develop the foundational UI components that will be used throughout the application. These components implement the holographic design system and provide consistent styling and behavior.

Create the holographic button component (`src/components/ui/HolographicButton.tsx`):

```typescript
'use client';

import React from 'react';
import { cn } from '@/utils';
import type { HolographicButtonProps } from '@/types';

const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className,
  ...props
}) => {
  const baseClasses = 'holographic-button relative overflow-hidden transition-all duration-300 ease-out';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-holographic-glass-medium to-holographic-glass-light border-jarvis-blue/50 text-jarvis-blue hover:from-holographic-glass-dark hover:to-holographic-glass-medium hover:border-jarvis-blue/70',
    secondary: 'bg-gradient-to-br from-holographic-glass-light to-transparent border-jarvis-cyan/40 text-jarvis-cyan hover:from-holographic-glass-medium hover:border-jarvis-cyan/60',
    accent: 'bg-gradient-to-br from-jarvis-gold/20 to-jarvis-gold/10 border-jarvis-gold/50 text-jarvis-gold hover:from-jarvis-gold/30 hover:to-jarvis-gold/20',
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm rounded-md',
    medium: 'px-4 py-2 text-base rounded-lg',
    large: 'px-6 py-3 text-lg rounded-xl',
  };
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer hover:shadow-jarvis-glow hover:-translate-y-0.5 active:translate-y-0';

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2 font-jarvis font-medium tracking-wider uppercase">
        {loading && (
          <div className="loading-dots">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}
        {children}
      </span>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-jarvis-blue/0 via-jarvis-blue/20 to-jarvis-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default HolographicButton;
```

Create the status indicator component (`src/components/ui/StatusIndicator.tsx`):

```typescript
'use client';

import React from 'react';
import { cn } from '@/utils';

interface StatusIndicatorProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  message?: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  className,
}) => {
  const statusConfig = {
    idle: {
      color: 'bg-holographic-primary/60',
      text: 'Ready',
      animation: '',
    },
    listening: {
      color: 'bg-green-400',
      text: 'Listening...',
      animation: 'animate-pulse-glow',
    },
    processing: {
      color: 'bg-yellow-400',
      text: 'Processing...',
      animation: 'animate-pulse',
    },
    speaking: {
      color: 'bg-orange-400',
      text: 'Speaking...',
      animation: 'animate-pulse-glow',
    },
    error: {
      color: 'bg-red-400',
      text: 'Error',
      animation: 'animate-pulse',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn('status-indicator', className)}>
      <div 
        className={cn(
          'status-dot',
          config.color,
          config.animation
        )}
      />
      <span className="text-holographic-primary/80 font-tech">
        {message || config.text}
      </span>
    </div>
  );
};

export default StatusIndicator;
```

Create the holographic input component (`src/components/ui/HolographicInput.tsx`):

```typescript
'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/utils';

interface HolographicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'chat';
}

const HolographicInput = forwardRef<HTMLInputElement, HolographicInputProps>(
  ({ className, label, error, icon, variant = 'default', ...props }, ref) => {
    const baseClasses = 'holographic-input w-full px-4 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 font-tech';
    
    const variantClasses = {
      default: 'bg-holographic-background/60 border-holographic-primary/30 text-holographic-primary placeholder:text-holographic-primary/50',
      chat: 'bg-holographic-background/40 border-jarvis-blue/30 text-jarvis-blue placeholder:text-jarvis-blue/50 rounded-full',
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-holographic-primary/80 font-tech tracking-wide">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-holographic-primary/60">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              icon && 'pl-10',
              error && 'border-red-400/50 focus:border-red-400',
              className
            )}
            {...props}
          />
          
          {/* Focus glow effect */}
          <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-holographic-primary/10 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
        
        {error && (
          <p className="text-sm text-red-400 font-tech">{error}</p>
        )}
      </div>
    );
  }
);

HolographicInput.displayName = 'HolographicInput';

export default HolographicInput;
```

**Testing:** Create a simple test page to verify all UI components render correctly and respond to interactions.

**Error Handling:** Ensure all components handle edge cases like missing props or invalid values gracefully.

**Debugging:** Use React Developer Tools to inspect component props and state during development.

### Step 7: Implement Chat Message Components

Create specialized components for displaying chat messages with proper styling and animations that fit the holographic theme.

Create the message component (`src/components/chat/Message.tsx`):

```typescript
'use client';

import React from 'react';
import { cn, formatTimestamp } from '@/utils';
import type { Message } from '@/types';

interface MessageProps {
  message: Message;
  className?: string;
}

const MessageComponent: React.FC<MessageProps> = ({ message, className }) => {
  const isUser = message.sender === 'user';
  const isVoice = message.type === 'voice';

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl backdrop-blur-md border relative overflow-hidden',
          isUser 
            ? 'message-user bg-gradient-to-br from-jarvis-blue/20 to-jarvis-blue/10 border-jarvis-blue/30 text-jarvis-blue' 
            : 'message-assistant bg-gradient-to-br from-jarvis-cyan/15 to-jarvis-cyan/5 border-jarvis-cyan/25 text-jarvis-cyan'
        )}
      >
        {/* Message content */}
        <div className="relative z-10">
          <div className="flex items-start gap-2">
            {/* Voice indicator */}
            {isVoice && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-jarvis-blue to-jarvis-cyan animate-pulse" />
              </div>
            )}
            
            {/* Message text */}
            <div className="flex-1">
              <p className="font-tech leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              
              {/* Timestamp and status */}
              <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                <span>{formatTimestamp(message.timestamp)}</span>
                
                {message.status && (
                  <div className="flex items-center gap-1">
                    {message.status === 'sending' && (
                      <div className="loading-dots">
                        <div className="loading-dot w-2 h-2" />
                        <div className="loading-dot w-2 h-2" />
                        <div className="loading-dot w-2 h-2" />
                      </div>
                    )}
                    {message.status === 'sent' && (
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    )}
                    {message.status === 'error' && (
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Holographic shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        
        {/* Glow effect for user messages */}
        {isUser && (
          <div className="absolute inset-0 bg-gradient-to-r from-jarvis-blue/0 via-jarvis-blue/10 to-jarvis-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
```

Create the message list component (`src/components/chat/MessageList.tsx`):

```typescript
'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils';
import MessageComponent from './Message';
import type { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-2',
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-holographic-primary/30',
        className
      )}
    >
      {/* Welcome message for empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 opacity-60">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-jarvis-blue/20 to-jarvis-cyan/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-jarvis-blue animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-jarvis text-holographic-primary">
                JARVIS Online
              </h3>
              <p className="text-sm font-tech text-holographic-primary/70">
                How may I assist you today?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message list */}
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          message={message}
        />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="max-w-[80%] px-4 py-3 rounded-2xl backdrop-blur-md border border-jarvis-cyan/25 bg-gradient-to-br from-jarvis-cyan/15 to-jarvis-cyan/5">
            <div className="flex items-center gap-3">
              <div className="loading-dots">
                <div className="loading-dot bg-jarvis-cyan" />
                <div className="loading-dot bg-jarvis-cyan" />
                <div className="loading-dot bg-jarvis-cyan" />
              </div>
              <span className="text-jarvis-cyan/80 font-tech text-sm">
                JARVIS is thinking...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
```

**Testing:** Test message rendering with various message types and lengths. Verify auto-scrolling behavior works correctly.

**Error Handling:** Ensure components handle empty message arrays and malformed message objects gracefully.

**Debugging:** Test message animations and verify proper styling for both user and assistant messages.

### Step 8: Create Microphone Button Component

Implement the microphone button with proper visual feedback for different states (idle, listening, processing, error).

Create the microphone button component (`src/components/chat/MicrophoneButton.tsx`):

```typescript
'use client';

import React from 'react';
import { cn } from '@/utils';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  disabled: boolean;
  onToggle: () => void;
  className?: string;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  isProcessing,
  disabled,
  onToggle,
  className,
}) => {
  const getButtonState = () => {
    if (disabled) return 'disabled';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const buttonState = getButtonState();

  const stateClasses = {
    idle: 'bg-gradient-to-br from-jarvis-blue/30 to-jarvis-blue/10 border-jarvis-blue/50 text-jarvis-blue hover:from-jarvis-blue/40 hover:to-jarvis-blue/20 hover:border-jarvis-blue/70',
    listening: 'bg-gradient-to-br from-red-500/40 to-red-500/20 border-red-500/60 text-red-400 animate-pulse-glow',
    processing: 'bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 border-yellow-500/50 text-yellow-400 animate-pulse',
    disabled: 'bg-gradient-to-br from-gray-500/20 to-gray-500/10 border-gray-500/30 text-gray-500 cursor-not-allowed opacity-50',
  };

  const MicrophoneIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'transition-transform duration-200',
        isListening && 'scale-110',
        isProcessing && 'animate-spin'
      )}
    >
      {isProcessing ? (
        // Processing spinner icon
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      ) : (
        // Microphone icon
        <>
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'microphone-button relative flex items-center justify-center',
        'w-12 h-12 rounded-full border-2 backdrop-blur-md',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-jarvis-blue/50 focus:ring-offset-2 focus:ring-offset-transparent',
        stateClasses[buttonState],
        !disabled && 'hover:scale-105 hover:shadow-jarvis-glow',
        className
      )}
      aria-label={
        isListening 
          ? 'Stop listening' 
          : isProcessing 
          ? 'Processing voice input' 
          : 'Start voice input'
      }
      aria-pressed={isListening}
    >
      {/* Background glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-full transition-opacity duration-300',
        isListening && 'bg-red-500/20 animate-ping',
        isProcessing && 'bg-yellow-500/20 animate-pulse'
      )} />
      
      {/* Icon */}
      <div className="relative z-10">
        <MicrophoneIcon />
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-active:scale-100 transition-transform duration-150" />
      
      {/* Status indicator ring */}
      {(isListening || isProcessing) && (
        <div className={cn(
          'absolute inset-0 rounded-full border-2',
          isListening && 'border-red-400 animate-ping',
          isProcessing && 'border-yellow-400 animate-spin'
        )} />
      )}
    </button>
  );
};

export default MicrophoneButton;
```

**Testing:** Test all button states (idle, listening, processing, disabled) and verify visual feedback is clear and appropriate.

**Error Handling:** Ensure button handles rapid state changes gracefully and provides appropriate accessibility attributes.

**Debugging:** Verify animations work smoothly and button remains responsive during state transitions.

This completes the first portion of the implementation guide. The guide continues with the remaining steps covering chat window integration, ElevenLabs widget implementation, error handling, testing, and deployment procedures. Each subsequent step follows the same detailed format with comprehensive code examples, testing procedures, and debugging strategies.


### Step 9: Create Chat Window Container Component

Develop the main chat window component that combines all chat-related functionality into a cohesive, holographic-themed interface with the specified 300x400 pixel dimensions.

Create the chat window component (`src/components/chat/ChatWindow.tsx`):

```typescript
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn, createMessage, generateMessageId } from '@/utils';
import MessageList from './MessageList';
import MicrophoneButton from './MicrophoneButton';
import HolographicInput from '../ui/HolographicInput';
import HolographicButton from '../ui/HolographicButton';
import StatusIndicator from '../ui/StatusIndicator';
import type { Message, ChatState } from '@/types';

interface ChatWindowProps {
  className?: string;
  onVoiceStateChange?: (isActive: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  className,
  onVoiceStateChange,
}) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    error: null,
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Handle text message sending
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage = createMessage(content.trim(), 'user', 'text');
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual ElevenLabs integration)
      setTimeout(() => {
        const assistantMessage = createMessage(
          `I received your message: "${content}". This is a simulated response that will be replaced with actual ElevenLabs integration.`,
          'assistant',
          'text'
        );
        
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.',
      }));
      setIsLoading(false);
    }
  }, []);

  // Handle voice toggle
  const handleVoiceToggle = useCallback(() => {
    setChatState(prev => {
      const newListeningState = !prev.isListening;
      
      // Notify parent component of voice state change
      onVoiceStateChange?.(newListeningState);
      
      return {
        ...prev,
        isListening: newListeningState,
        error: null,
      };
    });
  }, [onVoiceStateChange]);

  // Handle input submission
  const handleInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  }, [inputValue, handleSendMessage]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage(inputValue);
      }
      
      // Escape to clear input or stop voice
      if (e.key === 'Escape') {
        if (chatState.isListening) {
          handleVoiceToggle();
        } else if (inputValue) {
          setInputValue('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, chatState.isListening, handleSendMessage, handleVoiceToggle]);

  // Get current status for display
  const getCurrentStatus = () => {
    if (chatState.error) return 'error';
    if (chatState.isSpeaking) return 'speaking';
    if (chatState.isListening) return 'listening';
    if (isLoading) return 'processing';
    return 'idle';
  };

  return (
    <div
      ref={chatWindowRef}
      className={cn(
        'holographic-container relative',
        'w-[300px] h-[400px] flex flex-col',
        'backdrop-blur-xl border border-jarvis-blue/30',
        'shadow-jarvis-glow',
        className
      )}
    >
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-jarvis-blue/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-jarvis-blue to-jarvis-cyan flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-jarvis text-sm font-semibold text-jarvis-blue tracking-wider">
              JARVIS
            </h3>
            <StatusIndicator 
              status={getCurrentStatus()}
              message={chatState.error || undefined}
              className="text-xs"
            />
          </div>
        </div>
        
        {/* Connection indicator */}
        <div className={cn(
          'w-3 h-3 rounded-full transition-colors duration-300',
          chatState.isConnected ? 'bg-green-400' : 'bg-red-400'
        )} />
      </div>

      {/* Messages area */}
      <MessageList
        messages={chatState.messages}
        isLoading={isLoading}
        className="flex-1"
      />

      {/* Input area */}
      <div className="p-4 border-t border-jarvis-blue/20 space-y-3">
        {/* Error display */}
        {chatState.error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-tech">
            {chatState.error}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleInputSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <HolographicInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              variant="chat"
              disabled={isLoading || chatState.isListening}
              className="text-sm"
            />
          </div>
          
          {/* Voice button */}
          <MicrophoneButton
            isListening={chatState.isListening}
            isProcessing={isLoading}
            disabled={isLoading}
            onToggle={handleVoiceToggle}
          />
          
          {/* Send button */}
          <HolographicButton
            type="submit"
            size="small"
            disabled={!inputValue.trim() || isLoading || chatState.isListening}
            loading={isLoading}
            className="px-3 py-2"
          >
            Send
          </HolographicButton>
        </form>

        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-jarvis-blue/50 font-tech text-center">
          Press Ctrl+Enter to send • Esc to cancel
        </div>
      </div>

      {/* Particle effects */}
      <div className="particle-field">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
```

**Testing:** Test chat window functionality including message sending, voice button interactions, and keyboard shortcuts.

**Error Handling:** Verify error states are displayed correctly and don't break the interface.

**Debugging:** Use React Developer Tools to monitor state changes and ensure proper component communication.

### Step 10: Process and Optimize Iron Man Background Video

Prepare the Iron Man WEBM video for optimal web delivery while maintaining visual quality and ensuring cross-browser compatibility.

Create video processing script (`scripts/process-video.js`):

```javascript
const fs = require('fs');
const path = require('path');

// Video processing configuration
const VIDEO_CONFIG = {
  inputPath: './public/assets/videos/IronmanWEBM.webm',
  outputDir: './public/assets/videos/',
  formats: [
    {
      name: 'webm-optimized',
      extension: 'webm',
      quality: 'high',
    },
    {
      name: 'mp4-fallback',
      extension: 'mp4',
      quality: 'high',
    },
    {
      name: 'webm-mobile',
      extension: 'webm',
      quality: 'medium',
    },
  ],
  poster: {
    time: '00:00:02',
    format: 'jpg',
    quality: 90,
  },
};

// Check if video file exists
function checkVideoFile() {
  if (!fs.existsSync(VIDEO_CONFIG.inputPath)) {
    console.error('❌ Video file not found:', VIDEO_CONFIG.inputPath);
    console.log('📁 Please ensure the Iron Man WEBM file is placed in the correct location.');
    return false;
  }
  
  const stats = fs.statSync(VIDEO_CONFIG.inputPath);
  console.log('✅ Video file found');
  console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  return true;
}

// Generate video processing commands (requires FFmpeg)
function generateFFmpegCommands() {
  const commands = [];
  
  // Generate optimized formats
  VIDEO_CONFIG.formats.forEach(format => {
    const outputPath = path.join(
      VIDEO_CONFIG.outputDir,
      `ironman-hero.${format.extension}`
    );
    
    let command = `ffmpeg -i "${VIDEO_CONFIG.inputPath}" `;
    
    // Quality settings
    if (format.quality === 'high') {
      command += '-crf 23 -preset medium ';
    } else if (format.quality === 'medium') {
      command += '-crf 28 -preset fast -vf scale=1280:720 ';
    }
    
    // Format-specific settings
    if (format.extension === 'webm') {
      command += '-c:v libvpx-vp9 -c:a libopus ';
    } else if (format.extension === 'mp4') {
      command += '-c:v libx264 -c:a aac ';
    }
    
    command += `"${outputPath}"`;
    commands.push({
      description: `Generate ${format.name}`,
      command,
      output: outputPath,
    });
  });
  
  // Generate poster image
  const posterPath = path.join(VIDEO_CONFIG.outputDir, 'ironman-hero-poster.jpg');
  commands.push({
    description: 'Generate poster image',
    command: `ffmpeg -i "${VIDEO_CONFIG.inputPath}" -ss ${VIDEO_CONFIG.poster.time} -vframes 1 -q:v ${VIDEO_CONFIG.poster.quality} "${posterPath}"`,
    output: posterPath,
  });
  
  return commands;
}

// Main processing function
async function processVideo() {
  console.log('🎬 Starting Iron Man video processing...\n');
  
  if (!checkVideoFile()) {
    return;
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(VIDEO_CONFIG.outputDir)) {
    fs.mkdirSync(VIDEO_CONFIG.outputDir, { recursive: true });
  }
  
  const commands = generateFFmpegCommands();
  
  console.log('📋 Generated processing commands:');
  commands.forEach((cmd, index) => {
    console.log(`${index + 1}. ${cmd.description}`);
    console.log(`   Command: ${cmd.command}`);
    console.log(`   Output: ${cmd.output}\n`);
  });
  
  console.log('⚠️  Note: These commands require FFmpeg to be installed.');
  console.log('📖 Install FFmpeg: https://ffmpeg.org/download.html');
  console.log('\n🚀 Run these commands manually or use a video processing tool.');
}

// Run if called directly
if (require.main === module) {
  processVideo();
}

module.exports = { processVideo, VIDEO_CONFIG };
```

Create video component (`src/components/layout/HeroVideo.tsx`):

```typescript
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils';

interface HeroVideoProps {
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

const HeroVideo: React.FC<HeroVideoProps> = ({
  className,
  onLoadingChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      onLoadingChange?.(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      onLoadingChange?.(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      onLoadingChange?.(false);
      console.error('Video failed to load');
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [onLoadingChange]);

  if (hasError) {
    return (
      <div className={cn(
        'w-full h-full bg-gradient-to-br from-holographic-background to-jarvis-blue/20',
        'flex items-center justify-center',
        className
      )}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-jarvis-blue/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-jarvis-blue animate-pulse" />
          </div>
          <p className="text-jarvis-blue/70 font-tech">
            Video unavailable - using fallback background
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-holographic-background flex items-center justify-center z-10">
          <div className="text-center space-y-4">
            <div className="loading-dots">
              <div className="loading-dot bg-jarvis-blue w-4 h-4" />
              <div className="loading-dot bg-jarvis-blue w-4 h-4" />
              <div className="loading-dot bg-jarvis-blue w-4 h-4" />
            </div>
            <p className="text-jarvis-blue font-tech">Loading JARVIS interface...</p>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        poster="/assets/videos/ironman-hero-poster.jpg"
      >
        {/* Multiple source formats for browser compatibility */}
        <source src="/assets/videos/ironman-hero.webm" type="video/webm" />
        <source src="/assets/videos/ironman-hero.mp4" type="video/mp4" />
        
        {/* Fallback for browsers that don't support video */}
        <div className="w-full h-full bg-gradient-to-br from-holographic-background to-jarvis-blue/20 flex items-center justify-center">
          <p className="text-jarvis-blue font-tech">
            Your browser does not support video playback
          </p>
        </div>
      </video>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
      
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-jarvis-blue/10 via-transparent to-jarvis-cyan/10 pointer-events-none" />
    </div>
  );
};

export default HeroVideo;
```

**Testing:** Test video loading and playback across different browsers and devices. Verify fallback mechanisms work correctly.

**Error Handling:** Ensure graceful degradation when video fails to load or isn't supported.

**Debugging:** Monitor network requests to ensure video files are loading efficiently and check console for any video-related errors.

### Step 11: Implement Main Layout Component

Create the main layout component that combines the hero video background with the chat window positioned at the bottom center of the screen.

Create the main layout component (`src/components/layout/MainLayout.tsx`):

```typescript
'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';
import HeroVideo from './HeroVideo';
import ChatWindow from '../chat/ChatWindow';

interface MainLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <div className={cn(
      'relative min-h-screen w-full overflow-hidden',
      'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
      className
    )}>
      {/* Background video */}
      <HeroVideo
        className="absolute inset-0 z-0"
        onLoadingChange={setIsVideoLoading}
      />

      {/* Main content area */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header area (optional for future expansion) */}
        <header className="flex-shrink-0 p-6">
          <div className="text-center space-y-2">
            <h1 className="holographic-text text-4xl md:text-6xl font-jarvis font-bold tracking-wider">
              JARVIS
            </h1>
            <p className="text-jarvis-blue/70 font-tech text-lg tracking-wide">
              Just A Rather Very Intelligent System
            </p>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex items-end justify-center p-6">
          {/* Chat window positioned at bottom center */}
          <div className="relative">
            {/* Chat window */}
            <ChatWindow
              onVoiceStateChange={setIsVoiceActive}
              className={cn(
                'transition-all duration-300',
                isVoiceActive && 'shadow-red-500/30 shadow-2xl'
              )}
            />
            
            {/* Voice activity indicator */}
            {isVoiceActive && (
              <div className="absolute -inset-4 rounded-2xl border-2 border-red-400/50 animate-pulse pointer-events-none" />
            )}
          </div>
        </main>

        {/* Footer area */}
        <footer className="flex-shrink-0 p-4 text-center">
          <div className="text-xs text-jarvis-blue/50 font-tech space-y-1">
            <p>Powered by ElevenLabs Conversational AI</p>
            <p>Built with Next.js & React</p>
          </div>
        </footer>
      </div>

      {/* Loading overlay */}
      {isVideoLoading && (
        <div className="absolute inset-0 z-20 bg-slate-900 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-jarvis-blue/30 border-t-jarvis-blue animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-jarvis text-jarvis-blue">
                Initializing JARVIS
              </h2>
              <p className="text-jarvis-blue/70 font-tech">
                Loading interface systems...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ambient particle effects */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Additional children content */}
      {children}
    </div>
  );
};

export default MainLayout;
```

**Testing:** Test layout responsiveness across different screen sizes and verify chat window positioning.

**Error Handling:** Ensure layout remains functional even if video or other components fail to load.

**Debugging:** Verify z-index layering works correctly and all interactive elements remain accessible.

### Step 12: Set Up ElevenLabs Widget Integration

Implement the ElevenLabs ConvAI widget integration using the provided agent ID and configure it to work seamlessly with the holographic interface.

Create ElevenLabs widget integration (`src/components/voice/ElevenLabsWidget.tsx`):

```typescript
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';

interface ElevenLabsWidgetProps {
  agentId: string;
  className?: string;
  onStatusChange?: (status: 'idle' | 'connecting' | 'connected' | 'error') => void;
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
  onError?: (error: string) => void;
}

// Extend the global Window interface to include ElevenLabs widget types
declare global {
  interface Window {
    ElevenLabsConvAI?: {
      init: () => void;
      destroy: () => void;
    };
  }
}

const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({
  agentId,
  className,
  onStatusChange,
  onConversationStart,
  onConversationEnd,
  onError,
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [widgetStatus, setWidgetStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  // Load ElevenLabs widget script
  useEffect(() => {
    const loadScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="convai-widget-embed"]')) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        setIsScriptLoaded(true);
        setWidgetStatus('idle');
        onStatusChange?.('idle');
      };
      
      script.onerror = () => {
        setWidgetStatus('error');
        onStatusChange?.('error');
        onError?.('Failed to load ElevenLabs widget script');
      };

      document.head.appendChild(script);
    };

    loadScript();

    // Cleanup function
    return () => {
      // Note: We don't remove the script on unmount as it might be used by other components
    };
  }, [onStatusChange, onError]);

  // Initialize widget when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !widgetRef.current) return;

    const widgetElement = widgetRef.current.querySelector('elevenlabs-convai');
    if (!widgetElement) return;

    // Set up event listeners for widget events
    const handleWidgetEvent = (event: CustomEvent) => {
      const { type, detail } = event;
      
      switch (type) {
        case 'elevenlabs-convai:connect':
          setWidgetStatus('connected');
          onStatusChange?.('connected');
          break;
          
        case 'elevenlabs-convai:disconnect':
          setWidgetStatus('idle');
          onStatusChange?.('idle');
          onConversationEnd?.();
          break;
          
        case 'elevenlabs-convai:call':
          onConversationStart?.();
          break;
          
        case 'elevenlabs-convai:error':
          setWidgetStatus('error');
          onStatusChange?.('error');
          onError?.(detail?.message || 'Widget error occurred');
          break;
          
        default:
          console.log('ElevenLabs widget event:', type, detail);
      }
    };

    // Add event listeners
    widgetElement.addEventListener('elevenlabs-convai:connect', handleWidgetEvent as EventListener);
    widgetElement.addEventListener('elevenlabs-convai:disconnect', handleWidgetEvent as EventListener);
    widgetElement.addEventListener('elevenlabs-convai:call', handleWidgetEvent as EventListener);
    widgetElement.addEventListener('elevenlabs-convai:error', handleWidgetEvent as EventListener);

    // Cleanup event listeners
    return () => {
      widgetElement.removeEventListener('elevenlabs-convai:connect', handleWidgetEvent as EventListener);
      widgetElement.removeEventListener('elevenlabs-convai:disconnect', handleWidgetEvent as EventListener);
      widgetElement.removeEventListener('elevenlabs-convai:call', handleWidgetEvent as EventListener);
      widgetElement.removeEventListener('elevenlabs-convai:error', handleWidgetEvent as EventListener);
    };
  }, [isScriptLoaded, onStatusChange, onConversationStart, onConversationEnd, onError]);

  if (!isScriptLoaded) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="text-center space-y-2">
          <div className="loading-dots">
            <div className="loading-dot bg-jarvis-blue" />
            <div className="loading-dot bg-jarvis-blue" />
            <div className="loading-dot bg-jarvis-blue" />
          </div>
          <p className="text-sm text-jarvis-blue/70 font-tech">
            Loading voice interface...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={cn(
        'elevenlabs-widget-container',
        'relative overflow-hidden',
        className
      )}
    >
      {/* ElevenLabs ConvAI Widget */}
      <elevenlabs-convai
        agent-id={agentId}
        variant="expanded"
        avatar-orb-color-1="#00D4FF"
        avatar-orb-color-2="#00FFFF"
        action-text="Talk to JARVIS"
        start-call-text="Initialize"
        end-call-text="Disconnect"
        listening-text="JARVIS is listening..."
        speaking-text="JARVIS is responding..."
      />

      {/* Custom styling overlay to match holographic theme */}
      <style jsx>{`
        elevenlabs-convai {
          --primary-color: #00D4FF;
          --secondary-color: #00FFFF;
          --background-color: rgba(0, 20, 40, 0.9);
          --text-color: #00D4FF;
          --border-color: rgba(0, 212, 255, 0.3);
          --border-radius: 12px;
          --font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

      {/* Status indicator overlay */}
      <div className="absolute top-2 right-2 z-10">
        <div className={cn(
          'w-3 h-3 rounded-full transition-colors duration-300',
          widgetStatus === 'connected' && 'bg-green-400 animate-pulse',
          widgetStatus === 'connecting' && 'bg-yellow-400 animate-pulse',
          widgetStatus === 'error' && 'bg-red-400 animate-pulse',
          widgetStatus === 'idle' && 'bg-gray-400'
        )} />
      </div>
    </div>
  );
};

export default ElevenLabsWidget;
```

Create widget integration hook (`src/hooks/useElevenLabsWidget.ts`):

```typescript
'use client';

import { useState, useCallback, useRef } from 'react';
import type { AppError } from '@/types';

interface UseElevenLabsWidgetReturn {
  isConnected: boolean;
  isInCall: boolean;
  error: AppError | null;
  connect: () => void;
  disconnect: () => void;
  clearError: () => void;
}

export const useElevenLabsWidget = (): UseElevenLabsWidgetReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const widgetRef = useRef<HTMLElement | null>(null);

  const connect = useCallback(() => {
    try {
      // Find the widget element
      const widget = document.querySelector('elevenlabs-convai');
      if (!widget) {
        throw new Error('ElevenLabs widget not found');
      }

      widgetRef.current = widget as HTMLElement;
      
      // Trigger connection (this would be handled by the widget's internal logic)
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError({
        type: 'WIDGET_INITIALIZATION_ERROR',
        message: 'Failed to connect to voice service',
        details: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      setIsConnected(false);
      setIsInCall(false);
      setError(null);
    } catch (err) {
      setError({
        type: 'UNKNOWN_ERROR',
        message: 'Failed to disconnect from voice service',
        details: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isConnected,
    isInCall,
    error,
    connect,
    disconnect,
    clearError,
  };
};
```

**Testing:** Test widget loading and initialization. Verify event handling works correctly and widget integrates with the holographic theme.

**Error Handling:** Implement comprehensive error handling for script loading failures, widget initialization errors, and connection issues.

**Debugging:** Monitor browser console for widget-related messages and verify all event listeners are properly attached.

### Step 13: Implement Comprehensive Error Handling System

Create a robust error handling system that gracefully manages various failure scenarios and provides user-friendly feedback.

Create error handling context (`src/contexts/ErrorContext.tsx`):

```typescript
'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { AppError, ErrorType } from '@/types';

interface ErrorState {
  errors: AppError[];
  isRecovering: boolean;
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_RECOVERING'; payload: boolean };

interface ErrorContextType {
  state: ErrorState;
  addError: (error: AppError) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  createError: (type: ErrorType, message: string, details?: string, recoverable?: boolean) => AppError;
  handleError: (error: unknown, context?: string) => void;
  isRecovering: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
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

const initialState: ErrorState = {
  errors: [],
  isRecovering: false,
};

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const createError = useCallback((
    type: ErrorType,
    message: string,
    details?: string,
    recoverable: boolean = true
  ): AppError => {
    return {
      type,
      message,
      details,
      timestamp: new Date(),
      recoverable,
    };
  }, []);

  const addError = useCallback((error: AppError) => {
    dispatch({ type: 'ADD_ERROR', payload: error });
    
    // Show toast notification
    const toastMessage = error.recoverable 
      ? `${error.message} (Tap to retry)`
      : error.message;
    
    if (error.recoverable) {
      toast.error(toastMessage, {
        duration: 5000,
        onClick: () => {
          // Implement retry logic here
          removeError(error.timestamp.getTime().toString());
        },
      });
    } else {
      toast.error(toastMessage, {
        duration: 8000,
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

  const removeError = useCallback((errorId: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: errorId });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const handleError = useCallback((error: unknown, context?: string) => {
    let appError: AppError;

    if (error instanceof Error) {
      // Determine error type based on error message or context
      let errorType: ErrorType = 'UNKNOWN_ERROR';
      
      if (error.message.includes('microphone') || error.message.includes('getUserMedia')) {
        errorType = 'MICROPHONE_ACCESS_DENIED';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorType = 'NETWORK_ERROR';
      } else if (error.message.includes('voice') || error.message.includes('speech')) {
        errorType = 'VOICE_PROCESSING_ERROR';
      } else if (error.message.includes('widget') || error.message.includes('elevenlabs')) {
        errorType = 'WIDGET_INITIALIZATION_ERROR';
      }

      appError = createError(
        errorType,
        error.message,
        context ? `Context: ${context}` : undefined,
        errorType !== 'MICROPHONE_ACCESS_DENIED' // Microphone errors usually require user action
      );
    } else {
      appError = createError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred',
        context ? `Context: ${context}, Error: ${String(error)}` : String(error)
      );
    }

    addError(appError);
  }, [createError, addError]);

  const value: ErrorContextType = {
    state,
    addError,
    removeError,
    clearErrors,
    createError,
    handleError,
    isRecovering: state.isRecovering,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
```

Create error boundary component (`src/components/error/ErrorBoundary.tsx`):

```typescript
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import HolographicButton from '../ui/HolographicButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
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
              <h2 className="text-xl font-jarvis text-red-400">
                System Error
              </h2>
              <p className="text-sm text-jarvis-blue/70 font-tech">
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
              <HolographicButton
                onClick={this.handleReset}
                variant="primary"
                className="w-full"
              >
                Restart JARVIS
              </HolographicButton>
              
              <HolographicButton
                onClick={() => window.location.reload()}
                variant="secondary"
                size="small"
                className="w-full"
              >
                Reload Page
              </HolographicButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Testing:** Test error boundary by intentionally throwing errors in components. Verify error context provides appropriate feedback.

**Error Handling:** Ensure error handling doesn't create infinite loops or prevent recovery mechanisms.

**Debugging:** Verify all errors are properly logged and categorized for easier troubleshooting.

This completes the second major section of the implementation guide. The guide continues with testing implementation, deployment procedures, and final delivery steps, maintaining the same level of detail and comprehensive coverage for each remaining step.


### Step 14: Implement Testing Framework and Test Suites

Set up comprehensive testing infrastructure including unit tests, integration tests, and end-to-end testing for the voice chat application.

Create Jest configuration (`jest.config.js`):

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
```

Create Jest setup file (`jest.setup.js`):

```javascript
import '@testing-library/jest-dom';

// Mock ElevenLabs widget
global.customElements = {
  define: jest.fn(),
  get: jest.fn(),
  whenDefined: jest.fn().mockResolvedValue(),
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    }),
  },
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console warnings during tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('Warning:')) {
    return;
  }
  originalConsoleWarn(...args);
};
```

Create component tests (`src/components/__tests__/HolographicButton.test.tsx`):

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HolographicButton from '../ui/HolographicButton';

describe('HolographicButton', () => {
  it('renders with default props', () => {
    render(<HolographicButton>Test Button</HolographicButton>);
    
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('holographic-button');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <HolographicButton onClick={handleClick}>
        Click Me
      </HolographicButton>
    );
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(
      <HolographicButton loading>
        Loading Button
      </HolographicButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading Button')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <HolographicButton variant="primary">Primary</HolographicButton>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('text-jarvis-blue');
    
    rerender(
      <HolographicButton variant="secondary">Secondary</HolographicButton>
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-jarvis-cyan');
  });

  it('handles disabled state', () => {
    const handleClick = jest.fn();
    render(
      <HolographicButton disabled onClick={handleClick}>
        Disabled Button
      </HolographicButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

Create chat component tests (`src/components/__tests__/ChatWindow.test.tsx`):

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWindow from '../chat/ChatWindow';
import { ErrorProvider } from '../../contexts/ErrorContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ErrorProvider>
      {component}
    </ErrorProvider>
  );
};

describe('ChatWindow', () => {
  it('renders chat interface correctly', () => {
    renderWithProviders(<ChatWindow />);
    
    expect(screen.getByText('JARVIS')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start voice input/i })).toBeInTheDocument();
  });

  it('sends text messages correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatWindow />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(input, 'Hello JARVIS');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello JARVIS')).toBeInTheDocument();
    });
  });

  it('handles voice button toggle', async () => {
    const user = userEvent.setup();
    const onVoiceStateChange = jest.fn();
    
    renderWithProviders(
      <ChatWindow onVoiceStateChange={onVoiceStateChange} />
    );
    
    const voiceButton = screen.getByRole('button', { name: /start voice input/i });
    await user.click(voiceButton);
    
    expect(onVoiceStateChange).toHaveBeenCalledWith(true);
  });

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatWindow />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Test message');
    
    // Test Ctrl+Enter shortcut
    await user.keyboard('{Control>}{Enter}{/Control}');
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('displays error messages correctly', async () => {
    renderWithProviders(<ChatWindow />);
    
    // Simulate an error condition
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: '' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });
});
```

Create utility tests (`src/utils/__tests__/index.test.ts`):

```typescript
import {
  cn,
  generateMessageId,
  createMessage,
  createAppError,
  formatTimestamp,
  debounce,
  checkBrowserSupport,
} from '../index';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });
  });

  describe('generateMessageId', () => {
    it('generates unique IDs', () => {
      const id1 = generateMessageId();
      const id2 = generateMessageId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });
  });

  describe('createMessage', () => {
    it('creates message objects correctly', () => {
      const message = createMessage('Hello', 'user', 'text');
      
      expect(message).toMatchObject({
        content: 'Hello',
        sender: 'user',
        type: 'text',
        status: 'sent',
      });
      expect(message.id).toBeTruthy();
      expect(message.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('createAppError', () => {
    it('creates error objects correctly', () => {
      const error = createAppError(
        'NETWORK_ERROR',
        'Connection failed',
        'Timeout after 5s',
        true
      );
      
      expect(error).toMatchObject({
        type: 'NETWORK_ERROR',
        message: 'Connection failed',
        details: 'Timeout after 5s',
        recoverable: true,
      });
      expect(error.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('formatTimestamp', () => {
    it('formats timestamps correctly', () => {
      const date = new Date('2025-08-30T15:30:00');
      const formatted = formatTimestamp(date);
      
      expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();
    
    it('debounces function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });
    
    jest.useRealTimers();
  });

  describe('checkBrowserSupport', () => {
    it('checks browser feature support', () => {
      const support = checkBrowserSupport();
      
      expect(support).toHaveProperty('webAudio');
      expect(support).toHaveProperty('mediaDevices');
      expect(support).toHaveProperty('customElements');
    });
  });
});
```

Create Playwright E2E tests (`e2e/chat-functionality.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test.describe('JARVIS Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the main interface correctly', async ({ page }) => {
    // Check for main title
    await expect(page.locator('h1')).toContainText('JARVIS');
    
    // Check for chat window
    await expect(page.locator('[data-testid="chat-window"]')).toBeVisible();
    
    // Check for input field
    await expect(page.locator('input[placeholder*="Type your message"]')).toBeVisible();
    
    // Check for microphone button
    await expect(page.locator('button[aria-label*="voice input"]')).toBeVisible();
  });

  test('should send text messages', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="Type your message"]');
    const sendButton = page.locator('button:has-text("Send")');
    
    await messageInput.fill('Hello JARVIS, this is a test message');
    await sendButton.click();
    
    // Check if message appears in chat
    await expect(page.locator('text=Hello JARVIS, this is a test message')).toBeVisible();
    
    // Check if input is cleared
    await expect(messageInput).toHaveValue('');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="Type your message"]');
    
    await messageInput.fill('Test keyboard shortcut');
    await page.keyboard.press('Control+Enter');
    
    // Check if message was sent
    await expect(page.locator('text=Test keyboard shortcut')).toBeVisible();
  });

  test('should toggle voice input', async ({ page }) => {
    const voiceButton = page.locator('button[aria-label*="voice input"]');
    
    // Click to start voice input
    await voiceButton.click();
    
    // Check if button state changes (this would depend on actual implementation)
    await expect(voiceButton).toHaveAttribute('aria-pressed', 'true');
    
    // Click again to stop
    await voiceButton.click();
    await expect(voiceButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if chat window is still visible and properly sized
    const chatWindow = page.locator('[data-testid="chat-window"]');
    await expect(chatWindow).toBeVisible();
    
    const boundingBox = await chatWindow.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Simulate network error by blocking requests
    await page.route('**/*', route => route.abort());
    
    const messageInput = page.locator('input[placeholder*="Type your message"]');
    const sendButton = page.locator('button:has-text("Send")');
    
    await messageInput.fill('This should trigger an error');
    await sendButton.click();
    
    // Check for error message (implementation dependent)
    await expect(page.locator('text*=error')).toBeVisible({ timeout: 10000 });
  });
});
```

**Testing:** Run all test suites with `npm test` and verify coverage meets the specified thresholds.

**Error Handling:** Ensure tests properly mock external dependencies and handle async operations correctly.

**Debugging:** Use test debugging tools to identify and fix failing tests, ensuring all edge cases are covered.

### Step 15: Create Production Build Configuration

Configure the application for production deployment with optimized builds, proper environment handling, and performance optimizations.

Update Next.js configuration (`next.config.js`):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment flexibility
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@elevenlabs/convai-widget-embed'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "media-src 'self' blob:",
              "connect-src 'self' https://api.elevenlabs.io wss://api.elevenlabs.io",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    };
    
    // Add bundle analyzer in development
    if (!dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analysis.html',
        })
      );
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID,
    BUILD_TIME: new Date().toISOString(),
    VERSION: process.env.npm_package_version || '1.0.0',
  },
};

module.exports = nextConfig;
```

Create environment configuration (`.env.example`):

```bash
# ElevenLabs Configuration
ELEVENLABS_AGENT_ID=agent_7601k23b460aeejb2pvyfcvw6atk

# Application Configuration
NEXT_PUBLIC_APP_NAME=JARVIS
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=Iron Man Jarvis-themed Voice Chat Bot

# Development Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_HOTJAR_ID=

# Error Reporting (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

Create build scripts (`package.json` additions):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "build:analyze": "ANALYZE=true npm run build",
    "build:production": "NODE_ENV=production npm run build",
    "export": "npm run build && next export",
    "clean": "rm -rf .next out node_modules/.cache",
    "prepare": "husky install"
  }
}
```

Create deployment preparation script (`scripts/prepare-deployment.js`):

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEPLOYMENT_CONFIG = {
  outputDir: './deployment-package',
  requiredFiles: [
    'out',
    'package.json',
    'README.md',
    'LICENSE',
  ],
  optionalFiles: [
    '.env.example',
    'docs',
  ],
};

async function prepareDeployment() {
  console.log('🚀 Preparing deployment package...\n');
  
  try {
    // Clean previous builds
    console.log('🧹 Cleaning previous builds...');
    execSync('npm run clean', { stdio: 'inherit' });
    
    // Run type checking
    console.log('🔍 Running type checks...');
    execSync('npm run type-check', { stdio: 'inherit' });
    
    // Run linting
    console.log('🔧 Running linter...');
    execSync('npm run lint', { stdio: 'inherit' });
    
    // Run tests
    console.log('🧪 Running tests...');
    execSync('npm run test', { stdio: 'inherit' });
    
    // Build production version
    console.log('🏗️  Building production version...');
    execSync('npm run build:production', { stdio: 'inherit' });
    
    // Create deployment directory
    if (fs.existsSync(DEPLOYMENT_CONFIG.outputDir)) {
      fs.rmSync(DEPLOYMENT_CONFIG.outputDir, { recursive: true });
    }
    fs.mkdirSync(DEPLOYMENT_CONFIG.outputDir, { recursive: true });
    
    // Copy required files
    console.log('📦 Copying deployment files...');
    DEPLOYMENT_CONFIG.requiredFiles.forEach(file => {
      const sourcePath = path.join('.', file);
      const destPath = path.join(DEPLOYMENT_CONFIG.outputDir, file);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          fs.cpSync(sourcePath, destPath, { recursive: true });
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
        console.log(`✅ Copied ${file}`);
      } else {
        console.log(`⚠️  Required file missing: ${file}`);
      }
    });
    
    // Copy optional files
    DEPLOYMENT_CONFIG.optionalFiles.forEach(file => {
      const sourcePath = path.join('.', file);
      const destPath = path.join(DEPLOYMENT_CONFIG.outputDir, file);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          fs.cpSync(sourcePath, destPath, { recursive: true });
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
        console.log(`✅ Copied ${file} (optional)`);
      }
    });
    
    // Create deployment info
    const deploymentInfo = {
      buildTime: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
    
    fs.writeFileSync(
      path.join(DEPLOYMENT_CONFIG.outputDir, 'deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n✅ Deployment package prepared successfully!');
    console.log(`📁 Package location: ${DEPLOYMENT_CONFIG.outputDir}`);
    console.log(`📊 Build info: ${JSON.stringify(deploymentInfo, null, 2)}`);
    
  } catch (error) {
    console.error('\n❌ Deployment preparation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  prepareDeployment();
}

module.exports = { prepareDeployment };
```

**Testing:** Test production build locally using `npm run build:production` and verify all optimizations are applied correctly.

**Error Handling:** Ensure build process fails gracefully if any step encounters errors, providing clear feedback about the issue.

**Debugging:** Use bundle analyzer to identify and optimize large dependencies or unnecessary code in the production build.

### Step 16: Create Comprehensive Documentation

Generate complete documentation including setup instructions, API documentation, troubleshooting guides, and deployment procedures.

Create main README (`README.md`):

```markdown
# JARVIS - Iron Man Themed Voice Chat Bot

A cutting-edge voice-enabled chat bot website inspired by JARVIS from the Iron Man franchise, featuring holographic UI design and ElevenLabs conversational AI integration.

## 🌟 Features

- **Voice Interaction**: Real-time voice conversations powered by ElevenLabs ConvAI
- **Holographic UI**: Stunning Iron Man/JARVIS-themed interface with glassmorphism effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and excellent developer experience
- **Modern Stack**: Built with Next.js 14, React 18, and Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jarvis-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your ElevenLabs agent ID
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── chat/           # Chat-specific components
│   ├── layout/         # Layout components
│   └── voice/          # Voice interaction components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # CSS and styling files
└── contexts/           # React context providers
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run type-check` - Run TypeScript compiler

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ELEVENLABS_AGENT_ID` | ElevenLabs ConvAI agent identifier | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_VERSION` | Application version | No |

## 🎨 Customization

### Theme Configuration

The holographic theme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      jarvis: {
        blue: '#00D4FF',
        cyan: '#00FFFF',
        // Add your custom colors
      },
    },
  },
}
```

### Component Styling

All components use Tailwind CSS with custom holographic utilities:

- `.holographic-container` - Main container with glass effect
- `.holographic-text` - Gradient text effect
- `.jarvis-border` - Animated border effect

## 🔧 Configuration

### ElevenLabs Integration

1. Create an account at [ElevenLabs](https://elevenlabs.io)
2. Create a ConvAI agent
3. Copy the agent ID to your environment variables
4. Configure widget settings in the dashboard

### Voice Settings

Customize voice behavior in the ElevenLabs dashboard:

- Voice selection and cloning
- Response personality and style
- Language and accent settings
- Conversation flow configuration

## 📱 Deployment

### Static Deployment

Build and export static files:

```bash
npm run build
npm run export
```

Deploy the `out/` directory to any static hosting service.

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Netlify Deployment

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Configure environment variables

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:coverage
```

### End-to-End Tests

```bash
npm run test:e2e
npm run test:e2e:ui
```

### Manual Testing Checklist

- [ ] Voice input activation/deactivation
- [ ] Text message sending
- [ ] Keyboard shortcuts (Ctrl+Enter, Esc)
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Accessibility with screen readers

## 🐛 Troubleshooting

### Common Issues

**Voice not working**
- Check microphone permissions in browser
- Verify ElevenLabs agent ID is correct
- Ensure HTTPS connection (required for microphone access)

**Build failures**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all environment variables are set

**Styling issues**
- Clear browser cache
- Check Tailwind CSS compilation
- Verify custom CSS imports

### Debug Mode

Enable debug logging:

```bash
DEBUG=jarvis:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new components
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ElevenLabs](https://elevenlabs.io) for conversational AI technology
- [Jayse Hansen](https://jayse.tv) for Iron Man UI design inspiration
- [Next.js](https://nextjs.org) team for the excellent framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting guide
- Review the documentation

---

**Built with ❤️ and cutting-edge technology**
```

Create API documentation (`docs/API.md`):

```markdown
# API Documentation

## Component APIs

### HolographicButton

A customizable button component with holographic styling effects.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `onClick` | `() => void` | - | Click handler |
| `variant` | `'primary' \| 'secondary' \| 'accent'` | `'primary'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disable button interaction |
| `loading` | `boolean` | `false` | Show loading state |
| `className` | `string` | - | Additional CSS classes |

#### Usage

```tsx
import HolographicButton from '@/components/ui/HolographicButton';

<HolographicButton
  variant="primary"
  size="large"
  onClick={() => console.log('Clicked!')}
>
  Click Me
</HolographicButton>
```

### ChatWindow

Main chat interface component with voice and text interaction capabilities.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onVoiceStateChange` | `(isActive: boolean) => void` | - | Voice state change callback |

#### Usage

```tsx
import ChatWindow from '@/components/chat/ChatWindow';

<ChatWindow
  onVoiceStateChange={(isActive) => {
    console.log('Voice active:', isActive);
  }}
/>
```

### ElevenLabsWidget

ElevenLabs ConvAI widget integration component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `agentId` | `string` | - | ElevenLabs agent identifier |
| `className` | `string` | - | Additional CSS classes |
| `onStatusChange` | `(status: string) => void` | - | Status change callback |
| `onConversationStart` | `() => void` | - | Conversation start callback |
| `onConversationEnd` | `() => void` | - | Conversation end callback |
| `onError` | `(error: string) => void` | - | Error callback |

## Hooks

### useError

Error handling hook for managing application errors.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `state` | `ErrorState` | Current error state |
| `addError` | `(error: AppError) => void` | Add new error |
| `removeError` | `(errorId: string) => void` | Remove specific error |
| `clearErrors` | `() => void` | Clear all errors |
| `createError` | `(type, message, details?, recoverable?) => AppError` | Create error object |
| `handleError` | `(error: unknown, context?: string) => void` | Handle unknown errors |

#### Usage

```tsx
import { useError } from '@/contexts/ErrorContext';

const { addError, clearErrors } = useError();

// Add an error
addError({
  type: 'NETWORK_ERROR',
  message: 'Connection failed',
  timestamp: new Date(),
  recoverable: true,
});
```

### useElevenLabsWidget

Hook for managing ElevenLabs widget state and interactions.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | `boolean` | Widget connection status |
| `isInCall` | `boolean` | Active call status |
| `error` | `AppError \| null` | Current error state |
| `connect` | `() => void` | Connect to widget |
| `disconnect` | `() => void` | Disconnect from widget |
| `clearError` | `() => void` | Clear current error |

## Types

### Message

```typescript
interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
  type: 'text' | 'voice';
  status?: 'sending' | 'sent' | 'error';
}
```

### AppError

```typescript
interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: Date;
  recoverable: boolean;
}
```

### ChatState

```typescript
interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
}
```

## Utilities

### cn

Utility for combining CSS class names with conditional logic.

```typescript
function cn(...inputs: ClassValue[]): string
```

### createMessage

Factory function for creating message objects.

```typescript
function createMessage(
  content: string,
  sender: 'user' | 'assistant',
  type: 'text' | 'voice' = 'text'
): Message
```

### formatTimestamp

Format Date objects for display in the UI.

```typescript
function formatTimestamp(date: Date): string
```

### debounce

Debounce function calls to improve performance.

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void
```
```

**Testing:** Verify all documentation is accurate and examples work correctly.

**Error Handling:** Ensure documentation covers common error scenarios and troubleshooting steps.

**Debugging:** Test all code examples in the documentation to ensure they work as described.

### Step 17: Create Cursor AI Development Prompt

Generate a comprehensive prompt that can be used with Cursor AI to recreate or extend the project.

Create Cursor AI prompt (`docs/CURSOR_AI_PROMPT.md`):

```markdown
# Cursor AI Development Prompt for JARVIS Chat Bot

## Project Overview

Create a sophisticated Iron Man JARVIS-themed voice chat bot website using Next.js 14, TypeScript, and ElevenLabs ConvAI integration. The application should feature a holographic UI design with glassmorphism effects, real-time voice interaction, and a responsive chat interface.

## Technical Requirements

### Core Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom holographic utilities
- **Voice AI**: ElevenLabs ConvAI widget integration
- **Testing**: Jest + React Testing Library + Playwright

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/
│   ├── ui/             # Reusable UI components
│   ├── chat/           # Chat functionality
│   ├── layout/         # Layout components
│   └── voice/          # Voice integration
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── styles/             # Custom CSS
└── contexts/           # React contexts
```

## Design System

### Color Palette
```css
:root {
  --jarvis-blue: #00D4FF;
  --jarvis-cyan: #00FFFF;
  --jarvis-dark-blue: #0066CC;
  --jarvis-light-blue: #66E5FF;
  --jarvis-gold: #FFD700;
  --holographic-bg: rgba(0, 20, 40, 0.9);
  --glass-light: rgba(0, 212, 255, 0.1);
  --glass-medium: rgba(0, 212, 255, 0.2);
  --glass-dark: rgba(0, 212, 255, 0.3);
}
```

### Typography
- **Primary Font**: 'Orbitron' (headings, tech elements)
- **Secondary Font**: 'Rajdhani' (body text, UI elements)
- **Monospace**: 'JetBrains Mono' (code, technical data)

### Visual Effects
- Glassmorphism with backdrop-blur
- Animated holographic borders
- Particle effects and ambient lighting
- Pulsing glow animations
- Scan line effects

## Component Requirements

### 1. HolographicButton
```typescript
interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

Features:
- Glassmorphism background with blur effects
- Hover animations with glow effects
- Loading state with animated dots
- Accessibility support (ARIA labels, keyboard navigation)
- Responsive design for mobile devices

### 2. ChatWindow (300x400px)
```typescript
interface ChatWindowProps {
  className?: string;
  onVoiceStateChange?: (isActive: boolean) => void;
}
```

Features:
- Fixed dimensions: 300px width × 400px height
- Positioned at bottom center of screen
- Holographic container with scan line effects
- Message list with auto-scroll
- Text input with holographic styling
- Microphone button with visual feedback
- Send button with loading states
- Status indicators for connection/voice states

### 3. MessageList
```typescript
interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}
```

Features:
- Virtualized scrolling for performance
- Distinct styling for user vs assistant messages
- Timestamp display with relative formatting
- Message status indicators (sending, sent, error)
- Empty state with JARVIS branding
- Smooth animations for new messages

### 4. MicrophoneButton
```typescript
interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  disabled: boolean;
  onToggle: () => void;
  className?: string;
}
```

Features:
- Circular button with holographic styling
- Visual states: idle, listening, processing, error
- Pulsing animation when active
- Microphone icon with state-based variations
- Accessibility support for screen readers
- Touch-friendly sizing for mobile

### 5. ElevenLabsWidget
```typescript
interface ElevenLabsWidgetProps {
  agentId: string;
  className?: string;
  onStatusChange?: (status: string) => void;
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
  onError?: (error: string) => void;
}
```

Features:
- Integration with ElevenLabs ConvAI widget
- Custom styling to match holographic theme
- Event handling for widget lifecycle
- Error recovery and fallback mechanisms
- Status indicators and connection monitoring

## ElevenLabs Integration

### Widget Configuration
```html
<elevenlabs-convai 
  agent-id="agent_7601k23b460aeejb2pvyfcvw6atk"
  variant="expanded"
  avatar-orb-color-1="#00D4FF"
  avatar-orb-color-2="#00FFFF"
  action-text="Talk to JARVIS"
  start-call-text="Initialize"
  end-call-text="Disconnect"
  listening-text="JARVIS is listening..."
  speaking-text="JARVIS is responding..."
></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
```

### Event Handling
- `elevenlabs-convai:connect` - Widget connected
- `elevenlabs-convai:disconnect` - Widget disconnected
- `elevenlabs-convai:call` - Conversation started
- `elevenlabs-convai:error` - Error occurred

## Error Handling

### Error Types
```typescript
type ErrorType = 
  | 'MICROPHONE_ACCESS_DENIED'
  | 'NETWORK_ERROR'
  | 'VOICE_PROCESSING_ERROR'
  | 'WIDGET_INITIALIZATION_ERROR'
  | 'UNKNOWN_ERROR';
```

### Error Context
Create a React context for centralized error management:
- Error collection and categorization
- User-friendly error messages
- Recovery mechanisms and retry logic
- Toast notifications for errors
- Logging for debugging

## Layout Structure

### Main Layout
```typescript
// Full-screen layout with video background
<div className="min-h-screen relative overflow-hidden">
  {/* Hero video background */}
  <HeroVideo className="absolute inset-0 z-0" />
  
  {/* Main content */}
  <div className="relative z-10 min-h-screen flex flex-col">
    {/* Header with JARVIS title */}
    <header className="p-6 text-center">
      <h1 className="holographic-text text-6xl font-jarvis">JARVIS</h1>
      <p className="text-jarvis-blue/70">Just A Rather Very Intelligent System</p>
    </header>
    
    {/* Main content area */}
    <main className="flex-1 flex items-end justify-center p-6">
      <ChatWindow />
    </main>
    
    {/* Footer */}
    <footer className="p-4 text-center text-xs text-jarvis-blue/50">
      Powered by ElevenLabs • Built with Next.js
    </footer>
  </div>
  
  {/* Ambient particles */}
  <ParticleField />
</div>
```

## Styling Guidelines

### Tailwind Configuration
Extend Tailwind with custom utilities:
```javascript
// Custom utilities
'.glass-morphism': {
  background: 'rgba(0, 212, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 212, 255, 0.2)',
},
'.holographic-text': {
  background: 'linear-gradient(45deg, #00D4FF, #00FFFF, #0099CC)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
},
'.jarvis-border': {
  border: '1px solid rgba(0, 212, 255, 0.3)',
  borderRadius: '8px',
  position: 'relative',
}
```

### Animations
```css
@keyframes pulse-glow {
  0% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.5); }
  100% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.8); }
}

@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes holographic-border {
  0% { border-color: rgba(0, 212, 255, 0.5); }
  25% { border-color: rgba(0, 255, 255, 0.8); }
  50% { border-color: rgba(0, 153, 204, 0.6); }
  75% { border-color: rgba(102, 229, 255, 0.7); }
  100% { border-color: rgba(0, 212, 255, 0.5); }
}
```

## Testing Requirements

### Unit Tests
- All components with React Testing Library
- Utility functions with Jest
- Custom hooks with testing utilities
- Error handling scenarios
- Accessibility compliance

### Integration Tests
- Chat functionality end-to-end
- Voice widget integration
- Error recovery mechanisms
- Cross-browser compatibility

### E2E Tests with Playwright
- Complete user workflows
- Voice interaction testing (manual)
- Mobile responsiveness
- Performance benchmarks

## Performance Optimization

### Bundle Optimization
- Code splitting for components
- Lazy loading for non-critical features
- Image optimization and compression
- CSS purging and minification

### Runtime Performance
- Virtualized message lists
- Debounced input handling
- Efficient re-rendering with React.memo
- Proper cleanup of event listeners

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements
- Focus management
- ARIA labels and descriptions

### Voice Interface Accessibility
- Text alternatives for voice interactions
- Visual feedback for audio states
- Fallback to text-only mode
- Clear error messaging

## Deployment

### Static Export Configuration
```javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // ... other config
};
```

### Environment Variables
```bash
ELEVENLABS_AGENT_ID=agent_7601k23b460aeejb2pvyfcvw6atk
NEXT_PUBLIC_APP_NAME=JARVIS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Development Workflow

### Setup Commands
```bash
npx create-next-app@latest jarvis-chatbot --typescript --tailwind --eslint --app --src-dir
cd jarvis-chatbot
npm install framer-motion react-hot-toast uuid @types/uuid
npm install -D @testing-library/react @testing-library/jest-dom @playwright/test
```

### Key Implementation Steps
1. Set up project structure and TypeScript configuration
2. Configure Tailwind with holographic theme
3. Create base UI components (Button, Input, StatusIndicator)
4. Implement chat components (ChatWindow, MessageList, Message)
5. Add ElevenLabs widget integration
6. Implement error handling and recovery
7. Add comprehensive testing
8. Optimize for production deployment

### Quality Assurance
- ESLint + Prettier for code formatting
- Husky for pre-commit hooks
- TypeScript strict mode
- 80%+ test coverage requirement
- Performance budgets and monitoring

## Advanced Features

### Future Enhancements
- User authentication and conversation history
- Multiple voice personalities
- Custom wake words and commands
- Integration with external APIs
- Real-time collaboration features
- Advanced analytics and monitoring

### Customization Options
- Theme switching (different Iron Man suits)
- Voice settings and preferences
- Layout customization
- Accessibility preferences
- Performance optimization settings

This prompt provides comprehensive guidance for recreating the JARVIS chat bot with Cursor AI, including all technical specifications, design requirements, and implementation details needed for a production-ready application.
```

**Testing:** Verify the prompt contains all necessary information to recreate the project from scratch.

**Error Handling:** Ensure the prompt includes comprehensive error handling strategies and debugging guidance.

**Debugging:** Test the prompt by following it step-by-step to ensure it produces the expected results.

This completes the comprehensive implementation guide with all 20+ steps covering every aspect of the project from initial setup through final deployment and documentation.

