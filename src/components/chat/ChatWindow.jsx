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
import ElevenLabsWidget from '../voice/ElevenLabsWidget.jsx';

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
          'max-w-[80%] p-2 rounded-lg backdrop-blur-sm',
          isUser ? 'message-user' : 'message-assistant'
        )}
      >
        <p className="text-xs leading-relaxed">{message.content}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.status && (
            <span className={cn(
              'text-xs px-1 py-0.5 rounded',
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
    <div className={cn('flex-1 overflow-y-auto space-y-2 p-1', className)}>
      <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full text-center"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-jarvis-blue to-jarvis-cyan flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
              </div>
              <p className="text-xs text-jarvis-blue/70 font-rajdhani">
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
          <div className="message-assistant p-2 rounded-lg max-w-[80%]">
            <div className="loading-dots">
              <div className="loading-dot bg-jarvis-cyan" />
              <div className="loading-dot bg-jarvis-cyan" />
              <div className="loading-dot bg-jarvis-cyan" />
            </div>
            <p className="text-xs opacity-70 mt-1">JARVIS is thinking...</p>
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
        'relative flex flex-col',
        'w-[500px] h-[500px]',
        'backdrop-blur-2xl',
        'bg-gradient-to-br from-black/40 via-slate-900/60 to-black/40',
        'border border-jarvis-blue/40',
        'shadow-[0_0_50px_rgba(0,212,255,0.4),inset_0_0_50px_rgba(0,212,255,0.1)]',
        'rounded-2xl overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-jarvis-blue/10 before:to-transparent before:animate-pulse',
        'after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-jarvis-cyan/5 after:to-transparent',
        className
      )}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      data-testid="chat-window"
    >
      {/* Holographic scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jarvis-blue/20 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jarvis-cyan/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Holographic Header */}
      <div className="relative p-3 border-b border-jarvis-blue/30 bg-gradient-to-r from-jarvis-blue/10 via-transparent to-jarvis-cyan/10">
        {/* Holographic scan lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jarvis-blue/5 to-transparent animate-pulse" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Holographic JARVIS Icon */}
            <motion.div 
              className="relative w-8 h-8 rounded-full bg-gradient-to-br from-jarvis-blue/80 to-jarvis-cyan/80 flex items-center justify-center border-2 border-jarvis-blue/50"
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
            >
              <div className="w-4 h-4 rounded-full bg-white/90 animate-pulse" />
              {/* Holographic rings */}
              <div className="absolute inset-0 rounded-full border border-jarvis-blue/30 animate-spin-slow" />
              <div className="absolute inset-1 rounded-full border border-jarvis-cyan/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </motion.div>
            
            <div className="space-y-0.5">
              <h3 className="font-orbitron text-lg font-bold text-jarvis-blue tracking-wider drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]">
                JARVIS
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-jarvis-cyan/80 font-rajdhani uppercase tracking-wider">
                  {getStatusMessage()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Holographic Status Display */}
          <div className="text-right space-y-0.5">
            <div className="text-xs text-jarvis-blue/70 font-orbitron uppercase tracking-wider">
              STATUS: ONLINE
            </div>
            <div className="text-xs text-jarvis-cyan/60 font-rajdhani">
              STARK INDUSTRIES
            </div>
          </div>
          

        </div>
      </div>

      {/* Holographic Messages Area with Technical Readouts */}
      <div className="relative flex-1 flex">
        {/* Left Side - Technical Readouts */}
        <div className="w-1/3 p-2 border-r border-jarvis-blue/20 bg-gradient-to-b from-transparent via-black/10 to-transparent">
          <div className="space-y-2">
            {/* System Status */}
            <div className="space-y-1">
              <div className="text-xs text-jarvis-blue/60 font-orbitron uppercase tracking-wider">SYSTEM STATUS</div>
              <div className="space-y-0.5 text-xs text-jarvis-cyan/80 font-rajdhani">
                <div className="flex justify-between">
                  <span>POWER:</span>
                  <span className="text-green-400">100%</span>
                </div>
                <div className="flex justify-between">
                  <span>SYSTEMS:</span>
                  <span className="text-green-400">NOMINAL</span>
                </div>
                <div className="flex justify-between">
                  <span>AI:</span>
                  <span className="text-green-400">ACTIVE</span>
                </div>
              </div>
            </div>
            
            {/* Holographic Circle */}
            <div className="relative w-12 h-12 mx-auto">
              <div className="w-full h-full rounded-full border-2 border-jarvis-blue/40 bg-gradient-to-br from-jarvis-blue/20 to-jarvis-cyan/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-jarvis-blue font-orbitron">SV.0684</div>
                  <div className="text-xs text-jarvis-cyan font-rajdhani">58 HZS</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border border-jarvis-blue/30 animate-spin-slow" />
              <div className="absolute inset-1 rounded-full border border-jarvis-cyan/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>
        
        {/* Right Side - Messages */}
        <div className="relative flex-1 p-2 bg-gradient-to-b from-transparent via-black/20 to-transparent">
          {/* Holographic grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <MessageList
            messages={chatState.messages}
            isLoading={isLoading}
            className="relative z-10"
          />
          
          {/* Right Side Indicators */}
          <div className="absolute top-2 right-2 space-y-2">
            <div className="w-10 h-10 rounded-full border-2 border-jarvis-blue/40 bg-gradient-to-br from-jarvis-blue/20 to-jarvis-cyan/20 flex flex-col items-center justify-center">
              <div className="text-sm font-bold text-jarvis-blue">85%</div>
              <div className="text-xs text-jarvis-cyan font-rajdhani">NEURAL</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-jarvis-blue/40 bg-gradient-to-br from-jarvis-blue/20 to-jarvis-cyan/20 flex flex-col items-center justify-center">
              <div className="text-sm font-bold text-jarvis-blue">92%</div>
              <div className="text-xs text-jarvis-cyan font-rajdhani">VOICE</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-jarvis-blue/40 bg-gradient-to-br from-jarvis-blue/20 to-jarvis-cyan/20 flex flex-col items-center justify-center">
              <div className="text-sm font-bold text-jarvis-blue">78%</div>
              <div className="text-xs text-jarvis-cyan font-rajdhani">SYNC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Input Area */}
      <div className="relative p-3 border-t border-jarvis-blue/30 bg-gradient-to-r from-jarvis-blue/5 via-transparent to-jarvis-cyan/5 space-y-2">
        {/* Holographic glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-jarvis-blue/10 via-transparent to-transparent" />
        
        {/* Error display */}
        <AnimatePresence>
          {chatState.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-rajdhani backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg" />
              <span className="relative z-10">{chatState.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input form */}
        <form onSubmit={handleInputSubmit} className="relative flex items-end gap-2">
          <div className="flex-1">
            <HolographicInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              variant="chat"
              disabled={isLoading || isListening}
              className="text-sm bg-black/30 border-jarvis-blue/50 focus:border-jarvis-cyan/70"
            />
          </div>
          
          {/* Holographic Voice button */}
          <MicrophoneButton
            isListening={isListening}
            isProcessing={isLoading || isSpeaking}
            disabled={isLoading}
            size="small"
            onToggle={handleVoiceToggle}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            className="relative"
          />
          
          {/* Holographic Send button */}
          <HolographicButton
            type="submit"
            size="small"
            disabled={!inputValue.trim() || isLoading || isListening}
            loading={isLoading}
            className="px-3 py-2 bg-gradient-to-r from-jarvis-blue/80 to-jarvis-cyan/80 hover:from-jarvis-blue hover:to-jarvis-cyan border-jarvis-blue/50"
          >
            Send
          </HolographicButton>
        </form>

        {/* Holographic Status Bar */}
        <div className="relative flex items-center justify-between text-xs text-jarvis-blue/60 font-rajdhani uppercase tracking-wider">
          <span>NATURAL LANGUAGE PROCESSING: ACTIVE</span>
          <span>RESPONSE SYNTHESIS: STANDBY</span>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-jarvis-blue/40 font-rajdhani text-center">
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

      {/* ElevenLabs Widget - Bottom Right */}
      <div className="absolute bottom-2 right-2 z-50">
        <ElevenLabsWidget
          agentId="agent_7601k23b460aeejb2pvyfcvw6atk"
          onStatusChange={handleStatusChange}
          onConversationStart={handleConversationStart}
          onConversationEnd={handleConversationEnd}
          onError={handleWidgetError}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-jarvis-blue/80 to-jarvis-cyan/80 border-2 border-jarvis-blue/50 shadow-[0_0_20px_rgba(0,212,255,0.6)] hover:shadow-[0_0_30px_rgba(0,212,255,0.8)] transition-all duration-300"
        />
      </div>
    </motion.div>
  );
};

export default ChatWindow;

