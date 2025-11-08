import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { ChartsSection } from "@/components/charts-section"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  redirect("/admin/dashboard")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-primary">Dashboard Blasira</h1>
          <p className="text-muted-foreground text-pretty">{"Gérez votre plateforme de covoiturage en temps réel"}</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <ChartsSection />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
