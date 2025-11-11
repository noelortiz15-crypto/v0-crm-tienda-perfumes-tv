import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SupplierForm } from "@/components/suppliers/supplier-form"

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: supplier, error: supplierError } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (supplierError || !supplier) {
    redirect("/dashboard/suppliers")
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Supplier</h1>
          <p className="text-slate-400 mt-2">Update supplier information</p>
        </div>

        <div className="max-w-2xl">
          <SupplierForm mode="edit" userId={userData.user.id} initialData={supplier} />
        </div>
      </div>
    </DashboardLayout>
  )
}
