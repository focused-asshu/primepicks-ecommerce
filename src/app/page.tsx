"use client"

import { useState, useEffect } from 'react'
import { GameCursor } from '@/components/game-ui/cursor-effects'
import { GameIntroSequence } from '@/components/game-ui/intro-sequence'
import ECommerceNavbar from '@/components/ecommerce/ecommerce-navbar'
import HeroCarousel from '@/components/ecommerce/hero-carousel'
import ProductGrid from '@/components/ecommerce/product-grid'
import FilterSidebar from '@/components/ecommerce/filter-sidebar'
import CheckoutFlow from '@/components/ecommerce/checkout-flow'
import SellerDashboard from '@/components/ecommerce/seller-dashboard'

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

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  brands: string[]
  ratings: string[]
  sellerType: string[]
  condition: string[]
  shipping: string[]
  features: { [key: string]: string[] }
}

export default function ECommercePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [currentView, setCurrentView] = useState<'browse' | 'checkout' | 'seller'>('browse')
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      quantity: 2,
      image: '/api/placeholder/100/100',
      variant: 'Black'
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 199.99,
      quantity: 1,
      image: '/api/placeholder/100/100',
      variant: 'Silver'
    }
  ])
  const [wishlistCount, setWishlistCount] = useState(3)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName] = useState('John Doe')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones with Active Noise Cancellation',
      brand: 'TechSound',
      image: '/api/placeholder/300/400',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviewCount: 1247,
      seller: 'TechSound Official',
      inStock: true,
      isWishlisted: false
    },
    {
      id: '2',
      name: 'Smart Fitness Watch with Heart Rate Monitor',
      brand: 'FitTrack',
      image: '/api/placeholder/300/400',
      price: 199.99,
      rating: 4.3,
      reviewCount: 892,
      seller: 'FitTrack Store',
      inStock: true,
      isWishlisted: true
    },
    {
      id: '3',
      name: 'Portable Bluetooth Speaker - Waterproof',
      brand: 'SoundWave',
      image: '/api/placeholder/300/400',
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.7,
      reviewCount: 2156,
      seller: 'SoundWave Direct',
      inStock: true,
      isWishlisted: false
    },
    {
      id: '4',
      name: 'USB-C Fast Charging Cable 6ft',
      brand: 'ChargeMax',
      image: '/api/placeholder/300/400',
      price: 14.99,
      originalPrice: 24.99,
      rating: 4.2,
      reviewCount: 567,
      inStock: false,
      isWishlisted: false
    },
    {
      id: '5',
      name: 'Wireless Phone Charger Pad',
      brand: 'PowerUp',
      image: '/api/placeholder/300/400',
      price: 29.99,
      rating: 4.4,
      reviewCount: 334,
      seller: 'PowerUp Official',
      inStock: true,
      isWishlisted: false
    },
    {
      id: '6',
      name: 'Gaming Mechanical Keyboard RGB',
      brand: 'GamePro',
      image: '/api/placeholder/300/400',
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviewCount: 1123,
      seller: 'GamePro Store',
      inStock: true,
      isWishlisted: true
    }
  ]

  useEffect(() => {
    setMounted(true)
    setFilteredProducts(sampleProducts)
    
    // Auto-hide intro after 8 seconds if user doesn't interact
    const introTimer = setTimeout(() => {
      setShowIntro(false)
    }, 8000)
    
    return () => clearTimeout(introTimer)
  }, [])

  const handleSearch = (query: string, category?: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    
    setTimeout(() => {
      let filtered = sampleProducts
      
      if (query.trim()) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
        )
      }
      
      if (category && category !== 'All Categories') {
        filtered = filtered.filter(product =>
          product.brand.toLowerCase().includes(category.toLowerCase())
        )
      }
      
      setFilteredProducts(filtered)
      setIsLoading(false)
    }, 500)
  }

  const handleFiltersChange = (filters: FilterState) => {
    setIsLoading(true)
    
    setTimeout(() => {
      let filtered = sampleProducts
      
      if (filters.brands.length > 0) {
        filtered = filtered.filter(product =>
          filters.brands.includes(product.brand)
        )
      }
      
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        filtered = filtered.filter(product =>
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
        )
      }
      
      if (filters.ratings.length > 0) {
        filtered = filtered.filter(product => {
          return filters.ratings.some(rating => {
            const minRating = parseInt(rating.replace('+', ''))
            return product.rating >= minRating
          })
        })
      }
      
      setFilteredProducts(filtered)
      setIsLoading(false)
    }, 300)
  }

  const handleCartClick = () => {
    setCurrentView('checkout')
  }

  const handleWishlistClick = () => {
    console.log('Wishlist clicked')
  }

  const handleAccountClick = (action: 'login' | 'register' | 'profile' | 'orders') => {
    if (action === 'login') {
      setIsLoggedIn(true)
    } else if (action === 'register') {
      console.log('Register clicked')
    } else {
      console.log(`${action} clicked`)
    }
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleCompleteOrder = (orderData: any) => {
    console.log('Order completed:', orderData)
    setCartItems([])
    setCurrentView('browse')
  }

  const handleSellerNavigation = (section: string) => {
    console.log('Seller navigation:', section)
  }

  const handleProductAction = (action: string, productId: string) => {
    console.log('Product action:', action, productId)
  }

  const handleOrderAction = (action: string, orderId: string) => {
    console.log('Order action:', action, orderId)
  }

  const handleSettingsChange = (setting: string, value: any) => {
    console.log('Settings change:', setting, value)
  }

  if (showIntro) {
    return (
      <>
        <GameCursor />
        <GameIntroSequence />
      </>
    )
  }

  if (currentView === 'seller') {
    return (
      <>
        <GameCursor />
        <div className="animate-fade-in-up">
          <SellerDashboard
            onNavigate={handleSellerNavigation}
            onProductAction={handleProductAction}
            onOrderAction={handleOrderAction}
            onSettingsChange={handleSettingsChange}
          />
        </div>
      </>
    )
  }

  if (currentView === 'checkout') {
    return (
      <>
        <GameCursor />
        <div className="min-h-screen bg-background animate-slide-up relative overflow-hidden">
          {/* Advanced Background Effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <ECommerceNavbar
            onSearchSubmit={handleSearch}
            onCartClick={handleCartClick}
            onWishlistClick={handleWishlistClick}
            onAccountClick={handleAccountClick}
            cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            wishlistItemCount={wishlistCount}
            isLoggedIn={isLoggedIn}
            userName={userName}
          />
          <div className="animate-scale-in relative z-10">
            <CheckoutFlow
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCompleteOrder={handleCompleteOrder}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <GameCursor />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Animated Gradient Meshes */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-1/4 left-3/4 w-64 h-64 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
          </div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                <div className="w-2 h-2 bg-primary/30 rotate-45" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="animate-slide-up relative z-10">
          <ECommerceNavbar
            onSearchSubmit={handleSearch}
            onCartClick={handleCartClick}
            onWishlistClick={handleWishlistClick}
            onAccountClick={handleAccountClick}
            cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            wishlistItemCount={wishlistCount}
            isLoggedIn={isLoggedIn}
            userName={userName}
          />
        </div>
        
        <div className="animate-fade-in-up relative z-10" style={{animationDelay: '0.2s'}}>
          <HeroCarousel />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex gap-6">
            <div className="animate-fade-in-up parallax-element" style={{animationDelay: '0.4s'}}>
              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                productCount={filteredProducts.length}
              />
            </div>
            
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold text-foreground text-gradient animate-glow-pulse">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Featured Products'}
                  </h2>
                  <div className="flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                    <span className="text-sm text-muted-foreground animate-float">
                      {filteredProducts.length} products found
                    </span>
                    <button
                      onClick={() => setCurrentView('seller')}
                      className="text-sm text-primary hover:text-primary/80 underline morphing-button px-3 py-1 rounded transition-all duration-300 hover:bg-primary/10"
                    >
                      Seller Dashboard
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="stagger-animation">
                <ProductGrid
                  products={filteredProducts}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Floating Action Elements */}
        <div className="fixed bottom-8 right-8 animate-float z-50">
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse-glow hover-lift flex items-center justify-center transition-all duration-500 group-hover:scale-110">
              <span className="text-white text-2xl">💬</span>
            </div>
            {/* Orbiting particles around the chat button */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/50 rounded-full"
                  style={{
                    animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: `${40 + i * 5}px 0px`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Gaming UI Elements */}
        <div className="fixed bottom-8 left-8 z-50">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground font-mono bg-card/20 backdrop-blur-sm p-3 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
              <span>PRODUCTS: {filteredProducts.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
              <span>CART: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}