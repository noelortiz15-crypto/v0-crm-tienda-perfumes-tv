"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts"

interface Sale {
  id: string
  total_amount: number
  status: string
  created_at: string
}

interface SalesReportProps {
  sales: Sale[]
}

export function SalesReport({ sales }: SalesReportProps) {
  // Calculate metrics
  const totalSales = sales.reduce((sum, s) => sum + s.total_amount, 0)
  const completedSales = sales.filter((s) => s.status === "completed").length
  const averageSaleAmount = completedSales > 0 ? totalSales / completedSales : 0

  // Sales by month
  const salesByMonth = sales.reduce((acc: Record<string, number>, sale) => {
    const date = new Date(sale.created_at)
    const monthKey = `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`
    acc[monthKey] = (acc[monthKey] || 0) + sale.total_amount
    return acc
  }, {})

  const monthlyData = Object.entries(salesByMonth)
    .slice(-7)
    .map(([month, amount]) => ({
      name: month,
      amount: Math.round(amount),
    }))

  // Sales by status
  const statusData = [
    { name: "Completed", value: sales.filter((s) => s.status === "completed").length },
    { name: "Pending", value: sales.filter((s) => s.status === "pending").length },
    { name: "Cancelled", value: sales.filter((s) => s.status === "cancelled").length },
  ]

  const COLORS = ["#16a34a", "#eab308", "#dc2626"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold text-amber-400 mt-2">${totalSales.toLocaleString()}</p>
          <p className="text-slate-500 text-xs mt-1">{sales.length} transactions</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Completed Orders</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">{completedSales}</p>
          <p className="text-slate-500 text-xs mt-1">
            {Math.round((completedSales / sales.length) * 100)}% success rate
          </p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Average Order Value</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            ${averageSaleAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-500 text-xs mt-1">Per completed sale</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Sales Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="amount" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Sales by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
