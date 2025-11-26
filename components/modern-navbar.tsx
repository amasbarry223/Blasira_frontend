'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import logo from '@/assets/logo.png'

interface NavItem {
  label: string
  href: string
  sectionId?: string
}

const navItems: NavItem[] = [
  { label: 'Accueil', href: '#hero', sectionId: 'hero' },
  { label: 'Fonctionnalités', href: '#features', sectionId: 'features' },
  { label: 'Avantages', href: '#benefits', sectionId: 'benefits' },
  { label: 'Témoignages', href: '#testimonials', sectionId: 'testimonials' },
]

export function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  // Track scroll position for expansion/contraction
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const current = latest
    const previous = lastScrollY.current

    // Expand when scrolling up, contract when scrolling down
    if (current < previous || current < 100) {
      setIsExpanded(true)
    } else if (current > previous && current > 100) {
      setIsExpanded(false)
    }

    // Update scrolled state for styling
    setIsScrolled(current > 50)
    lastScrollY.current = current
  })

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .filter((item) => item.sectionId)
        .map((item) => {
          const element = document.getElementById(item.sectionId!)
          if (element) {
            const rect = element.getBoundingClientRect()
            return {
              id: item.sectionId!,
              top: rect.top,
              bottom: rect.bottom,
            }
          }
          return null
        })
        .filter(Boolean) as Array<{ id: string; top: number; bottom: number }>

      const currentSection = sections.find((section) => {
        return section.top <= 100 && section.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      } else if (window.scrollY < 300) {
        setActiveSection('hero')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1))
      if (element) {
        const offset = 120
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        className="fixed top-2 sm:top-4 z-[450] left-0 right-0 mx-auto container"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '95%',
        }}
      >
        <motion.div
          className="flex items-start justify-between rounded-[24px] px-3 py-2 pr-2.5 lg:items-center lg:rounded-[50px] relative overflow-hidden"
          animate={{
            paddingTop: isExpanded ? '0.5rem' : '0.25rem',
            paddingBottom: isExpanded ? '0.5rem' : '0.25rem',
            borderRadius: isExpanded ? '50px' : '24px',
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          style={{
            background: isScrolled
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(25.5px) brightness(1.04) contrast(1.075)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isScrolled
              ? '0 7.5px 30px rgba(0, 0, 0, 0.045), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
              : '0 3px 15px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            transform: 'translateZ(0px)',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            willChange: 'backdrop-filter, background, border, box-shadow, opacity, transform',
            contain: 'layout style paint',
            isolation: 'isolate',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(45deg, rgba(255, 255, 255, 0.24) 0%, transparent 50%, rgba(0, 0, 0, 0.16) 100%)',
              mixBlendMode: 'overlay',
              borderRadius: 'inherit',
            }}
          />

          {/* Logo */}
          <Link
            href="/"
            className="relative mx-2 flex cursor-pointer flex-row items-center justify-center pt-0.5 lg:pt-0 z-10"
            aria-label="Homepage"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative h-7 w-7 md:h-6 md:w-6">
                <Image
                  src={logo}
                  alt="Blasira"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <motion.span
                className="hidden md:block text-lg font-bold text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                Blasira
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-4 md:gap-4 lg:flex xl:gap-12 z-10"
            style={{
              opacity: 1,
              visibility: 'inherit',
              display: 'flex',
            }}
          >
            <AnimatePresence mode="wait">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.sectionId
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`leading-none font-medium tracking-[-0.00875em] transition-all hover:text-primary relative ${
                      isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        layoutId="activeSection"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.a>
                )
              })}
            </AnimatePresence>
          </nav>

          {/* CTA Button */}
          <motion.div
            className="mr-4 md:mr-0 z-10"
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/login">
              <Button
                className="h-9 px-8 rounded-[18px] bg-gradient-to-br from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="sm"
              >
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="z-[100] mx-2 mt-2 flex w-fit items-center justify-center lg:hidden relative isolate after:absolute after:-inset-2 after:content-[''] touch-action-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="flex h-5 w-[22px] origin-center flex-col items-center justify-center space-y-1.5"
              aria-hidden="true"
            >
              <motion.span
                className="h-0.5 w-full rounded-full bg-current"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="h-0.5 w-full rounded-full bg-current"
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="h-0.5 w-full rounded-full bg-current"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[400] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              id="mobile-menu"
              className="fixed top-16 sm:top-20 left-0 right-0 mx-auto z-[450] container"
              style={{ width: '95%' }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="rounded-[24px] p-6 space-y-4 relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(25.5px) brightness(1.04) contrast(1.075)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow:
                    '0 7.5px 30px rgba(0, 0, 0, 0.045), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(45deg, rgba(255, 255, 255, 0.24) 0%, transparent 50%, rgba(0, 0, 0, 0.16) 100%)',
                    mixBlendMode: 'overlay',
                    borderRadius: 'inherit',
                  }}
                />
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.sectionId
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`block py-3 px-4 rounded-lg font-medium transition-all relative z-10 ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                    >
                      {item.label}
                    </motion.a>
                  )
                })}
                <motion.div
                  className="pt-4 border-t border-border/50 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full h-11 rounded-[18px] bg-gradient-to-br from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg"
                    >
                      Commencer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

