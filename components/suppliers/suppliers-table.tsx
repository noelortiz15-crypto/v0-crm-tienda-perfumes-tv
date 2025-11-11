"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"
import { deleteSupplier } from "@/app/actions/suppliers"

interface Supplier {
  id: string
  company_name: string
  email?: string
  phone?: string
  contact_person?: string
  address?: string
  created_at: string
}

interface SuppliersTableProps {
  suppliers: Supplier[]
}

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return

    setLoading(true)
    setDeletingId(id)
    try {
      await deleteSupplier(id)
    } catch (error) {
      console.error("Error deleting supplier:", error)
      alert("Failed to delete supplier")
    } finally {
      setLoading(false)
      setDeletingId(null)
    }
  }

  if (suppliers.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No suppliers yet. Create your first supplier to get started.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Company Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{supplier.company_name}</td>
                <td className="px-6 py-4 text-slate-300">{supplier.contact_person || "-"}</td>
                <td className="px-6 py-4 text-slate-300 text-sm">{supplier.email || "-"}</td>
                <td className="px-6 py-4 text-slate-300 text-sm">{supplier.phone || "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/suppliers/${supplier.id}`}>
                      <Button variant="ghost" size="sm" className="text-amber-500 hover:bg-amber-500/10">
                        <Edit2 size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDelete(supplier.id)}
                      disabled={loading || deletingId === supplier.id}
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
