"use client"

import { useState } from "react"
import { motion } from "motion/react"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-card overflow-hidden border-light-border hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4/5}>
            <div className="relative w-full h-full bg-soft-gray">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-ui font-medium text-sm bg-dark-text px-3 py-1 rounded">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && product.inStock && (
                <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground font-ui text-xs">
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 md:opacity-100 md:scale-100'
                }`}
                onClick={handleWishlistToggle}
                disabled={!product.inStock}
              >
                <Heart 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isWishlisted ? 'fill-destructive text-destructive' : 'text-medium-gray'
                  }`} 
                />
              </Button>

              {/* Quick View Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-12 right-2 w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                } hidden md:flex`}
                onClick={handleQuickView}
                disabled={!product.inStock}
              >
                <Eye className="w-4 h-4 text-medium-gray" />
              </Button>
            </div>
          </AspectRatio>
        </div>

        {/* Product Information */}
        <div className="p-4">
          {/* Seller Badge */}
          {product.seller && (
            <Badge variant="secondary" className="mb-2 text-xs font-ui">
              by {product.seller}
            </Badge>
          )}

          {/* Brand & Product Name */}
          <div className="mb-2">
            <p className="text-xs text-medium-gray font-ui uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h3 className="font-body font-medium text-sm text-dark-text leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-ui ml-1 text-dark-text">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-medium-gray font-ui">
              ({product.reviewCount})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-ui font-semibold text-dark-text">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-medium-gray line-through font-ui">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 font-ui transition-all duration-200 ${
              isHovered || window.innerWidth < 768 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 md:opacity-100 md:translate-y-0'
            }`}
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

const ProductSkeleton = () => (
  <Card className="bg-card overflow-hidden border-light-border">
    <AspectRatio ratio={4/5}>
      <Skeleton className="w-full h-full" />
    </AspectRatio>
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
    </div>
  </Card>
)

export default function ProductGrid({ 
  products = [], 
  loading = false, 
  className = "" 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 ${className}`}>
        {Array.from({ length: 12 }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-soft-gray rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-medium-gray" />
        </div>
        <h3 className="text-lg font-display font-semibold text-dark-text mb-2">
          No products found
        </h3>
        <p className="text-medium-gray font-body text-sm max-w-md">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 ${className}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}