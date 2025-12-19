"use client"

import React, { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
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
import { TripService } from "@/services/TripService"
import { AdminTrip } from "@/models/AdminTrip"
import { Skeleton } from "@/components/ui/skeleton"
import { getToken } from '@/lib/auth';

// Define the type for the trip data used within the component
type DisplayTrip = {
  id: number;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  available: number;
  status: "pending" | "active" | "completed" | "cancelled";
  vehicle: string;
  type: "car" | "moto";
};

export default function TripsPage() {
  const { toast } = useToast()
  
  // State for data, loading, and error
  const [trips, setTrips] = useState<DisplayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrip, setSelectedTrip] = useState<DisplayTrip | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; description?: string; onConfirm: () => void }>({ open: false, title: "", description: "", onConfirm: () => {} })
  const [sort, setSort] = useState<{ key: "driver" | "date" | "price" | "status"; dir: "asc" | "desc" }>({ key: "driver", dir: "asc" })
  const [density, setDensity] = useState<"spacious" | "compact">("spacious")
  const [visible, setVisible] = useState<{ route: boolean; datetime: boolean; type: boolean; seats: boolean; price: boolean; status: boolean; actions: boolean }>({ route: true, datetime: true, type: true, seats: true, price: true, status: true, actions: true })
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
    
  useEffect(() => {
    const token = getToken(); // Get token here
    const tripService = new TripService('/api', token); // Pass token to service
    setLoading(true);
    tripService.getAdminTrips()
      .then(data => {
        const transformedTrips: DisplayTrip[] = data.map(trip => ({
          id: trip.id,
          driver: trip.driverName,
          from: trip.departureAddress,
          to: trip.destinationAddress,
          date: new Date(trip.departureTime).toISOString().split('T')[0],
          time: new Date(trip.departureTime).toTimeString().split(' ')[0].substring(0, 5),
          price: trip.pricePerSeat,
          seats: trip.availableSeats, // Using availableSeats as total seats for now
          available: trip.availableSeats,
          status: "pending", // Default status, as it's not in the API response
          vehicle: trip.vehicleModel,
          type: "car", // Default type
        }));
        setTrips(transformedTrips);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch trips:", err);
        setError("Impossible de charger les trajets. Veuillez réessayer plus tard.");
        setLoading(false);
      });
  }, []);

  const filteredTrips = trips.filter((trip) => {
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
    const variant = variants[status] || variants.pending
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  const renderTableBody = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={`skeleton-${i}`} className={density === "compact" ? "h-10" : "h-14"}>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          {visible.route && <TableCell><Skeleton className="h-5 w-40" /></TableCell>}
          {visible.datetime && <TableCell><Skeleton className="h-5 w-24" /></TableCell>}
          {visible.type && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
          {visible.seats && <TableCell><Skeleton className="h-5 w-12" /></TableCell>}
          {visible.price && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
          {visible.status && <TableCell><Skeleton className="h-5 w-20" /></TableCell>}
          {visible.actions && <TableCell><Skeleton className="h-8 w-20" /></TableCell>}
        </TableRow>
      ));
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8}>
            <Empty className="border mt-4">
              <EmptyHeader><EmptyTitle className="text-destructive">{error}</EmptyTitle></EmptyHeader>
            </Empty>
          </TableCell>
        </TableRow>
      );
    }
    
    if (filteredTrips.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8}>
            <Empty className="border mt-4">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Car className="h-5 w-5" /></EmptyMedia>
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
      );
    }

    return paginatedTrips.map((trip) => (
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
    ));
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
            <CardDescription>Total: {totalItems} trajets trouvés</CardDescription>
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
                <Button onClick={() => setShowAddDialog(true)}>
                  <Car className="mr-2 h-4 w-4" />
                  Ajouter un trajet
                </Button>
              </div>
            </div>
            
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
                  {renderTableBody()}
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
    </div>
  )
}
