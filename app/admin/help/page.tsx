import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react"

export default function HelpPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-primary">Guide de style BLASIRA</h1>
				<p className="text-muted-foreground">Référence rapide de la charte graphique et des usages UI</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Palette principale</CardTitle>
					<CardDescription>Couleurs et rôles clés</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-lg border p-4">
						<div className="h-10 w-full rounded-md" style={{ backgroundColor: "var(--primary)" }} />
						<p className="mt-2 text-sm font-medium">Bleu pétrole</p>
						<p className="text-xs text-muted-foreground">--primary · #1F6773</p>
					</div>
					<div className="rounded-lg border p-4">
						<div className="h-10 w-full rounded-md" style={{ backgroundColor: "var(--accent)" }} />
						<p className="mt-2 text-sm font-medium">Vert olive clair</p>
						<p className="text-xs text-muted-foreground">--accent · #A5C650</p>
					</div>
					<div className="rounded-lg border p-4">
						<div className="h-10 w-full rounded-md" style={{ backgroundColor: "var(--ring)" }} />
						<p className="mt-2 text-sm font-medium">Bleu sarcelle clair</p>
						<p className="text-xs text-muted-foreground">--ring · #4B9DA5</p>
					</div>
					<div className="rounded-lg border p-4">
						<div className="h-10 w-full rounded-md" style={{ backgroundColor: "var(--border)" }} />
						<p className="mt-2 text-sm font-medium">Bordure subtile</p>
						<p className="text-xs text-muted-foreground">--border · #E6F0F1</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>États & Alertes</CardTitle>
					<CardDescription>Utiliser les variantes normalisées</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					<div className="flex flex-wrap gap-2">
						<Badge variant="success">Succès</Badge>
						<Badge variant="info">Information</Badge>
						<Badge variant="warning">Avertissement</Badge>
						<Badge variant="destructive">Erreur</Badge>
					</div>
					<p className="text-xs text-muted-foreground">
						Badges et Alerts disposent de variantes success/info/warning/destructive alignées à la charte.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Exemples d'Alertes</CardTitle>
					<CardDescription>Aperçu visuel des variantes</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					<Alert variant="success">
						<CheckCircle />
						<AlertTitle>Opération réussie</AlertTitle>
						<AlertDescription>Votre action a été exécutée avec succès.</AlertDescription>
					</Alert>
					<Alert variant="info">
						<Info />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>Une nouvelle mise à jour est disponible.</AlertDescription>
					</Alert>
					<Alert variant="warning">
						<AlertTriangle />
						<AlertTitle>Avertissement</AlertTitle>
						<AlertDescription>Vérifiez les informations avant de continuer.</AlertDescription>
					</Alert>
					<Alert variant="destructive">
						<XCircle />
						<AlertTitle>Erreur</AlertTitle>
						<AlertDescription>Une erreur est survenue. Réessayez plus tard.</AlertDescription>
					</Alert>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Composants</CardTitle>
					<CardDescription>Recommandations de style</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<ul className="list-disc pl-5 text-sm space-y-2">
						<li>Titres H1/H2 en <span className="font-semibold text-primary">text-primary</span>.</li>
						<li>Cartes avec rayon doux: <code className="rounded bg-muted px-1 py-0.5">--radius: 1rem</code>.</li>
						<li>Bouton secondaire: bordure teal, hover olive (<code className="rounded bg-muted px-1 py-0.5">variant="secondary"</code>).</li>
						<li>Graphiques: utiliser <code className="rounded bg-muted px-1 py-0.5">var(--chart-1..5)</code>.</li>
						<li>Sidebar: fond bleu pétrole, texte blanc, survol sarcelle/olive.</li>
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Exemples de code</CardTitle>
					<CardDescription>Comment utiliser les variantes standardisées</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div>
						<p className="mb-2 text-sm font-medium">Badges</p>
						<pre className="rounded-md border bg-muted p-3 text-xs overflow-x-auto">
							<code>{`import { Badge } from "@/components/ui/badge"

<Badge variant="success">Succès</Badge>
<Badge variant="info">Information</Badge>
<Badge variant="warning">Avertissement</Badge>
<Badge variant="destructive">Erreur</Badge>`}</code>
						</pre>
					</div>
					<div>
						<p className="mb-2 text-sm font-medium">Alertes</p>
						<pre className="rounded-md border bg-muted p-3 text-xs overflow-x-auto">
							<code>{`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert variant="success">
  <AlertTitle>Opération réussie</AlertTitle>
  <AlertDescription>Détails de l'action effectuée.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Attention</AlertTitle>
  <AlertDescription>Vérifiez les informations avant de continuer.</AlertDescription>
</Alert>`}</code>
						</pre>
					</div>
					<div>
						<p className="mb-2 text-sm font-medium">Bouton secondaire</p>
						<pre className="rounded-md border bg-muted p-3 text-xs overflow-x-auto">
							<code>{`import { Button } from "@/components/ui/button"

<Button variant="secondary">Action</Button>`}</code>
						</pre>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}


