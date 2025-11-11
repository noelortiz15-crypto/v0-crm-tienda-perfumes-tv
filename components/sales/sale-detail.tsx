"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface SaleItem {
  id: string
  quantity: number
  unit_price: number
  subtotal: number
  products?: { name: string; brand: string }
}

interface Sale {
  id: string
  total_amount: number
  status: string
  created_at: string
  customers?: { first_name: string; last_name: string; email?: string }
  employees?: { first_name: string; last_name: string }
}

interface SaleDetailProps {
  sale: Sale
  items: SaleItem[]
}

export function SaleDetail({ sale, items }: SaleDetailProps) {
  return (
    <div className="space-y-6">
      <Link href="/dashboard/sales">
        <Button variant="outline" className="border-slate-600 text-slate-200 bg-transparent">
          <ArrowLeft size={16} /> Back to Sales
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-300 text-sm font-medium">Customer</h3>
          <p className="text-white text-lg font-semibold mt-2">
            {sale.customers?.first_name} {sale.customers?.last_name}
          </p>
          {sale.customers?.email && <p className="text-slate-400 text-sm mt-1">{sale.customers.email}</p>}
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-300 text-sm font-medium">Employee</h3>
          <p className="text-white text-lg font-semibold mt-2">
            {sale.employees?.first_name} {sale.employees?.last_name}
          </p>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-300 text-sm font-medium">Status</h3>
          <p
            className={`text-lg font-semibold mt-2 ${
              sale.status === "completed"
                ? "text-green-400"
                : sale.status === "pending"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
          </p>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-300">Product</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-300">Brand</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-slate-300">Quantity</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-slate-300">Unit Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-slate-300">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-white">{item.products?.name}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{item.products?.brand}</td>
                  <td className="px-4 py-3 text-right text-white">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-white">${item.unit_price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-white font-semibold">${item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 w-full md:w-64">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold">Total:</span>
              <span className="text-2xl font-bold text-amber-400">${sale.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-6">
        <p className="text-slate-300 text-sm">
          Sale Date: <span className="text-white font-semibold">{new Date(sale.created_at).toLocaleString()}</span>
        </p>
      </Card>
    </div>
  )
}
