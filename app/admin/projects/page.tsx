"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User, Project } from "@/lib/types"

export const dynamic = 'force-dynamic'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredProjects(
        projects.filter(
          (p) =>
            p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredProjects(projects)
    }
  }, [searchTerm, projects])

  const fetchData = async () => {
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
      console.error("[v0] Erro ao carregar projectos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este projecto?")) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId))
      }
    } catch (error) {
      console.error("[v0] Erro ao eliminar projecto:", error)
    }
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
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Button
            onClick={() => router.push("/admin/dashboard")}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground font-serif">KIXINDE YA NGONGO</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground font-serif mb-2">
            Gestao de Projectos
          </h1>
          <p className="text-muted-foreground font-sans">
            Total: <span className="font-semibold text-foreground">{projects.length}</span> projectos
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Procurar por nome, cliente ou localizacao..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-sans"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground font-sans mb-4">Nenhum projecto encontrado</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-[#F7A71C]/50 transition-colors"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground font-serif mb-2 truncate">
                      {project.projectName}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold font-sans ${
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
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground font-sans mb-4">
                    <p>
                      <span className="font-semibold text-foreground">Cliente:</span> {project.clientName}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Tipo:</span> {project.projectType}{" "}
                      {project.projectSubType && `- ${project.projectSubType}`}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Localizacao:</span>{" "}
                      {project.location}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Area:</span> {project.area} m²
                    </p>
                    <p className="text-xs">
                      {new Date(project.createdAt).toLocaleDateString("pt-PT")}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descarregar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:bg-red-500/10 font-sans"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
