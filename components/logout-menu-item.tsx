'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { removeToken } from '@/lib/auth'

export function LogoutMenuItem() {
	const router = useRouter()

	function handleLogout() {
		try {
			// Supprimer le token d'authentification
			removeToken()
			
			// Clear common client storages
			if (typeof localStorage !== 'undefined') {
				localStorage.clear()
			}
			if (typeof sessionStorage !== 'undefined') {
				sessionStorage.clear()
			}
			// Expire sidebar cookie if present
			document.cookie = 'sidebar_state=; Max-Age=0; path=/'
		} finally {
			router.push('/login')
		}
	}

	return (
		<DropdownMenuItem className="text-destructive" onClick={handleLogout}>
			<LogOut className="mr-2 h-4 w-4" />
			Déconnexion
		</DropdownMenuItem>
	)
}


