"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProduct, updateProduct } from "@/app/actions/products"

interface Supplier {
  id: string
  company_name: string
}

interface ProductFormProps {
  mode: "create" | "edit"
  userId: string
  suppliers: Supplier[]
  initialData?: {
    id: string
    name: string
    description?: string
    brand: string
    price: number
    tier: string
    expiry_date?: string
    stock_quantity: number
    supplier_id: string
  }
}

export function ProductForm({ mode, userId, suppliers, initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    brand: initialData?.brand || "",
    price: initialData?.price?.toString() || "",
    tier: initialData?.tier || "medium",
    expiry_date: initialData?.expiry_date || "",
    stock_quantity: initialData?.stock_quantity?.toString() || "0",
    supplier_id: initialData?.supplier_id || suppliers[0]?.id || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock_quantity: Number.parseInt(formData.stock_quantity),
        ...(mode === "create" && { created_by: userId }),
      }

      if (mode === "create") {
        await createProduct(submitData as any)
      } else if (initialData) {
        await updateProduct(initialData.id, submitData)
      }
      router.push("/dashboard/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Product Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Eau de Parfum"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-200">Brand *</Label>
            <Input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              placeholder="e.g., Chanel"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Price (USD) *</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="Enter price"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-200">Tier *</Label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2"
            >
              <option value="premium">Premium ($5,000 - $20,000)</option>
              <option value="medium">Medium ($2,000 - $4,999)</option>
              <option value="basic">Basic ($0 - $1,999)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Stock Quantity *</Label>
            <Input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter stock quantity"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-200">Supplier *</Label>
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              required
              className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2"
            >
              <option value="">Select a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.company_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label className="text-slate-200">Expiry Date</Label>
          <Input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="mt-2 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-200">Description</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2"
          />
        </div>

        {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">{error}</div>}

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
            {loading ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
