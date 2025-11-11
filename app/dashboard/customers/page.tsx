import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CustomersTable } from "@/components/customers/customers-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })

  if (customersError) {
    console.error("Error fetching customers:", customersError)
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Customers</h1>
            <p className="text-slate-400 mt-2">Manage your customer relationships</p>
          </div>
          <Link href="/dashboard/customers/new">
            <Button className="bg-amber-600 hover:bg-amber-700">Add Customer</Button>
          </Link>
        </div>

        <CustomersTable customers={customers || []} />
      </div>
    </DashboardLayout>
  )
}
