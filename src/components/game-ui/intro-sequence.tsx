"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, Zap, Star, Sparkles } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

interface MatrixDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  char: string;
}

export const GameIntroSequence = () => {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'welcome' | 'complete'>('loading');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [showSkip, setShowSkip] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [matrixDrops, setMatrixDrops] = useState<MatrixDrop[]>([]);
  const [showContinue, setShowContinue] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const fullLoadingText = "INITIALIZING QUANTUM SYSTEMS...";
  
  // Matrix characters
  const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.5 ? '#60a5fa' : '#3b82f6'
      });
    }
    setParticles(initialParticles);
    
    const initialDrops: MatrixDrop[] = [];
    for (let i = 0; i < 20; i++) {
      initialDrops.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
      });
    }
    setMatrixDrops(initialDrops);
  }, []);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y - particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.5,
        opacity: particle.y < -10 ? Math.random() * 0.8 + 0.2 : particle.opacity,
        y: particle.y < -10 ? window.innerHeight + 10 : particle.y - particle.speed
      })));
      
      setMatrixDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        char: Math.random() < 0.1 ? matrixChars[Math.floor(Math.random() * matrixChars.length)] : drop.char,
        y: drop.y > window.innerHeight ? Math.random() * -100 : drop.y + drop.speed
      })));
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Loading sequence
  useEffect(() => {
    if (currentPhase !== 'loading') return;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 3 + 1, 100);
        if (newProgress >= 100) {
          setTimeout(() => setCurrentPhase('welcome'), 500);
        }
        return newProgress;
      });
    }, 150);

    const textTimer = setInterval(() => {
      setLoadingText(prev => {
        if (prev.length < fullLoadingText.length) {
          return fullLoadingText.slice(0, prev.length + 1);
        }
        return prev;
      });
    }, 80);

    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(textTimer);
      clearTimeout(skipTimer);
    };
  }, [currentPhase]);

  // Welcome sequence
  useEffect(() => {
    if (currentPhase !== 'welcome') return;
    
    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, 3000);
    
    return () => clearTimeout(continueTimer);
  }, [currentPhase]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentPhase === 'welcome' && showContinue) {
        setCurrentPhase('complete');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPhase, showContinue]);

  const handleSkip = useCallback(() => {
    setCurrentPhase('complete');
  }, []);

  const handleContinue = useCallback(() => {
    setCurrentPhase('complete');
  }, []);

  if (currentPhase === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Matrix Rain Effect */}
        {matrixDrops.map(drop => (
          <div
            key={drop.id}
            className="absolute text-green-400 font-mono text-sm"
            style={{
              left: drop.x,
              top: drop.y,
              opacity: drop.opacity,
              textShadow: "0 0 10px #10b981"
            }}
          >
            {drop.char}
          </div>
        ))}

        {/* Pulsing Energy Fields */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "conic-gradient(from 0deg at 50% 50%, transparent, rgba(96, 165, 250, 0.1), transparent)",
              "conic-gradient(from 360deg at 50% 50%, transparent, rgba(96, 165, 250, 0.1), transparent)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Skip Button */}
      <AnimatePresence>
        {showSkip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 right-8 z-10"
          >
            <Button
              onClick={handleSkip}
              variant="outline"
              className="bg-black/20 border-blue-400/30 text-blue-100 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Intro
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Phase */}
      <AnimatePresence>
        {currentPhase === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full relative"
          >
            {/* Logo with Particles */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-12"
            >
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center relative"
                animate={{
                  boxShadow: [
                    "0 0 50px rgba(96, 165, 250, 0.5)",
                    "0 0 80px rgba(139, 92, 246, 0.8)",
                    "0 0 50px rgba(96, 165, 250, 0.5)"
                  ],
                  rotate: [0, 360]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
              >
                <Zap className="w-16 h-16 text-white" />
                
                {/* Orbiting particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-white rounded-full"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      rotate: { duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.2 },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      transformOrigin: `${60 + i * 10}px 0px`,
                      marginLeft: '-6px',
                      marginTop: '-6px'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Loading Text with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl font-mono text-blue-100 mb-8 text-center"
            >
              <motion.span
                className="inline-block"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(96, 165, 250, 0.5)",
                    "0 0 20px rgba(96, 165, 250, 0.8)",
                    "0 0 10px rgba(96, 165, 250, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {loadingText}
              </motion.span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="ml-1"
              >
                |
              </motion.span>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="w-96 max-w-[90vw]"
            >
              <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-blue-400/20">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(96, 165, 250, 0.5)",
                      "0 0 30px rgba(139, 92, 246, 0.8)",
                      "0 0 20px rgba(96, 165, 250, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <motion.div
                className="text-center mt-4 text-blue-200 font-mono"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(96, 165, 250, 0.5)",
                    "0 0 15px rgba(96, 165, 250, 0.8)",
                    "0 0 5px rgba(96, 165, 250, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {Math.round(progress)}%
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Phase */}
      <AnimatePresence>
        {currentPhase === 'welcome' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full relative"
          >
            {/* Cinematic Zoom Effect */}
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-center"
            >
              {/* Main Title */}
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="text-7xl md:text-9xl font-display font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 50px rgba(96, 165, 250, 0.5)"
                }}
              >
                WELCOME
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="text-2xl md:text-3xl text-blue-100 mb-12 font-light"
              >
                TO THE FUTURE
              </motion.p>

              {/* Floating Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      delay: Math.random() * 2,
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3
                    }}
                    className="absolute"
                  >
                    {i % 3 === 0 ? (
                      <Star className="w-6 h-6 text-blue-400" />
                    ) : i % 3 === 1 ? (
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    ) : (
                      <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Continue Prompt */}
            <AnimatePresence>
              {showContinue && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute bottom-20"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-center"
                  >
                    <Button
                      onClick={handleContinue}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 mr-3" />
                      Enter Experience
                    </Button>
                    <motion.p
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-blue-200 mt-4 text-sm"
                    >
                      Press any key or click to continue
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound Visualization Bars */}
      <div className="absolute bottom-8 left-8 flex items-end space-x-1">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
            animate={{
              height: [10, Math.random() * 40 + 10, 10]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
};