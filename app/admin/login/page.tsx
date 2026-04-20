"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Login - enviando para /api/auth/login")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] Login - resposta status:", response.status)
      const data = await response.json()
      console.log("[v0] Login - resposta data:", data)

      if (!response.ok) {
        console.log("[v0] Login - erro:", data.error)
        setError(data.error || "Falha no login")
        setLoading(false)
        return
      }

      console.log("[v0] Login - sucesso! redirecionando para dashboard")
      setLoading(false)
      router.push("/admin/dashboard")
    } catch (err) {
      console.error("[v0] Login - erro na requisição:", err)
      setError("Erro ao conectar com o servidor")
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
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-sans">{error}</p>
              </div>
            )}

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
