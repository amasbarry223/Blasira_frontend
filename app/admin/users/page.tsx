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
import { Search, Filter, CheckCircle, XCircle, Eye, Ban, Mail, UserPlus, Users, X, ArrowUpDown, PencilIcon } from "lucide-react"
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
import { AdminService, UpdateUserRequest } from "@/services/AdminService"
import { AuthService } from "@/services/AuthService"
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

const initialNewUserState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  acceptedTrustCharter: true, // Default to true for admin creation
  role: "user", // Default role
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<DisplayUser | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<UpdateUserRequest>>({})
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newUser, setNewUser] = useState(initialNewUserState)
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
  const authService = React.useMemo(() => new AuthService(), [])

  const loadUsers = React.useCallback(async () => {
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
  }, [adminService])


  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Convertir les utilisateurs de l'API en format d'affichage
  const displayUsers: DisplayUser[] = users.map((user) => {
    const getRole = (roles: string[]) => {
      if (roles.includes("ROLE_ADMIN")) return "admin"
      if (roles.includes("ROLE_DRIVER")) return "driver"
      if (roles.includes("ROLE_STUDENT")) return "student"
      if (roles.includes("ROLE_USER")) return "user"
      return "user"
    }
    
    return {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      status: "active", // API does not provide this, so we keep a default
      role: getRole(user.roles),
      tripsCount: user.nombreDeTrajet,
      rating: user.note,
      joinedDate: "", // API does not provide this
    }
  })

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || !newUser.phoneNumber) {
      toast.error("Champs requis", {
        description: "Veuillez remplir tous les champs obligatoires.",
      })
      return
    }

    try {
      const response = await authService.signup({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
        phoneNumber: newUser.phoneNumber,
        acceptedTrustCharter: newUser.acceptedTrustCharter,
      })
      
      toast.success("Utilisateur ajouté", {
        description: response.message || `${newUser.firstName} ${newUser.lastName} a été créé avec succès.`,
      })
      
      setShowAddDialog(false)
      setNewUser(initialNewUserState)
      await loadUsers() // Recharger la liste des utilisateurs

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue."
      toast.error("Échec de la création", {
        description: errorMessage,
      })
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser || !editedUser) return;

    try {
      // @ts-ignore
      const updatedUser = await adminService.updateUser(selectedUser.id, editedUser);
      toast.success("Utilisateur mis à jour", {
        description: `${updatedUser.firstName} ${updatedUser.lastName} a été mis à jour avec succès.`,
      });
      setIsEditMode(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
      toast.error("Échec de la mise à jour", {
        description: errorMessage,
      });
    }
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
                          <Button
                            aria-label="Modifier utilisateur"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user)
                              setEditedUser({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                phoneNumber: user.phone || '',
                                roles: user.roles,
                              })
                              setIsEditMode(true)
                            }}
                          >
                            <PencilIcon className="h-4 w-4" />
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
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>Renseignez les informations pour créer un nouveau compte.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-firstName">Prénom</Label>
              <Input
                id="new-firstName"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                placeholder="Ex: Fatoumata"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-lastName">Nom</Label>
              <Input
                id="new-lastName"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                placeholder="Ex: Traoré"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
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
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                placeholder="+223 70 00 00 00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
              <Checkbox
                id="new-acceptedTrustCharter"
                checked={newUser.acceptedTrustCharter}
                onCheckedChange={(checked) => setNewUser({ ...newUser, acceptedTrustCharter: Boolean(checked) })}
              />
              <Label htmlFor="new-acceptedTrustCharter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                L'utilisateur accepte la charte de confiance
              </Label>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="secondary" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateUser}>
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedUser} onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null)
          setIsEditMode(false)
        }
      }}>
        <DialogContent className="max-w-3xl sm:max-w-3xl w-[92vw] max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Modifier l'utilisateur" : "Détails de l'utilisateur"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Modifiez les informations ci-dessous." : "Informations complètes et historique."}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
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
                  {isEditMode ? (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="edit-firstName">Prénom</Label>
                        <Input
                          id="edit-firstName"
                          value={editedUser.firstName || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lastName">Nom</Label>
                        <Input
                          id="edit-lastName"
                          value={editedUser.lastName || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  )}
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Téléphone</p>
                  {isEditMode ? (
                     <Input
                        value={editedUser.phoneNumber || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
                      />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  {isEditMode ? (
                     <Input
                        type="email"
                        value={editedUser.email || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date d'inscription</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.joinedDate || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nombre de trajets</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.tripsCount} trajets</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Note moyenne</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.rating} ★</p>
                </div>
                 {isEditMode && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Nouveau mot de passe (optionnel)</p>
                     <Input
                        type="password"
                        placeholder="Laisser vide pour ne pas changer"
                        onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                      />
                  </div>
                 )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>Annuler</Button>
                <Button onClick={handleUpdateUser}>Enregistrer</Button>
              </>
            ) : (
              <Button onClick={() => {
                setEditedUser({
                  firstName: selectedUser?.firstName,
                  lastName: selectedUser?.lastName,
                  email: selectedUser?.email,
                  phoneNumber: selectedUser?.phone || '',
                  roles: selectedUser?.roles,
                })
                setIsEditMode(true)
              }}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
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
