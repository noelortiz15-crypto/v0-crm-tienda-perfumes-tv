import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SupplierForm } from "@/components/suppliers/supplier-form"

export default async function NewSupplierPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Supplier</h1>
          <p className="text-slate-400 mt-2">Create a new supplier profile</p>
        </div>

        <div className="max-w-2xl">
          <SupplierForm mode="create" userId={userData.user.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
