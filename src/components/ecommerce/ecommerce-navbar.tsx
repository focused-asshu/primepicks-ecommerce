"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ShoppingBag, ShoppingCart, Heart, User, Menu, X, ChevronDown, Clock, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface NavbarProps {
  onSearchSubmit?: (query: string, category?: string) => void
  onCartClick?: () => void
  onWishlistClick?: () => void
  onAccountClick?: (action: 'login' | 'register' | 'profile' | 'orders') => void
  cartItemCount?: number
  wishlistItemCount?: number
  isLoggedIn?: boolean
  userName?: string
}

const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Automotive'
]

const recentSearches = [
  'wireless headphones',
  'running shoes',
  'laptop bag'
]

const popularCategories = [
  { name: 'Electronics', count: '2.5k products' },
  { name: 'Fashion', count: '1.8k products' },
  { name: 'Home & Garden', count: '920 products' }
]

export default function ECommerceNavbar({
  onSearchSubmit,
  onCartClick,
  onWishlistClick,
  onAccountClick,
  cartItemCount = 0,
  wishlistItemCount = 0,
  isLoggedIn = false,
  userName = 'Guest'
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchSubmit?.(searchQuery, selectedCategory !== 'All Categories' ? selectedCategory : undefined)
    setIsSearchFocused(false)
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    onSearchSubmit?.(query, selectedCategory !== 'All Categories' ? selectedCategory : undefined)
    setIsSearchFocused(false)
  }

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full border-b border-border transition-all duration-300 ${
        scrolled ? 'glass-effect shadow-lg' : 'bg-background/95'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <ShoppingBag className="h-8 w-8 text-primary animate-pulse-glow" />
              </motion.div>
              <span className="text-2xl font-display font-bold text-gradient animate-glow-pulse">
                PrimePicks
              </span>
            </div>
          </motion.div>

          {/* Desktop Search Bar */}
          <motion.div 
            className="hidden lg:flex flex-1 max-w-2xl mx-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative w-full">
              <form onSubmit={handleSearchSubmit} className="flex rounded-lg overflow-hidden border border-border glass-effect">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="px-4 py-2 bg-muted/20 hover:bg-muted/40 text-muted-foreground border-none rounded-none border-r border-border font-ui text-sm morphing-button"
                    >
                      {selectedCategory}
                      <motion.div
                        animate={{ rotate: isSearchFocused ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 glass-effect">
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'bg-muted/40' : ''}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="border-none bg-background/50 focus:ring-0 focus:border-none h-full font-ui transition-all duration-300 focus:bg-background/80"
                  />
                  
                  {/* Search Autocomplete */}
                  <AnimatePresence>
                    {isSearchFocused && (searchQuery.length > 0 || recentSearches.length > 0) && (
                      <motion.div 
                        className="absolute top-full left-0 right-0 glass-effect border border-border rounded-b-lg shadow-xl z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {searchQuery.length === 0 && (
                          <>
                            <div className="p-3 border-b border-border">
                              <div className="flex items-center space-x-2 text-muted-foreground text-sm font-ui mb-2">
                                <Clock className="h-4 w-4" />
                                <span>Recent Searches</span>
                              </div>
                              {recentSearches.map((search, index) => (
                                <motion.button
                                  key={index}
                                  onClick={() => handleQuickSearch(search)}
                                  className="block w-full text-left px-3 py-2 hover:bg-muted/20 rounded text-sm font-ui transition-all duration-200 hover-lift"
                                  whileHover={{ x: 5 }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  {search}
                                </motion.button>
                              ))}
                            </div>
                            <div className="p-3">
                              <div className="flex items-center space-x-2 text-muted-foreground text-sm font-ui mb-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>Popular Categories</span>
                              </div>
                              {popularCategories.map((category, index) => (
                                <motion.button
                                  key={index}
                                  onClick={() => {
                                    setSelectedCategory(category.name)
                                    onSearchSubmit?.('', category.name)
                                  }}
                                  className="block w-full text-left px-3 py-2 hover:bg-muted/20 rounded transition-all duration-200 hover-lift"
                                  whileHover={{ x: 5 }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 + 0.2 }}
                                >
                                  <div className="text-sm font-ui text-foreground">{category.name}</div>
                                  <div className="text-xs text-muted-foreground">{category.count}</div>
                                </motion.button>
                              ))}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Button 
                  type="submit"
                  className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none font-ui morphing-button animate-magnetic"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-primary morphing-button animate-magnetic">
                  <User className="h-5 w-5" />
                  <span className="font-ui">{isLoggedIn ? userName : 'Account'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 glass-effect" align="end">
                {!isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => onAccountClick?.('login')}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAccountClick?.('register')}>
                      Create Account
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => onAccountClick?.('profile')}>
                      Your Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAccountClick?.('orders')}>
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={onWishlistClick}
                className="relative p-2 text-muted-foreground hover:text-primary animate-magnetic"
              >
                <Heart className="h-5 w-5" />
                <AnimatePresence>
                  {wishlistItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground animate-pulse-glow">
                        {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Shopping Cart */}
            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    className="relative p-2 text-muted-foreground hover:text-primary animate-magnetic"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <AnimatePresence>
                      {cartItemCount > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground animate-pulse-glow">
                            {cartItemCount > 99 ? '99+' : cartItemCount}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-80 glass-effect p-0" align="end">
                <motion.div 
                  className="p-4 border-b border-border"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="font-ui font-medium text-foreground">Shopping Cart</h3>
                </motion.div>
                <motion.div 
                  className="p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {cartItemCount === 0 ? (
                    <p className="text-muted-foreground text-sm font-ui text-center py-4">Your cart is empty</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-ui text-muted-foreground">
                        {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in cart
                      </div>
                      <Button 
                        onClick={onCartClick}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-ui morphing-button"
                      >
                        View Cart
                      </Button>
                    </div>
                  )}
                </motion.div>
              </PopoverContent>
            </Popover>
          </motion.div>

          {/* Mobile Actions */}
          <motion.div 
            className="flex lg:hidden items-center space-x-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Mobile Search Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 text-muted-foreground hover:text-primary animate-magnetic"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Mobile Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={onCartClick}
                className="relative p-2 text-muted-foreground hover:text-primary animate-magnetic"
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-4 w-4 rounded-full p-0 text-xs bg-primary text-primary-foreground animate-pulse-glow">
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="p-2 text-muted-foreground hover:text-primary animate-magnetic">
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-effect">
                <SheetHeader>
                  <SheetTitle className="text-left font-display text-primary">Menu</SheetTitle>
                </SheetHeader>
                <motion.div 
                  className="mt-6 space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {!isLoggedIn ? (
                    <>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('login')
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-ui morphing-button"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('register')
                          setIsMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="w-full font-ui morphing-button"
                      >
                        Create Account
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm font-ui text-muted-foreground">Welcome, {userName}</div>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('profile')
                          setIsMobileMenuOpen(false)
                        }}
                        variant="ghost"
                        className="w-full justify-start font-ui morphing-button"
                      >
                        Your Profile
                      </Button>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('orders')
                          setIsMobileMenuOpen(false)
                        }}
                        variant="ghost"
                        className="w-full justify-start font-ui morphing-button"
                      >
                        Order History
                      </Button>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-4">
                    <Button 
                      onClick={() => {
                        onWishlistClick?.()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="ghost"
                      className="w-full justify-start font-ui morphing-button"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist ({wishlistItemCount})
                    </Button>
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div 
              className="lg:hidden pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full font-ui glass-effect"
                  />
                </div>
                <Button 
                  type="submit"
                  className="px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-ui morphing-button"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="px-3 text-muted-foreground animate-magnetic"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}