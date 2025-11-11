import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProductForm } from "@/components/products/product-form"

export default async function EditProductPage({
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

  const [{ data: product }, { data: suppliers }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("suppliers").select("id, company_name").order("company_name", { ascending: true }),
  ])

  if (!product) {
    redirect("/dashboard/products")
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Product</h1>
          <p className="text-slate-400 mt-2">Update product information</p>
        </div>

        <div className="max-w-2xl">
          <ProductForm mode="edit" userId={userData.user.id} initialData={product} suppliers={suppliers || []} />
        </div>
      </div>
    </DashboardLayout>
  )
}
