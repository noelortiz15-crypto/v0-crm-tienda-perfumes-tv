"use client"

import { Card } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  stock_quantity: number
  price: number
  tier: string
}

interface InventoryReportProps {
  products: Product[]
}

const tierLabels: Record<string, string> = {
  premium: "Premium ($5K-$20K)",
  medium: "Medium ($2K-$5K)",
  basic: "Basic ($0-$2K)",
}

export function InventoryReport({ products }: InventoryReportProps) {
  const totalValue = products.reduce((sum, p) => sum + p.stock_quantity * p.price, 0)
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 5)
  const outOfStockProducts = products.filter((p) => p.stock_quantity === 0)

  const productsByTier = {
    premium: products.filter((p) => p.tier === "premium").length,
    medium: products.filter((p) => p.tier === "medium").length,
    basic: products.filter((p) => p.tier === "basic").length,
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-white mt-2">{products.length}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Inventory Value</h3>
          <p className="text-3xl font-bold text-amber-400 mt-2">${totalValue.toLocaleString()}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Low Stock</h3>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{lowStockProducts.length}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">{outOfStockProducts.length}</p>
        </Card>
      </div>

      {/* Products by Tier */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-white font-semibold mb-4">Products by Tier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Premium</p>
            <p className="text-2xl font-bold text-amber-500 mt-2">{productsByTier.premium}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Medium</p>
            <p className="text-2xl font-bold text-slate-300 mt-2">{productsByTier.medium}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Basic</p>
            <p className="text-2xl font-bold text-slate-400 mt-2">{productsByTier.basic}</p>
          </div>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Low Stock Alert</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center bg-yellow-900/20 rounded p-3 border border-yellow-900"
              >
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-yellow-300 text-sm">Stock: {product.stock_quantity} units</p>
                </div>
                <span className="text-yellow-400 font-bold">${product.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
