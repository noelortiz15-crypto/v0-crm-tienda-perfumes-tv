import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const [
    { data: products, error: productsError },
    { data: customers, error: customersError },
    { data: sales, error: salesError },
    { data: suppliers, error: suppliersError },
  ] = await Promise.all([
    supabase.from("products").select("id").eq("created_by", data.user.id),
    supabase.from("customers").select("id").eq("created_by", data.user.id),
    supabase.from("sales").select("id, total_amount").eq("created_by", data.user.id),
    supabase.from("suppliers").select("id").eq("created_by", data.user.id),
  ])

  console.log("[v0] Dashboard data fetch results:", {
    products: products?.length,
    customers: customers?.length,
    sales: sales?.length,
    suppliers: suppliers?.length,
    errors: { productsError, customersError, salesError, suppliersError },
  })

  const stats = {
    products: products?.length || 0,
    customers: customers?.length || 0,
    sales: sales?.length || 0,
    totalRevenue: sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0,
    suppliers: suppliers?.length || 0,
  }

  return (
    <DashboardLayout user={data.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your Perfume CRM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.products}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.customers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.sales}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.suppliers}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
