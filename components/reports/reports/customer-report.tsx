"use client"

import { Card } from "@/components/ui/card"

interface Customer {
  id: string
  first_name: string
  last_name: string
  created_at: string
}

interface CustomerReportProps {
  customers: Customer[]
}

export function CustomerReport({ customers }: CustomerReportProps) {
  // Calculate metrics
  const totalCustomers = customers.length

  const newCustomersThisMonth = customers.filter((c) => {
    const date = new Date(c.created_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  const customersByMonth = customers.reduce((acc: Record<string, number>, customer) => {
    const date = new Date(customer.created_at)
    const monthKey = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`
    acc[monthKey] = (acc[monthKey] || 0) + 1
    return acc
  }, {})

  const growthRate =
    Object.values(customersByMonth).length > 1 ? Math.round((newCustomersThisMonth / (totalCustomers || 1)) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Total Customers</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalCustomers}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">New This Month</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">{newCustomersThisMonth}</p>
          <p className="text-slate-500 text-xs mt-1">{growthRate}% of total</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Monthly Growth</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">{growthRate}%</p>
        </Card>
      </div>

      {/* Recent Customers */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-white font-semibold mb-4">Recent Customers</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {customers.slice(0, 10).map((customer) => (
            <div key={customer.id} className="flex justify-between items-center bg-slate-700 rounded p-3">
              <p className="text-white">
                {customer.first_name} {customer.last_name}
              </p>
              <p className="text-slate-400 text-sm">{new Date(customer.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
