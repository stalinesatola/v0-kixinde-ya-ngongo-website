import Image from "next/image"
import { Building2, Hammer, MapPin, Mountain, Box, ClipboardList, FileCheck } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Serviços | KIXINDE YA NGONGO",
  description: "Serviços completos de arquitetura, construção, topografia, renderização 3D, planeamento de obras e consultoria técnica.",
}

const services = [
  {
    icon: Building2,
    title: "Arquitetura",
    desc: "Projetos arquitectónicos completos para residências, edifícios comerciais e espaços urbanos. Desde o conceito inicial até ao projeto executivo, cada solução é pensada para integrar funcionalidade, estética e sustentabilidade adaptada ao território angolano.",
    image: "/images/residential.jpg",
  },
  {
    icon: Hammer,
    title: "Construção",
    desc: "Gestão e planeamento completo de obras, incluindo orçamentação, cronograma, coordenação de equipas e controlo de qualidade. Garantimos que cada projeto é executado com precisão, dentro do prazo e do orçamento estabelecido.",
    image: "/images/infrastructure.jpg",
  },
  {
    icon: MapPin,
    title: "Croquis de Localização",
    desc: "Elaboração de croquis detalhados de localização que documentam a posição exata do terreno, acessos, confrontações e envolvente. Documento essencial para o processo de licenciamento e planeamento do projeto.",
    image: "/images/topography.jpg",
  },
  {
    icon: Mountain,
    title: "Levantamento Topográfico",
    desc: "Levantamentos topográficos de precisão utilizando equipamento de última geração. Mapeamento detalhado do terreno incluindo altimetria, planimetria e elementos naturais e artificiais existentes.",
    image: "/images/topography.jpg",
  },
  {
    icon: Box,
    title: "Renderização 3D",
    desc: "Visualizações fotorrealistas e modelos tridimensionais de alta qualidade que permitem experienciar o projeto antes da construção. Renders exteriores, interiores e tours virtuais imersivos.",
    image: "/images/3d-visualization.jpg",
  },
  {
    icon: ClipboardList,
    title: "Planeamento de Obras",
    desc: "Planeamento detalhado de todas as fases da obra, incluindo cronograma de atividades, alocação de recursos, gestão de custos e controlo de qualidade. Metodologias modernas de gestão de projetos.",
    image: "/images/commercial.jpg",
  },
  {
    icon: FileCheck,
    title: "Consultoria Técnica",
    desc: "Assessoria especializada em todas as fases do projeto, desde a viabilidade técnica até à conclusão da obra. Pareceres técnicos, análises de projetos e apoio na tomada de decisões estratégicas.",
    image: "/images/company.jpg",
  },
]

export default function ServicosPage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">O Que Fazemos</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Serviços
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Soluções integradas de arquitetura, engenharia e tecnologia para cada fase do seu projeto.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-20">
            {services.map((service, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  i % 2 !== 0 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground font-serif">{service.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground font-sans">{service.desc}</p>
                </div>
                <div className={`relative aspect-[16/10] rounded-lg overflow-hidden ${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
