"use client"

import * as React from "react"
import { UserPlus, Car, Send, Shield, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function QuickActions() {
  const { toast } = useToast()
  const [notificationOpen, setNotificationOpen] = React.useState(false)
  const [verifyUserOpen, setVerifyUserOpen] = React.useState(false)

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault()
    setNotificationOpen(false)
    toast({
      title: "Notification envoyée",
      description: "La notification a été envoyée à tous les utilisateurs.",
    })
  }

  const handleVerifyUser = (verified: boolean) => {
    setVerifyUserOpen(false)
    toast({
      title: verified ? "Utilisateur vérifié" : "Vérification refusée",
      description: verified ? "L'utilisateur a reçu le badge vérifié." : "L'utilisateur a été notifié du refus.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Gérez rapidement les tâches importantes</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Dialog open={verifyUserOpen} onOpenChange={setVerifyUserOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="justify-start gap-3 bg-transparent">
              <Shield className="h-4 w-4" />
              Vérifier un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vérification d'utilisateur</DialogTitle>
              <DialogDescription>Vérifiez l'identité d'un utilisateur et attribuez un badge</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-select">Utilisateur</Label>
                <Select>
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Amadou Diallo - En attente</SelectItem>
                    <SelectItem value="user2">Fatoumata Traoré - En attente</SelectItem>
                    <SelectItem value="user3">Mamadou Keita - En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Documents soumis</Label>
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <p className="text-sm">📄 Carte d'identité nationale</p>
                  <p className="text-sm">📧 Email institutionnel vérifié</p>
                  <p className="text-sm">📱 Numéro de téléphone vérifié</p>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => handleVerifyUser(false)}>
                <XCircle className="mr-2 h-4 w-4" />
                Refuser
              </Button>
              <Button onClick={() => handleVerifyUser(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approuver
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="justify-start gap-3 bg-transparent">
              <Send className="h-4 w-4" />
              Envoyer une notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Envoyer une notification</DialogTitle>
              <DialogDescription>Envoyez une notification ciblée aux utilisateurs</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value="drivers">Conducteurs uniquement</SelectItem>
                    <SelectItem value="passengers">Passagers uniquement</SelectItem>
                    <SelectItem value="students">Étudiants vérifiés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Ex: Nouvelle fonctionnalité disponible" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre notification..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNotificationOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="justify-start gap-3 bg-transparent">
          <Car className="h-4 w-4" />
          Modérer un trajet
        </Button>

        <Button variant="outline" className="justify-start gap-3 bg-transparent">
          <UserPlus className="h-4 w-4" />
          Ajouter un administrateur
        </Button>
      </CardContent>
    </Card>
  )
}
