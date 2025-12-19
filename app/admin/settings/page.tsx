"use client"

import React, { useState, useEffect } from "react"
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
import { AppConfigService } from "@/services/AppConfigService"
import { AppConfig } from "@/models"
import { Spinner } from "@/components/ui/spinner"

const initialSettings: AppConfig = {
  general: { platformName: "", platformEmail: "", platformPhone: "", supportEmail: "", timezone: "", language: "" },
  trips: { maxPassengersPerTrip: 0, minTripPrice: 0, maxTripPrice: 0, autoApproveTrips: false },
  features: { enableReviews: false, enableChat: false },
  security: { requireEmailVerification: false, requirePhoneVerification: false, requirePhotoVerification: false, allowStudentOnly: false, dataRetentionDays: 0 },
  notifications: {
    admin: { notifyNewUsers: false, notifyNewTrips: false, notifyIncidents: false, notifyReports: false },
    channels: { emailNotifications: false, smsNotifications: false, pushNotifications: false }
  },
  payments: { commissionRate: 0, currency: "" },
  system: { maintenanceMode: false, backupFrequency: "" },
};

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<AppConfig>(initialSettings)
  const [originalSettings, setOriginalSettings] = useState<AppConfig>(initialSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const appConfigService = React.useMemo(() => new AppConfigService(), [])

  const loadSettings = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await appConfigService.getSettings()
      setSettings(data)
      setOriginalSettings(data) // Keep a copy for reset functionality
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les paramètres. Les valeurs par défaut sont affichées.",
      })
      setError("Impossible de charger les paramètres.")
    } finally {
      setIsLoading(false)
    }
  }, [appConfigService, toast])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleSave = async () => {
    try {
      const updatedSettings = await appConfigService.updateSettings(settings)
      setSettings(updatedSettings)
      setOriginalSettings(updatedSettings)
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos modifications ont été enregistrées avec succès.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    }
  }

  const handleReset = () => {
    setSettings(originalSettings);
    toast({
      title: "Modifications annulées",
      description: "Les paramètres ont été restaurés à leur dernière version sauvegardée.",
    })
  }
  
  const handleSettingsChange = (section: keyof AppConfig, key: any, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };
  
  const handleAdminNotificationsChange = (key: keyof AppConfig['notifications']['admin'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        admin: {
          ...prev.notifications.admin,
          [key]: value
        }
      }
    }));
  }

  const handleChannelNotificationsChange = (key: keyof AppConfig['notifications']['channels'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        channels: {
          ...prev.notifications.channels,
          [key]: value
        }
      }
    }));
  }


  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="mr-2" />
        <span className="text-muted-foreground">Chargement des paramètres...</span>
      </div>
    )
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
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la plateforme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Nom de la plateforme</Label><Input value={settings.general.platformName} onChange={e => handleSettingsChange('general', 'platformName', e.target.value)} /></div>
                <div className="space-y-2"><Label>Email principal</Label><Input type="email" value={settings.general.platformEmail} onChange={e => handleSettingsChange('general', 'platformEmail', e.target.value)} /></div>
                <div className="space-y-2"><Label>Téléphone</Label><Input value={settings.general.platformPhone} onChange={e => handleSettingsChange('general', 'platformPhone', e.target.value)} /></div>
                <div className="space-y-2"><Label>Email du support</Label><Input type="email" value={settings.general.supportEmail} onChange={e => handleSettingsChange('general', 'supportEmail', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Paramètres des trajets</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2"><Label>Passagers max</Label><Input type="number" value={settings.trips.maxPassengersPerTrip} onChange={e => handleSettingsChange('trips', 'maxPassengersPerTrip', parseInt(e.target.value))} /></div>
                <div className="space-y-2"><Label>Prix minimum</Label><Input type="number" value={settings.trips.minTripPrice} onChange={e => handleSettingsChange('trips', 'minTripPrice', parseInt(e.target.value))} /></div>
                <div className="space-y-2"><Label>Prix maximum</Label><Input type="number" value={settings.trips.maxTripPrice} onChange={e => handleSettingsChange('trips', 'maxTripPrice', parseInt(e.target.value))} /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><Label>Approbation auto</Label><Switch checked={settings.trips.autoApproveTrips} onCheckedChange={c => handleSettingsChange('trips', 'autoApproveTrips', c)} /></div>
              <div className="flex items-center justify-between"><Label>Activer les avis</Label><Switch checked={settings.features.enableReviews} onCheckedChange={c => handleSettingsChange('features', 'enableReviews', c)} /></div>
              <div className="flex items-center justify-between"><Label>Activer le chat</Label><Switch checked={settings.features.enableChat} onCheckedChange={c => handleSettingsChange('features', 'enableChat', c)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Vérification des utilisateurs</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Vérification email</Label><Switch checked={settings.security.requireEmailVerification} onCheckedChange={c => handleSettingsChange('security', 'requireEmailVerification', c)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><Label>Vérification téléphone</Label><Switch checked={settings.security.requirePhoneVerification} onCheckedChange={c => handleSettingsChange('security', 'requirePhoneVerification', c)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><Label>Vérification photo</Label><Switch checked={settings.security.requirePhotoVerification} onCheckedChange={c => handleSettingsChange('security', 'requirePhotoVerification', c)} /></div>
               <Separator />
              <div className="flex items-center justify-between"><Label>Réservé aux étudiants</Label><Switch checked={settings.security.allowStudentOnly} onCheckedChange={c => handleSettingsChange('security', 'allowStudentOnly', c)} /></div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader><CardTitle>Sécurité et confidentialité</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Rétention des données (jours)</Label><Input type="number" value={settings.security.dataRetentionDays} onChange={e => handleSettingsChange('security', 'dataRetentionDays', parseInt(e.target.value))} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Notifications administrateur</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Nouveaux utilisateurs</Label><Switch checked={settings.notifications.admin.notifyNewUsers} onCheckedChange={c => handleAdminNotificationsChange('notifyNewUsers', c)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><Label>Nouveaux trajets</Label><Switch checked={settings.notifications.admin.notifyNewTrips} onCheckedChange={c => handleAdminNotificationsChange('notifyNewTrips', c)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><Label>Incidents signalés</Label><Switch checked={settings.notifications.admin.notifyIncidents} onCheckedChange={c => handleAdminNotificationsChange('notifyIncidents', c)} /></div>
               <Separator />
              <div className="flex items-center justify-between"><Label>Signalements</Label><Switch checked={settings.notifications.admin.notifyReports} onCheckedChange={c => handleAdminNotificationsChange('notifyReports', c)} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Canaux de notification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><Label>Par email</Label><Switch checked={settings.notifications.channels.emailNotifications} onCheckedChange={c => handleChannelNotificationsChange('emailNotifications', c)} /></div>
                <Separator />
                <div className="flex items-center justify-between"><Label>Par SMS</Label><Switch checked={settings.notifications.channels.smsNotifications} onCheckedChange={c => handleChannelNotificationsChange('smsNotifications', c)} /></div>
                <Separator />
                <div className="flex items-center justify-between"><Label>Notifications push</Label><Switch checked={settings.notifications.channels.pushNotifications} onCheckedChange={c => handleChannelNotificationsChange('pushNotifications', c)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Configuration des paiements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Taux de commission (%)</Label><Input type="number" value={settings.payments.commissionRate} onChange={e => handleSettingsChange('payments', 'commissionRate', parseInt(e.target.value))} /></div>
                <div className="space-y-2"><Label>Devise</Label><Input value={settings.payments.currency} onChange={e => handleSettingsChange('payments', 'currency', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Maintenance et sauvegarde</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Mode maintenance</Label><Switch checked={settings.system.maintenanceMode} onCheckedChange={c => handleSettingsChange('system', 'maintenanceMode', c)} /></div>
              <Separator />
              <div className="space-y-2"><Label>Fréquence de sauvegarde</Label><Input value={settings.system.backupFrequency} onChange={e => handleSettingsChange('system', 'backupFrequency', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}