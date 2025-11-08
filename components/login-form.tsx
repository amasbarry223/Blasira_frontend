'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeOffIcon, LogInIcon, MailIcon, LockIcon, ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import logo from '@/assets/logo.png'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'


const schema = z.object({
	email: z.string().min(1, 'Email requis').email("Email invalide"),
	password: z.string().min(8, 'Au moins 8 caractères'),
	remember: z.boolean().optional().default(false),
})

type FormValues = z.infer<typeof schema>

export function LoginForm({ className }: { className?: string }) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = React.useState(false)
	const [showPassword, setShowPassword] = React.useState(false)

	const form = useForm<FormValues>({
		mode: 'onTouched',
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
			remember: false,
		},
	})

	async function onSubmit(values: FormValues) {
		setIsSubmitting(true)
		try {
			// Simule une requête réseau
			await new Promise((r) => setTimeout(r, 900))
			// Redirection vers le tableau de bord (remplacer par votre logique d'auth)
			router.push('/admin/dashboard')
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
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-primary">Adresse e-mail</FormLabel>
									<FormControl>
										<div className="grid gap-2">
											<Label htmlFor="email" className="sr-only">Email</Label>
											<div className="relative">
												<MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
												<div className="bg-input/30 dark:bg-input/30 rounded-md h-11 flex items-center transition focus-within:ring-0">
													<input
														id="email"
														placeholder="vous@exemple.com"
														type="email"
														autoComplete="email"
														inputMode="email"
														className="h-11 w-full bg-transparent outline-none focus-visible:outline-none ring-0 focus:ring-0 border-0 pl-11 pr-3 text-base md:text-sm"
														{...field}
													/>
												</div>
											</div>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-primary">Mot de passe</FormLabel>
									<FormControl>
										<div className="grid gap-2">
											<Label htmlFor="password" className="sr-only">Mot de passe</Label>
											<div className="relative">
												<LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
												<div className="bg-input/30 dark:bg-input/30 rounded-md h-11 flex items-center transition focus-within:ring-0">
													<input
														id="password"
														placeholder="••••••••"
														type={showPassword ? 'text' : 'password'}
														autoComplete="current-password"
														className="h-11 w-full bg-transparent outline-none focus-visible:outline-none ring-0 focus:ring-0 border-0 pl-11 pr-10 text-base md:text-sm"
														{...field}
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
							)}
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


