"use client"
import {
  LayoutDashboard,
  Users,
  Car,
  AlertTriangle,
  Bell,
  ShieldCheck,
  MessageSquare,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import logo from "@/assets/logo.png"

const menuItems = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        title: "Tableau de bord",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Trajets",
        url: "/admin/trips",
        icon: Car,
      },
      {
        title: "Incidents",
        url: "/admin/incidents",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Sécurité",
    items: [
      {
        title: "Vérifications",
        url: "/admin/verifications",
        icon: ShieldCheck,
      },
      {
        title: "Signalements",
        url: "/admin/reports",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Notifications",
        url: "/admin/notifications",
        icon: Bell,
      },
      {
        title: "Support",
        url: "/admin/support",
        icon: MessageSquare,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="items-center justify-center py-3">
        <Image src={logo} alt="Blasira" width={72} height={72} priority />
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="relative transition-all hover:translate-x-0.5 data-[active=true]:ring-1 data-[active=true]:ring-sidebar-ring/40 data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-accent/20 data-[active=true]:to-sidebar-primary/10"
                    >
                      <Link href={item.url} className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-sidebar-primary opacity-0 data-[active=true]:opacity-100" />
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/settings"}>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
