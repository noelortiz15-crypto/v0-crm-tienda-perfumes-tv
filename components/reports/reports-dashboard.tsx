"use client"

import { useState } from "react"
import { SalesReport } from "./reports/sales-report"
import { InventoryReport } from "./reports/inventory-report"
import { CustomerReport } from "./reports/customer-report"
import { SupplierReport } from "./reports/supplier-report"
import { EmployeeReport } from "./reports/employee-report"

interface Sale {
  id: string
  total_amount: number
  status: string
  created_at: string
}

interface Product {
  id: string
  name: string
  stock_quantity: number
  price: number
  tier: string
}

interface Customer {
  id: string
  first_name: string
  last_name: string
  created_at: string
}

interface Supplier {
  id: string
  company_name: string
  created_at: string
}

interface Employee {
  id: string
  first_name: string
  last_name: string
  created_at: string
}

interface ReportsDashboardProps {
  sales: Sale[]
  products: Product[]
  customers: Customer[]
  suppliers: Supplier[]
  employees: Employee[]
}

export function ReportsDashboard({ sales, products, customers, suppliers, employees }: ReportsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"sales" | "inventory" | "customers" | "suppliers" | "employees">("sales")

  const tabs = [
    { id: "sales", label: "Sales", icon: "💰" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "suppliers", label: "Suppliers", icon: "🏢" },
    { id: "employees", label: "Employees", icon: "👨‍💼" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-slate-400 mt-2">Comprehensive business intelligence and insights</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "sales" && <SalesReport sales={sales} />}
      {activeTab === "inventory" && <InventoryReport products={products} />}
      {activeTab === "customers" && <CustomerReport customers={customers} />}
      {activeTab === "suppliers" && <SupplierReport suppliers={suppliers} />}
      {activeTab === "employees" && <EmployeeReport employees={employees} />}
    </div>
  )
}
