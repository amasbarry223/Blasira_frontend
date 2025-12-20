import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blasira - Plateforme de covoiturage intelligent",
  description: "Trouvez ou proposez des trajets en toute sécurité avec Blasira, la plateforme de covoiturage pour étudiants et professionnels.",
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
