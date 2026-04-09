import { Building, Layers, Mountain, Droplets, Truck, Zap, Cog, TreePine, Map } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Engenharia | KIXINDE YA NGONGO",
  description: "Disciplinas de engenharia: civil, estrutural, geotécnica, hidráulica, transportes, elétrica, mecânica, ambiental e planeamento urbano.",
}

const disciplines = [
  { icon: Building, title: "Engenharia Civil", desc: "Projetos de construção civil abrangentes, desde fundações até acabamentos. Soluções estruturais para edifícios, pontes, estradas e infraestruturas diversas, com foco na segurança e durabilidade." },
  { icon: Layers, title: "Engenharia Estrutural", desc: "Cálculo e dimensionamento de estruturas em betão armado, aço e madeira. Análise de resistência, estabilidade e comportamento estrutural para garantir a segurança das construções." },
  { icon: Mountain, title: "Engenharia Geotécnica", desc: "Estudo de solos e fundações, análise de estabilidade de taludes e contenções. Investigação geotécnica completa para garantir a viabilidade dos projetos de construção." },
  { icon: Droplets, title: "Engenharia Hidráulica", desc: "Projetos de redes de abastecimento de água, drenagem pluvial, sistemas de esgoto e obras hidráulicas. Gestão sustentável dos recursos hídricos." },
  { icon: Truck, title: "Engenharia de Transportes", desc: "Planeamento e projeto de vias, estradas, interseções e sistemas de transporte. Estudos de tráfego e mobilidade urbana para melhorar a acessibilidade." },
  { icon: Zap, title: "Engenharia Elétrica", desc: "Projetos de instalações elétricas, redes de distribuição, iluminação e sistemas de energia. Soluções de eficiência energética e energia renovável." },
  { icon: Cog, title: "Engenharia Mecânica", desc: "Projetos de climatização, ventilação, sistemas mecânicos e equipamentos industriais. Soluções de conforto térmico e eficiência energética." },
  { icon: TreePine, title: "Engenharia Ambiental", desc: "Estudos de impacto ambiental, gestão de resíduos e soluções sustentáveis. Projetos que respeitam e preservam o meio ambiente angolano." },
  { icon: Map, title: "Planeamento Urbano", desc: "Desenvolvimento de planos diretores, estudos urbanísticos e projetos de espaços públicos. Criação de comunidades sustentáveis e funcionais." },
]

export default function EngenhariaPage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Disciplinas</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Engenharia
          </h1>
          <p className="mt-4 text-lg text-[#a0a0a0] max-w-2xl font-sans leading-relaxed">
            Nove disciplinas de engenharia integradas para entregar soluções completas e de excelência para cada projeto.
          </p>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {disciplines.map((d, i) => (
              <div key={i} className="group rounded-lg border border-border p-8 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <d.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground font-serif">{d.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-sans">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
