"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Send, Bell, Users, AlertTriangle, Gift, Calendar, X, ServerCrash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MessageService, AdminService, NotificationService } from "@/services"
import { AdminUser } from "@/models"
import { NotificationHistoryItem } from "@/models/Notification"
import { getToken } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function NotificationsPage() {
  const { toast } = useToast()

  // State for sending notifications
  const [showDialog, setShowDialog] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([])
  const [allUsers, setAllUsers] = useState<AdminUser[]>([])
  const [isSending, setIsSending] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)

  // State for notification history
  const [history, setHistory] = useState<NotificationHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const messageService = useMemo(() => new MessageService(getToken() || undefined), [])
  const adminService = useMemo(() => new AdminService(getToken() || undefined), [])
  const notificationService = useMemo(() => new NotificationService('/api', getToken() || undefined), [])

  // Fetch notification history
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true)
    setHistoryError(null)
    try {
      const data = await notificationService.getNotificationHistory()
      setHistory(data.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Impossible de charger l'historique."
      setHistoryError(errorMsg)
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: errorMsg,
      })
    } finally {
      setLoadingHistory(false)
    }
  }, [notificationService, toast])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Fetch all users for recipient selection
  useEffect(() => {
    const fetchUsers = async () => {
      if (!showDialog) return
      setLoadingUsers(true)
      setUsersError(null)
      try {
        const usersData = await adminService.getAllUsers()
        setAllUsers(usersData)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Impossible de charger la liste des utilisateurs."
        setUsersError(errorMsg)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les utilisateurs.",
        })
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [showDialog, adminService, toast])

  // Client-side pagination for history
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = history.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedHistory = history.slice(startIndex, endIndex)
  
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

  const handleSendNotification = async () => {
    if (!messageContent.trim()) {
      toast({ variant: "destructive", title: "Message vide" })
      return
    }
    setIsSending(true)
    try {
      await messageService.sendAdminBroadcastMessage({
        recipientIds: selectedRecipientIds,
        content: messageContent,
      })
      toast({
        title: "Notification envoyée",
        description: `Message envoyé avec succès.`,
      })
      setShowDialog(false)
      setMessageContent("")
      setSelectedRecipientIds([])
      fetchHistory() // Refresh history after sending
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      BROADCAST: {
        label: "Diffusion",
        className: "bg-primary/10 text-primary border-primary/20",
        icon: <Bell className="h-3 w-3" />,
      },
      PROMOTION: {
        label: "Promotion",
        className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
        icon: <Gift className="h-3 w-3" />,
      },
      ALERT: {
        label: "Alerte",
        className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
    }
    const variant = variants[type] || {
        label: type,
        className: "bg-muted/10 text-foreground border-muted/20",
        icon: <Bell className="h-3 w-3" />,
    }
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.icon}
        <span className="ml-1">{variant.label}</span>
      </Badge>
    )
  }

  const totalRecipients = useMemo(() => history.reduce((sum, n) => sum + n.recipientIds.length, 0), [history]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Notifications</h1>
          <p className="text-muted-foreground">Envoyez des messages et consultez l'historique.</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Nouvelle notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une notification</DialogTitle>
              <DialogDescription>Envoyez un message à des utilisateurs spécifiques ou à tous.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Écrivez votre message..." className="min-h-[120px]" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Destinataires ({selectedRecipientIds.length === 0 ? "Tous" : selectedRecipientIds.length})</Label>
                 {loadingUsers ? <Spinner size="sm" /> : usersError ? <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erreur</AlertTitle><AlertDescription>{usersError}</AlertDescription></Alert> : (
                  <>
                    <Select onValueChange={(value) => {
                      const newId = Number(value);
                      if (!selectedRecipientIds.includes(newId)) {
                        setSelectedRecipientIds(prev => [...prev, newId]);
                      }
                    }}>
                      <SelectTrigger><SelectValue placeholder="Rechercher un utilisateur..." /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {allUsers.filter(u => !selectedRecipientIds.includes(u.id)).map(user => (
                            <SelectItem key={user.id} value={user.id.toString()}>{user.firstName} {user.lastName} ({user.email})</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setSelectedRecipientIds([])}>Vider la sélection</Button>
                      {selectedRecipientIds.map(id => {
                        const user = allUsers.find(u => u.id === id);
                        return user ? <Badge key={id} variant="secondary" className="flex items-center gap-1.5">{user.firstName} {user.lastName} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedRecipientIds(p => p.filter(rid => rid !== id))} /></Badge> : null;
                      })}
                    </div>
                  </>
                 )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isSending}>Annuler</Button>
              <Button onClick={handleSendNotification} disabled={isSending || !messageContent.trim()}>{isSending ? <Spinner className="mr-2" /> : <Send className="mr-2 h-4 w-4" />}Envoyer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Notifications envoyées</p><p className="text-3xl font-bold">{loadingHistory ? <Spinner size="sm"/> : history.length}</p></div><Send className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Destinataires touchés</p><p className="text-3xl font-bold">{loadingHistory ? <Spinner size="sm"/> : totalRecipients}</p></div><Users className="h-8 w-8 text-accent" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Ce mois-ci</p><p className="text-3xl font-bold">{loadingHistory ? <Spinner size="sm"/> : history.filter(n => new Date(n.sentAt).getMonth() === new Date().getMonth()).length}</p></div><Calendar className="h-8 w-8 text-chart-3" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Historique des notifications</CardTitle><CardDescription>Notifications envoyées récemment</CardDescription></CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Contenu</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Envoyé le</TableHead>
                  <TableHead className="text-right">Destinataires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingHistory ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center"><Spinner /></TableCell></TableRow>
                ) : historyError ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-destructive"><div className="flex flex-col items-center gap-2"><ServerCrash className="h-8 w-8" /><p>{historyError}</p><Button variant="outline" size="sm" onClick={fetchHistory}>Réessayer</Button></div></TableCell></TableRow>
                ) : paginatedHistory.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">Aucune notification trouvée.</TableCell></TableRow>
                ) : (
                  paginatedHistory.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="max-w-sm truncate text-sm text-muted-foreground">{notification.content}</TableCell>
                      <TableCell>{getTypeBadge(notification.type)}</TableCell>
                      <TableCell className="text-sm">{notification.senderAdminName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(notification.sentAt), "PPP p", { locale: fr })}</TableCell>
                      <TableCell className="text-right font-medium">{notification.recipientIds.length}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalItems > 0 && (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between py-3">
              <div className="text-sm text-muted-foreground">{`Affiche ${startIndex + 1}–${endIndex} sur ${totalItems}`}</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Par page</span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                    <SelectTrigger className="w-[92px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
                  </Select>
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" aria-disabled={currentPage === 1} onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage(currentPage - 1) }} /></PaginationItem>
                    {getPageList(totalPages, currentPage).map((p, idx) => typeof p === "string" ? <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem> : <PaginationItem key={p}><PaginationLink href="#" isActive={p === currentPage} onClick={(e) => { e.preventDefault(); setPage(p) }}>{p}</PaginationLink></PaginationItem>)}
                    <PaginationItem><PaginationNext href="#" aria-disabled={currentPage === totalPages} onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setPage(currentPage + 1) }} /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}