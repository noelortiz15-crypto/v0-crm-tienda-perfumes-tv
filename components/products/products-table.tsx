"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, AlertTriangle } from "lucide-react"
import { deleteProduct } from "@/app/actions/products"

interface Product {
  id: string
  name: string
  brand: string
  tier: string
  price: number
  stock_quantity: number
  expiry_date?: string
  suppliers?: { company_name: string }
  created_at: string
}

interface ProductsTableProps {
  products: Product[]
}

const tierColors: Record<string, string> = {
  premium: "bg-amber-900 text-amber-200",
  medium: "bg-slate-700 text-slate-200",
  basic: "bg-slate-600 text-slate-300",
}

const tierLabels: Record<string, string> = {
  premium: "Premium ($5K-$20K)",
  medium: "Medium ($2K-$5K)",
  basic: "Basic ($0-$2K)",
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setLoading(true)
    setDeletingId(id)
    try {
      await deleteProduct(id)
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    } finally {
      setLoading(false)
      setDeletingId(null)
    }
  }

  const isLowStock = (quantity: number) => quantity <= 5
  const isExpired = (date?: string) => date && new Date(date) < new Date()

  if (products.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No products yet. Add your first product to get started.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Brand</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Tier</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Supplier</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Expiry</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {products.map((product) => {
              const lowStock = isLowStock(product.stock_quantity)
              const expired = isExpired(product.expiry_date)

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-slate-700/50 transition-colors ${expired ? "bg-red-900/20" : ""}`}
                >
                  <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-slate-300">{product.brand}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${tierColors[product.tier]}`}>
                      {tierLabels[product.tier] || product.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={lowStock ? "text-red-400 font-semibold" : "text-slate-300"}>
                        {product.stock_quantity}
                      </span>
                      {lowStock && <AlertTriangle size={16} className="text-red-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{product.suppliers?.company_name || "-"}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {product.expiry_date ? (
                      <span className={expired ? "text-red-400" : ""}>
                        {new Date(product.expiry_date).toLocaleDateString()}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Button variant="ghost" size="sm" className="text-amber-500 hover:bg-amber-500/10">
                          <Edit2 size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(product.id)}
                        disabled={loading || deletingId === product.id}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
