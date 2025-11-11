import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SuppliersTable } from "@/components/suppliers/suppliers-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SuppliersPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  // Fetch suppliers for the authenticated user
  const { data: suppliers, error: suppliersError } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false })

  if (suppliersError) {
    console.error("Error fetching suppliers:", suppliersError)
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Suppliers</h1>
            <p className="text-slate-400 mt-2">Manage your product suppliers</p>
          </div>
          <Link href="/dashboard/suppliers/new">
            <Button className="bg-amber-600 hover:bg-amber-700">Add Supplier</Button>
          </Link>
        </div>

        <SuppliersTable suppliers={suppliers || []} />
      </div>
    </DashboardLayout>
  )
}
