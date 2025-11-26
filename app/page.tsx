import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('blasira_auth_token')?.value

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (token) {
    redirect("/admin/dashboard")
  }

  // Sinon, rediriger vers la landing page
  redirect("/landing")
}
