"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupplier, updateSupplier } from "@/app/actions/suppliers"

interface SupplierFormProps {
  mode: "create" | "edit"
  userId: string
  initialData?: {
    id: string
    company_name: string
    description?: string
    address?: string
    contact_person?: string
    email?: string
    phone?: string
  }
}

export function SupplierForm({ mode, userId, initialData }: SupplierFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    contact_person: initialData?.contact_person || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === "create") {
        await createSupplier({ ...formData, created_by: userId })
      } else if (initialData) {
        await updateSupplier(initialData.id, formData)
      }
      router.push("/dashboard/suppliers")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Company Name *</Label>
            <Input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-200">Contact Person</Label>
            <Input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Enter contact person name"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-200">Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-slate-200">Address</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="mt-2 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-200">Description</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter supplier description"
            rows={4}
            className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2"
          />
        </div>

        {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">{error}</div>}

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
            {loading ? "Saving..." : mode === "create" ? "Create Supplier" : "Update Supplier"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
