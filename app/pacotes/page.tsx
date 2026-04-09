import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pacotes | KIXINDE YA NGONGO",
  description: "Pacotes de serviços de arquitetura e engenharia: Básico, Standard e Premium.",
}

const packages = [
  {
    name: "Basic",
    price: "Sob Consulta",
    desc: "Ideal para quem precisa dos documentos essenciais para iniciar o projeto.",
    features: [
      "Croqui de localização",
      "Planta preliminar",
      "1 render simples",
      "Prazo: 15 dias úteis",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    price: "Sob Consulta",
    desc: "A solução completa para projetos residenciais e comerciais.",
    features: [
      "Croqui de localização",
      "Projeto arquitectónico completo",
      "3 renders fotorrealistas",
      "Consultoria técnica",
      "Prazo: 30 dias úteis",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "Sob Consulta",
    desc: "O pacote mais completo para projetos de grande escala e complexidade.",
    features: [
      "Croqui de localização",
      "Levantamento topográfico",
      "Projeto completo",
      "Engenharia básica",
      "5 renders fotorrealistas",
      "Planeamento de obra",
      "Prazo: 45 dias úteis",
    ],
    highlight: false,
  },
]

export default function PacotesPage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Investimento</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Pacotes
          </h1>
          <p className="mt-4 text-lg text-[#a0a0a0] max-w-2xl font-sans leading-relaxed">
            Soluções adaptadas ao tamanho e complexidade do seu projeto.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`relative rounded-lg border p-10 flex flex-col ${
                  pkg.highlight
                    ? "border-primary bg-primary text-primary-foreground shadow-xl scale-105"
                    : "border-border bg-background"
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#F7A71C] px-4 py-1 text-xs font-semibold text-[#303030]">
                    Mais Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold font-serif ${pkg.highlight ? "text-[#ffffff]" : "text-foreground"}`}>
                  {pkg.name}
                </h3>
                <p className={`mt-2 text-lg font-semibold font-serif ${pkg.highlight ? "text-[#F7A71C]" : "text-accent"}`}>
                  {pkg.price}
                </p>
                <p className={`mt-3 text-sm leading-relaxed font-sans ${pkg.highlight ? "text-[#d0d0d0]" : "text-muted-foreground"}`}>
                  {pkg.desc}
                </p>
                <ul className="mt-8 flex flex-col gap-3 flex-1">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${pkg.highlight ? "text-[#F7A71C]" : "text-accent"}`} />
                      <span className={`text-sm font-sans ${pkg.highlight ? "text-[#e0e0e0]" : "text-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  className={`mt-8 w-full font-sans font-semibold ${
                    pkg.highlight
                      ? "bg-[#ffffff] text-[#303030] hover:bg-[#e0e0e0]"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <Link href="/contacto">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
