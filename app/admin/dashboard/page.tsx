"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, FolderOpen, CreditCard, MessageCircle, Zap } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/admin/user")

      if (!response.ok) {
        router.push("/admin/login")
        return
      }

      const data = await response.json()
      setUser(data.user)
      setProjects(data.projects || [])
    } catch (err) {
      console.error("[v0] Erro ao carregar dados:", err)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (err) {
      console.error("[v0] Erro ao fazer logout:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground font-serif">KIXINDE YA NGONGO</h1>
            <p className="text-xs text-muted-foreground font-sans mt-1">Bem vindo, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-border font-sans"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground font-serif">Painel Administrativo</h2>
            <p className="text-muted-foreground mt-2 font-sans">Total: {projects.length} projectos</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/admin/ai-config")}
              variant="outline"
              className="border-border hover:bg-secondary font-sans"
            >
              <Zap className="w-4 h-4 mr-2" />
              IA Config
            </Button>
            <Button
              onClick={() => router.push("/admin/telegram-config")}
              variant="outline"
              className="border-border hover:bg-secondary font-sans"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            <Button
              onClick={() => router.push("/admin/subscription-plans")}
              variant="outline"
              className="border-border hover:bg-secondary font-sans"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Planos
            </Button>
            <Button
              onClick={() => router.push("/admin/projects")}
              variant="outline"
              className="border-border hover:bg-secondary font-sans"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Ver Todos
            </Button>
            <Button
              onClick={() => router.push("/gerador-projetos")}
              className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projecto
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground font-sans mb-4">Nenhum projecto criado ainda</p>
            <Button
              onClick={() => router.push("/gerador-projetos")}
              className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
            >
              Criar Primeiro Projecto
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project: any) => (
              <div key={project.id} className="p-4 border border-border rounded-lg bg-card hover:border-[#F7A71C]/50 transition-colors">
                <h3 className="font-semibold text-foreground font-sans">{project.projectName}</h3>
                <p className="text-sm text-muted-foreground font-sans mt-1">{project.location}</p>
                <p className="text-xs text-muted-foreground font-sans mt-2">
                  {new Date(project.createdAt).toLocaleDateString("pt-PT")}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
