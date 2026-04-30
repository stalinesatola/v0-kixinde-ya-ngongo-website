"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  {
    label: "Serviços",
    href: "/servicos",
    children: [
      { label: "Arquitetura", href: "/arquitetura" },
      { label: "Engenharia", href: "/engenharia" },
      { label: "Simulador de Projetos", href: "/gerador-projetos" },
    ],
  },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Pacotes", href: "/pacotes" },
  { label: "Empresa", href: "/empresa" },
  { label: "Contacto", href: "/contacto" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    // Check if user is logged in by checking for session cookie
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/user")
        setIsLoggedIn(response.ok)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    if (!isHomePage) {
      setShowMenu(true)
      return
    }

    const fetchHomeSettings = async () => {
      try {
        const response = await fetch('/api/home-settings')
        const data = await response.json()
        setShowMenu(data?.data?.settings?.showMenu ?? true)
      } catch (error) {
        setShowMenu(true)
      }
    }

    fetchHomeSettings()
  }, [isHomePage])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsLoggedIn(false)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (isHomePage && !showMenu) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-horizontal.png"
            alt="KIXINDE YA NGONGO"
            width={300}
            height={80}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                  {link.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-background p-2 shadow-lg">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-accent transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-[#d99116] font-sans font-semibold">
            <Link href="/gerador-projetos">Simular Projeto</Link>
          </Button>
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 font-sans font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile nav */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === link.label ? null : link.label)
                    }
                    className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground/80"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="ml-4 flex flex-col gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="py-2 text-sm text-foreground/70 hover:text-accent"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-sm font-medium text-foreground/80 hover:text-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <Button asChild size="sm" className="mt-4 bg-accent text-accent-foreground hover:bg-[#d99116] font-sans font-semibold">
              <Link href="/gerador-projetos">Simular Projeto</Link>
            </Button>
            {isLoggedIn && (
              <Button
                onClick={handleLogout}
                size="sm"
                className="mt-2 w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
