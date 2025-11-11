"use client"

import { Card } from "@/components/ui/card"

interface Supplier {
  id: string
  company_name: string
  created_at: string
}

interface SupplierReportProps {
  suppliers: Supplier[]
}

export function SupplierReport({ suppliers }: SupplierReportProps) {
  const totalSuppliers = suppliers.length

  const activeSuppliers = suppliers.filter((s) => {
    const date = new Date(s.created_at)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return date > sixMonthsAgo
  }).length

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Total Suppliers</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalSuppliers}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Active Suppliers</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">{activeSuppliers}</p>
          <p className="text-slate-500 text-xs mt-1">Last 6 months</p>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-white font-semibold mb-4">All Suppliers</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="flex justify-between items-center bg-slate-700 rounded p-3">
              <p className="text-white">{supplier.company_name}</p>
              <p className="text-slate-400 text-sm">{new Date(supplier.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
