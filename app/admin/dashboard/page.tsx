"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Car, Calendar, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const statsData = [
  { title: "Utilisateurs Actifs", value: "2,345", change: "+12.5%", trend: "up", icon: Users, color: "text-primary" },
  { title: "Trajets du Jour", value: "156", change: "+8.3%", trend: "up", icon: Car, color: "text-accent" },
  { title: "Réservations", value: "892", change: "+23.1%", trend: "up", icon: Calendar, color: "text-chart-3" },
  {
    title: "Incidents Actifs",
    value: "12",
    change: "-5.2%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-destructive",
  },
]

const chartData = [
  { month: "Jan", trajets: 186, reservations: 305, utilisateurs: 412 },
  { month: "Fév", trajets: 205, reservations: 378, utilisateurs: 456 },
  { month: "Mar", trajets: 237, reservations: 445, utilisateurs: 501 },
  { month: "Avr", trajets: 273, reservations: 512, utilisateurs: 578 },
  { month: "Mai", trajets: 209, reservations: 389, utilisateurs: 623 },
  { month: "Juin", trajets: 314, reservations: 598, utilisateurs: 701 },
]

const dailyActivityData = [
  { heure: "00h", activite: 12 },
  { heure: "04h", activite: 8 },
  { heure: "08h", activite: 145 },
  { heure: "12h", activite: 203 },
  { heure: "16h", activite: 187 },
  { heure: "20h", activite: 98 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme Blasira</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs flex items-center gap-1 ${stat.trend === "up" ? "text-accent" : "text-destructive"}`}
              >
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change} par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendances Mensuelles</CardTitle>
            <CardDescription>Évolution des trajets, réservations et utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                trajets: {
                  label: "Trajets",
                  color: "var(--chart-1)",
                },
                reservations: {
                  label: "Réservations",
                  color: "var(--chart-2)",
                },
                utilisateurs: {
                  label: "Utilisateurs",
                  color: "var(--chart-3)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="trajets" stroke="var(--color-trajets)" strokeWidth={2} />
                  <Line type="monotone" dataKey="reservations" stroke="var(--color-reservations)" strokeWidth={2} />
                  <Line type="monotone" dataKey="utilisateurs" stroke="var(--color-utilisateurs)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Quotidienne</CardTitle>
            <CardDescription>Répartition de l'activité par tranche horaire</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                activite: {
                  label: "Activité",
                  color: "var(--primary)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="heure" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="activite" fill="var(--color-activite)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
          <CardDescription>Dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Nouvel utilisateur inscrit", user: "Amadou Diarra", time: "Il y a 5 min", type: "user" },
              { action: "Trajet publié", user: "Fatoumata Keita", time: "Il y a 12 min", type: "trip" },
              { action: "Incident signalé", user: "Ibrahim Koné", time: "Il y a 23 min", type: "incident" },
              { action: "Vérification approuvée", user: "Mariam Touré", time: "Il y a 35 min", type: "verification" },
              { action: "Réservation confirmée", user: "Seydou Traoré", time: "Il y a 1 h", type: "booking" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.type === "incident"
                      ? "bg-destructive"
                      : activity.type === "trip"
                        ? "bg-accent"
                        : "bg-primary"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
