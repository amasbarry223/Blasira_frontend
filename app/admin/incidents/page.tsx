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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Filter, Eye, CheckCircle, AlertTriangle, Clock, X, ArrowUpDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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

const mockIncidents = [
  {
    id: 1,
    reporter: "Aissata Sanogo",
    reported: "Mamadou Keita",
    tripId: "TRP-001",
    type: "retard",
    severity: "low",
    status: "open",
    date: "2024-12-14",
    description: "Le conducteur est arrivé 30 minutes en retard sans prévenir",
  },
  {
    id: 2,
    reporter: "Ibrahim Coulibaly",
    reported: "Fatoumata Traoré",
    tripId: "TRP-045",
    type: "comportement",
    severity: "high",
    status: "investigating",
    date: "2024-12-13",
    description: "Comportement inapproprié pendant le trajet, langage offensant",
  },
  {
    id: 3,
    reporter: "Mariam Diarra",
    reported: "Amadou Diallo",
    tripId: "TRP-023",
    type: "annulation",
    severity: "medium",
    status: "resolved",
    date: "2024-12-12",
    description: "Trajet annulé au dernier moment sans justification",
  },
  {
    id: 4,
    reporter: "Sekou Touré",
    reported: "Aminata Keita",
    tripId: "TRP-067",
    type: "securite",
    severity: "high",
    status: "open",
    date: "2024-12-14",
    description: "Conduite dangereuse, excès de vitesse constaté",
  },
]

export default function IncidentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIncident, setSelectedIncident] = useState<(typeof mockIncidents)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; description?: string; onConfirm: () => void }>({ open: false, title: "", description: "", onConfirm: () => {} })
  const [sort, setSort] = useState<{ key: "reporter" | "severity" | "status" | "date"; dir: "asc" | "desc" }>({ key: "date", dir: "desc" })
  const [density, setDensity] = useState<"spacious" | "compact">(() => (typeof window !== "undefined" ? (localStorage.getItem("incidents:density") as "spacious" | "compact") || "spacious" : "spacious"))
  const [visible, setVisible] = useState<{ concerning: boolean; trip: boolean; type: boolean; severity: boolean; status: boolean; date: boolean; actions: boolean }>(() => {
    if (typeof window === "undefined") {
      return { concerning: true, trip: true, type: true, severity: true, status: true, date: true, actions: true }
    }
    const raw = localStorage.getItem("incidents:visible")
    return raw ? JSON.parse(raw) : { concerning: true, trip: true, type: true, severity: true, status: true, date: true, actions: true }
  })

  const filteredIncidents = mockIncidents.filter((incident) => {
    const matchesSearch =
      incident.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reported.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.tripId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || incident.status === filterStatus
    return matchesSearch && matchesFilter
  }).slice().sort((a, b) => {
    const dir = sort.dir === "asc" ? 1 : -1
    switch (sort.key) {
      case "reporter":
        return a.reporter.localeCompare(b.reporter) * dir
      case "severity":
        return a.severity.localeCompare(b.severity) * dir
      case "status":
        return a.status.localeCompare(b.status) * dir
      case "date":
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
    }
  })

  // Client-side pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = filteredIncidents.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex)
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
      localStorage.setItem("incidents:density", density)
    } catch {}
  }, [density])
  React.useEffect(() => {
    try {
      localStorage.setItem("incidents:visible", JSON.stringify(visible))
    } catch {}
  }, [visible])
  React.useEffect(() => {
    try {
      localStorage.setItem("incidents:filterStatus", filterStatus)
      localStorage.setItem("incidents:search", searchQuery)
    } catch {}
  }, [filterStatus, searchQuery])
  React.useEffect(() => {
    try {
      const fs = localStorage.getItem("incidents:filterStatus")
      const sq = localStorage.getItem("incidents:search")
      if (fs) setFilterStatus(fs)
      if (sq) setSearchQuery(sq)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleResolveIncident = (incidentId: number, resolution: string) => {
    setConfirmState({
      open: true,
      title: "Marquer comme résolu ?",
      description: "Une notification sera envoyée aux parties concernées.",
      onConfirm: () => {
        toast({
          title: "Incident résolu",
          description: "L'incident a été marqué comme résolu et les parties ont été notifiées.",
        })
        setConfirmState({ ...confirmState, open: false })
        setSelectedIncident(null)
      },
    })
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      low: { label: "Faible", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      medium: { label: "Moyen", className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
      high: { label: "Élevé", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    const variant = variants[severity] || variants.medium
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      open: { label: "Ouvert", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
      investigating: { label: "En cours", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      resolved: { label: "Résolu", className: "bg-accent/10 text-accent border-accent/20" },
    }
    const variant = variants[status] || variants.open
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      retard: "Retard",
      comportement: "Comportement",
      annulation: "Annulation",
      securite: "Sécurité",
    }
    return types[type] || type
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
                <BreadcrumbPage>Incidents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary">Gestion des incidents</h1>
          <p className="text-muted-foreground">Surveillez et résolvez les incidents signalés par les utilisateurs</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Incidents ouverts</p>
                  <p className="text-3xl font-bold">{mockIncidents.filter((i) => i.status === "open").length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">En investigation</p>
                  <p className="text-3xl font-bold">
                    {mockIncidents.filter((i) => i.status === "investigating").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Résolus ce mois</p>
                  <p className="text-3xl font-bold">{mockIncidents.filter((i) => i.status === "resolved").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des incidents</CardTitle>
            <CardDescription>Total: {mockIncidents.length} incidents signalés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Rechercher des incidents"
                  placeholder="Rechercher par utilisateur ou trajet..."
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
                    <SelectItem value="open">Ouverts</SelectItem>
                    <SelectItem value="investigating">En cours</SelectItem>
                    <SelectItem value="resolved">Résolus</SelectItem>
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
                        <Checkbox checked={visible.concerning} onCheckedChange={(v) => setVisible({ ...visible, concerning: Boolean(v) })} />
                        Concernant
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.trip} onCheckedChange={(v) => setVisible({ ...visible, trip: Boolean(v) })} />
                        Trajet
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.type} onCheckedChange={(v) => setVisible({ ...visible, type: Boolean(v) })} />
                        Type
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.severity} onCheckedChange={(v) => setVisible({ ...visible, severity: Boolean(v) })} />
                        Gravité
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.status} onCheckedChange={(v) => setVisible({ ...visible, status: Boolean(v) })} />
                        Statut
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.date} onCheckedChange={(v) => setVisible({ ...visible, date: Boolean(v) })} />
                        Date
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={visible.actions} onCheckedChange={(v) => setVisible({ ...visible, actions: Boolean(v) })} />
                        Actions
                      </label>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "reporter", dir: s.key === "reporter" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Signalé par
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    {visible.concerning && <TableHead>Concernant</TableHead>}
                    {visible.trip && <TableHead>Trajet</TableHead>}
                    {visible.type && <TableHead>Type</TableHead>}
                    <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "severity", dir: s.key === "severity" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Gravité
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    {visible.status && <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "status", dir: s.key === "status" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Statut
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>}
                    {visible.date && <TableHead>
                      <Button variant="ghost" className="px-0" onClick={() => setSort((s) => ({ key: "date", dir: s.key === "date" && s.dir === "asc" ? "desc" : "asc" }))}>
                        Date
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableHead>}
                    {visible.actions && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIncidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Empty className="border mt-4">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <AlertTriangle className="h-5 w-5" />
                            </EmptyMedia>
                            <EmptyTitle>Aucun incident trouvé</EmptyTitle>
                            <EmptyDescription>Modifiez les filtres ou réinitialisez la recherche.</EmptyDescription>
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
                  ) : paginatedIncidents.map((incident) => (
                    <TableRow key={incident.id} className={density === "compact" ? "h-10" : "h-14"}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {incident.reporter
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{incident.reporter}</span>
                        </div>
                      </TableCell>
                      {visible.concerning && <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {incident.reported
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{incident.reported}</span>
                        </div>
                      </TableCell>}
                      {visible.trip && <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {incident.tripId}
                        </Badge>
                      </TableCell>}
                      {visible.type && <TableCell>
                        <span className="text-sm capitalize">{getTypeLabel(incident.type)}</span>
                      </TableCell>}
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      {visible.status && <TableCell>{getStatusBadge(incident.status)}</TableCell>}
                      {visible.date && <TableCell className="text-sm text-muted-foreground">{incident.date}</TableCell>}
                      {visible.actions && <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button aria-label="Voir détails incident" variant="ghost" size="icon" onClick={() => setSelectedIncident(incident)}>
                            <Eye className="h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'incident</DialogTitle>
            <DialogDescription>Informations complètes et résolution</DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Incident #{selectedIncident.id}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedIncident.status)}
                    {getSeverityBadge(selectedIncident.severity)}
                    <Badge variant="outline" className="capitalize">
                      {getTypeLabel(selectedIncident.type)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-2">Signalé par</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedIncident.reporter
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedIncident.reporter}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-2">Concernant</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedIncident.reported
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedIncident.reported}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Trajet concerné</p>
                  <p className="text-sm text-muted-foreground">{selectedIncident.tripId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date du signalement</p>
                  <p className="text-sm text-muted-foreground">{selectedIncident.date}</p>
                </div>
              </div>

              {selectedIncident.status !== "resolved" && (
                <div className="space-y-2">
                  <Label htmlFor="resolution">Résolution</Label>
                  <Textarea
                    id="resolution"
                    placeholder="Décrivez les actions prises pour résoudre cet incident..."
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedIncident?.status !== "resolved" && (
              <Button onClick={() => selectedIncident && handleResolveIncident(selectedIncident.id, "resolved")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer comme résolu
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog (incidents) */}
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
            <Button onClick={confirmState.onConfirm}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
