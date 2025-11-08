"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Search, MessageSquare, Clock, CheckCircle, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockTickets = [
  {
    id: 1,
    user: "Amadou Diarra",
    subject: "Problème de paiement",
    category: "payment",
    priority: "high",
    status: "open",
    message: "Je n'arrive pas à effectuer mon paiement pour le trajet",
    date: "2024-12-14",
  },
  {
    id: 2,
    user: "Fatoumata Keita",
    subject: "Compte bloqué",
    category: "account",
    priority: "high",
    status: "open",
    message: "Mon compte a été bloqué sans raison apparente",
    date: "2024-12-14",
  },
  {
    id: 3,
    user: "Ibrahim Touré",
    subject: "Question sur la vérification",
    category: "verification",
    priority: "medium",
    status: "pending",
    message: "Combien de temps prend la vérification des documents?",
    date: "2024-12-13",
  },
  {
    id: 4,
    user: "Mariam Sanogo",
    subject: "Remboursement",
    category: "payment",
    priority: "medium",
    status: "resolved",
    message: "Je souhaite être remboursée pour un trajet annulé",
    date: "2024-12-12",
  },
]

export default function SupportPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<(typeof mockTickets)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || ticket.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Client-side pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = filteredTickets.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex)
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

  const handleResolve = (id: number) => {
    toast({
      title: "Ticket résolu",
      description: "L'utilisateur a été notifié de la résolution.",
    })
    setSelectedTicket(null)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      open: { label: "Ouvert", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
      pending: { label: "En attente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      resolved: { label: "Résolu", className: "bg-accent/10 text-accent border-accent/20" },
    }
    const variant = variants[status] || variants.open
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      low: { label: "Basse", className: "bg-muted/10 text-muted-foreground border-muted/20" },
      medium: { label: "Moyenne", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      high: { label: "Haute", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    const variant = variants[priority] || variants.medium
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      payment: "Paiement",
      account: "Compte",
      verification: "Vérification",
      technical: "Technique",
      other: "Autre",
    }
    return labels[category] || category
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Support utilisateur</h1>
        <p className="text-muted-foreground">Gérez les demandes d'assistance et les questions des utilisateurs</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tickets ouverts</p>
                <p className="text-3xl font-bold">{mockTickets.filter((t) => t.status === "open").length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold">{mockTickets.filter((t) => t.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Résolus</p>
                <p className="text-3xl font-bold">{mockTickets.filter((t) => t.status === "resolved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{mockTickets.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets de support</CardTitle>
          <CardDescription>Demandes d'assistance des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par utilisateur ou sujet..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="open">Ouverts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="resolved">Résolus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/.jpg?height=32&width=32&query=${ticket.user}`} />
                          <AvatarFallback className="text-xs">
                            {ticket.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{ticket.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell className="text-sm">{getCategoryLabel(ticket.category)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ticket.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(ticket)}>
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

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du ticket</DialogTitle>
            <DialogDescription>Ticket #{selectedTicket?.id}</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/.jpg?height=48&width=48&query=${selectedTicket.user}`} />
                  <AvatarFallback>
                    {selectedTicket.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedTicket.user}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTicket.subject}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                    <Badge variant="outline">{getCategoryLabel(selectedTicket.category)}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm leading-relaxed">{selectedTicket.message}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Réponse</Label>
                <Textarea
                  id="response"
                  placeholder="Écrivez votre réponse à l'utilisateur..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Date de création</p>
                <p className="text-sm text-muted-foreground">{selectedTicket.date}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedTicket?.status !== "resolved" && (
              <>
                <Button variant="outline">Enregistrer</Button>
                <Button onClick={() => selectedTicket && handleResolve(selectedTicket.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Résoudre et fermer
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
