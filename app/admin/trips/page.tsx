"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Search, Filter, Eye, CheckCircle, XCircle, MapPin, Calendar, Users, Car, X, ArrowUpDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const mockTrips = [
  {
    id: 1,
    driver: "Amadou Diallo",
    from: "Bamako Centre",
    to: "Université de Bamako",
    date: "2024-12-15",
    time: "08:00",
    price: 1500,
    seats: 3,
    available: 1,
    status: "pending",
    vehicle: "Toyota Corolla",
    type: "car",
  },
  {
    id: 2,
    driver: "Fatoumata Traoré",
    from: "Hippodrome",
    to: "ACI 2000",
    date: "2024-12-15",
    time: "14:30",
    price: 1000,
    seats: 2,
    available: 2,
    status: "active",
    vehicle: "Honda Moto",
    type: "moto",
  },
  {
    id: 3,
    driver: "Mamadou Keita",
    from: "Lafiabougou",
    to: "Point G",
    date: "2024-12-16",
    time: "07:00",
    price: 1200,
    seats: 4,
    available: 0,
    status: "completed",
    vehicle: "Peugeot 307",
    type: "car",
  },
  {
    id: 4,
    driver: "Ibrahim Coulibaly",
    from: "Magnambougou",
    to: "Sogoniko",
    date: "2024-12-16",
    time: "18:00",
    price: 800,
    seats: 1,
    available: 1,
    status: "cancelled",
    vehicle: "Yamaha Moto",
    type: "moto",
  },
]

export default function TripsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrip, setSelectedTrip] = useState<(typeof mockTrips)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; description?: string; onConfirm: () => void }>({ open: false, title: "", description: "", onConfirm: () => {} })
  const [sort, setSort] = useState<{ key: "driver" | "date" | "price" | "status"; dir: "asc" | "desc" }>({ key: "driver", dir: "asc" })
  const [density, setDensity] = useState<"spacious" | "compact">(() => (typeof window !== "undefined" ? (localStorage.getItem("trips:density") as "spacious" | "compact") || "spacious" : "spacious"))
  const [visible, setVisible] = useState<{ route: boolean; datetime: boolean; type: boolean; seats: boolean; price: boolean; status: boolean; actions: boolean }>(() => {
    if (typeof window === "undefined") {
      return { route: true, datetime: true, type: true, seats: true, price: true, status: true, actions: true }
    }
    const raw = localStorage.getItem("trips:visible")
    return raw ? JSON.parse(raw) : { route: true, datetime: true, type: true, seats: true, price: true, status: true, actions: true }
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTrip, setNewTrip] = useState({
    driver: "",
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    seats: "",
    type: "car",
  })

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch =
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || trip.status === filterStatus
    return matchesSearch && matchesFilter
  }).slice().sort((a, b) => {
    const dir = sort.dir === "asc" ? 1 : -1
    switch (sort.key) {
      case "driver":
        return a.driver.localeCompare(b.driver) * dir
      case "date":
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
      case "price":
        return (a.price - b.price) * dir
      case "status":
        return a.status.localeCompare(b.status) * dir
    }
  })

  // Client-side pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = filteredTrips.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedTrips = filteredTrips.slice(startIndex, endIndex)
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

  // Persist preferences
  React.useEffect(() => {
    try {
      localStorage.setItem("trips:density", density)
    } catch {}
  }, [density])
  React.useEffect(() => {
    try {
      localStorage.setItem("trips:visible", JSON.stringify(visible))
    } catch {}
  }, [visible])
  React.useEffect(() => {
    try {
      localStorage.setItem("trips:filterStatus", filterStatus)
      localStorage.setItem("trips:search", searchQuery)
    } catch {}
  }, [filterStatus, searchQuery])
  React.useEffect(() => {
    try {
      const fs = localStorage.getItem("trips:filterStatus")
      const sq = localStorage.getItem("trips:search")
      if (fs) setFilterStatus(fs)
      if (sq) setSearchQuery(sq)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModerateTrip = (tripId: number, approved: boolean) => {
    if (!approved) {
      setConfirmState({
        open: true,
        title: "Refuser ce trajet ?",
        description: "Le conducteur sera notifié du refus.",
        onConfirm: () => {
          toast({ title: "Trajet refusé", description: "Le conducteur a été notifié." })
          setConfirmState({ ...confirmState, open: false })
          setSelectedTrip(null)
        },
      })
      return
    }
    toast({
      title: "Trajet approuvé",
      description: "Le trajet est maintenant visible aux utilisateurs.",
    })
    setSelectedTrip(null)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      active: { label: "Actif", className: "bg-accent/10 text-accent border-accent/20" },
      completed: { label: "Terminé", className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
      cancelled: { label: "Annulé", className: "bg-destructive/10 text-destructive border-destructive/20" },
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
                <BreadcrumbPage>Trajets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary">Gestion des trajets</h1>
          <p className="text-muted-foreground">Modérez et surveillez tous les trajets de la plateforme</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des trajets</CardTitle>
            <CardDescription>Total: {mockTrips.length} trajets créés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Rechercher des trajets"
                  placeholder="Rechercher par conducteur ou lieu..."
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
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="completed">Terminés</SelectItem>
                    <SelectItem value="cancelled">Annulés</SelectItem>
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
                        <Checkbox checked={visible.route} onCheckedChange={(v) => setVisible({ ...visible, route: Boolean(v) })} />
                        Trajet
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.datetime} onCheckedChange={(v) => setVisible({ ...visible, datetime: Boolean(v) })} />
                        Date & heure
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.type} onCheckedChange={(v) => setVisible({ ...visible, type: Boolean(v) })} />
                        Type
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.seats} onCheckedChange={(v) => setVisible({ ...visible, seats: Boolean(v) })} />
                        Places
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.price} onCheckedChange={(v) => setVisible({ ...visible, price: Boolean(v) })} />
                        Prix
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.status} onCheckedChange={(v) => setVisible({ ...visible, status: Boolean(v) })} />
                        Statut
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.actions} onCheckedChange={(v) => setVisible({ ...visible, actions: Boolean(v) })} />
                        Actions
                      </label>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Car className="mr-2 h-4 w-4" />
                  Ajouter un trajet
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
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "driver", dir: s.key === "driver" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Conducteur
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    {visible.route && <TableHead>Trajet</TableHead>}
                    <TableHead>
                      {visible.datetime && <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "date", dir: s.key === "date" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Date & Heure
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>}
                    </TableHead>
                    {visible.type && <TableHead>Type</TableHead>}
                    {visible.seats && <TableHead>Places</TableHead>}
                    <TableHead>
                      {visible.price && <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "price", dir: s.key === "price" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Prix
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>}
                    </TableHead>
                    <TableHead>
                      {visible.status && <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "status", dir: s.key === "status" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Statut
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>}
                    </TableHead>
                    {visible.actions && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Empty className="border mt-4">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Car className="h-5 w-5" />
                            </EmptyMedia>
                            <EmptyTitle>Aucun trajet trouvé</EmptyTitle>
                            <EmptyDescription>Modifiez vos filtres ou réinitialisez la recherche.</EmptyDescription>
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
                  ) : paginatedTrips.map((trip) => (
                    <TableRow key={trip.id} className={density === "compact" ? "h-10" : "h-14"}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {trip.driver
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{trip.driver}</p>
                            <p className="text-xs text-muted-foreground">{trip.vehicle}</p>
                          </div>
                        </div>
                      </TableCell>
                      {visible.route && <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {trip.from}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-accent" />
                            {trip.to}
                          </div>
                        </div>
                      </TableCell>}
                      {visible.datetime && <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{trip.date}</span>
                          <span className="text-muted-foreground">à {trip.time}</span>
                        </div>
                      </TableCell>}
                      {visible.type && <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {trip.type === "car" ? <Car className="mr-1 h-3 w-3" /> : <span className="mr-1">🏍️</span>}
                          {trip.type === "car" ? "Voiture" : "Moto"}
                        </Badge>
                      </TableCell>}
                      {visible.seats && <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {trip.available}/{trip.seats}
                          </span>
                        </div>
                      </TableCell>}
                      {visible.price && <TableCell className="font-medium">{trip.price} FCFA</TableCell>}
                      {visible.status && <TableCell>{getStatusBadge(trip.status)}</TableCell>}
                      {visible.actions && <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button aria-label="Voir détails trajet" variant="ghost" size="icon" onClick={() => setSelectedTrip(trip)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {trip.status === "pending" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleModerateTrip(trip.id, true)}>
                                <CheckCircle className="h-4 w-4 text-accent" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleModerateTrip(trip.id, false)}>
                                <XCircle className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
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
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Ajouter un trajet */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Ajouter un trajet</DialogTitle>
            <DialogDescription>Renseignez les informations de base du trajet</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="trip-driver">Conducteur</Label>
              <Input
                id="trip-driver"
                value={newTrip.driver}
                onChange={(e) => setNewTrip({ ...newTrip, driver: e.target.value })}
                placeholder="Ex: Amadou Diallo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-from">Départ</Label>
              <Input
                id="trip-from"
                value={newTrip.from}
                onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })}
                placeholder="Ex: Bamako Centre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-to">Arrivée</Label>
              <Input
                id="trip-to"
                value={newTrip.to}
                onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })}
                placeholder="Ex: Université de Bamako"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-date">Date</Label>
              <Input
                id="trip-date"
                type="date"
                value={newTrip.date}
                onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-time">Heure</Label>
              <Input
                id="trip-time"
                type="time"
                value={newTrip.time}
                onChange={(e) => setNewTrip({ ...newTrip, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-price">Prix (FCFA)</Label>
              <Input
                id="trip-price"
                type="number"
                value={newTrip.price}
                onChange={(e) => setNewTrip({ ...newTrip, price: e.target.value })}
                placeholder="1500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-seats">Places</Label>
              <Input
                id="trip-seats"
                type="number"
                value={newTrip.seats}
                onChange={(e) => setNewTrip({ ...newTrip, seats: e.target.value })}
                placeholder="3"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newTrip.type} onValueChange={(v) => setNewTrip({ ...newTrip, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Voiture</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="secondary" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (!newTrip.driver || !newTrip.from || !newTrip.to || !newTrip.date || !newTrip.time) {
                  toast({ title: "Champs requis", description: "Renseignez conducteur, départ, arrivée, date et heure.", variant: "destructive" })
                  return
                }
                toast({ title: "Trajet ajouté", description: "Le trajet a été créé (simulé)." })
                setShowAddDialog(false)
                setNewTrip({ driver: "", from: "", to: "", date: "", time: "", price: "", seats: "", type: "car" })
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du trajet</DialogTitle>
            <DialogDescription>Informations complètes du trajet</DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{selectedTrip.driver}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTrip.vehicle}</p>
                </div>
                {getStatusBadge(selectedTrip.status)}
              </div>

              <div className="grid gap-4">
                <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Départ</p>
                    <p className="text-sm text-muted-foreground">{selectedTrip.from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <MapPin className="h-5 w-5 mt-0.5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Arrivée</p>
                    <p className="text-sm text-muted-foreground">{selectedTrip.to}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date et heure</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrip.date} à {selectedTrip.time}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Prix par place</p>
                  <p className="text-sm text-muted-foreground">{selectedTrip.price} FCFA</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Type de véhicule</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedTrip.type === "car" ? "Voiture" : "Moto"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Places disponibles</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrip.available} sur {selectedTrip.seats}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedTrip?.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => selectedTrip && handleModerateTrip(selectedTrip.id, false)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser
                </Button>
                <Button onClick={() => selectedTrip && handleModerateTrip(selectedTrip.id, true)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approuver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog (trips) */}
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
