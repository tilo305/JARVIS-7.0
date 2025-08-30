import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/index.js';
import ChatWindow from '../chat/ChatWindow.jsx';
import ElevenLabsWidget, { ElevenLabsWidgetToggle } from '../voice/ElevenLabsWidget.jsx';
import ironManVideo from '../../assets/IronmanWEBM.webm';

const HeroVideo = ({ className, onLoadingChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  if (hasError) {
    return (
      <div className={cn(
        'w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
        'flex items-center justify-center',
        className
      )}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-jarvis-blue/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-jarvis-blue animate-pulse" />
          </div>
          <p className="text-jarvis-blue/70 font-rajdhani">
            Video unavailable - using fallback background
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10"
          >
            <div className="text-center space-y-4">
              <div className="loading-dots">
                <div className="loading-dot bg-jarvis-blue w-4 h-4" />
                <div className="loading-dot bg-jarvis-blue w-4 h-4" />
                <div className="loading-dot bg-jarvis-blue w-4 h-4" />
              </div>
              <p className="text-jarvis-blue font-rajdhani">Loading JARVIS interface...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video element */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      >
        <source src={ironManVideo} type="video/webm" />
        
        {/* Fallback for browsers that don't support video */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <p className="text-jarvis-blue font-rajdhani">
            Your browser does not support video playback
          </p>
        </div>
      </video>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
      
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-jarvis-blue/10 via-transparent to-jarvis-cyan/10 pointer-events-none" />
    </div>
  );
};

const MainLayout = ({
  children,
  className
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showElevenLabsWidget, setShowElevenLabsWidget] = useState(false);

  // Handle voice state changes from chat window
  const handleVoiceStateChange = (isActive) => {
    setIsVoiceActive(isActive);
  };

  // Handle ElevenLabs widget toggle
  const handleWidgetToggle = () => {
    setShowElevenLabsWidget(!showElevenLabsWidget);
  };

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
        {/* Header area */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-shrink-0 p-6"
        >
          <div className="text-center space-y-2">
            <motion.h1
              className="holographic-text text-4xl md:text-6xl font-bold tracking-wider"
              animate={isVoiceActive ? {
                textShadow: [
                  '0 0 10px rgba(0, 212, 255, 0.5)',
                  '0 0 20px rgba(255, 0, 100, 0.8)',
                  '0 0 10px rgba(0, 212, 255, 0.5)'
                ]
              } : {}}
              transition={{ duration: 1, repeat: isVoiceActive ? Infinity : 0 }}
            >
              JARVIS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-jarvis-blue/70 font-rajdhani text-lg tracking-wide"
            >
              Just A Rather Very Intelligent System
            </motion.p>
          </div>
        </motion.header>

        {/* Main content area */}
        <main className="flex-1 flex items-end justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Chat window */}
            <ChatWindow
              onVoiceStateChange={handleVoiceStateChange}
              className={cn(
                'transition-all duration-300',
                isVoiceActive && 'shadow-red-500/30 shadow-2xl scale-105'
              )}
            />
            
            {/* Voice activity indicator ring */}
            <AnimatePresence>
              {isVoiceActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0.5, 1, 0.5], 
                    scale: [1, 1.05, 1],
                    rotate: [0, 360]
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute -inset-6 rounded-2xl border-2 border-red-400/50 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,0,100,0.1) 0%, transparent 70%)',
                    boxShadow: '0 0 30px rgba(255, 0, 100, 0.5)'
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        {/* Footer area */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex-shrink-0 p-4 text-center"
        >
          <div className="text-xs text-jarvis-blue/50 font-rajdhani space-y-1">
            <p>Powered by ElevenLabs Conversational AI</p>
            <p>Built with React & Tailwind CSS</p>
          </div>
        </motion.footer>
      </div>

      {/* Loading overlay for entire interface */}
      <AnimatePresence>
        {isVideoLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-20 bg-slate-900 flex items-center justify-center"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto rounded-full border-4 border-jarvis-blue/30 border-t-jarvis-blue"
              />
              <div className="space-y-2">
                <motion.h2
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-orbitron text-jarvis-blue"
                >
                  Initializing JARVIS
                </motion.h2>
                <p className="text-jarvis-blue/70 font-rajdhani">
                  Loading interface systems...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ElevenLabs Widget */}
      <AnimatePresence>
        {showElevenLabsWidget && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-4 right-4 z-30 max-w-sm"
          >
            <ElevenLabsWidget
              agentId="agent_7601k23b460aeejb2pvyfcvw6atk"
              onStatusChange={(status) => console.log('Widget status:', status)}
              onConversationStart={() => console.log('Conversation started')}
              onConversationEnd={() => console.log('Conversation ended')}
              onError={(error) => console.error('Widget error:', error)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ElevenLabs Widget Toggle Button */}
      <ElevenLabsWidgetToggle
        onToggle={handleWidgetToggle}
        isVisible={showElevenLabsWidget}
      />

      {/* Ambient particle effects */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'easeInOut'
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

