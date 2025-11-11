"use client"

import { Card } from "@/components/ui/card"

interface Employee {
  id: string
  first_name: string
  last_name: string
  created_at: string
}

interface EmployeeReportProps {
  employees: Employee[]
}

export function EmployeeReport({ employees }: EmployeeReportProps) {
  const totalEmployees = employees.length

  const recentHires = employees.filter((e) => {
    const date = new Date(e.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return date > thirtyDaysAgo
  }).length

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Total Employees</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalEmployees}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-slate-400 text-sm font-medium">Recent Hires</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">{recentHires}</p>
          <p className="text-slate-500 text-xs mt-1">Last 30 days</p>
        </Card>
      </div>

      {/* Employees List */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-white font-semibold mb-4">All Employees</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {employees.map((employee) => (
            <div key={employee.id} className="flex justify-between items-center bg-slate-700 rounded p-3">
              <p className="text-white">
                {employee.first_name} {employee.last_name}
              </p>
              <p className="text-slate-400 text-sm">{new Date(employee.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
