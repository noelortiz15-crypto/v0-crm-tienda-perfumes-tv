"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"

interface Sale {
  id: string
  total_amount: number
  status: string
  created_at: string
  customers?: { first_name: string; last_name: string }
  employees?: { first_name: string; last_name: string }
}

interface SalesTableProps {
  sales: Sale[]
}

const statusColors: Record<string, string> = {
  completed: "bg-green-900 text-green-200",
  pending: "bg-yellow-900 text-yellow-200",
  cancelled: "bg-red-900 text-red-200",
}

export function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No sales recorded yet. Create your first sale to get started.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Total Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium">
                  {sale.customers?.first_name} {sale.customers?.last_name}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {sale.employees?.first_name} {sale.employees?.last_name}
                </td>
                <td className="px-6 py-4 text-white font-semibold">${sale.total_amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusColors[sale.status] || statusColors.pending}`}
                  >
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm">{new Date(sale.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/sales/${sale.id}`}>
                    <Button variant="ghost" size="sm" className="text-amber-500 hover:bg-amber-500/10">
                      <Eye size={16} />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
