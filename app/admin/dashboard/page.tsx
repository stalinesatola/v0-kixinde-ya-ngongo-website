"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Download, FileText, FolderOpen } from "lucide-react"
import type { User, Project } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAndProjects()
  }, [])

  const fetchUserAndProjects = async () => {
    try {
      const response = await fetch("/api/admin/user")
      if (!response.ok) {
        router.push("/admin/login")
        return
      }

      const data = await response.json()
      setUser(data.user)
      setProjects(data.projects || [])
    } catch (error) {
      console.error("[v0] Erro ao carregar dados:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const handleNewProject = () => {
    router.push("/gerador-projetos")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground font-sans">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-sans">Bem vindo,</p>
              <p className="font-semibold text-foreground font-sans">{user?.name}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground font-sans"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2 font-sans">Gestao de Projectos de Arquitectura</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/admin/projects")}
              variant="outline"
              className="border-border hover:bg-secondary font-sans"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Ver Todos
            </Button>
            <Button
              onClick={handleNewProject}
              className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projecto
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground font-sans mb-2">Total de Projectos</p>
            <p className="text-3xl font-bold text-[#F7A71C] font-serif">{projects.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground font-sans mb-2">Projectos Gerados</p>
            <p className="text-3xl font-bold text-foreground font-serif">
              {projects.filter((p) => p.status === "generated").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground font-sans mb-2">Projectos Rascunho</p>
            <p className="text-3xl font-bold text-foreground font-serif">
              {projects.filter((p) => p.status === "draft").length}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground font-serif">Meus Projectos</h2>
          </div>
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-sans">Nenhum projecto criado ainda</p>
              <Button
                onClick={handleNewProject}
                className="mt-4 bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
              >
                Criar Primeiro Projecto
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-sans">
                      Nome do Projecto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-sans">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-sans">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-sans">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-sans">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-sans">
                      Accoes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-sans">{project.projectName}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-sans">{project.clientName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-sans">
                        {project.projectType} {project.projectSubType && `- ${project.projectSubType}`}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold font-sans ${
                            project.status === "generated"
                              ? "bg-green-500/20 text-green-700 dark:text-green-400"
                              : project.status === "draft"
                                ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {project.status === "generated"
                            ? "Gerado"
                            : project.status === "draft"
                              ? "Rascunho"
                              : project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-sans">
                        {new Date(project.createdAt).toLocaleDateString("pt-PT")}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#F7A71C] hover:bg-[#F7A71C]/10 font-sans"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
