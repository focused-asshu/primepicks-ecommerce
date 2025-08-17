"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

type CursorType = 'default' | 'button' | 'text' | 'grab' | 'zoom' | 'link';

export const GameCursor = () => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [magneticTarget, setMagneticTarget] = useState<{ x: number; y: number } | null>(null);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Smooth cursor movement with spring animation
  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  // Cursor size and color transformations
  const cursorSize = useTransform(cursorX, () => {
    switch (cursorType) {
      case 'button': return 60;
      case 'text': return 20;
      case 'grab': return 50;
      case 'zoom': return 80;
      case 'link': return 40;
      default: return 30;
    }
  });

  const cursorColor = useTransform(cursorX, () => {
    switch (cursorType) {
      case 'button': return '#60a5fa';
      case 'text': return '#34d399';
      case 'grab': return '#fbbf24';
      case 'zoom': return '#3b82f6';
      case 'link': return '#f87171';
      default: return '#60a5fa';
    }
  });

  // Debounced hover detection
  const debounceTimer = useRef<NodeJS.Timeout>();
  const detectHoverTarget = useCallback((element: Element): CursorType => {
    const tagName = element.tagName.toLowerCase();
    const classList = element.classList;
    const role = element.getAttribute('role');

    if (tagName === 'button' || role === 'button' || classList.contains('btn')) {
      return 'button';
    }
    if (tagName === 'input' || tagName === 'textarea' || element.getAttribute('contenteditable')) {
      return 'text';
    }
    if (tagName === 'a' || role === 'link') {
      return 'link';
    }
    if (classList.contains('cart-item') || classList.contains('draggable')) {
      return 'grab';
    }
    if (classList.contains('product-image') || classList.contains('zoomable')) {
      return 'zoom';
    }
    
    // Check parent elements
    const parent = element.parentElement;
    if (parent && parent !== document.body) {
      return detectHoverTarget(parent);
    }
    
    return 'default';
  }, []);

  // Magnetic effect calculation
  const calculateMagneticEffect = useCallback((element: Element, mouseX: number, mouseY: number) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
    
    if (distance < 100) {
      const strength = Math.max(0, 1 - distance / 100);
      return {
        x: centerX + (mouseX - centerX) * strength * 0.3,
        y: centerY + (mouseY - centerY) * strength * 0.3
      };
    }
    return null;
  }, []);

  // Particle system
  const createParticles = useCallback((x: number, y: number, count: number = 8) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 3;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        size: 2 + Math.random() * 4,
        color: `hsl(${200 + Math.random() * 60}, 80%, 60%)`
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Update particles
  const updateParticles = useCallback(() => {
    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 0.02,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98
      }))
      .filter(particle => particle.life > 0)
    );
  }, []);

  // Create ripple effect
  const createRipple = useCallback((x: number, y: number) => {
    const newRipple: RippleEffect = {
      id: rippleIdRef.current++,
      x,
      y,
      timestamp: Date.now()
    };
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    
    setCursorPos({ x, y });
    
    // Clear previous debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Debounced hover detection
    debounceTimer.current = setTimeout(() => {
      const element = document.elementFromPoint(x, y);
      if (element) {
        const newType = detectHoverTarget(element);
        setCursorType(newType);
        
        // Calculate magnetic effect for interactive elements
        if (newType !== 'default') {
          const magnetic = calculateMagneticEffect(element, x, y);
          setMagneticTarget(magnetic);
        } else {
          setMagneticTarget(null);
        }
      }
    }, 10);

    // Update spring values with magnetic effect
    const targetX = magneticTarget ? magneticTarget.x : x;
    const targetY = magneticTarget ? magneticTarget.y : y;
    
    cursorX.set(targetX);
    cursorY.set(targetY);

    // Create trail particles occasionally
    if (Math.random() < 0.3) {
      createParticles(x, y, 1);
    }
  }, [cursorX, cursorY, detectHoverTarget, calculateMagneticEffect, magneticTarget, createParticles]);

  // Mouse click handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    createRipple(e.clientX, e.clientY);
    createParticles(e.clientX, e.clientY, 12);
  }, [createRipple, createParticles]);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    updateParticles();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  // Setup event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Restore default cursor
      document.body.style.cursor = 'auto';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, animate]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          className="relative rounded-full border-2 border-white/30 backdrop-blur-sm"
          style={{
            width: cursorSize,
            height: cursorSize,
            backgroundColor: cursorColor,
            boxShadow: `0 0 20px ${cursorColor.get()}40, 0 0 40px ${cursorColor.get()}20`
          }}
          animate={{
            scale: isClicking ? 0.8 : 1,
            opacity: cursorType === 'default' ? 0.8 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {/* Cursor Icon/Content based on type */}
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
            {cursorType === 'button' && '✨'}
            {cursorType === 'text' && '|'}
            {cursorType === 'grab' && '✋'}
            {cursorType === 'zoom' && '🔍'}
            {cursorType === 'link' && '→'}
          </div>
          
          {/* Pulsing ring for interactive elements */}
          {cursorType !== 'default' && (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/50"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Cursor Trail */}
      <motion.div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          className="w-4 h-4 rounded-full"
          style={{
            background: `linear-gradient(45deg, ${cursorColor.get()}60, ${cursorColor.get()}20)`,
            filter: 'blur(2px)'
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        />
      </motion.div>

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(0.5px)'
          }}
          animate={{
            opacity: particle.life,
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none rounded-full border-2"
          style={{
            left: ripple.x,
            top: ripple.y,
            borderColor: cursorColor.get(),
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            width: [0, 200],
            height: [0, 200],
            opacity: [0.8, 0],
            borderWidth: [2, 0]
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      ))}
    </div>
  );
};