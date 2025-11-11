"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSale } from "@/app/actions/sales"
import { Trash2, Plus } from "lucide-react"

interface Customer {
  id: string
  first_name: string
  last_name: string
}

interface Employee {
  id: string
  first_name: string
  last_name: string
}

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
}

interface SaleItem {
  product_id: string
  quantity: number
  unit_price: number
}

interface SaleFormProps {
  userId: string
  customers: Customer[]
  employees: Employee[]
  products: Product[]
}

export function SaleForm({ userId, customers, employees, products }: SaleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<SaleItem[]>([])
  const [formData, setFormData] = useState({
    customer_id: customers[0]?.id || "",
    employee_id: employees[0]?.id || "",
  })

  const handleAddItem = () => {
    if (products.length > 0) {
      setItems([
        ...items,
        {
          product_id: products[0].id,
          quantity: 1,
          unit_price: products[0].price,
        },
      ])
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    if (field === "product_id") {
      const product = products.find((p) => p.id === value)
      newItems[index] = {
        ...newItems[index],
        product_id: value,
        unit_price: product?.price || 0,
      }
    } else {
      ;(newItems[index] as any)[field] = field === "quantity" ? Number.parseInt(value) : value
    }
    setItems(newItems)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      setError("Add at least one product to the sale")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createSale({
        customer_id: formData.customer_id,
        employee_id: formData.employee_id,
        total_amount: totalAmount,
        items,
        created_by: userId,
      })
      router.push("/dashboard/sales")
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
            <Label className="text-slate-200">Customer *</Label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
              className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-slate-200">Employee *</Label>
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2"
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-slate-200">Products</Label>
            <Button
              type="button"
              onClick={handleAddItem}
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <Plus size={16} /> Add Product
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-slate-400 text-sm">No products added yet</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const product = products.find((p) => p.id === item.product_id)
                const subtotal = item.quantity * item.unit_price

                return (
                  <div key={index} className="bg-slate-700 rounded-lg p-4 flex gap-4 items-end">
                    <div className="flex-1">
                      <Label className="text-slate-300 text-xs">Product</Label>
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                        className="w-full bg-slate-600 border border-slate-500 rounded text-white px-2 py-1 text-sm mt-1"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${p.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <Label className="text-slate-300 text-xs">Qty</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        min="1"
                        max={product?.stock_quantity || 1}
                        className="bg-slate-600 border-slate-500 text-white text-sm mt-1"
                      />
                    </div>
                    <div className="w-24">
                      <Label className="text-slate-300 text-xs">Subtotal</Label>
                      <p className="text-white font-semibold mt-1">${subtotal.toLocaleString()}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-amber-400">${totalAmount.toLocaleString()}</span>
          </div>
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
            {loading ? "Creating Sale..." : "Create Sale"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
