"use client"

import { Car, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Utilisateurs actifs",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-chart-1",
  },
  {
    title: "Trajets aujourd'hui",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: Car,
    color: "text-chart-2",
  },
  {
    title: "Taux de réservation",
    value: "73%",
    change: "+5.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-chart-3",
  },
  {
    title: "Incidents ouverts",
    value: "12",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    color: "text-chart-4",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:bg-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className={`text-xs font-medium ${stat.trend === "up" ? "text-accent" : "text-muted-foreground"}`}>
                  {stat.change} depuis hier
                </p>
              </div>
              <div className={`rounded-full bg-secondary p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
