"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  {
    id: 1,
    user: "Amadou D.",
    action: "a créé un nouveau trajet",
    time: "Il y a 5 min",
    type: "trip",
  },
  {
    id: 2,
    user: "Fatoumata T.",
    action: "s'est inscrite",
    time: "Il y a 12 min",
    type: "user",
  },
  {
    id: 3,
    user: "Mamadou K.",
    action: "a signalé un incident",
    time: "Il y a 23 min",
    type: "incident",
  },
  {
    id: 4,
    user: "Aissata S.",
    action: "a réservé un trajet",
    time: "Il y a 34 min",
    type: "reservation",
  },
  {
    id: 5,
    user: "Ibrahim C.",
    action: "a laissé un avis 5★",
    time: "Il y a 1h",
    type: "review",
  },
  {
    id: 6,
    user: "Mariam D.",
    action: "a complété un trajet",
    time: "Il y a 2h",
    type: "trip",
  },
]

const typeColors = {
  trip: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  user: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  incident: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  reservation: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  review: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Les dernières actions sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-secondary">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${typeColors[activity.type as keyof typeof typeColors]}`}
                    >
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
