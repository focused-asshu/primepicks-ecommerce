"use client"

import React, { useState } from 'react'
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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-light-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-success-green" />
              <span className="text-2xl font-display font-bold text-primary-blue">PrimePicks</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <form onSubmit={handleSearchSubmit} className="flex rounded-lg overflow-hidden border border-light-border bg-soft-gray">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="px-4 py-2 bg-soft-gray hover:bg-muted text-medium-gray border-none rounded-none border-r border-light-border font-ui text-sm"
                    >
                      {selectedCategory}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white">
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'bg-soft-gray' : ''}
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
                    className="border-none bg-white focus:ring-0 focus:border-none h-full font-ui"
                  />
                  
                  {/* Search Autocomplete */}
                  {isSearchFocused && (searchQuery.length > 0 || recentSearches.length > 0) && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-light-border rounded-b-lg shadow-lg z-50">
                      {searchQuery.length === 0 && (
                        <>
                          <div className="p-3 border-b border-light-border">
                            <div className="flex items-center space-x-2 text-medium-gray text-sm font-ui mb-2">
                              <Clock className="h-4 w-4" />
                              <span>Recent Searches</span>
                            </div>
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickSearch(search)}
                                className="block w-full text-left px-3 py-2 hover:bg-soft-gray rounded text-sm font-ui"
                              >
                                {search}
                              </button>
                            ))}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center space-x-2 text-medium-gray text-sm font-ui mb-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>Popular Categories</span>
                            </div>
                            {popularCategories.map((category, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSelectedCategory(category.name)
                                  onSearchSubmit?.('', category.name)
                                }}
                                className="block w-full text-left px-3 py-2 hover:bg-soft-gray rounded"
                              >
                                <div className="text-sm font-ui text-dark-text">{category.name}</div>
                                <div className="text-xs text-medium-gray">{category.count}</div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="px-6 bg-success-green hover:bg-success-green/90 text-white rounded-none font-ui"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 text-medium-gray hover:text-primary-blue">
                  <User className="h-5 w-5" />
                  <span className="font-ui">{isLoggedIn ? userName : 'Account'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white" align="end">
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
            <Button
              variant="ghost"
              onClick={onWishlistClick}
              className="relative p-2 text-medium-gray hover:text-primary-blue"
            >
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-success-green text-white">
                  {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                </Badge>
              )}
            </Button>

            {/* Shopping Cart */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-2 text-medium-gray hover:text-primary-blue"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-success-green text-white">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white p-0" align="end">
                <div className="p-4 border-b border-light-border">
                  <h3 className="font-ui font-medium text-dark-text">Shopping Cart</h3>
                </div>
                <div className="p-4">
                  {cartItemCount === 0 ? (
                    <p className="text-medium-gray text-sm font-ui text-center py-4">Your cart is empty</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-ui text-medium-gray">
                        {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in cart
                      </div>
                      <Button 
                        onClick={onCartClick}
                        className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white font-ui"
                      >
                        View Cart
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-medium-gray hover:text-primary-blue"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Cart */}
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="relative p-2 text-medium-gray hover:text-primary-blue"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-success-green text-white">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2 text-medium-gray hover:text-primary-blue">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <SheetHeader>
                  <SheetTitle className="text-left font-display text-primary-blue">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {!isLoggedIn ? (
                    <>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('login')
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white font-ui"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('register')
                          setIsMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="w-full font-ui"
                      >
                        Create Account
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm font-ui text-medium-gray">Welcome, {userName}</div>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('profile')
                          setIsMobileMenuOpen(false)
                        }}
                        variant="ghost"
                        className="w-full justify-start font-ui"
                      >
                        Your Profile
                      </Button>
                      <Button 
                        onClick={() => {
                          onAccountClick?.('orders')
                          setIsMobileMenuOpen(false)
                        }}
                        variant="ghost"
                        className="w-full justify-start font-ui"
                      >
                        Order History
                      </Button>
                    </div>
                  )}
                  
                  <div className="border-t border-light-border pt-4">
                    <Button 
                      onClick={() => {
                        onWishlistClick?.()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="ghost"
                      className="w-full justify-start font-ui"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist ({wishlistItemCount})
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full font-ui"
                />
              </div>
              <Button 
                type="submit"
                className="px-4 bg-success-green hover:bg-success-green/90 text-white font-ui"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsMobileSearchOpen(false)}
                className="px-3 text-medium-gray"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}