"use client"

import { useState } from "react"
import Image from "next/image"
import type { Metadata } from "next"

const categories = ["Todos", "Arquitetura", "Engenharia", "Infraestrutura", "Conceptual"]

const projects = [
  {
    title: "Moradia Luxo Talatona",
    category: "Arquitetura",
    description: "Projeto residencial de alto padrão com design contemporâneo africano, piscina e jardim tropical.",
    image: "/images/portfolio-1.jpg",
  },
  {
    title: "Torre Comercial Baixa de Luanda",
    category: "Arquitetura",
    description: "Edifício de escritórios com fachada de vidro e aço, 20 andares, sistema de climatização inteligente.",
    image: "/images/portfolio-2.jpg",
  },
  {
    title: "Centro de Saúde Municipal",
    category: "Infraestrutura",
    description: "Projeto de infraestrutura de saúde com espaços verdes, ventilação natural e eficiência energética.",
    image: "/images/portfolio-3.jpg",
  },
  {
    title: "Complexo Residencial Kilamba II",
    category: "Engenharia",
    description: "Complexo habitacional com engenharia estrutural avançada e soluções sustentáveis de drenagem.",
    image: "/images/portfolio-5.jpg",
  },
  {
    title: "Intercâmbio Viário Viana",
    category: "Infraestrutura",
    description: "Projecto de engenharia de transportes com viaduto e rotunda multinível para descongestionar o tráfego.",
    image: "/images/portfolio-6.jpg",
  },
  {
    title: "Conceito Museu Cultura Angolana",
    category: "Conceptual",
    description: "Projecto conceptual para espaço cultural com design futurista inspirado na arquitetura tradicional angolana.",
    image: "/images/portfolio-4.jpg",
  },
  {
    title: "Condomínio Belas Business Park",
    category: "Arquitetura",
    description: "Espaço comercial integrado com jardins interiores, estacionamento subterrâneo e sistemas inteligentes.",
    image: "/images/commercial.jpg",
  },
  {
    title: "Masterplan Urbano Cacuaco",
    category: "Engenharia",
    description: "Planeamento urbano de uma nova zona residencial e comercial com infraestruturas completas.",
    image: "/images/urban-planning.jpg",
  },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered = activeCategory === "Todos"
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Projetos</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Portfólio
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Uma seleção dos nossos projetos de arquitetura, engenharia e infraestrutura desenvolvidos para o território angolano.
          </p>
        </div>
      </section>

      {/* Filter + Gallery */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all font-sans ${
                  activeCategory === cat
                    ? "bg-[#F7A71C] text-[#303030]"
                    : "bg-secondary text-muted-foreground hover:bg-[#F7A71C]/10 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <div
                key={i}
                className="group rounded-lg border border-border overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-md bg-[#F7A71C] px-3 py-1 text-xs font-semibold text-[#303030] font-sans">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground font-serif">{project.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground font-sans">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
