import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SalesTable } from "@/components/sales/sales-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SalesPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: sales, error: salesError } = await supabase
    .from("sales")
    .select(`
      id,
      total_amount,
      status,
      created_at,
      customers(first_name, last_name),
      employees(first_name, last_name)
    `)
    .order("created_at", { ascending: false })

  if (salesError) {
    console.error("Error fetching sales:", salesError)
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales</h1>
            <p className="text-slate-400 mt-2">Manage customer purchases and inventory</p>
          </div>
          <Link href="/dashboard/sales/new">
            <Button className="bg-amber-600 hover:bg-amber-700">New Sale</Button>
          </Link>
        </div>

        <SalesTable sales={sales || []} />
      </div>
    </DashboardLayout>
  )
}
