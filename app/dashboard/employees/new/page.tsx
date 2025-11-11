import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmployeeForm } from "@/components/employees/employee-form"

export default async function NewEmployeePage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Employee</h1>
          <p className="text-slate-400 mt-2">Create a new employee profile</p>
        </div>

        <div className="max-w-2xl">
          <EmployeeForm mode="create" userId={userData.user.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
