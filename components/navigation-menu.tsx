"use client"

import { BarChart3, Car, Flag, LayoutDashboard, MessageSquare, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/" },
  { icon: Users, label: "Utilisateurs", href: "/users" },
  { icon: Car, label: "Trajets", href: "/trips" },
  { icon: Flag, label: "Incidents", href: "/incidents" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: BarChart3, label: "Statistiques", href: "/stats" },
  { icon: Shield, label: "Sécurité", href: "/security" },
]

interface NavigationMenuProps {
  onNavigate?: () => void
}

export function NavigationMenu({ onNavigate }: NavigationMenuProps) {
  return (
    <nav className="flex flex-col gap-2 p-4">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-lg font-bold">B</span>
        </div>
        <span className="font-bold">Blasira Admin</span>
      </div>
      {navItems.map((item) => (
        <Button key={item.href} variant="ghost" className="justify-start gap-3" onClick={onNavigate}>
          <item.icon className="h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
