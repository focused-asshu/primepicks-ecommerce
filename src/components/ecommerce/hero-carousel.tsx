"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Slide {
  id: string
  badge: string
  badgeVariant: 'default' | 'secondary' | 'destructive'
  heading: string
  description: string
  image: string
  imageAlt: string
  primaryCTA: string
  secondaryCTA: string
  backgroundGradient: string
}

const slides: Slide[] = [
  {
    id: '1',
    badge: 'New Arrival',
    badgeVariant: 'default',
    heading: 'Latest Tech Innovations',
    description: 'Discover cutting-edge electronics and gadgets that will transform your daily life. From smart home devices to professional-grade equipment.',
    image: '/api/placeholder/600/400',
    imageAlt: 'Latest tech products showcase',
    primaryCTA: 'Shop Now',
    secondaryCTA: 'Learn More',
    backgroundGradient: 'from-slate-900 via-gray-900 to-slate-800'
  },
  {
    id: '2',
    badge: 'Best Seller',
    badgeVariant: 'secondary',
    heading: 'Fashion Forward',
    description: 'Elevate your style with our curated collection of premium fashion items. Trending designs that blend comfort with sophistication.',
    image: '/api/placeholder/600/400',
    imageAlt: 'Fashion collection showcase',
    primaryCTA: 'Shop Now',
    secondaryCTA: 'Learn More',
    backgroundGradient: 'from-purple-900 via-indigo-900 to-blue-900'
  },
  {
    id: '3',
    badge: 'Limited Time',
    badgeVariant: 'destructive',
    heading: 'Home & Living Sale',
    description: 'Transform your space with premium home essentials at unbeatable prices. Limited-time offers on furniture, decor, and appliances.',
    image: '/api/placeholder/600/400',
    imageAlt: 'Home and living products',
    primaryCTA: 'Shop Now',
    secondaryCTA: 'Learn More',
    backgroundGradient: 'from-emerald-900 via-teal-900 to-cyan-900'
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, nextSlide])

  const handleMouseEnter = () => {
    setIsPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsPlaying(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMousePosition({ x, y })
  }

  return (
    <section 
      className="relative w-full h-[400px] md:h-[400px] lg:h-[400px] overflow-hidden bg-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              rotateY: 0,
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
            }}
            exit={{ opacity: 0, x: -100, rotateY: -15 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1],
              transform: { duration: 0.2 }
            }}
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].backgroundGradient} interactive-card`}
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
            
            <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid h-full items-center gap-8 lg:grid-cols-2">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 60, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="flex flex-col justify-center space-y-6 parallax-element"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.5,
                      type: "spring",
                      bounce: 0.4
                    }}
                  >
                    <Badge 
                      variant={slides[currentSlide].badgeVariant}
                      className="mb-4 text-sm font-ui animate-pulse-glow"
                    >
                      {slides[currentSlide].badge}
                    </Badge>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30, rotateX: 45 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.6,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-gradient animate-glow-pulse"
                  >
                    {slides[currentSlide].heading}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.7,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="text-lg text-gray-200 max-w-lg font-body animate-fade-in-up"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.8,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="flex flex-col sm:flex-row gap-4 stagger-animation"
                  >
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white font-ui transition-all duration-300 hover:scale-105 hover-lift morphing-button animate-magnetic"
                    >
                      {slides[currentSlide].primaryCTA}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white/30 text-white hover:bg-white hover:text-slate-900 font-ui transition-all duration-300 hover:scale-105 glass-effect animate-magnetic"
                    >
                      {slides[currentSlide].secondaryCTA}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotateY: 45, z: -100 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotateY: 0, 
                    z: 0,
                    x: mousePosition.x * 20,
                    y: mousePosition.y * 20
                  }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    x: { duration: 0.3 },
                    y: { duration: 0.3 }
                  }}
                  className="relative hidden lg:block perspective"
                >
                  <div className="relative overflow-hidden rounded-2xl glass-effect shadow-2xl transform-3d hover-lift">
                    <motion.img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].imageAlt}
                      className="h-80 w-full object-cover transition-transform duration-500 hover:scale-110"
                      whileHover={{ 
                        scale: 1.1,
                        rotateY: 5,
                        rotateX: 5
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Floating elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 bg-white/50 rounded-full animate-float"
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute bottom-6 left-6 w-2 h-2 bg-primary rounded-full animate-float"
                      animate={{
                        y: [10, -10, 10],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <motion.div 
          className="absolute inset-y-0 left-4 flex items-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="glass-effect hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg animate-magnetic morphing-button"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
        </motion.div>
        
        <motion.div 
          className="absolute inset-y-0 right-4 flex items-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="glass-effect hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg animate-magnetic morphing-button"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </motion.div>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className="group relative"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary animate-pulse-glow' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}>
                  {index === currentSlide && (
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                x: [0, window.innerWidth || 1200],
                y: [Math.random() * 400, Math.random() * 400 + 100],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }}
              style={{
                left: -10,
                top: Math.random() * 400
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}