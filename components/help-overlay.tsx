'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/kbd'

export function HelpOverlay() {
	const [open, setOpen] = React.useState(false)

	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			// Shift + / produces '?'
			if ((e.key === '?' || (e.key === '/' && e.shiftKey)) && !e.metaKey && !e.ctrlKey && !e.altKey) {
				e.preventDefault()
				setOpen(true)
			}
			if (e.key === 'Escape') {
				setOpen(false)
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Raccourcis clavier</DialogTitle>
					<DialogDescription>Améliorez votre productivité avec ces raccourcis.</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
					<div className="flex items-center justify-between border rounded-md p-2">
						<span>Ouvrir l’aide</span>
						<Kbd>?</Kbd>
					</div>
					<div className="flex items-center justify-between border rounded-md p-2">
						<span>Rechercher</span>
						<Kbd>/</Kbd>
					</div>
					<div className="flex items-center justify-between border rounded-md p-2">
						<span>Basculer la sidebar</span>
						<div className="flex items-center gap-1">
							<Kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
							<Kbd>B</Kbd>
						</div>
					</div>
					<div className="flex items-center justify-between border rounded-md p-2">
						<span>Fermer un dialog</span>
						<Kbd>Esc</Kbd>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}


