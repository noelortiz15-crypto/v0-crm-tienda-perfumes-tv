import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmployeesTable } from "@/components/employees/employees-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EmployeesPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false })

  if (employeesError) {
    console.error("Error fetching employees:", employeesError)
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Employees</h1>
            <p className="text-slate-400 mt-2">Manage your team members</p>
          </div>
          <Link href="/dashboard/employees/new">
            <Button className="bg-amber-600 hover:bg-amber-700">Add Employee</Button>
          </Link>
        </div>

        <EmployeesTable employees={employees || []} />
      </div>
    </DashboardLayout>
  )
}
