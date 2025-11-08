"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Car, TrendingUp, DollarSign } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const userGrowthData = [
  { month: "Jan", users: 412, drivers: 156, students: 256 },
  { month: "Fév", users: 456, drivers: 178, students: 278 },
  { month: "Mar", users: 501, drivers: 195, students: 306 },
  { month: "Avr", users: 578, drivers: 223, students: 355 },
  { month: "Mai", users: 623, drivers: 241, students: 382 },
  { month: "Juin", users: 701, drivers: 271, students: 430 },
]

const revenueData = [
  { month: "Jan", revenue: 245000 },
  { month: "Fév", revenue: 289000 },
  { month: "Mar", revenue: 334000 },
  { month: "Avr", revenue: 398000 },
  { month: "Mai", revenue: 412000 },
  { month: "Juin", revenue: 487000 },
]

const tripTypeData = [
  { name: "Voiture", value: 68, color: "hsl(var(--primary))" },
  { name: "Moto", value: 32, color: "hsl(var(--accent))" },
]

const universityData = [
  { name: "Univ. Bamako", trips: 245 },
  { name: "FST", trips: 189 },
  { name: "FLASH", trips: 156 },
  { name: "FMPOS", trips: 134 },
  { name: "ENI", trips: 112 },
]

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground">Analyse détaillée des performances de la plateforme</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs totaux</p>
                <p className="text-3xl font-bold">2,345</p>
                <p className="text-xs text-accent">+12.5% ce mois</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Trajets totaux</p>
                <p className="text-3xl font-bold">8,942</p>
                <p className="text-xs text-accent">+23.1% ce mois</p>
              </div>
              <Car className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Taux d'utilisation</p>
                <p className="text-3xl font-bold">87%</p>
                <p className="text-xs text-accent">+5.2% ce mois</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenu total</p>
                <p className="text-3xl font-bold">487k</p>
                <p className="text-xs text-accent">+18.2% ce mois</p>
              </div>
              <DollarSign className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="trips">Trajets</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des utilisateurs</CardTitle>
                <CardDescription>Évolution mensuelle par type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: {
                      label: "Total",
                      color: "hsl(var(--chart-1))",
                    },
                    drivers: {
                      label: "Conducteurs",
                      color: "hsl(var(--chart-2))",
                    },
                    students: {
                      label: "Étudiants",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                      <Line type="monotone" dataKey="drivers" stroke="var(--color-drivers)" strokeWidth={2} />
                      <Line type="monotone" dataKey="students" stroke="var(--color-students)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des utilisateurs</CardTitle>
                <CardDescription>Par université</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    trips: {
                      label: "Trajets",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={universityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="trips" fill="var(--color-trips)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Types de trajets</CardTitle>
                <CardDescription>Répartition voiture vs moto</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Pourcentage",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tripTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tripTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trajets par université</CardTitle>
                <CardDescription>Volume de trajets mensuels</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    trips: {
                      label: "Trajets",
                      color: "hsl(var(--accent))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={universityData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="trips" fill="var(--color-trips)" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des revenus</CardTitle>
              <CardDescription>Revenus mensuels en FCFA</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenus",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
