import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createMessage, createAppError, ERROR_TYPES } from '../types/index.js';

// Export ERROR_TYPES for use in other modules
export { ERROR_TYPES };

// Utility for combining Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate unique message ID
export function generateMessageId() {
  return crypto.randomUUID();
}

// Create message object with proper validation
export function createChatMessage(content, sender, type = 'text') {
  if (!content || typeof content !== 'string') {
    throw new Error('Message content is required and must be a string');
  }
  
  if (!['user', 'assistant'].includes(sender)) {
    throw new Error('Sender must be either "user" or "assistant"');
  }
  
  if (!['text', 'voice'].includes(type)) {
    throw new Error('Type must be either "text" or "voice"');
  }
  
  return createMessage(content.trim(), sender, type);
}

// Error handling utilities
export function createApplicationError(type, message, details = null, recoverable = true) {
  if (!Object.values(ERROR_TYPES).includes(type)) {
    type = ERROR_TYPES.UNKNOWN_ERROR;
  }
  
  return createAppError(type, message, details, recoverable);
}

// Format timestamp for display
export function formatTimestamp(date) {
  if (!(date instanceof Date)) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// Debounce utility for input handling
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if browser supports required features
export function checkBrowserSupport() {
  const hasWebAudio = typeof window !== 'undefined' && 'AudioContext' in window;
  const hasMediaDevices = typeof navigator !== 'undefined' && 'mediaDevices' in navigator;
  const hasCustomElements = typeof window !== 'undefined' && 'customElements' in window;
  
  return {
    webAudio: hasWebAudio,
    mediaDevices: hasMediaDevices,
    customElements: hasCustomElements,
    isSupported: hasWebAudio && hasMediaDevices && hasCustomElements
  };
}

// Validate ElevenLabs agent ID format
export function validateAgentId(agentId) {
  if (!agentId || typeof agentId !== 'string') {
    return false;
  }
  
  // Basic validation for ElevenLabs agent ID format
  const agentIdPattern = /^agent_[a-zA-Z0-9_]+$/;
  return agentIdPattern.test(agentId);
}

// Safe JSON parsing with error handling
export function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

// Local storage utilities with error handling
export function getFromStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? safeJsonParse(item, fallback) : fallback;
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return fallback;
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
    return false;
  }
}

// Animation utilities
export function createAnimationConfig(duration = 300, easing = 'ease-out') {
  return {
    duration,
    easing,
    fill: 'forwards'
  };
}

// Responsive design utilities
export function getScreenSize() {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  
  const width = window.innerWidth;
  
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Performance monitoring utilities
export function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// Accessibility utilities
export function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Voice interaction utilities
export function requestMicrophonePermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.reject(new Error('Microphone access not supported'));
  }
  
  return navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    })
    .catch(error => {
      throw createApplicationError(
        ERROR_TYPES.MICROPHONE_ACCESS_DENIED,
        'Microphone access denied',
        error.message,
        false
      );
    });
}

// Theme utilities
export function applyHolographicTheme() {
  const root = document.documentElement;
  
  // Set CSS custom properties for holographic theme
  root.style.setProperty('--jarvis-blue', '#00D4FF');
  root.style.setProperty('--jarvis-cyan', '#00FFFF');
  root.style.setProperty('--jarvis-dark-blue', '#0066CC');
  root.style.setProperty('--jarvis-light-blue', '#66E5FF');
  root.style.setProperty('--jarvis-gold', '#FFD700');
  root.style.setProperty('--holographic-bg', 'rgba(0, 20, 40, 0.9)');
  root.style.setProperty('--glass-light', 'rgba(0, 212, 255, 0.1)');
  root.style.setProperty('--glass-medium', 'rgba(0, 212, 255, 0.2)');
  root.style.setProperty('--glass-dark', 'rgba(0, 212, 255, 0.3)');
}

// Initialize theme on module load
if (typeof window !== 'undefined') {
  applyHolographicTheme();
}

