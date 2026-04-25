export const maxDuration = 60

import { db } from "@/lib/db"
import { z } from "zod"

// ─── Validação Zod ────────────────────────────────────────────────────────────
const projectDataSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  phone: z.string().min(1, "Telefone obrigatório"),
  email: z.string().email("Email inválido"),
  location: z.string().min(1, "Localização obrigatória"),
  area: z.string().optional().default(""),
  perimeter: z.string().optional().default(""),
  dimensions: z.string().optional().default(""),
  terrainShape: z.enum(["regular", "irregular"]).default("regular"),
  irregularSides: z.string().optional().default(""),
  coordinates: z.string().optional().default(""),
  projectType: z.string().min(1, "Tipo de projecto obrigatório"),
  projectSubType: z.string().optional().default(""),
  floors: z.string().optional().default("1"),
  bedrooms: z.string().optional().default("3"),
  bathrooms: z.string().optional().default("2"),
  parking: z.string().optional().default("1"),
  style: z.string().optional().default("Moderno"),
  notes: z.string().optional().default(""),
})

type ProjectData = z.infer<typeof projectDataSchema>

// ─── Prompt do sistema para a IA ─────────────────────────────────────────────
function buildSystemPrompt(): string {
  return `És um arquitecto e engenheiro civil sénior angolano da empresa KIXINDE YA NGONGO.
Especializado em projectos residenciais, comerciais e de infraestrutura em Angola.
Conheces profundamente as normas de construção angolanas, o clima, os materiais locais e as particularidades do território.
Respondes sempre em Português de Angola, com terminologia técnica correcta.
Quando gerares um estudo prévio, segue EXACTAMENTE a estrutura de 9 secções especificada.
Sê preciso com os números e realista para o contexto angolano.`
}

// ─── Prompt do utilizador para gerar o relatório ──────────────────────────────
function buildUserPrompt(data: ProjectData): string {
  return `Gera um estudo prévio completo para o seguinte projecto:

**DADOS DO CLIENTE:**
- Nome: ${data.name}
- Localização: ${data.location}
- Contacto: ${data.phone} | ${data.email}

**DADOS DO TERRENO:**
- Forma: ${data.terrainShape === "regular" ? "Regular (Rectangular)" : "Irregular"}
- Dimensões: ${data.dimensions || "A definir"}
- Área: ${data.area || "A calcular"} m²
- Perímetro: ${data.perimeter || "A calcular"} m
- Coordenadas: ${data.coordinates || "Não fornecidas"}
${data.irregularSides ? `- Lados irregulares: ${data.irregularSides}` : ""}

**DADOS DO PROJECTO:**
- Tipo: ${data.projectType}${data.projectSubType ? ` — ${data.projectSubType}` : ""}
- Estilo arquitectónico: ${data.style}
- Número de andares: ${data.floors}
- Quartos: ${data.bedrooms}
- Casas de banho: ${data.bathrooms}
- Estacionamento: ${data.parking} lugar(es)
${data.notes ? `- Notas adicionais: ${data.notes}` : ""}

Estrutura OBRIGATÓRIA do relatório (usa exactamente estes títulos com ##):

## 1. ANÁLISE DO TERRENO
## 2. LAYOUT CONCEITUAL DO TERRENO
## 3. PLANTA BAIXA ARQUITECTÓNICA
## 4. CORTES DO EDIFÍCIO
## 5. ALÇADOS / ELEVAÇÕES
## 6. VOLUMETRIA 3D CONCEITUAL
## 7. ESTRUTURA BIM PARA REVIT
## 8. ESTIMATIVA DE ÁREAS
## 9. RECOMENDAÇÕES TÉCNICAS

Para as secções com tabelas (3 e 8), usa formato markdown com | Coluna | Coluna |.
Termina sempre com os contactos da KIXINDE YA NGONGO: +244 926 899 866 | geral@kixindeyangongo.ao`
}

// ─── Template de fallback (usado quando a IA não está configurada) ─────────────
function generateFallbackReport(data: ProjectData): string {
  const areaNum = parseFloat(data.area) || 500
  const floorsNum = parseInt(data.floors) || 1
  const bedroomsNum = parseInt(data.bedrooms) || 3
  const bathroomsNum = parseInt(data.bathrooms) || 2
  const parkingNum = parseInt(data.parking) || 2

  const areaPerFloor = Math.round(areaNum * 0.4 / floorsNum)
  const bedroomArea = Math.round(areaPerFloor * 0.4 / bedroomsNum)
  const bathroomArea = Math.round(areaPerFloor * 0.1 / bathroomsNum)
  const livingArea = Math.round(areaPerFloor * 0.25)
  const kitchenArea = Math.round(areaPerFloor * 0.15)
  const circulationArea = Math.round(areaPerFloor * 0.1)

  return `## 1. ANÁLISE DO TERRENO

**Localização:** ${data.location || "Angola"}
**Área Total:** ${data.area} m²
**Dimensões:** ${data.dimensions || "A definir conforme levantamento topográfico"}
**Coordenadas:** ${data.coordinates || "A confirmar"}

O terreno apresenta condições favoráveis para a implantação de uma ${data.projectType.toLowerCase()}. Recomenda-se estudo geotécnico para verificação da capacidade de suporte do solo e levantamento topográfico detalhado.

**Condicionantes Identificadas:**
- Orientação solar a considerar para melhor aproveitamento da luz natural
- Ventilação predominante de sudoeste (típico de Angola)
- Necessidade de drenagem adequada para período das chuvas

---

## 2. LAYOUT CONCEITUAL DO TERRENO

**Implantação Proposta:**
- Recuo frontal: 5,00 metros
- Recuos laterais: 3,00 metros (mínimo)
- Recuo posterior: 4,00 metros
- Taxa de ocupação estimada: 40%
- Índice de aproveitamento: ${(0.4 * floorsNum).toFixed(1)}

**Distribuição do Lote:**
- Área construída: ${Math.round(areaNum * 0.4)} m²
- Área permeável/jardim: ${Math.round(areaNum * 0.35)} m²
- Circulação e acessos: ${Math.round(areaNum * 0.15)} m²
- Estacionamento: ${Math.round(areaNum * 0.1)} m²

---

## 3. PLANTA BAIXA ARQUITECTÓNICA

### Pavimento Térreo (${areaPerFloor} m²)

| Compartimento | Área (m²) | Observações |
|--------------|-----------|-------------|
| Sala de Estar | ${livingArea} | Integração com varanda |
| Cozinha | ${kitchenArea} | Despensa incluída |
| Suite Principal | ${bedroomArea} | Com WC privativo |
${bedroomsNum > 1 ? `| Quartos (${bedroomsNum - 1}x) | ${bedroomArea * (bedroomsNum - 1)} | ${bedroomArea} m² cada |` : ""}
| Casas de Banho | ${bathroomArea * bathroomsNum} | ${bathroomsNum} unidades |
| Circulação | ${circulationArea} | Corredores e hall |

${floorsNum > 1 ? `
### Pavimento Superior

| Compartimento | Área (m²) | Observações |
|--------------|-----------|-------------|
| Quartos adicionais | ${Math.round(areaPerFloor * 0.5)} | Distribuição flexível |
| WC Social | ${bathroomArea} | Partilhado |
| Varanda/Terraços | ${Math.round(areaPerFloor * 0.15)} | Vista panorâmica |
| Circulação | ${Math.round(areaPerFloor * 0.1)} | Escada e corredor |
` : ""}

---

## 4. CORTES DO EDIFÍCIO

**Corte Transversal A-A:**
- Pé-direito térreo: 3,00 metros
${floorsNum > 1 ? `- Pé-direito superior: 2,80 metros` : ""}
- Altura total: ${(3.0 + (floorsNum - 1) * 2.8 + 1.5).toFixed(2)} metros (incluindo cobertura)
- Cota de soleira: +0,15 metros (proteção contra águas pluviais)

**Corte Longitudinal B-B:**
- Estrutura em betão armado
- Laje maciça de ${floorsNum > 1 ? "20" : "15"} cm
- Cobertura em telha colonial ou laje impermeabilizada

---

## 5. ALÇADOS / ELEVAÇÕES

**Fachada Principal (Frontal):**
- Estilo: ${data.style}
- Revestimento: Pintura acrílica sobre reboco ou cerâmica
- Esquadrias: Alumínio lacado na cor ${data.style.includes("Moderno") ? "preto ou cinza" : "bronze ou madeira"}
- Elementos: ${data.style.includes("Moderno") ? "Linhas retas, grandes envidraçados, palas horizontais" : "Varandas, balaustradas, cornijas"}

**Fachada Posterior:**
- Integração com área de lazer
- Portas de correr para varanda
- Proteção solar com brise-soleil ou persianas

**Fachadas Laterais:**
- Janelas estrategicamente posicionadas
- Ventilação cruzada favorecida

---

## 6. VOLUMETRIA 3D CONCEITUAL

**Forma Geral:**
- Volume principal retangular/quadrado
${floorsNum > 1 ? `- ${floorsNum} volumes sobrepostos com ligeiro recuo no piso superior` : "- Volume único térreo"}
- Cobertura: ${data.style.includes("Moderno") ? "Laje plana com platibanda" : "Telhado de 4 águas, inclinação 25%"}

**Elementos Volumétricos:**
- Varanda frontal destacada
- ${parkingNum > 0 ? `Garagem para ${parkingNum} veículo(s)` : "Sem garagem"}
- Churrasqueira/área gourmet nos fundos

---

## 7. ESTRUTURA BIM PARA REVIT

**Sistema Estrutural:**
- Fundação: Sapatas isoladas ou radier (conforme estudo geotécnico)
- Pilares: Betão armado 20x30cm ou 25x25cm
- Vigas: Betão armado, vãos máximos de 5,00m
- Lajes: Maciça de 12-20cm ou nervurada

**Malha Estrutural:**
- Modulação: 4,00 x 4,00 metros
- Pilares nos eixos A, B, C x 1, 2, 3, 4
- Vãos livres: 4,00 metros (típico)

**Materiais Especificados:**
- Betão: C25/30 (fck 25 MPa)
- Aço: CA-50 e CA-60
- Alvenaria: Blocos cerâmicos 14x19x29cm
- Cobertura: Estrutura metálica ou madeira tratada

---

## 8. ESTIMATIVA DE ÁREAS

| Descrição | Área (m²) |
|-----------|-----------|
| Área do Terreno | ${data.area} |
| Área Construída Total | ${areaPerFloor * floorsNum} |
| Área Útil | ${Math.round(areaPerFloor * floorsNum * 0.85)} |
| Área de Implantação | ${areaPerFloor} |
| Taxa de Ocupação | ${Math.round((areaPerFloor / areaNum) * 100)}% |
| Índice de Aproveitamento | ${((areaPerFloor * floorsNum) / areaNum).toFixed(2)} |

---

## 9. RECOMENDAÇÕES TÉCNICAS

**Sustentabilidade:**
- Captação de águas pluviais para reuso
- Painéis solares para aquecimento de água
- Iluminação LED em todas as áreas
- Ventilação natural cruzada

**Adaptação ao Clima Angolano:**
- Paredes com isolamento térmico
- Beirais generosos para proteção solar
- Cores claras nas fachadas para reflexão do calor
- Proteção contra humidade na base das paredes

**Infraestruturas:**
- Fossa séptica ou ligação a rede pública
- Reservatório de água com capacidade mínima de 5.000 litros
- Instalação elétrica dimensionada para ar condicionado
- Portão automatizado

---

**NOTA:** Este estudo prévio é uma análise conceitual preliminar. Para prosseguir com o projecto, recomenda-se:
1. Levantamento topográfico do terreno
2. Estudo geotécnico
3. Consulta ao plano director municipal
4. Desenvolvimento do projecto de arquitectura completo

**KIXINDE YA NGONGO — Arquitectura e Engenharia**
Contacto: +244 926 899 866 | geral@kixindeyangongo.ao
`
}

// ─── Endpoint principal ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  // 1. Validar input
  let projectData: ProjectData
  try {
    const body = await req.json()
    const parsed = projectDataSchema.safeParse(body.projectData)
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Dados inválidos", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }
    projectData = parsed.data
  } catch {
    return new Response(
      JSON.stringify({ error: "Corpo da requisição inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // 2. Tentar usar IA configurada no painel admin
  try {
    const config = await db.getAIConfig()

    if (config?.is_active && config.api_key) {
      console.log("[v0] Usando IA real — provider:", config.provider, "model:", config.model)

      // Importação dinâmica dos providers do AI SDK
      let model: any
      if (config.provider === "openai") {
        const { openai } = await import("@ai-sdk/openai")
        model = openai(config.model || "gpt-4o-mini", { apiKey: config.api_key })
      } else if (config.provider === "anthropic") {
        const { anthropic } = await import("@ai-sdk/anthropic")
        model = anthropic(config.model || "claude-3-5-haiku-20241022", { apiKey: config.api_key })
      } else if (config.provider === "google") {
        const { google } = await import("@ai-sdk/google")
        model = google(config.model || "gemini-1.5-flash", { apiKey: config.api_key })
      }

      if (model) {
        const { streamText } = await import("ai")
        const result = streamText({
          model,
          system: buildSystemPrompt(),
          prompt: buildUserPrompt(projectData),
          temperature: config.temperature ?? 0.7,
          maxTokens: config.max_tokens ?? 4000,
        })

        return result.toTextStreamResponse({
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      }
    }
  } catch (err) {
    console.warn("[v0] IA real falhou, usando fallback:", err instanceof Error ? err.message : err)
  }

  // 3. Fallback: relatório template local com streaming simulado
  console.log("[v0] Usando template de fallback (IA não configurada)")
  const fallbackContent = generateFallbackReport(projectData)
  const encoder = new TextEncoder()
  const chunks = fallbackContent.split("\n")

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk + "\n"))
        await new Promise(resolve => setTimeout(resolve, 12))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
