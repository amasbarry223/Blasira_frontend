"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Car, Calendar, AlertTriangle, TrendingUp, TrendingDown, Activity, User, BookUser } from "lucide-react"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AdminService } from "@/services/AdminService"
import { DashboardStats } from "@/models"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const adminService = new AdminService()
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="mr-2" />
        <span className="text-muted-foreground">Chargement du tableau de bord...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Alert variant="destructive" className="w-auto max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Alert className="w-auto max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Aucune donnée</AlertTitle>
          <AlertDescription>Impossible de charger les statistiques du tableau de bord.</AlertDescription>
        </Alert>
      </div>
    )
  }
  
  const statsData = [
    { title: "Utilisateurs Totals", value: stats.totalUsers, icon: Users, color: "text-primary" },
    { title: "Trajets Totals", value: stats.totalTrips, icon: Car, color: "text-accent" },
    { title: "Réservations Totales", value: stats.totalBookings, icon: Calendar, color: "text-chart-3" },
    // You might want to add totalIncidents to your API if needed
    { title: "Incidents Actifs", value: "N/A", icon: AlertTriangle, color: "text-destructive" },
  ]
  
  const monthlyChartData = Object.entries(stats.monthlyTrends).map(([month, data]) => ({
    month: new Date(month).toLocaleString('fr-FR', { month: 'short' }),
    utilisateurs: data.newUsers,
    trajets: data.newTrips,
    reservations: data.newBookings,
  }));

  const dailyChartData = Object.entries(stats.dailyActivity).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    activite: count,
  }));

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
              {/* Change/trend data is not available in the current API response */}
              <p className="text-xs text-muted-foreground">Donnée en temps réel</p>
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
                trajets: { label: "Trajets", color: "hsl(var(--chart-1))" },
                reservations: { label: "Réservations", color: "hsl(var(--chart-2))" },
                utilisateurs: { label: "Utilisateurs", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
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
            <CardTitle>Activité sur 30 jours</CardTitle>
            <CardDescription>Activité totale sur la plateforme par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                activite: { label: "Activité", color: "hsl(var(--primary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
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
          <div className="space-y-4"> {/* Applied directly here */}
            {stats.recentActivities.map((activity, index) => {
               const getIcon = () => {
                 if (activity.toLowerCase().includes("trajet")) return <Car className="h-4 w-4 text-accent" />;
                 if (activity.toLowerCase().includes("utilisateur")) return <User className="h-4 w-4 text-primary" />;
                 if (activity.toLowerCase().includes("réservation")) return <BookUser className="h-4 w-4 text-chart-3" />;
                 return <Activity className="h-4 w-4 text-muted-foreground" />;
               }

              return (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getIcon()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{activity}</p>
                </div>
              </div>
            )})}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
