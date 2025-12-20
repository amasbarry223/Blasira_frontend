"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
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
import { Search, MessageSquare, Clock, CheckCircle, Eye, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SupportService, MessageService } from "@/services"
import { SupportTicket, PaginatedSupportTickets } from "@/models"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sanitizeHTML } from "@/lib/utils"

export default function SupportPage() {
  const { toast } = useToast()
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedSupportTickets | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const supportService = useMemo(() => new SupportService(), [])
  const messageService = useMemo(() => new MessageService(), [])

  const loadTickets = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await supportService.getTickets({ page, limit: pageSize, status: filterStatus, search: searchQuery })
      setPaginatedResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setIsLoading(false)
    }
  }, [supportService, page, pageSize, filterStatus, searchQuery])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])
  
  const handleOpenTicket = async (ticketId: number) => {
    setIsModalLoading(true);
    try {
        const fullTicket = await supportService.getTicketById(ticketId);
        setSelectedTicket(fullTicket);
    } catch(err) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les détails du ticket.",
        });
    } finally {
        setIsModalLoading(false);
    }
  }

  const handleResolve = async (id: number) => {
    try {
      await supportService.updateTicketStatus(id, "RESOLVED");
      toast({
        title: "Ticket résolu",
        description: "L'utilisateur a été notifié de la résolution.",
      })
      setSelectedTicket(null);
      loadTickets(); // Refresh the list
    } catch(err) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de résoudre le ticket.",
        });
    }
  }

  const handleReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;
    setIsModalLoading(true);
    try {
      await messageService.sendMessage({ 
        recipientId: selectedTicket.user.id,
        content: replyContent 
      });
      setReplyContent("");
      toast({
        title: "Réponse envoyée",
      });
      
      // Add a small delay to allow the backend to process the new message
      await new Promise(resolve => setTimeout(resolve, 500));

      // Re-fetch the ticket to get the new message and ensure UI consistency
      await handleOpenTicket(selectedTicket.id); 
    } catch(err) {
      toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'envoyer la réponse.",
        });
    } finally {
      // Keep the modal loading state consistent with the re-fetch
      // setIsModalLoading(false) will be called inside handleOpenTicket
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      OPEN: { label: "Ouvert", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
      PENDING: { label: "En attente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      RESOLVED: { label: "Résolu", className: "bg-accent/10 text-accent border-accent/20" },
    }
    const variant = variants[status] || variants.OPEN
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      LOW: { label: "Basse", className: "bg-muted/10 text-muted-foreground border-muted/20" },
      MEDIUM: { label: "Moyenne", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
      HIGH: { label: "Haute", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    const variant = variants[priority] || variants.MEDIUM
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      PAYMENT: "Paiement",
      ACCOUNT: "Compte",
      VERIFICATION: "Vérification",
      TECHNICAL: "Technique",
      PROFILE: "Profil",
      OTHER: "Autre",
    }
    return labels[category] || category
  }

  if (isLoading && !paginatedResponse) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="mr-2" />
        <span className="text-muted-foreground">Chargement des tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Alert variant="destructive" className="w-auto max-w-lg">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const tickets = paginatedResponse?.data || [];
  const pagination = paginatedResponse?.pagination;
  const totalItems = pagination?.totalItems || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Support utilisateur</h1>
        <p className="text-muted-foreground">Gérez les demandes d'assistance et les questions des utilisateurs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets de support</CardTitle>
          <CardDescription>Total: {totalItems} demandes</CardDescription>
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
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="OPEN">Ouverts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="RESOLVED">Résolus</SelectItem>
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
                  <TableHead>Dernière MàJ</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                    <TableRow><TableCell colSpan={7} className="text-center py-12"><Spinner /></TableCell></TableRow>
                )}
                {!isLoading && tickets.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-12">Aucun ticket trouvé.</TableCell></TableRow>
                )}
                {!isLoading && tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell><span className="text-sm font-medium">{ticket.user?.name || 'N/A'}</span></TableCell>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell className="text-sm">{getCategoryLabel(ticket.category)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(ticket.lastUpdatedAt).toLocaleString('fr-FR')}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenTicket(ticket.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pagination && (
            <div className="flex justify-end py-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" onClick={() => setPage(p => Math.max(0, p - 1))} /></PaginationItem>
                  <PaginationItem><PaginationLink>{pagination.currentPage + 1}</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" onClick={() => setPage(p => Math.min(pagination.totalPages - 1, p + 1))} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du ticket</DialogTitle>
            <DialogDescription>Ticket #{selectedTicket?.id}</DialogDescription>
          </DialogHeader>
          {isModalLoading ? <div className="py-12 flex justify-center"><Spinner /></div> : selectedTicket && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/.jpg?query=${selectedTicket.user.name}`} />
                  <AvatarFallback>{selectedTicket.user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedTicket.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTicket.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-4">
                {(selectedTicket.messages && selectedTicket.messages.length > 0) ? (
                  selectedTicket.messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender.role === 'admin' ? 'justify-end' : ''}`}>
                      {msg.sender.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback>{msg.sender.name?.charAt(0) || 'U'}</AvatarFallback></Avatar>}
                      <div className={`rounded-lg p-3 text-sm ${msg.sender.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {/* 🔒 SECURITY: Le contenu est automatiquement échappé par React, mais on s'assure qu'il n'y a pas de HTML */}
                        <p>{msg.content || ''}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      {msg.sender.role === 'admin' && <Avatar className="h-8 w-8"><AvatarFallback>A</AvatarFallback></Avatar>}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Aucun message dans cette conversation.
                  </div>
                )}
              </div>

              {selectedTicket.status !== 'RESOLVED' && (
                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="response">Réponse</Label>
                  <div className="flex items-center gap-2">
                    <Textarea
                      id="response"
                      placeholder="Écrivez votre réponse..."
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                    />
                    <Button onClick={handleReply} disabled={!replyContent.trim() || isModalLoading}><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedTicket?.status !== "RESOLVED" && (
              <Button onClick={() => handleResolve(selectedTicket!.id)} disabled={isModalLoading}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Résoudre et fermer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}