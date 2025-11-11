import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SaleDetail } from "@/components/sales/sale-detail"

export default async function SaleDetailPage({
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

  const [{ data: sale }, { data: items }] = await Promise.all([
    supabase
      .from("sales")
      .select(`
        id,
        total_amount,
        status,
        created_at,
        customers(first_name, last_name, email),
        employees(first_name, last_name)
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("sales_items")
      .select(`
        id,
        quantity,
        unit_price,
        subtotal,
        products(name, brand)
      `)
      .eq("sale_id", id),
  ])

  if (!sale) {
    redirect("/dashboard/sales")
  }

  return (
    <DashboardLayout user={userData.user}>
      <SaleDetail sale={sale} items={items || []} />
    </DashboardLayout>
  )
}
