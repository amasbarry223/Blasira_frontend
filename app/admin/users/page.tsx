"use client"

import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, XCircle, Eye, Ban, Mail, UserPlus, Users, X, ArrowUpDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { AdminService } from "@/services/AdminService"
import { AdminUser } from "@/models"
import { Spinner } from "@/components/ui/spinner"

// Type pour les utilisateurs avec les données complètes pour l'affichage
type DisplayUser = AdminUser & {
  name: string;
  phone?: string;
  status: string;
  role: string;
  tripsCount?: number;
  rating?: number;
  joinedDate?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<DisplayUser | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    status: "active",
  })
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; description?: string; onConfirm: () => void }>({ open: false, title: "", description: "", onConfirm: () => {} })
  const [sort, setSort] = useState<{ key: "name" | "status" | "role" | "tripsCount" | "rating"; dir: "asc" | "desc" }>({ key: "name", dir: "asc" })
  const [density, setDensity] = useState<"spacious" | "compact">(() => (typeof window !== "undefined" ? (localStorage.getItem("users:density") as "spacious" | "compact") || "spacious" : "spacious"))
  const [visible, setVisible] = useState<{ contact: boolean; status: boolean; role: boolean; trips: boolean; rating: boolean; actions: boolean }>(() => {
    if (typeof window === "undefined") {
      return { contact: true, status: true, role: true, trips: true, rating: true, actions: true }
    }
    const raw = localStorage.getItem("users:visible")
    return raw ? JSON.parse(raw) : { contact: true, status: true, role: true, trips: true, rating: true, actions: true }
  })

  const adminService = React.useMemo(() => new AdminService(), [])

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const data = await adminService.getAllUsers()
        setUsers(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs'
        toast.error("Erreur", {
          description: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [adminService, toast])

  // Convertir les utilisateurs de l'API en format d'affichage
  const displayUsers: DisplayUser[] = users.map((user) => ({
    ...user,
    name: `${user.firstName} ${user.lastName}`,
    status: "active", // Par défaut, vous pouvez adapter selon vos besoins
    role: user.roles.includes("ROLE_ADMIN") ? "admin" : user.roles.includes("ROLE_USER") ? "user" : "user",
    tripsCount: 0, // À adapter si vous avez ces données
    rating: 0, // À adapter si vous avez ces données
    joinedDate: "", // À adapter si vous avez ces données
  }))

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Champs requis", {
        description: "Veuillez renseigner au minimum le nom et l'email.",
      })
      return
    }
    toast.success("Utilisateur ajouté", {
      description: `${newUser.name} a été créé avec succès.`,
    })
    setShowAddDialog(false)
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "student",
      status: "active",
    })
  }

  const filteredUsers = displayUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesFilter
  }).slice().sort((a, b) => {
    const dir = sort.dir === "asc" ? 1 : -1
    switch (sort.key) {
      case "name":
        return a.name.localeCompare(b.name) * dir
      case "status":
        return a.status.localeCompare(b.status) * dir
      case "role":
        return a.role.localeCompare(b.role) * dir
      case "tripsCount":
        return ((a.tripsCount || 0) - (b.tripsCount || 0)) * dir
      case "rating":
        return ((a.rating || 0) - (b.rating || 0)) * dir
    }
  })

  const totals = {
    all: displayUsers.length,
    verified: displayUsers.filter((u) => u.status === "verified").length,
    pending: displayUsers.filter((u) => u.status === "pending").length,
    active: displayUsers.filter((u) => u.status === "active").length,
    suspended: displayUsers.filter((u) => u.status === "suspended").length,
  }

  // Client-side pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  const getPageList = (total: number, current: number): (number | string)[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | string)[] = [1]
    if (current > 3) pages.push("...")
    const s = Math.max(2, current - 1)
    const e = Math.min(total - 1, current + 1)
    for (let p = s; p <= e; p++) pages.push(p)
    if (current < total - 2) pages.push("...")
    pages.push(total)
    return pages
  }

  const exportCsv = () => {
    const headers = ["Nom", "Email", "Téléphone", "Statut", "Rôle", "Trajets", "Note", "Inscription"]
    const rows = filteredUsers.map((u) => [u.name, u.email, u.phone, u.status, u.role, String(u.tripsCount), String(u.rating), u.joinedDate])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "utilisateurs.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Persist preferences
  React.useEffect(() => {
    try {
      localStorage.setItem("users:density", density)
    } catch {}
  }, [density])
  React.useEffect(() => {
    try {
      localStorage.setItem("users:visible", JSON.stringify(visible))
    } catch {}
  }, [visible])
  React.useEffect(() => {
    try {
      localStorage.setItem("users:filterStatus", filterStatus)
      localStorage.setItem("users:search", searchQuery)
    } catch {}
  }, [filterStatus, searchQuery])
  React.useEffect(() => {
    // restore filters on mount
    try {
      const fs = localStorage.getItem("users:filterStatus")
      const sq = localStorage.getItem("users:search")
      if (fs) setFilterStatus(fs)
      if (sq) setSearchQuery(sq)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleVerifyUser = (userId: number, verified: boolean) => {
    toast.success(verified ? "Utilisateur vérifié" : "Vérification refusée", {
      description: verified ? "L'utilisateur a reçu le badge vérifié." : "L'utilisateur a été notifié.",
    })
    setSelectedUser(null)
  }

  const handleSuspendUser = (userId: number) => {
    setConfirmState({
      open: true,
      title: "Suspendre l'utilisateur ?",
      description: "Cette action restreindra l'accès de l'utilisateur à la plateforme.",
      onConfirm: () => {
        toast.error("Utilisateur suspendu", {
          description: "L'utilisateur ne pourra plus accéder à la plateforme.",
        })
        setConfirmState({ ...confirmState, open: false })
      },
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      verified: { label: "Vérifié", className: "bg-accent/10 text-accent border-accent/20" },
      pending: { label: "En attente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      active: { label: "Actif", className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
      suspended: { label: "Suspendu", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    const variant = variants[status] || variants.active
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard">Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Utilisateurs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">Vérifiez, modérez et gérez tous les utilisateurs de la plateforme</p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-in fade-in slide-in-from-bottom-1">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{totals.all}</div>
            </CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-1">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Vérifiés</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-accent">{totals.verified}</div>
            </CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-1">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-chart-3">{totals.pending}</div>
            </CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-1">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Suspendus</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-destructive">{totals.suspended}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>Total: {users.length} utilisateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="mr-2" />
                <span className="text-muted-foreground">Chargement des utilisateurs...</span>
              </div>
            ) : (
              <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Rechercher des utilisateurs"
                  placeholder="Rechercher par nom ou email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="verified">Vérifiés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="suspended">Suspendus</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Affichage</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Densité</DropdownMenuLabel>
                    <div className="flex gap-2 px-2 py-1.5">
                      <Button
                        size="sm"
                        variant={density === "spacious" ? "secondary" : "outline"}
                        onClick={() => setDensity("spacious")}
                      >
                        Spacieux
                      </Button>
                      <Button
                        size="sm"
                        variant={density === "compact" ? "secondary" : "outline"}
                        onClick={() => setDensity("compact")}
                      >
                        Compact
                      </Button>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Colonnes</DropdownMenuLabel>
                    <div className="grid gap-1 px-2 py-1.5">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.contact} onCheckedChange={(v) => setVisible({ ...visible, contact: Boolean(v) })} />
                        Contact
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.status} onCheckedChange={(v) => setVisible({ ...visible, status: Boolean(v) })} />
                        Statut
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.role} onCheckedChange={(v) => setVisible({ ...visible, role: Boolean(v) })} />
                        Rôle
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.trips} onCheckedChange={(v) => setVisible({ ...visible, trips: Boolean(v) })} />
                        Trajets
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.rating} onCheckedChange={(v) => setVisible({ ...visible, rating: Boolean(v) })} />
                        Note
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.actions} onCheckedChange={(v) => setVisible({ ...visible, actions: Boolean(v) })} />
                        Actions
                      </label>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => setShowAddDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un utilisateur
                </Button>
                <Button variant="secondary" onClick={exportCsv}>
                  Export CSV
                </Button>
              </div>
            </div>

            {(searchQuery || filterStatus !== "all") && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <Button variant="secondary" size="sm" className="gap-1" onClick={() => setSearchQuery("")}>
                    <X className="h-3.5 w-3.5" />
                    Recherche: “{searchQuery}”
                  </Button>
                )}
                {filterStatus !== "all" && (
                  <Button variant="secondary" size="sm" className="gap-1" onClick={() => setFilterStatus("all")}>
                    <X className="h-3.5 w-3.5" />
                    Statut: {filterStatus}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setFilterStatus("all") }}>
                  Réinitialiser
                </Button>
              </div>
            )}

            <div className="rounded-lg border border-border">
              <Table className={density === "compact" ? "text-sm" : ""}>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "name", dir: s.key === "name" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Utilisateur
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    {visible.contact && <TableHead>Contact</TableHead>}
                    {visible.status && <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "status", dir: s.key === "status" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Statut
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>}
                    {visible.role && <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "role", dir: s.key === "role" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Rôle
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>}
                    {visible.trips && <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "tripsCount", dir: s.key === "tripsCount" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Trajets
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>}
                    {visible.rating && <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "rating", dir: s.key === "rating" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Note
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>}
                    {visible.actions && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Empty className="border mt-4">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Users className="h-5 w-5" />
                            </EmptyMedia>
                            <EmptyTitle>Aucun résultat</EmptyTitle>
                            <EmptyDescription>Modifiez les filtres ou réinitialisez votre recherche.</EmptyDescription>
                          </EmptyHeader>
                          <EmptyContent>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>Effacer la recherche</Button>
                              <Button variant="secondary" size="sm" onClick={() => setFilterStatus("all")}>Statut: Tous</Button>
                            </div>
                          </EmptyContent>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  ) : paginatedUsers.map((user) => (
                    <TableRow key={user.id} className={density === "compact" ? "h-10" : "h-14"}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`/.jpg?key=y3wxe&height=40&width=40&query=${user.name}`}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">Inscrit le {user.joinedDate}</p>
                          </div>
                        </div>
                      </TableCell>
                      {visible.contact && <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.phone}</p>
                        </div>
                      </TableCell>}
                      {visible.status && <TableCell>{getStatusBadge(user.status)}</TableCell>}
                      {visible.role && (
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className={
                                  role === "ROLE_ADMIN"
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {role === "ROLE_ADMIN" ? "Admin" : "Utilisateur"}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {visible.trips && <TableCell>{user.tripsCount}</TableCell>}
                      {visible.rating && <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{user.rating}</span>
                          <span className="text-xs text-muted-foreground">★</span>
                        </div>
                      </TableCell>}
                      {visible.actions && <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button aria-label="Voir détails utilisateur" variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.status === "pending" && (
                            <Button aria-label="Vérifier utilisateur" variant="ghost" size="icon" onClick={() => handleVerifyUser(user.id, true)}>
                              <CheckCircle className="h-4 w-4 text-accent" />
                            </Button>
                          )}
                          <Button aria-label="Suspendre utilisateur" variant="ghost" size="icon" onClick={() => handleSuspendUser(user.id)}>
                            <Ban className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between py-3">
              <div className="text-sm text-muted-foreground">
                {totalItems === 0 ? "Aucun élément à afficher" : `Affiche ${startIndex + 1}–${endIndex} sur ${totalItems}`}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Par page</span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                    <SelectTrigger className="w-[92px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        aria-disabled={currentPage === 1}
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setPage(currentPage - 1)
                        }}
                      />
                    </PaginationItem>
                    {getPageList(totalPages, currentPage).map((p, idx) =>
                      typeof p === "string" ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === currentPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setPage(p)
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        aria-disabled={currentPage === totalPages || totalItems === 0}
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setPage(currentPage + 1)
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Ajouter un utilisateur */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>Renseignez les informations de base</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-name">Nom complet</Label>
              <Input
                id="new-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Ex: Fatoumata Traoré"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="exemple@domaine.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-phone">Téléphone</Label>
              <Input
                id="new-phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+223 70 00 00 00"
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="driver">Conducteur</SelectItem>
                  <SelectItem value="passenger">Passager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={newUser.status}
                onValueChange={(v) => setNewUser({ ...newUser, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="verified">Vérifié</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="secondary" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateUser}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl sm:max-w-3xl w-[92vw] max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>Informations complètes et historique</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/.jpg?key=h8lly&height=64&width=64&query=${selectedUser.name}`}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(selectedUser.status)}
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date d'inscription</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.joinedDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nombre de trajets</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.tripsCount} trajets</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Note moyenne</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.rating} ★</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Documents vérifiés</p>
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carte d'identité</span>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email institutionnel</span>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Numéro de téléphone</span>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
              <Mail className="mr-2 h-4 w-4" />
              Envoyer un message
            </Button>
            </div>
            <div className="flex w-full sm:w-auto items-center justify-end gap-2 flex-wrap">
            {selectedUser?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => selectedUser && handleVerifyUser(selectedUser.id, false)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser
                </Button>
                <Button
                  onClick={() => selectedUser && handleVerifyUser(selectedUser.id, true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Vérifier
                </Button>
              </>
            )}
            {selectedUser?.status !== "suspended" && (
              <Button
                variant="destructive"
                onClick={() => selectedUser && handleSuspendUser(selectedUser.id)}
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspendre
              </Button>
            )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm dialog (users) */}
      <Dialog open={confirmState.open} onOpenChange={(v) => setConfirmState((s) => ({ ...s, open: v }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmState.title}</DialogTitle>
            {confirmState.description && <DialogDescription>{confirmState.description}</DialogDescription>}
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="secondary" onClick={() => setConfirmState((s) => ({ ...s, open: false }))}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmState.onConfirm}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
