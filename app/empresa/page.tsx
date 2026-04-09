import Image from "next/image"
import { Target, Eye, Lightbulb, Leaf, Cpu, MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Empresa | KIXINDE YA NGONGO",
  description: "Conheça a história, missão, visão e valores da KIXINDE YA NGONGO.",
}

const values = [
  { icon: Lightbulb, title: "Inovação", desc: "Buscamos constantemente novas soluções e tecnologias para superar desafios de engenharia e arquitetura." },
  { icon: Target, title: "Precisão", desc: "Cada detalhe é calculado com rigor técnico para garantir qualidade e segurança em todos os projetos." },
  { icon: Leaf, title: "Sustentabilidade", desc: "Projetamos com responsabilidade ambiental, respeitando o território e os recursos naturais de Angola." },
  { icon: Cpu, title: "Tecnologia", desc: "Integramos inteligência artificial e ferramentas digitais em cada fase do processo de projeto." },
  { icon: MapPin, title: "Conhecimento Territorial", desc: "A nossa expertise nasce do profundo conhecimento do território angolano e das suas particularidades." },
]

export default function EmpresaPage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Sobre Nós</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            KIXINDE YA NGONGO
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Unimos a sabedoria do território à tecnologia do futuro.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/company.jpg"
                alt="Escritório da KIXINDE YA NGONGO"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary font-sans">Nossa História</p>
              <h2 className="mb-6 text-3xl font-bold text-foreground font-serif text-balance">
                Nascidos do território, projetados para o futuro
              </h2>
              <p className="mb-4 text-base leading-relaxed text-muted-foreground font-sans">
                A KIXINDE YA NGONGO nasceu da visão de unir o profundo conhecimento do território angolano com as tecnologias mais avançadas do mundo. Fundada por profissionais multidisciplinares de arquitetura, engenharia e tecnologia, a empresa cresceu com o compromisso de transformar a paisagem construída de Angola.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground font-sans">
                Desde a nossa fundação, temos vindo a desenvolver projetos que respeitam a identidade cultural e ambiental do território, enquanto aplicamos metodologias internacionais de excelência em engenharia e arquitetura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="rounded-lg border border-border bg-background p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground font-serif">Missão</h3>
              <p className="text-base leading-relaxed text-muted-foreground font-sans">
                Entregar soluções inovadoras de arquitetura e engenharia usando tecnologia de ponta, transformando o território angolano em espaços funcionais, sustentáveis e inteligentes que melhoram a qualidade de vida das comunidades.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
                <Eye className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground font-serif">Visão</h3>
              <p className="text-base leading-relaxed text-muted-foreground font-sans">
                Tornar-se a principal empresa de tecnologia de arquitetura e engenharia em África, referência em inovação, sustentabilidade e excelência técnica, liderando a transformação digital do setor da construção no continente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary font-sans">Princípios</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl font-serif text-balance">Nossos Valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-foreground font-serif">{value.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground font-sans">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
