"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface OverviewChartsProps {
  tierDistribution: Array<{ name: string; value: number }>
}

export function OverviewCharts({ tierDistribution }: OverviewChartsProps) {
  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Tier Distribution</CardTitle>
          <CardDescription>Breakdown of products by price tier</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>System activity summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Sales Today</span>
            <span className="font-semibold">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Low Stock Items</span>
            <span className="font-semibold">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Upcoming Birthdays</span>
            <span className="font-semibold">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Expired Products</span>
            <span className="font-semibold">-</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
