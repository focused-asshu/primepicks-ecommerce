"use client"

import { useState, useCallback } from "react"
import { ChevronDown, ChevronRight, Search, X, Filter, Star, Truck, Shield, Award } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void
  productCount?: number
}

const categories = [
  {
    name: "Electronics",
    count: 15420,
    children: [
      {
        name: "Phones & Accessories",
        count: 3200,
        children: [
          { name: "Smartphones", count: 1200 },
          { name: "Phone Cases", count: 800 },
          { name: "Chargers", count: 600 }
        ]
      },
      {
        name: "Computers",
        count: 2800,
        children: [
          { name: "Laptops", count: 1400 },
          { name: "Desktops", count: 900 },
          { name: "Tablets", count: 500 }
        ]
      }
    ]
  },
  {
    name: "Home & Garden",
    count: 8750,
    children: [
      { name: "Kitchen", count: 2500 },
      { name: "Furniture", count: 1800 },
      { name: "Garden Tools", count: 1200 }
    ]
  },
  {
    name: "Fashion",
    count: 12300,
    children: [
      { name: "Men's Clothing", count: 4500 },
      { name: "Women's Clothing", count: 5200 },
      { name: "Shoes", count: 2600 }
    ]
  }
]

const brands = [
  { name: "Apple", count: 892, popular: true },
  { name: "Samsung", count: 743, popular: true },
  { name: "Nike", count: 654, popular: true },
  { name: "Sony", count: 521, popular: true },
  { name: "Adidas", count: 432, popular: false },
  { name: "Microsoft", count: 387, popular: false },
  { name: "Canon", count: 298, popular: false },
  { name: "Dell", count: 276, popular: false },
  { name: "HP", count: 234, popular: false },
  { name: "LG", count: 198, popular: false }
]

const ratings = [
  { label: "4+ Stars", value: "4+", count: 8542 },
  { label: "3+ Stars", value: "3+", count: 12387 },
  { label: "2+ Stars", value: "2+", count: 15293 },
  { label: "1+ Stars", value: "1+", count: 16842 }
]

const sellerTypes = [
  { label: "Amazon's Choice", value: "amazon-choice", count: 1234 },
  { label: "Prime", value: "prime", count: 8765 },
  { label: "Third-party sellers", value: "third-party", count: 4321 }
]

const conditions = [
  { label: "New", value: "new", count: 12450 },
  { label: "Used", value: "used", count: 3420 },
  { label: "Refurbished", value: "refurbished", count: 890 }
]

const shippingOptions = [
  { label: "Free shipping", value: "free", count: 9876 },
  { label: "Same day delivery", value: "same-day", count: 2341 },
  { label: "Prime eligible", value: "prime-eligible", count: 7654 }
]

export default function FilterSidebar({ onFiltersChange, productCount = 0 }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    brands: [],
    ratings: [],
    sellerType: [],
    condition: [],
    shipping: [],
    features: {}
  })

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    categories: true,
    price: true,
    brands: true,
    ratings: false,
    seller: false,
    condition: false,
    shipping: false
  })

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})
  const [brandSearch, setBrandSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }, [filters, onFiltersChange])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryName]
      : filters.categories.filter(c => c !== categoryName)
    updateFilters({ categories: newCategories })
  }

  const handleBrandChange = (brandName: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brandName]
      : filters.brands.filter(b => b !== brandName)
    updateFilters({ brands: newBrands })
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    const newRatings = checked
      ? [...filters.ratings, rating]
      : filters.ratings.filter(r => r !== rating)
    updateFilters({ ratings: newRatings })
  }

  const handleSellerTypeChange = (sellerType: string, checked: boolean) => {
    const newSellerTypes = checked
      ? [...filters.sellerType, sellerType]
      : filters.sellerType.filter(s => s !== sellerType)
    updateFilters({ sellerType: newSellerTypes })
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...filters.condition, condition]
      : filters.condition.filter(c => c !== condition)
    updateFilters({ condition: newConditions })
  }

  const handleShippingChange = (shipping: string, checked: boolean) => {
    const newShipping = checked
      ? [...filters.shipping, shipping]
      : filters.shipping.filter(s => s !== shipping)
    updateFilters({ shipping: newShipping })
  }

  const handlePriceRangeChange = (value: number[]) => {
    updateFilters({ priceRange: [value[0], value[1]] })
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      priceRange: [0, 1000],
      brands: [],
      ratings: [],
      sellerType: [],
      condition: [],
      shipping: [],
      features: {}
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.brands.length + 
           filters.ratings.length + 
           filters.sellerType.length + 
           filters.condition.length + 
           filters.shipping.length +
           (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000 ? 1 : 0)
  }

  const removeFilter = (type: keyof FilterState, value: string) => {
    switch (type) {
      case 'categories':
        handleCategoryChange(value, false)
        break
      case 'brands':
        handleBrandChange(value, false)
        break
      case 'ratings':
        handleRatingChange(value, false)
        break
      case 'sellerType':
        handleSellerTypeChange(value, false)
        break
      case 'condition':
        handleConditionChange(value, false)
        break
      case 'shipping':
        handleShippingChange(value, false)
        break
      case 'priceRange':
        updateFilters({ priceRange: [0, 1000] })
        break
    }
  }

  const filteredBrands = brandSearch
    ? brands.filter(brand => brand.name.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands

  const popularBrands = filteredBrands.filter(brand => brand.popular)
  const otherBrands = filteredBrands.filter(brand => !brand.popular)

  const renderStars = (rating: string) => {
    const numStars = parseInt(rating.replace('+', ''))
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < numStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">& up</span>
      </div>
    )
  }

  const renderCategoryTree = (categoryList: any[], level = 0) => {
    return categoryList.map((category) => (
      <div key={category.name} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 flex-1">
            {category.children && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => toggleCategory(category.name)}
              >
                {expandedCategories[category.name] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            <Checkbox
              id={`category-${category.name}`}
              checked={filters.categories.includes(category.name)}
              onCheckedChange={(checked) => handleCategoryChange(category.name, checked as boolean)}
            />
            <label
              htmlFor={`category-${category.name}`}
              className="text-sm cursor-pointer flex-1"
            >
              {category.name}
            </label>
          </div>
          <span className="text-xs text-gray-500">({category.count})</span>
        </div>
        {category.children && expandedCategories[category.name] && (
          <div className="mt-1">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  const activeFilters = [
    ...filters.categories.map(cat => ({ type: 'categories' as const, label: cat, value: cat })),
    ...filters.brands.map(brand => ({ type: 'brands' as const, label: brand, value: brand })),
    ...filters.ratings.map(rating => ({ type: 'ratings' as const, label: `${rating} Stars`, value: rating })),
    ...filters.sellerType.map(seller => ({ type: 'sellerType' as const, label: seller, value: seller })),
    ...filters.condition.map(cond => ({ type: 'condition' as const, label: cond, value: cond })),
    ...filters.shipping.map(ship => ({ type: 'shipping' as const, label: ship, value: ship })),
    ...(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000 ? [{ type: 'priceRange' as const, label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`, value: 'price' }] : [])
  ]

  const FilterContent = () => (
    <div className="bg-sidebar">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Applied Filters */}
          {activeFilters.length > 0 && (
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-ui text-sm font-medium">Applied Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground"
                  >
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 hover:bg-transparent"
                      onClick={() => removeFilter(filter.type, filter.value)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.categories} onOpenChange={() => toggleSection('categories')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Categories</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-2">
                  {renderCategoryTree(categories)}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Price Range */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.price} onOpenChange={() => toggleSection('price')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Price Range</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, filters.priceRange[1]])}
                        className="w-20 h-8 text-xs"
                        min={0}
                        max={filters.priceRange[1]}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">to</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value) || 1000])}
                        className="w-20 h-8 text-xs"
                        min={filters.priceRange[0]}
                        max={1000}
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Brands */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.brands} onOpenChange={() => toggleSection('brands')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Brand</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      placeholder="Search brands..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="pl-9 h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {popularBrands.length > 0 && (
                      <>
                        <div className="text-xs font-medium text-muted-foreground mb-2">Popular Brands</div>
                        {popularBrands.map((brand) => (
                          <div key={brand.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`brand-${brand.name}`}
                                checked={filters.brands.includes(brand.name)}
                                onCheckedChange={(checked) => handleBrandChange(brand.name, checked as boolean)}
                              />
                              <label htmlFor={`brand-${brand.name}`} className="text-sm cursor-pointer">
                                {brand.name}
                              </label>
                            </div>
                            <span className="text-xs text-muted-foreground">({brand.count})</span>
                          </div>
                        ))}
                      </>
                    )}
                    {otherBrands.length > 0 && (
                      <>
                        {popularBrands.length > 0 && <div className="text-xs font-medium text-muted-foreground mt-4 mb-2">Other Brands</div>}
                        {otherBrands.map((brand) => (
                          <div key={brand.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`brand-${brand.name}`}
                                checked={filters.brands.includes(brand.name)}
                                onCheckedChange={(checked) => handleBrandChange(brand.name, checked as boolean)}
                              />
                              <label htmlFor={`brand-${brand.name}`} className="text-sm cursor-pointer">
                                {brand.name}
                              </label>
                            </div>
                            <span className="text-xs text-muted-foreground">({brand.count})</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Ratings */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.ratings} onOpenChange={() => toggleSection('ratings')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Customer Ratings</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.ratings ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div key={rating.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`rating-${rating.value}`}
                          checked={filters.ratings.includes(rating.value)}
                          onCheckedChange={(checked) => handleRatingChange(rating.value, checked as boolean)}
                        />
                        <label htmlFor={`rating-${rating.value}`} className="cursor-pointer">
                          {renderStars(rating.value)}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">({rating.count})</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Seller Type */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.seller} onOpenChange={() => toggleSection('seller')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Seller Type</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.seller ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  {sellerTypes.map((seller) => (
                    <div key={seller.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`seller-${seller.value}`}
                          checked={filters.sellerType.includes(seller.value)}
                          onCheckedChange={(checked) => handleSellerTypeChange(seller.value, checked as boolean)}
                        />
                        <label htmlFor={`seller-${seller.value}`} className="text-sm cursor-pointer flex items-center gap-1">
                          {seller.value === 'amazon-choice' && <Award className="h-3 w-3 text-orange-500" />}
                          {seller.value === 'prime' && <Shield className="h-3 w-3 text-blue-600" />}
                          {seller.label}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">({seller.count})</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Condition */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.condition} onOpenChange={() => toggleSection('condition')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Condition</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.condition ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  {conditions.map((condition) => (
                    <div key={condition.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`condition-${condition.value}`}
                          checked={filters.condition.includes(condition.value)}
                          onCheckedChange={(checked) => handleConditionChange(condition.value, checked as boolean)}
                        />
                        <label htmlFor={`condition-${condition.value}`} className="text-sm cursor-pointer">
                          {condition.label}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">({condition.count})</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Shipping */}
          <div className="bg-card rounded-lg border border-border">
            <Collapsible open={expandedSections.shipping} onOpenChange={() => toggleSection('shipping')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="font-ui text-sm font-medium">Shipping Options</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.shipping ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  {shippingOptions.map((shipping) => (
                    <div key={shipping.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`shipping-${shipping.value}`}
                          checked={filters.shipping.includes(shipping.value)}
                          onCheckedChange={(checked) => handleShippingChange(shipping.value, checked as boolean)}
                        />
                        <label htmlFor={`shipping-${shipping.value}`} className="text-sm cursor-pointer flex items-center gap-1">
                          <Truck className="h-3 w-3 text-success-green" />
                          {shipping.label}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">({shipping.count})</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[280px] sticky top-20 h-[calc(100vh-5rem)] bg-sidebar border-r border-border">
        <FilterContent />
      </div>

      {/* Mobile Filter Button & Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" className="bg-card border-border">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[400px] p-0 bg-sidebar">
          <SheetHeader className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-ui text-base">
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </SheetTitle>
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-primary hover:text-primary/80"
                >
                  Clear All
                </Button>
              )}
            </div>
            {productCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {productCount.toLocaleString()} products found
              </p>
            )}
          </SheetHeader>
          <FilterContent />
          <div className="p-4 border-t border-border bg-card">
            <Button 
              onClick={() => setMobileOpen(false)} 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}