import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, createChatMessage, formatTimestamp } from '../../utils/index.js';
import { createChatState } from '../../types/index.js';
import HolographicInput from '../ui/HolographicInput.jsx';
import HolographicButton from '../ui/HolographicButton.jsx';
import MicrophoneButton from '../ui/MicrophoneButton.jsx';
import StatusIndicator from '../ui/StatusIndicator.jsx';
import { useElevenLabsWidget } from '../../hooks/useElevenLabsWidget.js';
import { useError } from '../../contexts/ErrorContext.jsx';

const Message = ({ message, isLast }) => {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] p-3 rounded-lg backdrop-blur-sm',
          isUser ? 'message-user' : 'message-assistant'
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs opacity-70">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.status && (
            <span className={cn(
              'text-xs px-2 py-1 rounded',
              message.status === 'sending' && 'bg-yellow-500/20 text-yellow-400',
              message.status === 'sent' && 'bg-green-500/20 text-green-400',
              message.status === 'error' && 'bg-red-500/20 text-red-400'
            )}>
              {message.status}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MessageList = ({ messages, isLoading, className }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={cn('flex-1 overflow-y-auto space-y-3 p-2', className)}>
      <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full text-center"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-jarvis-blue to-jarvis-cyan flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
              </div>
              <p className="text-sm text-jarvis-blue/70 font-rajdhani">
                Start a conversation with JARVIS
              </p>
            </div>
          </motion.div>
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))
        )}
      </AnimatePresence>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="message-assistant p-3 rounded-lg max-w-[80%]">
            <div className="loading-dots">
              <div className="loading-dot bg-jarvis-cyan" />
              <div className="loading-dot bg-jarvis-cyan" />
              <div className="loading-dot bg-jarvis-cyan" />
            </div>
            <p className="text-xs opacity-70 mt-2">JARVIS is thinking...</p>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

const ChatWindow = ({
  className,
  onVoiceStateChange
}) => {
  const [chatState, setChatState] = useState(createChatState());
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const { handleError } = useError();

  // ElevenLabs widget integration
  const {
    isConnected,
    isInCall,
    isListening,
    isSpeaking,
    error: widgetError,
    widgetStatus,
    toggleVoiceInput,
    handleStatusChange,
    handleConversationStart,
    handleConversationEnd,
    handleWidgetError
  } = useElevenLabsWidget();

  // Update chat state based on widget state
  useEffect(() => {
    setChatState(prev => ({
      ...prev,
      isConnected,
      isListening,
      isSpeaking,
      error: widgetError?.message || null
    }));
  }, [isConnected, isListening, isSpeaking, widgetError]);

  // Notify parent of voice state changes
  useEffect(() => {
    onVoiceStateChange?.(isListening || isSpeaking);
  }, [isListening, isSpeaking, onVoiceStateChange]);

  // Handle text message sending
  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    try {
      const userMessage = createChatMessage(content.trim(), 'user', 'text');
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      setInputValue('');
      setIsLoading(true);

      // Simulate AI response (in real implementation, this would be handled by ElevenLabs)
      setTimeout(() => {
        const responses = [
          "I understand your request. How can I assist you further?",
          "Processing your input. What would you like me to help you with next?",
          "I'm here to help. Please let me know if you need anything else.",
          "Your message has been received. I'm ready for your next command.",
          "Thank you for your input. How may I be of service?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const assistantMessage = createChatMessage(randomResponse, 'assistant', 'text');
        
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
        
        setIsLoading(false);
      }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.',
      }));
      setIsLoading(false);
      handleError(error, 'Message sending');
    }
  }, [handleError]);

  // Handle voice toggle
  const handleVoiceToggle = useCallback(() => {
    try {
      const success = toggleVoiceInput();
      if (!success) {
        setChatState(prev => ({
          ...prev,
          error: 'Failed to toggle voice input. Please try again.',
        }));
      }
    } catch (error) {
      handleError(error, 'Voice toggle');
    }
  }, [toggleVoiceInput, handleError]);

  // Handle input submission
  const handleInputSubmit = useCallback((e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  }, [inputValue, handleSendMessage]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage(inputValue);
      }
      
      // Escape to clear input or stop voice
      if (e.key === 'Escape') {
        if (isListening) {
          handleVoiceToggle();
        } else if (inputValue) {
          setInputValue('');
        }
      }
      
      // Space to toggle voice (when input is not focused)
      if (e.key === ' ' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        handleVoiceToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, isListening, handleSendMessage, handleVoiceToggle]);

  // Get current status for display
  const getCurrentStatus = () => {
    if (chatState.error) return 'error';
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    if (isLoading) return 'processing';
    if (isConnected) return 'connected';
    return 'idle';
  };

  const getStatusMessage = () => {
    if (chatState.error) return chatState.error;
    if (isSpeaking) return 'JARVIS is speaking...';
    if (isListening) return 'Listening for your voice...';
    if (isLoading) return 'Processing your message...';
    if (isConnected) return 'Voice ready';
    return 'Ready';
  };

  return (
    <motion.div
      ref={chatWindowRef}
      className={cn(
        'holographic-container relative',
        'w-[300px] h-[400px] flex flex-col',
        'backdrop-blur-xl border border-jarvis-blue/30',
        'shadow-[0_0_30px_rgba(0,212,255,0.3)]',
        className
      )}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      data-testid="chat-window"
    >
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-jarvis-blue/20">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-jarvis-blue to-jarvis-cyan flex items-center justify-center"
            animate={isListening ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          >
            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          </motion.div>
          <div>
            <h3 className="font-orbitron text-sm font-semibold text-jarvis-blue tracking-wider">
              JARVIS
            </h3>
            <StatusIndicator 
              status={getCurrentStatus()}
              message={getStatusMessage()}
              className="text-xs"
            />
          </div>
        </div>
        
        {/* Connection indicator */}
        <motion.div 
          className={cn(
            'w-3 h-3 rounded-full transition-colors duration-300',
            isConnected ? 'bg-green-400' : 'bg-red-400'
          )}
          animate={isConnected ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
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
        <AnimatePresence>
          {chatState.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-rajdhani"
            >
              {chatState.error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input form */}
        <form onSubmit={handleInputSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <HolographicInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              variant="chat"
              disabled={isLoading || isListening}
              className="text-sm"
            />
          </div>
          
          {/* Voice button */}
          <MicrophoneButton
            isListening={isListening}
            isProcessing={isLoading || isSpeaking}
            disabled={isLoading}
            onToggle={handleVoiceToggle}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          />
          
          {/* Send button */}
          <HolographicButton
            type="submit"
            size="small"
            disabled={!inputValue.trim() || isLoading || isListening}
            loading={isLoading}
            className="px-3 py-2"
          >
            Send
          </HolographicButton>
        </form>

        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-jarvis-blue/50 font-rajdhani text-center">
          Ctrl+Enter to send • Esc to cancel • Space to toggle voice
        </div>
      </div>

      {/* Particle effects */}
      <div className="particle-field absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
            animate={isListening ? {
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Voice activity indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-2 rounded-2xl border-2 border-red-400/50 pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(255, 0, 100, 0.5)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWindow;

