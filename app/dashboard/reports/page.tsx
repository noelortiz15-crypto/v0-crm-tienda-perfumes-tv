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
    { data: topCustomersData },
  ] = await Promise.all([
    supabase.from("sales").select("id, total_amount, status, created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, stock_quantity, price, tier"),
    supabase.from("customers").select("id, first_name, last_name, created_at"),
    supabase.from("suppliers").select("id, company_name, created_at"),
    supabase.from("employees").select("id, first_name, last_name, created_at"),
    supabase
      .from("sales")
      .select(`
        customer_id,
        total_amount,
        customers (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("status", "completed"),
  ])

  const customerSalesMap = new Map<string, { customer: any; totalSales: number; orderCount: number }>()

  if (topCustomersData) {
    topCustomersData.forEach((sale: any) => {
      const customerId = sale.customer_id
      const customer = sale.customers

      if (customer) {
        const existing = customerSalesMap.get(customerId)
        if (existing) {
          existing.totalSales += Number(sale.total_amount)
          existing.orderCount += 1
        } else {
          customerSalesMap.set(customerId, {
            customer,
            totalSales: Number(sale.total_amount),
            orderCount: 1,
          })
        }
      }
    })
  }

  const topCustomers = Array.from(customerSalesMap.values())
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5)

  return (
    <DashboardLayout user={userData.user}>
      <ReportsDashboard
        sales={salesData || []}
        products={productsData || []}
        customers={customersData || []}
        suppliers={suppliersData || []}
        employees={employeesData || []}
        topCustomers={topCustomers}
      />
    </DashboardLayout>
  )
}
