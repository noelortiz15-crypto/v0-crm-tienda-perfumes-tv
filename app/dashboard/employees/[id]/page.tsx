import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmployeeForm } from "@/components/employees/employee-form"

export default async function EditEmployeePage({
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

  const { data: employee, error: employeeError } = await supabase.from("employees").select("*").eq("id", id).single()

  if (employeeError || !employee) {
    redirect("/dashboard/employees")
  }

  return (
    <DashboardLayout user={userData.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Employee</h1>
          <p className="text-slate-400 mt-2">Update employee information</p>
        </div>

        <div className="max-w-2xl">
          <EmployeeForm mode="edit" userId={userData.user.id} initialData={employee} />
        </div>
      </div>
    </DashboardLayout>
  )
}
