import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Compass, Cpu, BrainCircuit, Sparkles, ScanLine, Box } from "lucide-react"
import { Button } from "@/components/ui/button"

const innovations = [
  { icon: BrainCircuit, title: "Inteligência Artificial", desc: "Algoritmos de IA para otimizar projetos e prever resultados de engenharia." },
  { icon: ScanLine, title: "Análise Digital do Terreno", desc: "Processamento avançado de dados topográficos para decisões informadas." },
  { icon: Box, title: "Visualização 3D", desc: "Modelos tridimensionais imersivos para visualizar cada detalhe." },
  { icon: Sparkles, title: "Simulação Inteligente", desc: "Simulações de projetos com dados reais do território angolano." },
]

export default function HomePage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-architecture.jpg"
            alt="Renderização arquitectónica moderna em Angola"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#303030]/75" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#F7A71C] font-sans">
              Arquitetura &middot; Engenharia &middot; Inteligência Artificial
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#ffffff] md:text-6xl lg:text-7xl font-serif text-balance">
              Projetamos Angola com Inteligência
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-[#d0d0d0] max-w-lg font-sans">
              Arquitetura, Engenharia e Inteligência Artificial para transformar terrenos em projetos reais.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold px-8">
                <Link href="/gerador-projetos">
                  Simular Projeto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#ffffff]/30 text-[#ffffff] hover:bg-[#ffffff]/10 font-sans px-8">
                <a
                  href="https://wa.me/244926899866?text=Olá! Gostaria de mais informações."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Innovation */}
      <section className="py-24 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Inovação Digital</p>
              <h2 className="mb-6 text-3xl font-bold text-[#ffffff] md:text-4xl font-serif text-balance">
                Tecnologia ao serviço da engenharia
              </h2>
              <p className="mb-10 text-base leading-relaxed text-[#b0b0b0] font-sans">
                Utilizamos as ferramentas digitais mais avançadas para garantir precisão, eficiência e qualidade em cada projeto. Da inteligência artificial à visualização 3D, a tecnologia transforma a forma como projetamos Angola.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {innovations.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7A71C]/15">
                      <item.icon className="h-5 w-5 text-[#F7A71C]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#ffffff] font-serif">{item.title}</h4>
                      <p className="text-xs leading-relaxed text-[#909090] font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/3d-visualization.jpg"
                alt="Visualização 3D de projetos arquitectónicos"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent font-sans">Transformação</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl font-serif text-balance">
              Do terreno ao projeto
            </h2>
          </div>
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <Image
              src="/images/before-after.jpg"
              alt="Transformação de terreno em projeto arquitectónico"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-8">
                <div className="rounded-lg bg-[#303030]/80 px-8 py-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-[#ffffff] font-serif">Antes</p>
                  <p className="text-xs text-[#c0c0c0]">Terreno natural</p>
                </div>
                <div className="rounded-lg bg-[#F7A71C]/90 px-8 py-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-[#303030] font-serif">Depois</p>
                  <p className="text-xs text-[#4a4a4a]">Projeto inteligente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#303030]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#ffffff] md:text-4xl font-serif text-balance">
            Transforme o seu terreno num projeto inteligente
          </h2>
          <p className="mb-10 text-base leading-relaxed text-[#a0a0a0] font-sans">
            Utilize o nosso simulador de projetos com inteligência artificial para visualizar o potencial do seu terreno.
          </p>
          <Button asChild size="lg" className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold px-10">
            <Link href="/gerador-projetos">
              Solicitar Simulação
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
