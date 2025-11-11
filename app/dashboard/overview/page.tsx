import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCharts } from "@/components/dashboard/overview-charts"

export default async function OverviewPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch dashboard statistics
  const [{ data: suppliers }, { data: customers }, { data: products }, { data: employees }, { data: sales }] =
    await Promise.all([
      supabase.from("suppliers").select("id").eq("created_by", user.id),
      supabase.from("customers").select("id").eq("created_by", user.id),
      supabase.from("products").select("id, price, tier").eq("created_by", user.id),
      supabase.from("employees").select("id").eq("created_by", user.id),
      supabase.from("sales").select("total_amount, status").eq("created_by", user.id),
    ])

  const stats = {
    suppliers: suppliers?.length || 0,
    customers: customers?.length || 0,
    products: products?.length || 0,
    employees: employees?.length || 0,
    totalSales: sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0,
  }

  const tierDistribution = [
    { name: "Premium", value: products?.filter((p) => p.tier === "premium").length || 0 },
    { name: "Medium", value: products?.filter((p) => p.tier === "medium").length || 0 },
    { name: "Basic", value: products?.filter((p) => p.tier === "basic").length || 0 },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your business summary.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suppliers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalSales / 1000).toFixed(1)}k</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <OverviewCharts tierDistribution={tierDistribution} />
    </div>
  )
}
