import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SaleForm } from "@/components/sales/sale-form"

export default async function NewSalePage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const [{ data: customers }, { data: employees }, { data: products }] = await Promise.all([
    supabase.from("customers").select("id, first_name, last_name").order("first_name", { ascending: true }),
    supabase.from("employees").select("id, first_name, last_name").order("first_name", { ascending: true }),
    supabase.from("products").select("id, name, price, stock_quantity").order("name", { ascending: true }),
  ])

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">New Sale</h1>
          <p className="text-slate-400 mt-2">Create a new customer purchase</p>
        </div>

        <div className="max-w-4xl">
          <SaleForm
            userId={userData.user.id}
            customers={customers || []}
            employees={employees || []}
            products={products || []}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
