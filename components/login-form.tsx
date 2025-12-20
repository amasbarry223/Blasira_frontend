'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeOffIcon, LogInIcon, PhoneIcon, LockIcon, AlertCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import logo from '@/assets/logo.png'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { AuthService } from '@/services/AuthService'
import { saveToken } from '@/lib/auth'
import { RateLimiter } from '@/lib/security'


const schema = z.object({
	phone: z.string().min(1, 'Numéro de téléphone requis'),
	password: z.string().min(1, 'Mot de passe requis'),
	remember: z.boolean().optional().default(false),
})

type FormValues = z.infer<typeof schema>

type ErrorType = 'phone' | 'password' | 'general' | null

export function LoginForm({ className }: { className?: string }) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = React.useState(false)
	const [showPassword, setShowPassword] = React.useState(false)
	const [errorType, setErrorType] = React.useState<ErrorType>(null)
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
	const authService = React.useMemo(() => new AuthService(), [])

	const form = useForm<FormValues>({
		mode: 'onTouched',
		resolver: zodResolver(schema),
		defaultValues: {
			phone: '',
			password: '',
			remember: false,
		},
	})

	// Fonction pour analyser et formater les erreurs
	function parseError(error: unknown): { type: ErrorType; message: string } {
		if (!(error instanceof Error)) {
			return { type: 'general', message: 'Une erreur est survenue lors de la connexion' }
		}

		const errorAny = error as any
		const status = errorAny.status
		const errorData = errorAny.errorData || {}
		const message = error.message.toLowerCase()

		// Analyser le message d'erreur pour déterminer le type
		if (
			status === 401 ||
			message.includes('401') ||
			message.includes('unauthorized') ||
			message.includes('bad credentials') ||
			message.includes('invalid credentials')
		) {
			// Vérifier si le message indique spécifiquement le téléphone ou le mot de passe
			if (
				message.includes('phone') ||
				message.includes('téléphone') ||
				message.includes('utilisateur') ||
				message.includes('user') ||
				message.includes('compte') ||
				errorData.field === 'phone'
			) {
				return {
					type: 'phone',
					message: "Le numéro de téléphone est incorrect ou n'existe pas",
				}
			}

			if (
				message.includes('password') ||
				message.includes('mot de passe') ||
				message.includes('mdp') ||
				errorData.field === 'password'
			) {
				return {
					type: 'password',
					message: 'Le mot de passe est incorrect',
				}
			}

			// Par défaut, si c'est une erreur 401, on considère que c'est les identifiants
			return {
				type: 'general',
				message: "Le numéro de téléphone ou le mot de passe est incorrect",
			}
		}

		if (status === 404 || message.includes('404') || message.includes('not found')) {
			return {
				type: 'general',
				message: "Service d'authentification indisponible. Veuillez réessayer plus tard.",
			}
		}

		if (
			status === 500 ||
			status === 502 ||
			status === 503 ||
			message.includes('500') ||
			message.includes('502') ||
			message.includes('503')
		) {
			return {
				type: 'general',
				message: 'Erreur serveur. Veuillez réessayer dans quelques instants.',
			}
		}

		if (message.includes('network') || message.includes('fetch') || message.includes('failed to fetch')) {
			return {
				type: 'general',
				message: 'Problème de connexion. Vérifiez votre connexion internet.',
			}
		}

		// Message par défaut
		return {
			type: 'general',
			message: error.message || 'Une erreur est survenue lors de la connexion',
		}
	}

	async function onSubmit(values: FormValues) {
		setIsSubmitting(true)
		setErrorType(null)
		setErrorMessage(null)

		// Réinitialiser les erreurs des champs
		form.clearErrors('phone')
		form.clearErrors('password')

		// 🔒 SECURITY: Vérifier le rate limiting avant la tentative de connexion
		const clientId = values.phone || 'anonymous'
		const rateLimit = RateLimiter.checkLimit(clientId)

		if (!rateLimit.allowed) {
			const minutesRemaining = rateLimit.lockoutUntil
				? Math.ceil((rateLimit.lockoutUntil - Date.now()) / 60000)
				: 15

			setErrorType('general')
			setErrorMessage(`Trop de tentatives de connexion. Veuillez réessayer dans ${minutesRemaining} minute(s).`)

			toast.error('Trop de tentatives', {
				description: `Veuillez réessayer dans ${minutesRemaining} minute(s).`,
				duration: 10000,
			})

			setIsSubmitting(false)
			return
		}

		try {
			const response = await authService.login({
				phoneNumber: values.phone,
				password: values.password,
			})

			// 🔒 SECURITY: Réinitialiser les tentatives en cas de succès
			RateLimiter.resetAttempts(clientId)

			// Sauvegarder le token
			saveToken(response.token)

			// Afficher un message de succès
			toast.success('Connexion réussie', {
				description: 'Redirection vers le tableau de bord...',
			})

			// Redirection vers le tableau de bord
			router.push('/admin/dashboard')
		} catch (error) {
			// 🔒 SECURITY: Enregistrer l'échec pour le rate limiting
			RateLimiter.recordAttempt(clientId)

			const parsedError = parseError(error)

			setErrorType(parsedError.type)
			setErrorMessage(parsedError.message)

			// Définir l'erreur sur le champ approprié
			if (parsedError.type === 'email') {
				form.setError('email', {
					type: 'manual',
					message: parsedError.message,
				})
			} else if (parsedError.type === 'password') {
				form.setError('password', {
					type: 'manual',
					message: parsedError.message,
				})
			}

			// Afficher un toast avec le message d'erreur
			toast.error('Échec de la connexion', {
				description: parsedError.message,
				duration: 5000,
			})

			// Réinitialiser le mot de passe
			form.setValue('password', '')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Card className={cn('w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-2 duration-300', className)}>
			<CardHeader>
				<div className="flex justify-center">
					<Image src={logo} alt="Logo Blasira" width={128} height={128} className="rounded-md shadow-sm" />
				</div>
				<CardTitle className="text-2xl text-center text-primary">Connexion</CardTitle>
				<CardDescription className="text-center">Accédez à votre tableau de bord</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
						{/* Message d'erreur général */}
						{errorType === 'general' && errorMessage && (
							<Alert
								variant="destructive"
								className="animate-in slide-in-from-top-2 fade-in duration-300"
							>
								<XCircle className="h-4 w-4" />
								<AlertTitle className="font-semibold">Erreur de connexion</AlertTitle>
								<AlertDescription className="mt-1">{errorMessage}</AlertDescription>
							</Alert>
						)}

						<FormField
							name="phone"
							control={form.control}
							render={({ field }) => {
								const hasError = form.formState.errors.phone || errorType === 'phone'
								return (
								<FormItem>
									<FormLabel className="text-primary">Numéro de téléphone</FormLabel>
									<FormControl>
										<div className="grid gap-2">
											<Label htmlFor="phone" className="sr-only">Numéro de téléphone</Label>
											<div className="relative">
													<PhoneIcon
														className={cn(
															'absolute left-3 top-1/2 -translate-y-1/2 transition-colors',
															hasError ? 'text-destructive' : 'text-muted-foreground'
														)}
													/>
													<div
														className={cn(
															'bg-input/30 dark:bg-input/30 rounded-md h-11 flex items-center transition-all',
															hasError
																? 'border border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20'
																: 'border border-transparent focus-within:ring-2 focus-within:ring-primary/20'
														)}
													>
													<input
														id="phone"
														placeholder="+223 XX XX XX XX"
														type="tel"
														autoComplete="tel"
														inputMode="tel"
															className={cn(
																'h-11 w-full bg-transparent outline-none focus-visible:outline-none ring-0 focus:ring-0 border-0 pl-11 pr-3 text-base md:text-sm transition-colors',
																hasError && 'text-destructive placeholder:text-destructive/50'
															)}
														{...field}
															onChange={(e) => {
																field.onChange(e)
																// Effacer l'erreur quand l'utilisateur commence à taper
																if (errorType === 'phone') {
																	setErrorType(null)
																	setErrorMessage(null)
																	form.clearErrors('phone')
																}
															}}
													/>
												</div>
											</div>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
								)
							}}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => {
								const hasError = form.formState.errors.password || errorType === 'password'
								return (
								<FormItem>
									<FormLabel className="text-primary">Mot de passe</FormLabel>
									<FormControl>
										<div className="grid gap-2">
											<Label htmlFor="password" className="sr-only">Mot de passe</Label>
											<div className="relative">
													<LockIcon
														className={cn(
															'absolute left-3 top-1/2 -translate-y-1/2 transition-colors',
															hasError ? 'text-destructive' : 'text-muted-foreground'
														)}
													/>
													<div
														className={cn(
															'bg-input/30 dark:bg-input/30 rounded-md h-11 flex items-center transition-all',
															hasError
																? 'border border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20'
																: 'border border-transparent focus-within:ring-2 focus-within:ring-primary/20'
														)}
													>
													<input
														id="password"
														placeholder="••••••••"
														type={showPassword ? 'text' : 'password'}
														autoComplete="current-password"
															className={cn(
																'h-11 w-full bg-transparent outline-none focus-visible:outline-none ring-0 focus:ring-0 border-0 pl-11 pr-10 text-base md:text-sm transition-colors',
																hasError && 'text-destructive placeholder:text-destructive/50'
															)}
														{...field}
															onChange={(e) => {
																field.onChange(e)
																// Effacer l'erreur quand l'utilisateur commence à taper
																if (errorType === 'password') {
																	setErrorType(null)
																	setErrorMessage(null)
																	form.clearErrors('password')
																}
															}}
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
														onClick={() => setShowPassword((v) => !v)}
														className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
													>
														{showPassword ? <EyeOffIcon /> : <EyeIcon />}
													</Button>
												</div>
											</div>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
								)
							}}
						/>

						<div className="flex items-center justify-between">
							<FormField
								name="remember"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center gap-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(v) => field.onChange(Boolean(v))}
												id="remember"
											/>
										</FormControl>
										<FormLabel className="m-0 text-primary" htmlFor="remember">Se souvenir de moi</FormLabel>
									</FormItem>
								)}
							/>
							<a className="text-sm text-primary hover:underline" href="#">
								Mot de passe oublié ?
							</a>
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full"
						>
							{isSubmitting ? (
								<>
									<Spinner className="mr-2" /> Connexion...
								</>
							) : (
								<>
									<LogInIcon className="mr-2" /> Se connecter
								</>
							)}
						</Button>

					</form>
				</Form>
			</CardContent>
		</Card>
	)
}


