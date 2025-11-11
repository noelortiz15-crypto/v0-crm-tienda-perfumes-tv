import { Suspense } from "react"
import { DatabaseSettings } from "@/components/settings/database-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your database connections and configurations</p>
      </div>

      <Suspense fallback={<div>Loading settings...</div>}>
        <DatabaseSettings />
      </Suspense>
    </div>
  )
}
