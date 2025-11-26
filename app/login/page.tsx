'use client'

import { LoginForm } from "@/components/login-form"
import { AuthGuard } from "@/components/auth-guard"

export default function Page() {
	return (
		<AuthGuard>
			<div className="relative min-h-[100svh] grid place-items-center px-4 py-8 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_60%)]" />
					<div className="absolute left-1/4 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
					<div className="absolute right-1/4 top-24 h-60 w-60 rounded-full bg-accent/30 blur-3xl animate-blob animation-delay-2000" />
					<div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-ring/30 blur-3xl animate-blob animation-delay-4000" />
				</div>
				<LoginForm className="bg-card/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-primary/20 ring-1 ring-primary/10" />
			</div>
		</AuthGuard>
	)
}


