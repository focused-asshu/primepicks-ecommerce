"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface Product {
  id: string
  name: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  seller?: string
  inStock: boolean
  isWishlisted?: boolean
}

interface ProductGridProps {
  products?: Product[]
  loading?: boolean
  className?: string
}

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted || false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Add to cart logic here
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Quick view logic here
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -12, 
        rotateX: 5, 
        rotateY: 2,
        scale: 1.02
      }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        type: "spring",
        bounce: 0.3
      }}
      className="group relative perspective"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Card className="bg-card overflow-hidden border-border hover:shadow-2xl transition-all duration-500 interactive-card glass-effect hover-lift">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4/5}>
            <div className="relative w-full h-full bg-muted/20">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 w-full h-full animate-pulse" />
              )}
              <motion.img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                whileHover={{ 
                  scale: 1.1,
                  rotateZ: 1
                }}
                onLoad={() => setImageLoaded(true)}
                style={{
                  filter: isHovered ? 'brightness(1.1) saturate(1.2)' : 'brightness(1) saturate(1)'
                }}
              />
              
              {/* Hover overlay with gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <motion.div 
                  className="absolute inset-0 bg-black/70 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white font-ui font-medium text-sm bg-destructive px-3 py-1 rounded animate-pulse">
                    Out of Stock
                  </span>
                </motion.div>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && product.inStock && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", bounce: 0.5 }}
                >
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground font-ui text-xs animate-pulse-glow">
                    -{discountPercentage}%
                  </Badge>
                </motion.div>
              )}

              {/* Floating action buttons */}
              <motion.div
                className="absolute top-2 right-2 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: isHovered || window.innerWidth < 768 ? 1 : 0.7,
                  x: isHovered || window.innerWidth < 768 ? 0 : 10
                }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 glass-effect hover:bg-white/90 transition-all duration-200 animate-magnetic"
                    onClick={handleWishlistToggle}
                    disabled={!product.inStock}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-all duration-300 ${
                        isWishlisted ? 'fill-destructive text-destructive animate-bounce' : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 glass-effect hover:bg-white/90 transition-all duration-200 animate-magnetic"
                    onClick={handleQuickView}
                    disabled={!product.inStock}
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Animated particles on hover */}
              <AnimatePresence>
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/60 rounded-full"
                        initial={{ 
                          x: Math.random() * 100 + '%',
                          y: '100%',
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{
                          y: '-10%',
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </AspectRatio>
        </div>

        {/* Product Information */}
        <motion.div 
          className="p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.2 }}
        >
          {/* Seller Badge */}
          {product.seller && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.3 }}
            >
              <Badge variant="secondary" className="mb-2 text-xs font-ui animate-fade-in-up">
                by {product.seller}
              </Badge>
            </motion.div>
          )}

          {/* Brand & Product Name */}
          <div className="mb-2">
            <motion.p 
              className="text-xs text-muted-foreground font-ui uppercase tracking-wide mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.4 }}
            >
              {product.brand}
            </motion.p>
            <motion.h3 
              className="font-body font-medium text-sm text-foreground leading-tight line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.5 }}
            >
              {product.name}
            </motion.h3>
          </div>

          {/* Rating */}
          <motion.div 
            className="flex items-center gap-1 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.6 }}
          >
            <div className="flex items-center">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </motion.div>
              <span className="text-xs font-ui ml-1 text-foreground">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-ui">
              ({product.reviewCount})
            </span>
          </motion.div>

          {/* Pricing */}
          <motion.div 
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.7 }}
          >
            <span className="text-lg font-ui font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <motion.span 
                className="text-sm text-muted-foreground line-through font-ui"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.8 }}
              >
                ${product.originalPrice.toFixed(2)}
              </motion.span>
            )}
          </motion.div>

          {/* Add to Cart Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.9 }}
          >
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-ui transition-all duration-300 morphing-button animate-magnetic"
              size="sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="mr-2"
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.div>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

const ProductSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card className="bg-card overflow-hidden border-border animate-pulse">
      <AspectRatio ratio={4/5}>
        <Skeleton className="w-full h-full bg-muted/50 animate-pulse" />
      </AspectRatio>
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16 bg-muted/50" />
        <Skeleton className="h-4 w-full bg-muted/50" />
        <Skeleton className="h-4 w-3/4 bg-muted/50" />
        <Skeleton className="h-3 w-20 bg-muted/50" />
        <Skeleton className="h-4 w-24 bg-muted/50" />
        <Skeleton className="h-8 w-full bg-muted/50" />
      </div>
    </Card>
  </motion.div>
)

export default function ProductGrid({ 
  products = [], 
  loading = false, 
  className = "" 
}: ProductGridProps) {
  if (loading) {
    return (
      <motion.div 
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <ProductSkeleton key={i} index={i} />
        ))}
      </motion.div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
        </motion.div>
        <motion.h3 
          className="text-lg font-display font-semibold text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No products found
        </motion.h3>
        <motion.p 
          className="text-muted-foreground font-body text-sm max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Try adjusting your search or filter criteria to find what you're looking for.
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  )
}