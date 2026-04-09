"use client"

import { useState, useRef } from "react"
import { Upload, Sparkles, Loader2, FileText, Layers, Building2, Ruler, Box, Cpu, AreaChart, Lightbulb, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const projectTypes = [
  { value: "Casa", icon: "🏠" },
  { value: "Edifício", icon: "🏢" },
  { value: "Espaço Comercial", icon: "🏪" },
  { value: "Infraestrutura", icon: "🏗️" },
]

const architecturalStyles = [
  "Moderno",
  "Minimalista",
  "Contemporâneo",
  "Moderno Africano",
]

const sectionIcons: Record<string, React.ReactNode> = {
  "ANÁLISE DO TERRENO": <Ruler className="h-5 w-5" />,
  "LAYOUT CONCEITUAL": <Layers className="h-5 w-5" />,
  "PLANTA BAIXA": <FileText className="h-5 w-5" />,
  "CORTES DO EDIFÍCIO": <Building2 className="h-5 w-5" />,
  "ALÇADOS": <Building2 className="h-5 w-5" />,
  "VOLUMETRIA 3D": <Box className="h-5 w-5" />,
  "ESTRUTURA BIM": <Cpu className="h-5 w-5" />,
  "ESTIMATIVA DE ÁREAS": <AreaChart className="h-5 w-5" />,
  "RECOMENDAÇÕES": <Lightbulb className="h-5 w-5" />,
}

function getSectionIcon(title: string) {
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (title.toUpperCase().includes(key)) return icon
  }
  return <FileText className="h-5 w-5" />
}

interface FormData {
  name: string
  phone: string
  email: string
  location: string
  area: string
  dimensions: string
  coordinates: string
  projectType: string
  floors: string
  bedrooms: string
  bathrooms: string
  parking: string
  style: string
  notes: string
}

const initialFormData: FormData = {
  name: "",
  phone: "",
  email: "",
  location: "",
  area: "",
  dimensions: "",
  coordinates: "",
  projectType: "",
  floors: "1",
  bedrooms: "3",
  bathrooms: "2",
  parking: "1",
  style: "",
  notes: "",
}

export default function GeradorProjetosPage() {
  const [step, setStep] = useState<"form" | "generating" | "result">("form")
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [streamContent, setStreamContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("generating")
    setStreamContent("")
    setIsStreaming(true)

    abortRef.current = new AbortController()

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData: formData }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) throw new Error("Erro ao gerar projeto")
      if (!response.body) throw new Error("Sem stream de resposta")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setStreamContent(accumulated)
      }

      setStep("result")
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setStreamContent("Ocorreu um erro ao gerar o projeto. Por favor, tente novamente.")
      setStep("result")
    } finally {
      setIsStreaming(false)
    }
  }

  const handleReset = () => {
    if (abortRef.current) abortRef.current.abort()
    setStep("form")
    setFormData(initialFormData)
    setStreamContent("")
    setIsStreaming(false)
  }

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Parse markdown into sections
  const parseSections = (content: string) => {
    const lines = content.split("\n")
    const sections: { title: string; content: string }[] = []
    let currentSection = { title: "", content: "" }

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (currentSection.title || currentSection.content.trim()) {
          sections.push({ ...currentSection })
        }
        currentSection = { title: line.replace("## ", "").replace(/^\d+\.\s*/, ""), content: "" }
      } else {
        currentSection.content += line + "\n"
      }
    }
    if (currentSection.title || currentSection.content.trim()) {
      sections.push(currentSection)
    }
    return sections
  }

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let tableRows: string[][] = []
    let isInTable = false

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="px-4 py-2.5 text-left font-semibold text-foreground">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-background" : "bg-secondary/50"}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2 text-muted-foreground">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
      }
      isInTable = false
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Table row
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        // Skip separator rows
        if (/^\|[\s-:|]+\|$/.test(line.trim())) {
          isInTable = true
          continue
        }
        const cells = line.split("|").filter((c) => c.trim() !== "")
        if (cells.length > 0) {
          tableRows.push(cells)
          isInTable = true
        }
        continue
      }

      if (isInTable) flushTable()

      // Headings
      if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="mt-5 mb-2 text-base font-bold text-foreground font-serif">{line.replace("### ", "")}</h3>)
      } else if (line.startsWith("- ")) {
        elements.push(
          <div key={i} className="flex items-start gap-2.5 py-0.5">
            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F7A71C] shrink-0" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {line.replace("- ", "").split("**").map((part, pi) =>
                pi % 2 === 1 ? <strong key={pi} className="text-foreground">{part}</strong> : part
              )}
            </p>
          </div>
        )
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />)
      } else {
        elements.push(
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {line.split("**").map((part, pi) =>
              pi % 2 === 1 ? <strong key={pi} className="text-foreground">{part}</strong> : part
            )}
          </p>
        )
      }
    }

    if (isInTable) flushTable()

    return elements
  }

  // GENERATING / RESULT VIEW
  if (step === "generating" || step === "result") {
    const sections = parseSections(streamContent)

    return (
      <div className="pt-[73px]">
        {/* Top bar */}
        <section className="border-b border-border bg-background sticky top-[73px] z-40">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <button onClick={handleReset} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-sans">
              <ArrowLeft className="h-4 w-4" />
              Nova Simulacao
            </button>
            <div className="flex items-center gap-3">
              {isStreaming && (
                <div className="flex items-center gap-2 text-sm text-[#F7A71C] font-sans">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A gerar projecto...
                </div>
              )}
              {!isStreaming && step === "result" && (
                <span className="text-sm font-medium text-[#F7A71C] font-sans">Projecto gerado</span>
              )}
            </div>
          </div>
        </section>

        {/* Project Summary Header */}
        <section className="bg-[#303030] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Projecto Conceptual</p>
                <h1 className="text-2xl font-bold text-[#ffffff] md:text-3xl font-serif text-balance">
                  {formData.projectType} {formData.style && `- ${formData.style}`}
                </h1>
                <p className="mt-2 text-sm text-[#c0c0c0] font-sans">
                  {formData.location} | {formData.area} m² | {formData.floors} andar(es)
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Area", value: `${formData.area} m²` },
                  { label: "Quartos", value: formData.bedrooms },
                  { label: "WC", value: formData.bathrooms },
                  { label: "Parking", value: formData.parking },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-[#ffffff]/5 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-[#ffffff] font-serif">{stat.value}</p>
                    <p className="text-xs text-[#c0c0c0] font-sans">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI Output Content */}
        <section className="py-16 bg-background" ref={resultRef}>
          <div className="mx-auto max-w-4xl px-6">
            {sections.length === 0 && isStreaming && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7A71C]/10">
                  <Loader2 className="h-8 w-8 animate-spin text-[#F7A71C]" />
                </div>
                <p className="text-sm text-muted-foreground font-sans">A analisar dados do terreno e gerar projecto...</p>
              </div>
            )}

            {sections.length > 0 && (
              <div className="flex flex-col gap-8">
                {/* Section navigation */}
                {!isStreaming && sections.filter(s => s.title).length > 1 && (
                  <div className="flex flex-wrap gap-2 pb-6 border-b border-border">
                    {sections.filter(s => s.title).map((s, i) => (
                      <a
                        key={i}
                        href={`#section-${i}`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-[#F7A71C] hover:text-[#F7A71C] transition-colors font-sans"
                      >
                        {s.title.replace(/^\d+\.\s*/, "")}
                      </a>
                    ))}
                  </div>
                )}

                {/* Sections */}
                {sections.map((section, i) => (
                  <div key={i} id={`section-${i}`} className="rounded-lg border border-border bg-background p-6 md:p-8">
                    {section.title && (
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7A71C]/10 text-[#F7A71C]">
                          {getSectionIcon(section.title)}
                        </div>
                        <h2 className="text-lg font-bold text-foreground font-serif">{section.title}</h2>
                      </div>
                    )}
                    <div className="prose-sm">{renderMarkdown(section.content)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions */}
            {!isStreaming && streamContent && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={handleReset} variant="outline" className="font-sans">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Nova Simulacao
                </Button>
                <Button asChild className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold">
                  <a href="https://wa.me/244923000000?text=Olá, gerei um projecto conceptual e gostaria de avançar." target="_blank" rel="noopener noreferrer">
                    Falar com Equipa Tecnica
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  // FORM VIEW
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-24 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Inteligencia Artificial</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Gerador de Projectos
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Utilize inteligencia artificial para gerar plantas baixas, cortes, alcados, volumetria 3D e estrutura BIM para o seu projecto.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          <form onSubmit={handleGenerate} className="flex flex-col gap-10">

            {/* Step 1: Personal Info */}
            <div className="rounded-lg border border-border p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7A71C] text-sm font-bold text-[#303030] font-serif">1</div>
                <h2 className="text-lg font-bold text-foreground font-serif">Dados do Cliente</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-sm font-medium font-sans">Nome</Label>
                  <Input id="name" required placeholder="Nome completo" value={formData.name} onChange={(e) => update("name", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium font-sans">Telefone</Label>
                  <Input id="phone" required type="tel" placeholder="+244 923 000 000" value={formData.phone} onChange={(e) => update("phone", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-sm font-medium font-sans">Email</Label>
                  <Input id="email" required type="email" placeholder="email@exemplo.com" value={formData.email} onChange={(e) => update("email", e.target.value)} className="font-sans" />
                </div>
              </div>
            </div>

            {/* Step 2: Land Info */}
            <div className="rounded-lg border border-border p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7A71C] text-sm font-bold text-[#303030] font-serif">2</div>
                <h2 className="text-lg font-bold text-foreground font-serif">Dados do Terreno</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location" className="text-sm font-medium font-sans">Localizacao</Label>
                  <Input id="location" required placeholder="Bairro, Municipio, Provincia" value={formData.location} onChange={(e) => update("location", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="area" className="text-sm font-medium font-sans">Area do Terreno (m2)</Label>
                  <Input id="area" required type="number" placeholder="ex: 500" value={formData.area} onChange={(e) => update("area", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dimensions" className="text-sm font-medium font-sans">Dimensoes do Terreno</Label>
                  <Input id="dimensions" placeholder="ex: 20m x 25m" value={formData.dimensions} onChange={(e) => update("dimensions", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="coordinates" className="text-sm font-medium font-sans">Coordenadas (Opcional)</Label>
                  <Input id="coordinates" placeholder="Latitude, Longitude" value={formData.coordinates} onChange={(e) => update("coordinates", e.target.value)} className="font-sans" />
                </div>
              </div>
            </div>

            {/* Step 3: Project Details */}
            <div className="rounded-lg border border-border p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7A71C] text-sm font-bold text-[#303030] font-serif">3</div>
                <h2 className="text-lg font-bold text-foreground font-serif">Detalhes do Projecto</h2>
              </div>

              {/* Project Type */}
              <div className="mb-6">
                <Label className="mb-3 block text-sm font-medium font-sans">Tipo de Projecto</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => update("projectType", type.value)}
                      className={`flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-all font-sans ${
                        formData.projectType === type.value
                          ? "border-[#F7A71C] bg-[#F7A71C]/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-[#F7A71C]/40"
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      {type.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="floors" className="text-sm font-medium font-sans">Andares</Label>
                  <Input id="floors" type="number" min="1" max="50" value={formData.floors} onChange={(e) => update("floors", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bedrooms" className="text-sm font-medium font-sans">Quartos</Label>
                  <Input id="bedrooms" type="number" min="0" max="20" value={formData.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bathrooms" className="text-sm font-medium font-sans">Casas de Banho</Label>
                  <Input id="bathrooms" type="number" min="1" max="20" value={formData.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className="font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="parking" className="text-sm font-medium font-sans">Estacionamento</Label>
                  <Input id="parking" type="number" min="0" max="20" value={formData.parking} onChange={(e) => update("parking", e.target.value)} className="font-sans" />
                </div>
              </div>

              {/* Architectural Style */}
              <div>
                <Label className="mb-3 block text-sm font-medium font-sans">Estilo Arquitectonico</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {architecturalStyles.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update("style", s)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all font-sans ${
                        formData.style === s
                          ? "border-[#F7A71C] bg-[#F7A71C]/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-[#F7A71C]/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Uploads & Notes */}
            <div className="rounded-lg border border-border p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7A71C] text-sm font-bold text-[#303030] font-serif">4</div>
                <h2 className="text-lg font-bold text-foreground font-serif">Documentos e Observacoes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="terrain-photo" className="text-sm font-medium font-sans">Foto do Terreno (Opcional)</Label>
                  <label
                    htmlFor="terrain-photo"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-sm text-muted-foreground hover:border-[#F7A71C]/40 transition-colors font-sans"
                  >
                    <Upload className="h-6 w-6" />
                    <span>Carregar foto do terreno</span>
                    <span className="text-xs">JPG, PNG ate 10MB</span>
                  </label>
                  <input id="terrain-photo" type="file" accept="image/*" className="sr-only" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="site-map" className="text-sm font-medium font-sans">Mapa / Croqui (Opcional)</Label>
                  <label
                    htmlFor="site-map"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-sm text-muted-foreground hover:border-[#F7A71C]/40 transition-colors font-sans"
                  >
                    <Upload className="h-6 w-6" />
                    <span>Carregar mapa do local</span>
                    <span className="text-xs">JPG, PNG, PDF ate 10MB</span>
                  </label>
                  <input id="site-map" type="file" accept="image/*,.pdf" className="sr-only" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes" className="text-sm font-medium font-sans">Observacoes Adicionais</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Descreva detalhes adicionais: preferencias de materiais, orcamento, necessidades especiais..."
                  value={formData.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="font-sans"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={!formData.name || !formData.email || !formData.location || !formData.area || !formData.projectType || !formData.style}
              className="w-full bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold text-base h-14 disabled:opacity-40"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Gerar Projecto com Inteligencia Artificial
            </Button>

            <p className="text-center text-xs text-muted-foreground font-sans">
              O projecto conceptual gerado por IA serve como base para desenvolvimento profissional posterior em Revit / ArchiCAD.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
