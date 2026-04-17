"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Falha no login")
        setLoading(false)
        return
      }

      // Navigate after successful login
      router.push("/admin/dashboard")
      router.refresh()
    } catch (err) {
      setError("Erro ao conectar com o servidor")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image
            src="/images/logo-horizontal.png"
            alt="KIXINDE YA NGONGO"
            width={200}
            height={50}
            className="h-12 w-auto mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-bold text-foreground font-serif">Painel Administrativo</h1>
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

          <div className="text-center text-xs text-muted-foreground font-sans">
            <p>
              Demo: <span className="font-mono">admin@kixindeyangongo.ao</span> / <span className="font-mono">demo123</span>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
