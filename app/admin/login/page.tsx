"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/hooks/useNotification"
import { errorLogger } from "@/lib/error-logger"
import { fetchJson } from "@/lib/fetch-wrapper"

export default function LoginPage() {
  const router = useRouter()
  const notify = useNotification()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const toastId = notify.loading("A fazer login...")
      
      const data = await fetchJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (!data.success) {
        const errorMsg = data.error?.message || "Email ou senha inválidos"
        notify.error(errorMsg, data.error?.id)
        setLoading(false)
        return
      }

      notify.success("Login realizado com sucesso!", { duration: 2000 })
      setTimeout(() => router.push("/admin/dashboard"), 1000)
    } catch (err) {
      const errorId = errorLogger.error(
        "Login falhou",
        { email },
        err instanceof Error ? err : new Error(String(err))
      )
      notify.error("Erro ao fazer login", errorId)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-xl font-bold text-foreground font-serif">KIXINDE YA NGONGO</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground font-serif">Painel Administrativo</h2>
            <p className="text-sm text-muted-foreground mt-2 font-sans">
              Gestão de Projectos de Arquitectura
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium font-sans">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kixindeyangongo.ao"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium font-sans">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="font-sans"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold h-10"
            >
              {loading ? "A conectar..." : "Entrar"}
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-sans">
              © 2024 KIXINDE YA NGONGO. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-xs">
              <a href="mailto:info@kixindeyangongo.ao" className="text-muted-foreground hover:text-foreground transition-colors font-sans">
                Contacte-nos
              </a>
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors font-sans">
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
