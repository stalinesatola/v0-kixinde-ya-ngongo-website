import Image from "next/image"
import { Home, Building2, Layers, PenTool, Eye } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Arquitetura | KIXINDE YA NGONGO",
  description: "Serviços de arquitetura residencial, comercial, design urbano e visualização arquitectónica.",
}

const services = [
  { icon: Home, title: "Arquitetura Residencial", desc: "Projetos de moradias, apartamentos e condomínios com design contemporâneo africano, adaptados ao clima e cultura local. Cada residência é pensada para maximizar conforto, funcionalidade e estética." },
  { icon: Building2, title: "Arquitetura Comercial", desc: "Espaços comerciais, escritórios e centros empresariais projetados para produtividade e impacto visual. Design que valoriza a marca e otimiza a experiência do utilizador." },
  { icon: Layers, title: "Design Urbano", desc: "Planeamento de bairros, comunidades e espaços públicos que integram infraestrutura moderna com a identidade territorial de Angola. Soluções urbanas inteligentes e sustentáveis." },
  { icon: PenTool, title: "Design Conceptual", desc: "Desenvolvimento de conceitos arquitetónicos inovadores, desde a ideia inicial até ao projeto detalhado. Exploramos formas, materiais e tecnologias para criar soluções únicas." },
  { icon: Eye, title: "Visualização Arquitectónica", desc: "Renders fotorrealistas, maquetes digitais e tours virtuais que permitem visualizar cada detalhe do projeto antes da construção. Tecnologia 3D de última geração." },
]

const gallery = [
  { src: "/images/residential.jpg", alt: "Projeto residencial de luxo", label: "Residencial" },
  { src: "/images/commercial.jpg", alt: "Edifício comercial moderno", label: "Comercial" },
  { src: "/images/urban-planning.jpg", alt: "Planeamento urbano", label: "Urbano" },
  { src: "/images/3d-visualization.jpg", alt: "Visualização 3D", label: "Visualização" },
]

export default function ArquiteturaPage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Serviços</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Arquitetura
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Projetos que transformam o território angolano com design contemporâneo, sustentabilidade e inovação tecnológica.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div key={i} className="rounded-lg border border-border p-8 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground font-serif">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-sans">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary font-sans">Galeria</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl font-serif text-balance">
              Projetos de Arquitetura
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gallery.map((item, i) => (
              <div key={i} className="group relative aspect-[16/10] rounded-lg overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#303030]/0 group-hover:bg-[#303030]/40 transition-colors duration-300 flex items-end">
                  <div className="p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-lg font-semibold text-[#ffffff] font-serif">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
