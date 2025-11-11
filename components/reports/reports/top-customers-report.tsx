"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface TopCustomer {
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  totalSales: number
  orderCount: number
}

interface TopCustomersReportProps {
  topCustomers: TopCustomer[]
}

export function TopCustomersReport({ topCustomers }: TopCustomersReportProps) {
  // Format data for chart
  const chartData = topCustomers.map((item) => ({
    name: `${item.customer.first_name} ${item.customer.last_name}`,
    sales: item.totalSales,
  }))

  // Colors for bars
  const barColors = ["#f59e0b", "#fb923c", "#fbbf24", "#fcd34d", "#fde68a"]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-amber-600 to-orange-600 border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Top 5 Customers by Sales</CardTitle>
          <p className="text-amber-100">Highest revenue-generating customers</p>
        </CardHeader>
      </Card>

      {/* Chart Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Sales by Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Total Sales"]}
              />
              <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topCustomers.map((item, index) => (
          <Card key={item.customer.id} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">
                      {item.customer.first_name} {item.customer.last_name}
                    </CardTitle>
                    <p className="text-sm text-slate-400">{item.customer.email}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Sales</span>
                  <span className="text-xl font-bold text-amber-500">${item.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Orders</span>
                  <span className="text-lg font-semibold text-white">{item.orderCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg Order Value</span>
                  <span className="text-lg font-semibold text-slate-300">
                    ${(item.totalSales / item.orderCount).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Total Revenue from Top 5</p>
              <p className="text-3xl font-bold text-amber-500">
                ${topCustomers.reduce((sum, item) => sum + item.totalSales, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-white">
                {topCustomers.reduce((sum, item) => sum + item.orderCount, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Average Order Value</p>
              <p className="text-3xl font-bold text-slate-300">
                $
                {(
                  topCustomers.reduce((sum, item) => sum + item.totalSales, 0) /
                  topCustomers.reduce((sum, item) => sum + item.orderCount, 0)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
