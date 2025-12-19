"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Send, Bell, Users, AlertTriangle, Gift, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MessageService } from "@/services/MessageService"
import { AdminService } from "@/services/AdminService"
import { AdminUser } from "@/models"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Placeholder for notification history item (since no API is provided for this)
interface NotificationHistoryItem {
  id: number;
  title: string;
  message: string;
  type: string;
  target: string;
  sentDate: string;
  recipients: number;
}

const mockNotifications: NotificationHistoryItem[] = [
  {
    id: 1,
    title: "Promotion de fin d'année",
    message: "Profitez de 20% de réduction sur vos trajets ce mois-ci!",
    type: "promotion",
    target: "all",
    sentDate: "2024-12-10",
    recipients: 2345,
  },
  {
    id: 2,
    title: "Rappel de sécurité",
    message: "N'oubliez pas de porter votre ceinture de sécurité",
    type: "safety",
    target: "drivers",
    sentDate: "2024-12-08",
    recipients: 456,
  },
  {
    id: 3,
    title: "Nouvelle fonctionnalité",
    message: "Découvrez notre nouveau système de réservation instantanée",
    type: "feature",
    target: "all",
    sentDate: "2024-12-05",
    recipients: 2345,
  },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [showDialog, setShowDialog] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([]) // Array of user IDs
  const [allUsers, setAllUsers] = useState<AdminUser[]>([])
  const [isSending, setIsSending] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)

  const messageService = useMemo(() => new MessageService(), [])
  const adminService = useMemo(() => new AdminService(), [])

  // Fetch all users for recipient selection
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      setUsersError(null)
      try {
        const usersData = await adminService.getAllUsers()
        setAllUsers(usersData)
      } catch (err) {
        setUsersError(err instanceof Error ? err.message : "Impossible de charger la liste des utilisateurs.")
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs pour la sélection des destinataires.",
        })
      } finally {
        setLoadingUsers(false)
      }
    }

    if (showDialog) { // Only fetch users when the dialog is opened
      fetchUsers()
    }
  }, [showDialog, adminService, toast])


  // Client-side pagination for mock history
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = mockNotifications.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedNotifications = mockNotifications.slice(startIndex, endIndex)
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
      toast({
        variant: "destructive",
        title: "Message vide",
        description: "Veuillez écrire un message à envoyer.",
      })
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
        description: selectedRecipientIds.length === 0 ? "Le message a été envoyé à tous les utilisateurs." : `Le message a été envoyé à ${selectedRecipientIds.length} destinataire(s).`,
      })
      setShowDialog(false)
      setMessageContent("")
      setSelectedRecipientIds([])
      // Potentially refresh notification history here if there was an API for it
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi de la notification.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      promotion: {
        label: "Promotion",
        className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
        icon: <Gift className="h-3 w-3" />,
      },
      safety: {
        label: "Sécurité",
        className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      feature: {
        label: "Nouveauté",
        className: "bg-primary/10 text-primary border-primary/20",
        icon: <Bell className="h-3 w-3" />,
      },
      general: {
        label: "Général",
        className: "bg-muted/10 text-foreground border-muted/20",
        icon: <Bell className="h-3 w-3" />,
      },
    }
    const variant = variants[type] || variants.general
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.icon}
        <span className="ml-1">{variant.label}</span>
      </Badge>
    )
  }

  const getTargetLabel = (target: string | number[]) => {
    if (Array.isArray(target)) {
        return target.length === 0 ? "Tous les utilisateurs" : `${target.length} utilisateur(s) spécifique(s)`;
    }
    const labels: Record<string, string> = {
      all: "Tous les utilisateurs",
      students: "Étudiants uniquement", // These static options are removed in the new UI but kept for compatibility
      drivers: "Conducteurs uniquement",
      verified: "Utilisateurs vérifiés",
    }
    return labels[target] || labels.all
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Notifications</h1>
          <p className="text-muted-foreground">Envoyez des notifications ciblées aux utilisateurs</p>
        </div>
        <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) { // Reset form on close
                setMessageContent("");
                setSelectedRecipientIds([]);
            }
        }}>
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
                <Textarea
                  id="message"
                  placeholder="Écrivez votre message..."
                  className="min-h-[120px]"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipients">Destinataires</Label>
                {loadingUsers ? (
                  <Spinner size="sm" className="ml-2" />
                ) : usersError ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{usersError}</AlertDescription>
                  </Alert>
                ) : (
                  <Select
                    value={selectedRecipientIds.length === 0 ? "all" : selectedRecipientIds.map(String).join(',')}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedRecipientIds([]); // Empty array means all users
                      } else {
                        // For multi-select, assuming value is a comma-separated string of IDs
                        // This Select component from shadcn/ui does not natively support multi-select.
                        // For a true multi-select, a custom component or a workaround for Select would be needed.
                        // For demonstration, selecting one means replacing current selection.
                        // A more robust solution for multiple selections would involve checkboxes or a dedicated multi-select component.
                        const newId = Number(value);
                        if (!selectedRecipientIds.includes(newId)) {
                            setSelectedRecipientIds(prev => [...prev, newId]);
                        } else {
                            setSelectedRecipientIds(prev => prev.filter(id => id !== newId));
                        }
                      }
                    }}
                  >
                    <SelectTrigger id="recipients">
                      <SelectValue placeholder="Sélectionner les destinataires (laissez vide pour tous)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      <SelectGroup>
                        <SelectLabel>Utilisateurs individuels</SelectLabel>
                        {allUsers.map(user => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.firstName} {user.lastName} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                {/* Display current selections */}
                {selectedRecipientIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedRecipientIds.map(id => {
                            const user = allUsers.find(u => u.id === id);
                            return user ? (
                                <Badge key={id} variant="secondary" className="flex items-center gap-1">
                                    {user.firstName} {user.lastName}
                                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedRecipientIds(prev => prev.filter(recId => recId !== id))} />
                                </Badge>
                            ) : null;
                        })}
                    </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isSending}>
                Annuler
              </Button>
              <Button onClick={handleSendNotification} disabled={isSending || !messageContent.trim()}>
                {isSending ? <Spinner className="mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Notifications envoyées</p>
                <p className="text-3xl font-bold">{mockNotifications.length}</p>
              </div>
              <Send className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Destinataires totaux</p>
                <p className="text-3xl font-bold">{mockNotifications.reduce((sum, n) => sum + n.recipients, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ce mois-ci</p>
                <p className="text-3xl font-bold">{mockNotifications.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des notifications</CardTitle>
          <CardDescription>Notifications envoyées récemment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Destinataires</TableHead>
                  <TableHead>Envoyé</TableHead>
                  <TableHead className="text-right">Nombre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                      {notification.message}
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell className="text-sm">{getTargetLabel(notification.target)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{notification.sentDate}</TableCell>
                    <TableCell className="text-right font-medium">{notification.recipients}</TableCell>
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
  )
}