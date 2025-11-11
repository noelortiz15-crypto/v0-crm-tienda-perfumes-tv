"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"
import { deleteEmployee } from "@/app/actions/employees"

interface Employee {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  birth_date?: string
  created_at: string
}

interface EmployeesTableProps {
  employees: Employee[]
}

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    setLoading(true)
    setDeletingId(id)
    try {
      await deleteEmployee(id)
    } catch (error) {
      console.error("Error deleting employee:", error)
      alert("Failed to delete employee")
    } finally {
      setLoading(false)
      setDeletingId(null)
    }
  }

  if (employees.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No employees yet. Add your first team member to get started.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Birth Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium">
                  {employee.first_name} {employee.last_name}
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm">{employee.email || "-"}</td>
                <td className="px-6 py-4 text-slate-300 text-sm">{employee.phone || "-"}</td>
                <td className="px-6 py-4 text-slate-300 text-sm">
                  {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/employees/${employee.id}`}>
                      <Button variant="ghost" size="sm" className="text-amber-500 hover:bg-amber-500/10">
                        <Edit2 size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDelete(employee.id)}
                      disabled={loading || deletingId === employee.id}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
