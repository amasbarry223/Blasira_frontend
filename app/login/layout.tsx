import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion - Blasira",
  description: "Connectez-vous à votre compte Blasira",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
