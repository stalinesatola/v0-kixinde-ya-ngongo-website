import { FileText, MapPin, Mountain, PenTool, Layers, Box, ClipboardList, CheckCircle2 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Como Funciona | KIXINDE YA NGONGO",
  description: "Conheça o nosso processo de trabalho passo a passo, do briefing digital à entrega final.",
}

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Briefing Digital",
    desc: "Recolhemos todas as informações do projeto através de um formulário digital detalhado. Necessidades, preferências, orçamento e localização do terreno.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Croqui de Localização",
    desc: "Elaboramos o croqui de localização do terreno, documentando posição, acessos, confrontações e envolvente para o processo de licenciamento.",
  },
  {
    number: "03",
    icon: Mountain,
    title: "Levantamento Topográfico",
    desc: "Realizamos o levantamento topográfico de precisão do terreno, mapeando altimetria, planimetria e todos os elementos existentes.",
  },
  {
    number: "04",
    icon: PenTool,
    title: "Projeto Arquitectónico",
    desc: "Desenvolvemos o projeto arquitectónico completo com plantas, cortes, fachadas e especificações técnicas, alinhado com a visão do cliente.",
  },
  {
    number: "05",
    icon: Layers,
    title: "Desenvolvimento de Engenharia",
    desc: "As especialidades de engenharia são desenvolvidas: estrutural, hidráulica, elétrica, mecânica e ambiental, garantindo viabilidade técnica.",
  },
  {
    number: "06",
    icon: Box,
    title: "Visualização 3D",
    desc: "Criamos renders fotorrealistas e modelos 3D para visualizar o projeto final. Tours virtuais e animações para uma experiência imersiva.",
  },
  {
    number: "07",
    icon: ClipboardList,
    title: "Planeamento da Obra",
    desc: "Elaboramos o planeamento completo da obra: cronograma, orçamento detalhado, especificações de materiais e plano de execução.",
  },
  {
    number: "08",
    icon: CheckCircle2,
    title: "Entrega Final",
    desc: "Entregamos toda a documentação do projeto, pronta para licenciamento e construção. Acompanhamento técnico durante a execução da obra.",
  },
]

export default function ComoFuncionaPage() {
  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Processo</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Como Funciona
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Do primeiro contacto à entrega final, conheça cada etapa do nosso processo de trabalho.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

            <div className="flex flex-col gap-12">
              {steps.map((step, i) => (
                <div key={i} className={`relative flex gap-8 md:gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Number circle */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif font-bold text-sm md:absolute md:left-1/2 md:-translate-x-1/2">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-lg border border-border p-8 ${i % 2 !== 0 ? "md:mr-auto md:ml-0 md:text-right" : "md:ml-auto md:mr-0"} md:w-[calc(50%-3rem)]`}>
                    <div className={`mb-4 flex items-center gap-3 ${i % 2 !== 0 ? "md:justify-end" : ""}`}>
                      <step.icon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground font-serif">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
