"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const tripsData = [
  { date: "Lun", trips: 45, reservations: 38 },
  { date: "Mar", trips: 52, reservations: 44 },
  { date: "Mer", trips: 48, reservations: 41 },
  { date: "Jeu", trips: 61, reservations: 53 },
  { date: "Ven", trips: 73, reservations: 65 },
  { date: "Sam", trips: 68, reservations: 58 },
  { date: "Dim", trips: 55, reservations: 47 },
]

const usersData = [
  { month: "Jan", users: 420 },
  { month: "Fév", users: 580 },
  { month: "Mar", users: 720 },
  { month: "Avr", users: 950 },
  { month: "Mai", users: 1240 },
  { month: "Juin", users: 1680 },
  { month: "Juil", users: 2180 },
]

const revenueData = [
  { month: "Jan", revenue: 12400 },
  { month: "Fév", revenue: 16800 },
  { month: "Mar", revenue: 21200 },
  { month: "Avr", revenue: 28600 },
  { month: "Mai", revenue: 35400 },
  { month: "Juin", revenue: 44200 },
  { month: "Juil", revenue: 56800 },
]

export function ChartsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des performances</CardTitle>
        <CardDescription>Statistiques en temps réel de la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trips" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trips">Trajets</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-4">
            <ChartContainer
              config={{
                trips: {
                  label: "Trajets",
                  color: "var(--chart-1)",
                },
                reservations: {
                  label: "Réservations",
                  color: "var(--chart-2)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tripsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="trips"
                    stroke="var(--color-trips)"
                    fill="var(--color-trips)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="reservations"
                    stroke="var(--color-reservations)"
                    fill="var(--color-reservations)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <ChartContainer
              config={{
                users: {
                  label: "Utilisateurs",
                  color: "var(--chart-2)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-users)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenus (FCFA)",
                  color: "var(--chart-3)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
