"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle, XCircle, Eye, FileText, Mail, Phone, ShieldCheck } from "lucide-react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const mockVerifications = [
  {
    id: 1,
    name: "Amadou Diarra",
    email: "amadou.diarra@univ.ml",
    phone: "+223 70 12 34 56",
    type: "student",
    status: "pending",
    documents: {
      idCard: { uploaded: true, verified: false },
      institutionalEmail: { uploaded: true, verified: false },
      phoneNumber: { uploaded: true, verified: true },
    },
    submittedDate: "2024-12-14",
  },
  {
    id: 2,
    name: "Fatoumata Keita",
    email: "fatoumata.k@gmail.com",
    phone: "+223 75 98 76 54",
    type: "driver",
    status: "pending",
    documents: {
      idCard: { uploaded: true, verified: false },
      driversLicense: { uploaded: true, verified: false },
      vehicleRegistration: { uploaded: true, verified: false },
      phoneNumber: { uploaded: true, verified: true },
    },
    submittedDate: "2024-12-13",
  },
  {
    id: 3,
    name: "Ibrahim Touré",
    email: "ibrahim.t@univ.ml",
    phone: "+223 76 54 32 10",
    type: "student",
    status: "approved",
    documents: {
      idCard: { uploaded: true, verified: true },
      institutionalEmail: { uploaded: true, verified: true },
      phoneNumber: { uploaded: true, verified: true },
    },
    submittedDate: "2024-12-10",
  },
]

export default function VerificationsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<(typeof mockVerifications)[0] | null>(null)

  const filteredVerifications = mockVerifications.filter(
    (verification) =>
      verification.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Client-side pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = filteredVerifications.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedVerifications = filteredVerifications.slice(startIndex, endIndex)
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

  const handleVerify = (id: number, approved: boolean) => {
    toast({
      title: approved ? "Vérification approuvée" : "Vérification refusée",
      description: approved
        ? "L'utilisateur a reçu son badge de vérification."
        : "L'utilisateur a été notifié et peut soumettre de nouveaux documents.",
    })
    setSelectedVerification(null)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      approved: { label: "Approuvé", className: "bg-accent/10 text-accent border-accent/20" },
      rejected: { label: "Refusé", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    const variant = variants[status] || variants.pending
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Vérifications d'identité</h1>
        <p className="text-muted-foreground">Vérifiez les documents et accordez les badges aux utilisateurs</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold">{mockVerifications.filter((v) => v.status === "pending").length}</p>
              </div>
              <FileText className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Approuvés</p>
                <p className="text-3xl font-bold">{mockVerifications.filter((v) => v.status === "approved").length}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{mockVerifications.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de vérification</CardTitle>
          <CardDescription>Examinez et validez les documents des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
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
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVerifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`/.jpg?height=40&width=40&query=${verification.name}`}
                          />
                          <AvatarFallback>
                            {verification.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{verification.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {verification.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {verification.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {verification.type === "student" ? "Étudiant" : "Conducteur"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {Object.values(verification.documents).filter((doc) => doc.uploaded).length} documents
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{verification.submittedDate}</TableCell>
                    <TableCell>{getStatusBadge(verification.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedVerification(verification)}>
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

      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vérification de documents</DialogTitle>
            <DialogDescription>Examinez les documents soumis par l'utilisateur</DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/.jpg?height=64&width=64&query=${selectedVerification.name}`}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedVerification.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedVerification.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedVerification.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(selectedVerification.status)}
                    <Badge variant="outline" className="capitalize">
                      {selectedVerification.type === "student" ? "Étudiant" : "Conducteur"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="info">Informations</TabsTrigger>
                </TabsList>
                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(selectedVerification.documents).map(([key, doc]) => {
                      const labels: Record<string, string> = {
                        idCard: "Carte d'identité",
                        institutionalEmail: "Email institutionnel",
                        phoneNumber: "Numéro de téléphone",
                        driversLicense: "Permis de conduire",
                        vehicleRegistration: "Carte grise",
                      }
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{labels[key]}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.uploaded ? "Document soumis" : "Non soumis"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified ? (
                              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Vérifié
                              </Badge>
                            ) : doc.uploaded ? (
                              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                                En attente
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">
                                Non soumis
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="info" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedVerification.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">{selectedVerification.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Type de compte</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedVerification.type === "student" ? "Étudiant" : "Conducteur"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Date de soumission</p>
                      <p className="text-sm text-muted-foreground">{selectedVerification.submittedDate}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            {selectedVerification?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => selectedVerification && handleVerify(selectedVerification.id, false)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser
                </Button>
                <Button onClick={() => selectedVerification && handleVerify(selectedVerification.id, true)}>
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
