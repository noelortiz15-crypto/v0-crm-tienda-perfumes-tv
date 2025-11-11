import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProductsTable } from "@/components/products/products-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, suppliers(company_name)")
    .order("created_at", { ascending: false })

  if (productsError) {
    console.error("Error fetching products:", productsError)
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <p className="text-slate-400 mt-2">Manage your perfume inventory</p>
          </div>
          <Link href="/dashboard/products/new">
            <Button className="bg-amber-600 hover:bg-amber-700">Add Product</Button>
          </Link>
        </div>

        <ProductsTable products={products || []} />
      </div>
    </DashboardLayout>
  )
}
