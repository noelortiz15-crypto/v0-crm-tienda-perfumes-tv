import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  // Fetch all necessary data for reports
  const [
    { data: salesData },
    { data: productsData },
    { data: customersData },
    { data: suppliersData },
    { data: employeesData },
  ] = await Promise.all([
    supabase.from("sales").select("id, total_amount, status, created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, stock_quantity, price, tier"),
    supabase.from("customers").select("id, first_name, last_name, created_at"),
    supabase.from("suppliers").select("id, company_name, created_at"),
    supabase.from("employees").select("id, first_name, last_name, created_at"),
  ])

  return (
    <DashboardLayout user={userData.user}>
      <ReportsDashboard
        sales={salesData || []}
        products={productsData || []}
        customers={customersData || []}
        suppliers={suppliersData || []}
        employees={employeesData || []}
      />
    </DashboardLayout>
  )
}
