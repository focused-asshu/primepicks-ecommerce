"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Heart,
  Star,
  Search,
  Check,
  X,
  Home,
  ChevronRight,
  Filter,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

// Particle System Component
const ParticleSystem = ({ isActive, count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}
    </div>
  );
};

// 3D Product Card with Magnetic Effect
export const GameProductCard = ({ product, onAddToCart, onWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState(false);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [30, -30]));
  const rotateY = useSpring(useTransform(x, [-100, 100], [-30, 30]));

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setParticles(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParticles(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-md border-2 border-transparent hover:border-primary/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glowing border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={isHovered ? {
              boxShadow: [
                "0 0 20px rgba(96, 165, 250, 0.3)",
                "0 0 40px rgba(96, 165, 250, 0.6)",
                "0 0 20px rgba(96, 165, 250, 0.3)",
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <CardContent className="p-6 relative z-10">
            <div className="aspect-square bg-muted rounded-lg mb-4 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
                animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                🎮
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{product.description}</p>

            <div className="flex items-center justify-between mb-4">
              <motion.span
                className="text-2xl font-bold text-primary"
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              >
                ${product.price}
              </motion.span>
              <div className="flex gap-2">
                <GameButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onWishlist(product.id)}
                  className="hover:text-red-500"
                >
                  <Heart className="w-4 h-4" />
                </GameButton>
                <GameButton
                  size="sm"
                  onClick={() => onAddToCart(product.id)}
                >
                  <ShoppingCart className="w-4 h-4" />
                </GameButton>
              </div>
            </div>

            <GameRating rating={product.rating} />
          </CardContent>

          <ParticleSystem isActive={particles} count={15} />
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Interactive Game Button with Morphing Effects
export const GameButton = ({ 
  children, 
  variant = "default", 
  size = "default", 
  onClick, 
  loading = false, 
  success = false,
  error = false,
  pulse = false,
  className = "",
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const [isPressed, setIsPressed] = useState(false);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  const buttonVariants = {
    idle: { scale: 1, rotateZ: 0 },
    hover: { scale: 1.05, rotateZ: pulse ? [0, 2, -2, 0] : 0 },
    pressed: { scale: 0.95 },
    success: { scale: [1, 1.2, 1], rotateZ: [0, 360, 0] },
    error: { x: [-10, 10, -10, 10, 0] },
  };

  return (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="pressed"
      animate={success ? "success" : error ? "error" : "idle"}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={createRipple}
        disabled={loading}
        className={`relative overflow-hidden morphing-button ${className}`}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {success && <Check className="w-4 h-4" />}
          {error && <X className="w-4 h-4" />}
          {!loading && !success && !error && children}
        </span>

        {/* Ripple Effects */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}

        {/* Pulse effect for CTAs */}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-md bg-primary/20"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

// Animated Shopping Cart
export const GameShoppingCart = ({ itemCount = 0, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [itemCount]);

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={isAnimating ? { 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.2, 1] 
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <ShoppingCart className="w-6 h-6" />
      </motion.div>

      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
        >
          <motion.span
            key={itemCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {itemCount}
          </motion.span>
        </motion.div>
      )}

      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={isAnimating ? {
          scale: [0, 2],
          opacity: [0.5, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

// Animated Wishlist Heart
export const GameWishlist = ({ isLiked, onClick }) => {
  return (
    <motion.div
      className="cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
    >
      <motion.div
        animate={isLiked ? {
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-6 h-6 transition-colors ${
            isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </motion.div>

      {isLiked && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 2, 0] }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-red-500/50" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Animated Price Counter
export const GamePriceCounter = ({ price, originalPrice, discount }) => {
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = price / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= price) {
        setDisplayPrice(price);
        clearInterval(timer);
      } else {
        setDisplayPrice(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [price]);

  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="text-2xl font-bold text-primary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        ${displayPrice.toFixed(2)}
      </motion.span>
      
      {originalPrice && (
        <motion.span
          className="text-sm text-muted-foreground line-through"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          ${originalPrice}
        </motion.span>
      )}
      
      {discount && (
        <motion.div
          className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          -{discount}%
        </motion.div>
      )}
    </div>
  );
};

// Animated Rating Stars
export const GameRating = ({ rating, maxRating = 5, size = "sm" }) => {
  const [animatedRating, setAnimatedRating] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedRating(rating);
    }, 300);
    return () => clearTimeout(timer);
  }, [rating]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            color: i < animatedRating ? "#fbbf24" : "#6b7280"
          }}
          transition={{ 
            delay: i * 0.1,
            type: "spring",
            stiffness: 500
          }}
        >
          <Star
            className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} ${
              i < animatedRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        </motion.div>
      ))}
      <span className="text-sm text-muted-foreground ml-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

// Stock Indicator with Urgency
export const GameStockIndicator = ({ stock, lowStockThreshold = 10 }) => {
  const isLowStock = stock <= lowStockThreshold;
  const isCritical = stock <= 3;

  return (
    <motion.div
      className="flex items-center gap-2"
      animate={isCritical ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0, repeatDelay: 2 }}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${
          isCritical ? "bg-destructive" : isLowStock ? "bg-yellow-500" : "bg-green-500"
        }`}
        animate={isCritical ? { 
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      <span className={`text-sm font-medium ${
        isCritical ? "text-destructive" : isLowStock ? "text-yellow-500" : "text-green-500"
      }`}>
        {isCritical && <AlertTriangle className="w-4 h-4 inline mr-1" />}
        {stock > 0 ? `${stock} in stock` : "Out of stock"}
      </span>

      {isLowStock && stock > 0 && (
        <motion.div
          className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          Hurry!
        </motion.div>
      )}
    </motion.div>
  );
};

// Animated Breadcrumb
export const GameBreadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            {index === 0 && <Home className="w-4 h-4 mr-1" />}
            <motion.span
              className={`cursor-pointer hover:text-primary transition-colors ${
                index === items.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.span>
          </motion.div>
          
          {index < items.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.05 }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Interactive Search Bar
export const GameSearchBar = ({ onSearch, suggestions = [] }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className="relative"
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder="Search for amazing products..."
          className="pl-10 pr-4 py-2 bg-card/50 backdrop-blur-sm border-2 focus:border-primary/50"
        />
        
        <motion.div
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          animate={isFocused ? { rotate: 90, scale: 1.1 } : { rotate: 0, scale: 1 }}
        >
          <Search className="w-4 h-4 text-muted-foreground" />
        </motion.div>

        {/* Glowing border effect */}
        <motion.div
          className="absolute inset-0 rounded-md pointer-events-none"
          animate={isFocused ? {
            boxShadow: "0 0 20px rgba(96, 165, 250, 0.3)"
          } : {}}
        />
      </motion.div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg z-50"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  setQuery(suggestion);
                  onSearch(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Interactive Filter Chips
export const GameFilterChips = ({ filters, activeFilters, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        
        return (
          <motion.div
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={isActive ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-300 ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => onToggle(filter.id)}
            >
              <motion.div
                className="flex items-center gap-2"
                animate={isActive ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Filter className="w-3 h-3" />
                {filter.label}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <X className="w-3 h-3" />
                  </motion.div>
                )}
              </motion.div>
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
};

// Toast Notification System
export const GameToast = ({ message, type = "info", isVisible, onDismiss }) => {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <Sparkles className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-destructive",
    info: "bg-primary",
    warning: "bg-yellow-500",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 min-w-[300px]`}
        >
          <motion.div
            animate={{ rotate: type === "success" ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {icons[type]}
          </motion.div>
          
          <span className="flex-1">{message}</span>
          
          <motion.button
            onClick={onDismiss}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hover:bg-white/20 rounded p-1"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/30"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animated Progress Bar
export const GameProgressBar = ({ progress, label, showParticles = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
      )}
      
      <div className="relative">
        <Progress value={progress} className="h-2" />
        
        {showParticles && progress > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: `${progress}%` }}
            animate={{
              boxShadow: [
                "0 0 10px rgba(96, 165, 250, 0.5)",
                "0 0 20px rgba(96, 165, 250, 0.8)",
                "0 0 10px rgba(96, 165, 250, 0.5)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {progress === 100 && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Complete!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Loading Spinner with Particles
export const GameLoader = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} border-4 border-muted border-t-primary rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className={`absolute inset-0 ${sizes[size]} border-4 border-transparent border-r-accent rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        <ParticleSystem isActive={true} count={8} />
      </div>
      
      {text && (
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Success Checkmark with Celebration
export const GameSuccessCheck = ({ isVisible, message }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            className="bg-card rounded-lg p-8 flex flex-col items-center gap-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360, 0],
              }}
              transition={{ duration: 0.8 }}
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h3
              className="text-xl font-semibold text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {message}
            </motion.h3>

            <ParticleSystem isActive={true} count={30} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};