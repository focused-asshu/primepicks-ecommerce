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
    backgroundGradient: 'from-blue-50 to-indigo-100'
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
    backgroundGradient: 'from-purple-50 to-pink-100'
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
    backgroundGradient: 'from-emerald-50 to-teal-100'
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

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

  return (
    <section 
      className="relative w-full h-[400px] md:h-[400px] lg:h-[400px] overflow-hidden bg-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].backgroundGradient}`}
          >
            <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
              <div className="grid h-full items-center gap-8 lg:grid-cols-2">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col justify-center space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Badge 
                      variant={slides[currentSlide].badgeVariant}
                      className="mb-4 text-sm font-ui"
                    >
                      {slides[currentSlide].badge}
                    </Badge>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-3xl font-display font-bold tracking-tight text-dark-text sm:text-4xl lg:text-5xl"
                  >
                    {slides[currentSlide].heading}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-lg text-medium-gray max-w-lg font-body"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button 
                      size="lg"
                      className="bg-success-green hover:bg-success-green/90 text-white font-ui transition-all duration-200 hover:scale-105"
                    >
                      {slides[currentSlide].primaryCTA}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white font-ui transition-all duration-200 hover:scale-105"
                    >
                      {slides[currentSlide].secondaryCTA}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].imageAlt}
                      className="h-80 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group relative"
              >
                <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary-blue' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}>
                  {index === currentSlide && (
                    <motion.div
                      className="h-full bg-accent-blue rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}