"use client"

import React, { useState, useEffect } from "react"
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
import { Search, CheckCircle, XCircle, Eye, FileText, Mail, Phone, ShieldCheck, AlertTriangle } from "lucide-react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AdminService } from "@/services/AdminService"
import { VerificationRequest } from "@/models"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAuthHeaders } from "@/lib/auth"


// The structure used by the page's UI
interface DocumentDisplayItem {
  id: number | null;
  name: string; // e.g., "Carte d'identité", "Permis de conduire"
  uploaded: boolean;
  verified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_UPLOADED';
}

interface VerificationItem {
  id: number; // userId
  name: string;
  email: string;
  phone: string; // Still not available from endpoint, will be N/A
  type: 'student' | 'driver' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'; // Overall verification status for UI display
  documents: DocumentDisplayItem[];
  submittedDate: string;
}

export default function VerificationsPage() {
  const { toast } = useToast()
  const [verifications, setVerifications] = useState<VerificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<VerificationItem | null>(null)
  const [viewingDocument, setViewingDocument] = useState<{ url: string; title: string } | null>(null)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionType, setActionType] = useState<'document' | 'process' | null>(null)
  const [documentToRejectId, setDocumentToRejectId] = useState<number | null>(null)

  const adminService = React.useMemo(() => new AdminService(), [])

  // Helper to determine overall status from a list of documents
  const getStatusFromDocuments = (docs: DocumentDisplayItem[]): VerificationItem['status'] => {
    if (docs.some(doc => doc.status === 'REJECTED')) return 'rejected';
    if (docs.some(doc => doc.status === 'PENDING')) return 'pending';
    if (docs.every(doc => doc.status === 'APPROVED')) return 'approved';
    if (docs.every(doc => doc.status === 'NOT_UPLOADED')) return 'not_submitted';
    return 'pending'; // Fallback for mixed or unexpected states
  }

  const loadVerificationData = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data: VerificationRequest[] = await adminService.getDocumentVerifications()

      // Adapt VerificationRequest[] to VerificationItem[]
      const adaptedData = data.map((req): VerificationItem => {
        const getRoleType = (): VerificationItem['type'] => {
          if (req.roles.includes('ROLE_DRIVER')) return 'driver';
          if (req.roles.includes('ROLE_STUDENT')) return 'student';
          return 'user';
        }

        const roleType = getRoleType();
        const mainDocName = roleType === 'student' ? "Carte d'étudiant" : "Permis de conduire";

        const documents: DocumentDisplayItem[] = [];
        // Assuming only one main document per user for verification based on API response
        documents.push({
            id: req.documentId,
            name: mainDocName,
            uploaded: !!req.documentId,
            verified: req.documentStatus === 'APPROVED',
            status: req.documentStatus ? (req.documentStatus as DocumentDisplayItem['status']) : 'NOT_UPLOADED',
        });
        
        // Determine overall status for UI display
        const overallStatus = getStatusFromDocuments(documents);
        
        return {
          id: req.userId,
          name: `${req.firstName} ${req.lastName}`,
          email: req.email,
          phone: '', // Not available from endpoint, defaulting to empty string
          type: roleType,
          status: overallStatus,
          documents: documents,
          submittedDate: req.documentUploadDate ? new Date(req.documentUploadDate).toLocaleDateString('fr-FR') : 'N/A',
        }
      });

      setVerifications(adaptedData)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors du chargement des vérifications.",
      });
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors du chargement.")
    } finally {
      setIsLoading(false)
    }
  }, [adminService, toast])

  useEffect(() => {
    loadVerificationData()
  }, [loadVerificationData])

  const filteredVerifications = verifications.filter(
    (verification) =>
      verification.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Client-side pagination logic...
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
    const s = Math.max(2, current - 1)
    const e = Math.min(total - 1, current + 1)
    for (let p = s; p <= e; p++) pages.push(p)
    if (current < total - 2) pages.push("...")
    pages.push(total)
    return pages
  }

  const handleDocumentClick = async (doc: DocumentDisplayItem) => {
    if (!doc.id) {
      toast({
        variant: "destructive",
        title: "Document non disponible",
        description: `Ce document (${doc.name}) n'a pas encore été soumis.`,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/documents/${doc.id}/view`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Impossible de charger le document.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setViewingDocument({ url: objectUrl, title: doc.name });

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      });
    }
  }

  const handleApproveDocument = async (docId: number) => {
    try {
      await adminService.updateDocumentStatus(docId, { status: "APPROVED", rejectionReason: null });
      toast({
        title: "Document approuvé",
        description: "Le document a été marqué comme approuvé.",
      });
      setSelectedVerification(null);
      loadVerificationData(); // Reload data to reflect changes
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur d'approbation",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de l'approbation du document.",
      });
    }
  }

  const handleRejectDocumentInitiate = (docId: number) => {
    setDocumentToRejectId(docId);
    setActionType('document');
    setShowRejectionDialog(true);
  }

  const handleApproveProcess = async () => {
    if (!selectedVerification) return;
    try {
      await adminService.approveVerificationProcess(selectedVerification.id);
      toast({
        title: "Processus approuvé",
        description: "L'ensemble du processus de vérification a été approuvé.",
      });
      setSelectedVerification(null);
      loadVerificationData();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur d'approbation",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de l'approbation du processus.",
      });
    }
  }

  const handleRejectProcessInitiate = () => {
    setActionType('process');
    setShowRejectionDialog(true);
  }

  const handleConfirmRejection = async () => {
    if (!selectedVerification && actionType === 'process') return;
    try {
      if (actionType === 'document' && documentToRejectId !== null) {
        await adminService.updateDocumentStatus(documentToRejectId, { status: "REJECTED", rejectionReason: rejectionReason });
        toast({
          title: "Document rejeté",
          description: "Le document a été marqué comme rejeté.",
        });
      } else if (actionType === 'process' && selectedVerification) {
        await adminService.rejectVerificationProcess(selectedVerification.id, { reason: rejectionReason });
        toast({
          title: "Processus rejeté",
          description: "L'ensemble du processus de vérification a été rejeté.",
        });
      }
      setRejectionReason("");
      setDocumentToRejectId(null);
      setShowRejectionDialog(false);
      setSelectedVerification(null);
      loadVerificationData(); // Reload data to reflect changes
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur de rejet",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors du rejet.",
      });
    }
  }

  const getStatusBadge = (status: VerificationItem['status']) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      approved: { label: "Approuvé", className: "bg-accent/10 text-accent border-accent/20" },
      rejected: { label: "Refusé", className: "bg-destructive/10 text-destructive border-destructive/20" },
      not_submitted: { label: "Non soumis", className: "bg-muted text-muted-foreground" },
    }
    const variant = variants[status]
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }
  
  // Overall status of selected verification for modal footer
  const overallVerificationStatus = selectedVerification ? getStatusFromDocuments(selectedVerification.documents) : 'not_submitted';
  const hasPendingDocuments = selectedVerification?.documents.some(doc => doc.status === 'PENDING' || doc.status === 'NOT_UPLOADED');


  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="mr-2" />
        <span className="text-muted-foreground">Chargement des vérifications...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Alert variant="destructive" className="w-auto max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
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
                <p className="text-3xl font-bold">{verifications.filter((v) => v.status === "pending").length}</p>
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
                <p className="text-3xl font-bold">{verifications.filter((v) => v.status === "approved").length}</p>
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
                <p className="text-3xl font-bold">{verifications.length}</p>
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
                          {verification.phone || 'N/A'}
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
                        {verification.documents.filter((doc) => doc.uploaded).length} document(s)
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
                    {selectedVerification.documents.map((doc, index) => (
                        <div
                          key={doc.id || index}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div
                            className="flex items-center gap-3 flex-1 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleDocumentClick(doc)} // Clickable area for viewing
                          >
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.uploaded ? "Document soumis" : "Non soumis"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.status === 'APPROVED' ? (
                              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Vérifié
                              </Badge>
                            ) : doc.status === 'PENDING' ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Approuver"
                                  onClick={() => handleApproveDocument(doc.id!)} // Use ! because PENDING implies ID exists
                                >
                                  <CheckCircle className="h-4 w-4 text-accent" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Rejeter"
                                  onClick={() => handleRejectDocumentInitiate(doc.id!)}
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            ) : doc.status === 'REJECTED' ? (
                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                                  Rejeté
                                </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground">
                                Non soumis
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    )}
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
                      <p className="text-sm text-muted-foreground">{selectedVerification.phone || 'N/A'}</p>
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
          <DialogFooter className="sm:justify-between">
            {hasPendingDocuments && overallVerificationStatus === 'pending' && (
                <div className="text-sm text-muted-foreground">Veuillez approuver ou rejeter chaque document individuellement.</div>
            )}
            {!hasPendingDocuments && overallVerificationStatus === 'pending' && (
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" onClick={handleRejectProcessInitiate}>
                  Refuser le processus
                </Button>
                <Button onClick={handleApproveProcess}>
                  Finaliser l'approbation
                </Button>
              </div>
            )}
            {overallVerificationStatus === 'approved' && (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                Processus de vérification approuvé
              </Badge>
            )}
            {overallVerificationStatus === 'rejected' && (
              <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                Processus de vérification rejeté
              </Badge>
            )}
            {overallVerificationStatus === 'not_submitted' && (
              <Badge className="bg-muted text-muted-foreground">
                Aucun document soumis
              </Badge>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={(e) => {
          if (viewingDocument?.url) URL.revokeObjectURL(viewingDocument.url)
          setViewingDocument(null)
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{viewingDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {viewingDocument?.url && <img src={viewingDocument.url} alt="Document" className="w-full h-auto object-contain" />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Motif du rejet</DialogTitle>
            <DialogDescription>Veuillez indiquer la raison du rejet.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Raison du rejet..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowRejectionDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmRejection} disabled={!rejectionReason}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}