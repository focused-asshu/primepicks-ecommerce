"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Printer,
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react'

interface SellerDashboardProps {
  onNavigate?: (section: string) => void
  onProductAction?: (action: string, productId: string) => void
  onOrderAction?: (action: string, orderId: string) => void
  onSettingsChange?: (setting: string, value: any) => void
}

export default function SellerDashboard({ 
  onNavigate, 
  onProductAction, 
  onOrderAction, 
  onSettingsChange 
}: SellerDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleNavigation = (section: string) => {
    setActiveSection(section)
    onNavigate?.(section)
  }

  const metrics = [
    { title: 'Total Revenue', value: '$24,850', change: '+12.5%', icon: DollarSign, trend: 'up' },
    { title: 'Active Listings', value: '142', change: '+3', icon: Package, trend: 'up' },
    { title: 'Pending Orders', value: '28', change: '+8', icon: ShoppingCart, trend: 'up' },
    { title: 'Customer Rating', value: '4.8', change: '+0.2', icon: Star, trend: 'up' }
  ]

  const recentOrders = [
    { id: '#12847', customer: 'John Smith', product: 'Wireless Headphones', amount: '$89.99', status: 'Processing', date: '2 hours ago' },
    { id: '#12846', customer: 'Sarah Johnson', product: 'Smart Watch', amount: '$299.99', status: 'Shipped', date: '4 hours ago' },
    { id: '#12845', customer: 'Mike Davis', product: 'Phone Case', amount: '$24.99', status: 'Delivered', date: '1 day ago' },
    { id: '#12844', customer: 'Emily Brown', product: 'Bluetooth Speaker', amount: '$79.99', status: 'Pending', date: '1 day ago' }
  ]

  const products = [
    { id: 'P001', name: 'Wireless Headphones', image: '/api/placeholder/50/50', stock: 25, price: '$89.99', status: 'Active', stockLevel: 'good' },
    { id: 'P002', name: 'Smart Watch Pro', image: '/api/placeholder/50/50', stock: 8, price: '$299.99', status: 'Active', stockLevel: 'low' },
    { id: 'P003', name: 'Phone Case', image: '/api/placeholder/50/50', stock: 2, price: '$24.99', status: 'Active', stockLevel: 'critical' },
    { id: 'P004', name: 'Bluetooth Speaker', image: '/api/placeholder/50/50', stock: 45, price: '$79.99', status: 'Active', stockLevel: 'good' }
  ]

  const orders = [
    { id: '#12847', customer: 'John Smith', email: 'john@example.com', products: 'Wireless Headphones', amount: '$89.99', status: 'Processing', date: '2024-01-15' },
    { id: '#12846', customer: 'Sarah Johnson', email: 'sarah@example.com', products: 'Smart Watch', amount: '$299.99', status: 'Shipped', date: '2024-01-15' },
    { id: '#12845', customer: 'Mike Davis', email: 'mike@example.com', products: 'Phone Case', amount: '$24.99', status: 'Delivered', date: '2024-01-14' },
    { id: '#12844', customer: 'Emily Brown', email: 'emily@example.com', products: 'Bluetooth Speaker', amount: '$79.99', status: 'Pending', date: '2024-01-14' }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case 'good': return 'bg-green-500'
      case 'low': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ]

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-ui text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-display font-bold text-foreground">{metric.value}</p>
                  <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Revenue chart would be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-ui font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          3 products are running low on stock. <Button variant="link" className="p-0 h-auto text-yellow-800 underline">View products</Button>
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderProductsContent = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-display font-bold text-foreground">Product Management</h2>
        <Button onClick={() => onProductAction?.('add', '')} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-ui font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStockLevelColor(product.stockLevel)}`}></div>
                      <span className="font-ui">{product.stock}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-ui font-medium">{product.price}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onProductAction?.('view', product.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onProductAction?.('edit', product.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onProductAction?.('delete', product.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrdersContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-display font-bold text-foreground">Order Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Labels
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-ui font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-ui font-medium text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell className="font-ui font-medium">{order.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOrderAction?.('view', order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOrderAction?.('message', order.id)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOrderAction?.('print', order.id)}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Label
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display">Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Sales chart would be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-display font-bold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="font-ui font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">142 sold</p>
                    </div>
                  </div>
                  <p className="font-ui font-medium text-foreground">{product.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboardContent()
      case 'products': return renderProductsContent()
      case 'orders': return renderOrdersContent()
      case 'analytics': return renderAnalyticsContent()
      case 'settings': return (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Account Settings</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Settings configuration would be here</p>
            </CardContent>
          </Card>
        </div>
      )
      case 'help': return (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Help & Support</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Help documentation and support tools would be here</p>
            </CardContent>
          </Card>
        </div>
      )
      default: return renderDashboardContent()
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-display font-bold text-sidebar-foreground">Seller Hub</h1>
                <p className="text-xs text-sidebar-foreground/60">John&#39;s Store</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {!sidebarCollapsed && <span className="font-ui">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">Manage your store and track performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}