import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProductForm } from "@/components/products/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, company_name")
    .order("company_name", { ascending: true })

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="text-slate-400 mt-2">Create a new product entry</p>
        </div>

        <div className="max-w-2xl">
          <ProductForm mode="create" userId={userData.user.id} suppliers={suppliers || []} />
        </div>
      </div>
    </DashboardLayout>
  )
}
