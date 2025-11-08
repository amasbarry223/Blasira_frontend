"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Eye, Flag, Ban, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const mockReports = [
  {
    id: 1,
    reporter: "Mariam Diarra",
    reported: "Sekou Traoré",
    reason: "Comportement inapproprié",
    description: "Langage offensant et attitude irrespectueuse pendant le trajet",
    date: "2024-12-14",
    status: "open",
    tripId: "TRP-089",
  },
  {
    id: 2,
    reporter: "Amadou Keita",
    reported: "Fatoumata Sanogo",
    reason: "Non-respect des règles",
    description: "A fumé dans le véhicule malgré l'interdiction",
    date: "2024-12-13",
    status: "reviewing",
    tripId: "TRP-067",
  },
  {
    id: 3,
    reporter: "Ibrahim Coulibaly",
    reported: "Aissata Touré",
    reason: "Annulation abusive",
    description: "Annulation répétée de trajets au dernier moment",
    date: "2024-12-12",
    status: "resolved",
    tripId: "TRP-045",
  },
  {
    id: 4,
    reporter: "Seydou Diallo",
    reported: "Mamadou Koné",
    reason: "Conduite dangereuse",
    description: "Excès de vitesse et conduite imprudente",
    date: "2024-12-14",
    status: "open",
    tripId: "TRP-102",
  },
]

export default function ReportsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null)

  const filteredReports = mockReports.filter(
    (report) =>
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reported.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Client-side pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = filteredReports.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedReports = filteredReports.slice(startIndex, endIndex)
  const getPageList = (total: number, current: number): (number | string)[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | string)[] = [1]
    if (current > 3) pages.push("...")
    const start = Math.max(2, current - 1)
    const stop = Math.min(total - 1, current + 1)
    for (let p = start; p <= stop; p++) pages.push(p)
    if (current < total - 2) pages.push("...")
    pages.push(total)
    return pages
  }

  const handleAction = (id: number, action: string) => {
    const actions: Record<string, string> = {
      ban: "Utilisateur suspendu",
      warning: "Avertissement envoyé",
      close: "Signalement fermé",
    }
    toast({
      title: actions[action],
      description: "L'action a été effectuée avec succès.",
    })
    setSelectedReport(null)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      open: { label: "Ouvert", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
      reviewing: { label: "En cours", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      resolved: { label: "Résolu", className: "bg-accent/10 text-accent border-accent/20" },
    }
    const variant = variants[status] || variants.open
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Signalements</h1>
        <p className="text-muted-foreground">Gérez les signalements de comportements inappropriés</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ouverts</p>
                <p className="text-3xl font-bold">{mockReports.filter((r) => r.status === "open").length}</p>
              </div>
              <Flag className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">En cours</p>
                <p className="text-3xl font-bold">{mockReports.filter((r) => r.status === "reviewing").length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Résolus</p>
                <p className="text-3xl font-bold">{mockReports.filter((r) => r.status === "resolved").length}</p>
              </div>
              <Ban className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des signalements</CardTitle>
          <CardDescription>Signalements de comportements et violations des règles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

            <div className="rounded-lg border border-border">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signalé par</TableHead>
                  <TableHead>Utilisateur concerné</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {paginatedReports.map((report) => (
                   <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/.jpg?height=32&width=32&query=${report.reporter}`} />
                          <AvatarFallback className="text-xs">
                            {report.reporter
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{report.reporter}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/.jpg?height=32&width=32&query=${report.reported}`} />
                          <AvatarFallback className="text-xs">
                            {report.reported
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{report.reported}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{report.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {report.tripId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du signalement</DialogTitle>
            <DialogDescription>Examinez et prenez action sur ce signalement</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Signalement #{selectedReport.id}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-2">Signalé par</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`/.jpg?height=40&width=40&query=${selectedReport.reporter}`}
                      />
                      <AvatarFallback>
                        {selectedReport.reporter
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedReport.reporter}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-2">Utilisateur concerné</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`/.jpg?height=40&width=40&query=${selectedReport.reported}`}
                      />
                      <AvatarFallback>
                        {selectedReport.reported
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedReport.reported}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Trajet concerné</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.tripId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date du signalement</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.date}</p>
                </div>
              </div>

              {selectedReport.status !== "resolved" && (
                <div className="space-y-2">
                  <Label htmlFor="action-notes">Notes d'action</Label>
                  <Textarea id="action-notes" placeholder="Décrivez les mesures prises..." className="min-h-[100px]" />
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedReport?.status !== "resolved" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => selectedReport && handleAction(selectedReport.id, "warning")}
                  className="w-full sm:w-auto"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Avertir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => selectedReport && handleAction(selectedReport.id, "close")}
                  className="w-full sm:w-auto"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Clore
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedReport && handleAction(selectedReport.id, "ban")}
                  className="w-full sm:w-auto"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Suspendre
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
