import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CustomerForm } from "@/components/customers/customer-form"

export default async function EditCustomerPage({
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

  const { data: customer, error: customerError } = await supabase.from("customers").select("*").eq("id", id).single()

  if (customerError || !customer) {
    redirect("/dashboard/customers")
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Customer</h1>
          <p className="text-slate-400 mt-2">Update customer information</p>
        </div>

        <div className="max-w-2xl">
          <CustomerForm mode="edit" userId={userData.user.id} initialData={customer} />
        </div>
      </div>
    </DashboardLayout>
  )
}
