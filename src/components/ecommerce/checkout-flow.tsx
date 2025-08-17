"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Check, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Edit2, 
  Trash2, 
  Plus,
  Minus,
  Lock,
  Star
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface CheckoutFlowProps {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCompleteOrder: (orderData: any) => void
}

export default function CheckoutFlow({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCompleteOrder
}: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  })
  const [deliveryOption, setDeliveryOption] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [validatedFields, setValidatedFields] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { number: 1, label: "Shipping", icon: MapPin },
    { number: 2, label: "Delivery", icon: Truck },
    { number: 3, label: "Payment", icon: CreditCard },
    { number: 4, label: "Review", icon: Check }
  ]

  const deliveryOptions = [
    { id: "standard", name: "Standard Shipping", price: 5.99, days: "5-7 business days" },
    { id: "express", name: "Express Shipping", price: 12.99, days: "2-3 business days" },
    { id: "overnight", name: "Overnight Shipping", price: 24.99, days: "Next business day" }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = deliveryOptions.find(opt => opt.id === deliveryOption)?.price || 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const validateField = (field: string, value: string) => {
    let isValid = false
    let errorMsg = ""

    switch (field) {
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        errorMsg = isValid ? "" : "Please enter a valid email address"
        break
      case "phone":
        isValid = /^\+?[\d\s\-\(\)]{10,}$/.test(value)
        errorMsg = isValid ? "" : "Please enter a valid phone number"
        break
      case "zipCode":
        isValid = /^\d{5}(-\d{4})?$/.test(value)
        errorMsg = isValid ? "" : "Please enter a valid ZIP code"
        break
      default:
        isValid = value.trim().length > 0
        errorMsg = isValid ? "" : "This field is required"
    }

    if (isValid) {
      setValidatedFields(prev => [...prev.filter(f => f !== field), field])
      setErrors(prev => ({ ...prev, [field]: "" }))
    } else {
      setValidatedFields(prev => prev.filter(f => f !== field))
      setErrors(prev => ({ ...prev, [field]: errorMsg }))
    }

    return isValid
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]
        return requiredFields.every(field => validatedFields.includes(field))
      case 2:
        return deliveryOption !== ""
      case 3:
        return paymentMethod !== ""
      default:
        return true
    }
  }

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleCompleteOrder = () => {
    const orderData = {
      shippingInfo,
      deliveryOption,
      paymentMethod,
      cartItems,
      totals: { subtotal, shipping, tax, total }
    }
    onCompleteOrder(orderData)
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <Card className="mb-8 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${currentStep > step.number 
                      ? 'bg-success-green border-success-green text-white' 
                      : currentStep === step.number 
                        ? 'bg-primary-blue border-primary-blue text-white'
                        : 'bg-white border-light-border text-medium-gray'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`
                    ml-3 font-ui text-sm
                    ${currentStep >= step.number ? 'text-dark-text' : 'text-medium-gray'}
                  `}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4
                      ${currentStep > step.number ? 'bg-success-green' : 'bg-light-border'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <Progress 
              value={(currentStep / steps.length) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-display text-dark-text flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary-blue" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-ui text-dark-text">First Name</label>
                        <div className="relative">
                          <Input
                            value={shippingInfo.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className={`
                              ${errors.firstName ? 'border-destructive' : validatedFields.includes("firstName") ? 'border-success-green' : ''}
                            `}
                            placeholder="John"
                          />
                          {validatedFields.includes("firstName") && (
                            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                          )}
                        </div>
                        {errors.firstName && (
                          <p className="text-xs text-destructive">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-ui text-dark-text">Last Name</label>
                        <div className="relative">
                          <Input
                            value={shippingInfo.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className={`
                              ${errors.lastName ? 'border-destructive' : validatedFields.includes("lastName") ? 'border-success-green' : ''}
                            `}
                            placeholder="Doe"
                          />
                          {validatedFields.includes("lastName") && (
                            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                          )}
                        </div>
                        {errors.lastName && (
                          <p className="text-xs text-destructive">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-ui text-dark-text">Email Address</label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`
                            ${errors.email ? 'border-destructive' : validatedFields.includes("email") ? 'border-success-green' : ''}
                          `}
                          placeholder="john.doe@example.com"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        {validatedFields.includes("email") && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-ui text-dark-text">Phone Number</label>
                      <div className="relative">
                        <Input
                          value={shippingInfo.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`
                            ${errors.phone ? 'border-destructive' : validatedFields.includes("phone") ? 'border-success-green' : ''}
                          `}
                          placeholder="(555) 123-4567"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        {validatedFields.includes("phone") && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-ui text-dark-text">Street Address</label>
                      <div className="relative">
                        <Input
                          value={shippingInfo.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className={`
                            ${errors.address ? 'border-destructive' : validatedFields.includes("address") ? 'border-success-green' : ''}
                          `}
                          placeholder="123 Main Street"
                        />
                        {validatedFields.includes("address") && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                        )}
                      </div>
                      {errors.address && (
                        <p className="text-xs text-destructive">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-ui text-dark-text">City</label>
                        <div className="relative">
                          <Input
                            value={shippingInfo.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className={`
                              ${errors.city ? 'border-destructive' : validatedFields.includes("city") ? 'border-success-green' : ''}
                            `}
                            placeholder="New York"
                          />
                          {validatedFields.includes("city") && (
                            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                          )}
                        </div>
                        {errors.city && (
                          <p className="text-xs text-destructive">{errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-ui text-dark-text">State</label>
                        <Select onValueChange={(value) => handleInputChange("state", value)}>
                          <SelectTrigger className={`
                            ${errors.state ? 'border-destructive' : validatedFields.includes("state") ? 'border-success-green' : ''}
                          `}>
                            <SelectValue placeholder="NY" />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.state && (
                          <p className="text-xs text-destructive">{errors.state}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-ui text-dark-text">ZIP Code</label>
                        <div className="relative">
                          <Input
                            value={shippingInfo.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            className={`
                              ${errors.zipCode ? 'border-destructive' : validatedFields.includes("zipCode") ? 'border-success-green' : ''}
                            `}
                            placeholder="10001"
                          />
                          {validatedFields.includes("zipCode") && (
                            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success-green" />
                          )}
                        </div>
                        {errors.zipCode && (
                          <p className="text-xs text-destructive">{errors.zipCode}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-ui text-dark-text">Country</label>
                        <Select defaultValue="US" onValueChange={(value) => handleInputChange("country", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="MX">Mexico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-display text-dark-text flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-primary-blue" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-4">
                      {deliveryOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-4 border border-light-border rounded-lg hover:border-accent-blue transition-colors">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <label htmlFor={option.id} className="font-ui text-dark-text cursor-pointer">
                                {option.name}
                              </label>
                              <span className="font-ui text-dark-text">${option.price.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-medium-gray">{option.days}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-display text-dark-text flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-primary-blue" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border border-light-border rounded-lg hover:border-accent-blue transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex-1">
                          <label htmlFor="card" className="font-ui text-dark-text cursor-pointer flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Credit / Debit Card
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-light-border rounded-lg hover:border-accent-blue transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <div className="flex-1">
                          <label htmlFor="paypal" className="font-ui text-dark-text cursor-pointer">
                            PayPal
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-light-border rounded-lg hover:border-accent-blue transition-colors">
                        <RadioGroupItem value="apple" id="apple" />
                        <div className="flex-1">
                          <label htmlFor="apple" className="font-ui text-dark-text cursor-pointer">
                            Apple Pay
                          </label>
                        </div>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4 mt-6"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-ui text-dark-text">Card Number</label>
                          <Input placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-ui text-dark-text">Expiry Date</label>
                            <Input placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-ui text-dark-text">CVV</label>
                            <Input placeholder="123" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-ui text-dark-text">Cardholder Name</label>
                          <Input placeholder="John Doe" />
                        </div>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-center space-x-4 pt-4">
                      <Shield className="w-5 h-5 text-success-green" />
                      <span className="text-sm text-medium-gray">Secured by 256-bit SSL encryption</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 4 && (
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-display text-dark-text flex items-center">
                      <Check className="w-5 h-5 mr-2 text-success-green" />
                      Review & Confirm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-ui font-semibold text-dark-text mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Shipping Address
                          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setCurrentStep(1)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </h4>
                        <div className="text-sm text-medium-gray space-y-1">
                          <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                          <p>{shippingInfo.address}</p>
                          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                          <p>{shippingInfo.email}</p>
                          <p>{shippingInfo.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-ui font-semibold text-dark-text mb-2 flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Delivery Method
                          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setCurrentStep(2)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </h4>
                        <div className="text-sm text-medium-gray">
                          <p>{deliveryOptions.find(opt => opt.id === deliveryOption)?.name}</p>
                          <p>{deliveryOptions.find(opt => opt.id === deliveryOption)?.days}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-ui font-semibold text-dark-text mb-2 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment Method
                        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setCurrentStep(3)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </h4>
                      <p className="text-sm text-medium-gray capitalize">{paymentMethod} Payment</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="bg-card"
              >
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className="bg-primary-blue hover:bg-accent-blue"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteOrder}
                  className="bg-success-green hover:bg-success-green/90"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Complete Order
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg font-display text-dark-text">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-soft-gray rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-ui text-sm text-dark-text truncate">{item.name}</h4>
                          {item.variant && (
                            <p className="text-xs text-medium-gray">{item.variant}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-xs font-ui text-dark-text w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-ui text-sm text-dark-text">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveItem(item.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm" className="bg-card">Apply</Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray">Subtotal</span>
                      <span className="font-ui text-dark-text">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray">Shipping</span>
                      <span className="font-ui text-dark-text">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray">Tax</span>
                      <span className="font-ui text-dark-text">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-ui font-semibold text-dark-text">Total</span>
                      <span className="font-ui font-semibold text-lg text-dark-text">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  {deliveryOption && (
                    <div className="bg-soft-gray p-3 rounded-lg">
                      <p className="text-xs text-medium-gray">Estimated Delivery</p>
                      <p className="font-ui text-sm text-dark-text">
                        {deliveryOptions.find(opt => opt.id === deliveryOption)?.days}
                      </p>
                    </div>
                  )}

                  {/* Security Badges */}
                  <div className="flex items-center justify-center space-x-4 pt-4 text-xs text-medium-gray">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4 text-success-green" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-success-green" />
                      <span>SSL Protected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}