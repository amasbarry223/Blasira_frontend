'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Car,
  Shield,
  Users,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  Route,
  Smartphone,
  Globe,
  Download,
  QrCode,
  Bell,
  Navigation,
  CreditCard,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import logo from '@/assets/logo.png'
import { ModernNavbar } from '@/components/modern-navbar'

// Logo component avec fallback
function Logo({ width = 40, height = 40, className = '' }: { width?: number; height?: number; className?: string }) {
  return <Image src={logo} alt="Blasira" width={width} height={height} className={className} />
}

const features = [
  {
    icon: Car,
    title: 'Covoiturage intelligent',
    description: 'Trouvez ou proposez des trajets en quelques clics avec notre système de matching avancé. Disponible sur mobile et web.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Sécurité garantie',
    description: 'Vérification des conducteurs et passagers pour une expérience sécurisée et fiable sur toutes les plateformes.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Users,
    title: 'Communauté active',
    description: 'Rejoignez une communauté de milliers d\'utilisateurs qui partagent leurs trajets via l\'app mobile ou le site web.',
    color: 'text-ring',
    bgColor: 'bg-ring/10',
  },
  {
    icon: Zap,
    title: 'Rapide et efficace',
    description: 'Réservation instantanée et paiement sécurisé pour une expérience fluide, que vous soyez sur mobile ou web.',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
]

const mobileFeatures = [
  {
    icon: Navigation,
    title: 'GPS en temps réel',
    description: 'Suivez votre trajet en direct avec la géolocalisation précise',
    color: 'text-primary',
  },
  {
    icon: Bell,
    title: 'Notifications push',
    description: 'Recevez des alertes instantanées pour vos réservations',
    color: 'text-accent',
  },
  {
    icon: QrCode,
    title: 'QR Code de vérification',
    description: 'Vérifiez rapidement les identités avec un scan QR',
    color: 'text-ring',
  },
  {
    icon: CreditCard,
    title: 'Paiement mobile',
    description: 'Payez facilement avec Apple Pay, Google Pay ou carte',
    color: 'text-chart-3',
  },
  {
    icon: MessageCircle,
    title: 'Chat intégré',
    description: 'Communiquez directement avec les autres utilisateurs',
    color: 'text-primary',
  },
  {
    icon: MapPin,
    title: 'Recherche avancée',
    description: 'Trouvez des trajets près de vous avec la recherche géolocalisée',
    color: 'text-accent',
  },
]

const stats = [
  { value: '10K+', label: 'Utilisateurs actifs', icon: Users },
  { value: '50K+', label: 'Trajets réalisés', icon: Car },
  { value: '4.8★', label: 'Note moyenne', icon: Star },
  { value: '98%', label: 'Satisfaction', icon: TrendingUp },
]

const benefits = [
  'Économisez jusqu\'à 70% sur vos trajets',
  'Réduisez votre empreinte carbone',
  'Rencontrez de nouvelles personnes',
  'Voyagez en toute sécurité',
  'Paiement sécurisé et flexible',
  'Disponible sur iOS, Android et Web',
]

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-ring/5" />
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-accent/20 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-ring/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Navigation */}
      <ModernNavbar />

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Hero Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Base gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/80" />
          
          {/* Animated gradient mesh */}
            <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(31, 103, 115, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(165, 198, 80, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(75, 157, 165, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 30% 40%, rgba(31, 103, 115, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(165, 198, 80, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(75, 157, 165, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(31, 103, 115, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(165, 198, 80, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(75, 157, 165, 0.2) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Animated orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] rounded-full bg-primary/20 blur-[100px]"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 50, 0],
              scale: [1, 1.3, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] rounded-full bg-accent/20 blur-[100px]"
            animate={{
              x: [0, -100, 50, 0],
              y: [0, 80, -50, 0],
              scale: [1, 0.9, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-ring/15 blur-[80px]"
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -40, 60, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(31, 103, 115, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(31, 103, 115, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundImage: `
                  linear-gradient(rgba(165, 198, 80, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(165, 198, 80, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
            </div>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-primary/30"
              style={{
                left: `${(i * 8) % 100}%`,
                top: `${(i * 7) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Geometric shapes */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 border-2 border-primary/10 rounded-3xl"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 border-2 border-accent/10 rounded-full"
            animate={{
              rotate: [360, 270, 180, 90, 0],
              scale: [1, 0.8, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Shine effect overlay */}
          <div className="hero-shine" />
          </div>

        {/* Content with backdrop blur for better readability */}
        <div className="relative z-10">
        <motion.div
          style={{ y, opacity }}
          className="container mx-auto max-w-6xl"
        >
          <motion.div
              className="text-center space-y-8 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
              {/* Subtle backdrop for text areas */}
              <div className="absolute inset-0 -z-10 backdrop-blur-[2px] bg-background/20 rounded-3xl opacity-0 sm:opacity-100" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-4 bg-accent/20 backdrop-blur-sm text-accent border-accent/30 hover:bg-accent/30 shadow-lg shadow-accent/10">
                <Zap className="mr-2 h-3 w-3" />
                Disponible sur iOS, Android et Web
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-primary via-ring to-accent bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_2px_8px_rgba(31,103,115,0.3)]">
                Voyagez autrement
              </span>
              <br />
              <span className="text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">avec Blasira</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/90 max-w-3xl mx-auto px-4 sm:px-0 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              La plateforme de covoiturage qui vous connecte. Économique, écologique et sécurisée.
              <br className="hidden sm:block" />
              <span className="text-sm sm:text-base md:text-lg text-foreground/70">Sur votre téléphone, tablette ou ordinateur.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 group shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                  Télécharger l'app
                  <Download className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 shadow-lg hover:shadow-xl transition-all duration-300">
                  Utiliser le site web
                  <Globe className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${index % 2 === 0 ? 'text-primary' : 'text-accent'} drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]`} />
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_2px_4px_rgba(31,103,115,0.2)]">{stat.value}</div>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/80 px-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Smartphone className="mr-2 h-3 w-3" />
                Fonctionnalités mobiles
              </Badge>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary px-4 sm:px-0">
              Une expérience mobile optimale
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Découvrez toutes les fonctionnalités conçues spécialement pour votre smartphone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-ring/20 text-ring border-ring/30">
                <Sparkles className="mr-2 h-3 w-3" />
                Fonctionnalités
              </Badge>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary px-4 sm:px-0">
              Pourquoi choisir Blasira ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Une expérience de covoiturage moderne, sécurisée et écologique sur toutes les plateformes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                  <Route className="mr-2 h-3 w-3" />
                  Avantages
                </Badge>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-primary">
                Les avantages de Blasira
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                Rejoignez une communauté qui révolutionne la mobilité urbaine et réduit l'impact environnemental.
                Disponible sur mobile et web.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-3 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </motion.div>
                    <span className="text-base sm:text-lg group-hover:text-primary transition-colors">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div
                  className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Villes desservies</div>
                </motion.div>
                <motion.div
                  className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-lg mt-4 sm:mt-8"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-accent mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Disponibilité</div>
                </motion.div>
                <motion.div
                  className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-lg"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-ring mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-ring mb-1">70%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Économie moyenne</div>
                </motion.div>
                <motion.div
                  className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-lg mt-4 sm:mt-8"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-chart-3 mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-chart-3 mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Sécurisé</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary px-4 sm:px-0">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Découvrez les témoignages de ceux qui utilisent Blasira au quotidien
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'Marie Dubois',
                role: 'Étudiante',
                content: 'L\'app mobile Blasira est géniale ! Je peux réserver un trajet en quelques secondes depuis mon téléphone. Très pratique pour mes déplacements quotidiens.',
                rating: 5,
              },
              {
                name: 'Jean Martin',
                role: 'Conducteur',
                content: 'J\'utilise Blasira sur mobile et web. L\'interface est intuitive sur les deux plateformes. Je partage mes trajets régulièrement et j\'ai rencontré des personnes formidables.',
                rating: 5,
              },
              {
                name: 'Sophie Laurent',
                role: 'Professionnelle',
                content: 'Parfait pour mes déplacements professionnels. Je peux utiliser le site web au bureau et l\'app mobile en déplacement. Les paiements sont sécurisés partout.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-ring/5 to-accent/5 p-6 sm:p-8 md:p-12 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              />
              <CardContent className="space-y-6 relative z-10">
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                    <Sparkles className="mr-2 h-3 w-3" />
                    Rejoignez-nous maintenant
                  </Badge>
                </motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                  Prêt à commencer ?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-0">
                  Téléchargez l'application mobile ou utilisez notre plateforme web. Rejoignez des milliers d'utilisateurs qui font confiance à Blasira.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 group">
                      Télécharger l'app
                      <Download className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2">
                      Utiliser le site web
                      <Globe className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo width={32} height={32} className="rounded-md" />
                <span className="text-lg font-semibold text-primary">Blasira</span>
              </div>
              <p className="text-sm text-gray-400">
                La plateforme de covoiturage qui vous connecte. Disponible sur iOS, Android et Web.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Plateformes</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Application iOS</li>
                <li>Application Android</li>
                <li>Site Web</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Support</li>
                <li>À propos</li>
                <li>Politique de confidentialité</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © 2025 Blasira. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                iOS
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Android
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Web
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
