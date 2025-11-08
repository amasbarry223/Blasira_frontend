"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Shield,
  Bell,
  Users,
  DollarSign,
  Mail,
  Database,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    platformName: "Blasira",
    platformEmail: "admin@blasira.ml",
    platformPhone: "+223 XX XX XX XX",
    supportEmail: "support@blasira.ml",
    maxPassengersPerTrip: "4",
    minTripPrice: "500",
    maxTripPrice: "50000",
    commissionRate: "10",
    currency: "FCFA",
    autoApproveTrips: false,
    requireEmailVerification: true,
    requirePhoneVerification: true,
    requirePhotoVerification: true,
    allowStudentOnly: false,
    enableReviews: true,
    enableChat: true,
    notifyNewUsers: true,
    notifyNewTrips: true,
    notifyIncidents: true,
    notifyReports: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceMode: false,
    backupFrequency: "daily",
    dataRetention: "365",
    timezone: "Africa/Bamako",
    language: "fr",
  })

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès.",
    })
  }

  const handleReset = () => {
    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres ont été restaurés aux valeurs par défaut.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Paramètres</h1>
          <p className="text-muted-foreground">Gérer la configuration de la plateforme Blasira</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="mr-2 h-4 w-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="mr-2 h-4 w-4" />
            Système
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la plateforme</CardTitle>
              <CardDescription>Configurer les informations générales de Blasira</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Nom de la plateforme</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformEmail">Email principal</Label>
                  <Input
                    id="platformEmail"
                    type="email"
                    value={settings.platformEmail}
                    onChange={(e) => setSettings({ ...settings, platformEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformPhone">Téléphone</Label>
                  <Input
                    id="platformPhone"
                    value={settings.platformPhone}
                    onChange={(e) => setSettings({ ...settings, platformPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email du support</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres des trajets</CardTitle>
              <CardDescription>Configurer les règles pour les trajets et réservations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="maxPassengers">Passagers max par trajet</Label>
                  <Input
                    id="maxPassengers"
                    type="number"
                    value={settings.maxPassengersPerTrip}
                    onChange={(e) => setSettings({ ...settings, maxPassengersPerTrip: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Prix minimum (FCFA)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={settings.minTripPrice}
                    onChange={(e) => setSettings({ ...settings, minTripPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Prix maximum (FCFA)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={settings.maxTripPrice}
                    onChange={(e) => setSettings({ ...settings, maxTripPrice: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Approbation automatique des trajets</Label>
                  <p className="text-sm text-muted-foreground">
                    Les trajets sont publiés immédiatement sans validation manuelle
                  </p>
                </div>
                <Switch
                  checked={settings.autoApproveTrips}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoApproveTrips: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer les avis et notations</Label>
                  <p className="text-sm text-muted-foreground">Permet aux utilisateurs de noter leurs expériences</p>
                </div>
                <Switch
                  checked={settings.enableReviews}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableReviews: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer le chat en temps réel</Label>
                  <p className="text-sm text-muted-foreground">Discussion entre conducteurs et passagers</p>
                </div>
                <Switch
                  checked={settings.enableChat}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableChat: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localisation et langue</CardTitle>
              <CardDescription>Configurer les paramètres régionaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Bamako">Africa/Bamako (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Dakar">Africa/Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Abidjan">Africa/Abidjan (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue par défaut</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vérification des utilisateurs</CardTitle>
              <CardDescription>Configurer les exigences de vérification pour les nouveaux utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label>Vérification email obligatoire</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Les utilisateurs doivent confirmer leur adresse email</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label>Vérification téléphone obligatoire</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Vérifier le numéro de téléphone via SMS</p>
                </div>
                <Switch
                  checked={settings.requirePhoneVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requirePhoneVerification: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <Label>Vérification photo obligatoire</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Les utilisateurs doivent soumettre une photo d'identité
                  </p>
                </div>
                <Switch
                  checked={settings.requirePhotoVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requirePhotoVerification: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label>Réservé aux étudiants uniquement</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Restreindre l'accès aux étudiants avec email institutionnel
                  </p>
                </div>
                <Switch
                  checked={settings.allowStudentOnly}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowStudentOnly: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité et confidentialité</CardTitle>
              <CardDescription>Paramètres avancés de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-accent bg-accent/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Charte de confiance activée</p>
                    <p className="text-sm text-muted-foreground">
                      Tous les nouveaux utilisateurs doivent accepter la charte lors de l'inscription
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetention">Durée de conservation des données (jours)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Les données des comptes supprimés seront conservées pendant cette période
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications administrateur</CardTitle>
              <CardDescription>Configurer les alertes pour les administrateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveaux utilisateurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification pour chaque nouvelle inscription
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNewUsers}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifyNewUsers: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveaux trajets</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification pour chaque nouveau trajet publié
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNewTrips}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifyNewTrips: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Incidents signalés</Label>
                  <p className="text-sm text-muted-foreground">Recevoir une alerte immédiate pour les incidents</p>
                </div>
                <Switch
                  checked={settings.notifyIncidents}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifyIncidents: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Signalements de comportement</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification pour les signalements d'utilisateurs
                  </p>
                </div>
                <Switch
                  checked={settings.notifyReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifyReports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>Choisir les canaux pour recevoir les notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label>Notifications par email</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Envoyer les notifications à {settings.platformEmail}</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label>Notifications SMS</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Envoyer les alertes critiques par SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label>Notifications push</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Notifications dans le navigateur et l'application</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Paramètres liés aux comptes utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Badges et certifications</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Les utilisateurs peuvent obtenir les badges suivants après vérification :
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Étudiant vérifié
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    Conducteur confirmé
                  </Badge>
                  <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
                    Membre de confiance
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Critères pour le badge "Conducteur confirmé"</Label>
                <Textarea
                  placeholder="Ex: Minimum 10 trajets effectués avec une note moyenne de 4.5/5"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Critères pour le badge "Membre de confiance"</Label>
                <Textarea
                  placeholder="Ex: Compte actif depuis 6 mois, aucun signalement, vérification complète"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support utilisateur</CardTitle>
              <CardDescription>Configuration du système de support intégré</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-accent bg-accent/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Support intégré activé</p>
                    <p className="text-sm text-muted-foreground">
                      Chat en direct et formulaire de contact disponibles pour tous les utilisateurs
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportResponse">Temps de réponse moyen souhaité</Label>
                <Select defaultValue="24h">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Moins d'1 heure</SelectItem>
                    <SelectItem value="6h">Moins de 6 heures</SelectItem>
                    <SelectItem value="24h">Moins de 24 heures</SelectItem>
                    <SelectItem value="48h">Moins de 48 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des paiements</CardTitle>
              <CardDescription>Gérer les tarifs et commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="commission">Taux de commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Commission prélevée sur chaque trajet</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCFA">FCFA (Franc CFA)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Modes de paiement disponibles
                </h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span className="text-sm">Espèces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span className="text-sm">Mobile Money</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span className="text-sm">Carte bancaire</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance et sauvegarde</CardTitle>
              <CardDescription>Configuration système et maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive bg-destructive/10 p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <Label>Mode maintenance</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Désactiver temporairement l'accès à la plateforme</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Dernière sauvegarde</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleString("fr-FR", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
                <Button variant="outline" size="sm">
                  Lancer une sauvegarde manuelle
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
              <CardDescription>État actuel de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Version de la plateforme</p>
                  <p className="font-mono text-sm font-semibold">v1.2.0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Environnement</p>
                  <Badge variant="secondary">Production</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Base de données</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-sm font-semibold">Opérationnelle</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Stockage utilisé</p>
                  <p className="font-mono text-sm font-semibold">2.4 GB / 10 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
