export const maxDuration = 60

function generateFallbackReport(projectData: {
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
}) {
  const areaNum = parseFloat(projectData.area) || 500
  const floorsNum = parseInt(projectData.floors) || 1
  const bedroomsNum = parseInt(projectData.bedrooms) || 3
  const bathroomsNum = parseInt(projectData.bathrooms) || 2
  const parkingNum = parseInt(projectData.parking) || 2

  const areaPerFloor = Math.round(areaNum * 0.4 / floorsNum)
  const bedroomArea = Math.round(areaPerFloor * 0.4 / bedroomsNum)
  const bathroomArea = Math.round(areaPerFloor * 0.1 / bathroomsNum)
  const livingArea = Math.round(areaPerFloor * 0.25)
  const kitchenArea = Math.round(areaPerFloor * 0.15)
  const circulationArea = Math.round(areaPerFloor * 0.1)

  return `## 1. ANALISE DO TERRENO

**Localizacao:** ${projectData.location || "Angola"}
**Area Total:** ${projectData.area} m2
**Dimensoes:** ${projectData.dimensions || "A definir conforme levantamento topografico"}
**Coordenadas:** ${projectData.coordinates || "A confirmar"}

O terreno apresenta condicoes favoraveis para a implantacao de uma ${projectData.projectType.toLowerCase()}. Recomenda-se estudo geotecnico para verificacao da capacidade de suporte do solo e levantamento topografico detalhado.

**Condicionantes Identificadas:**
- Orientacao solar a considerar para melhor aproveitamento da luz natural
- Ventilacao predominante de sudoeste (tipico de Angola)
- Necessidade de drenagem adequada para periodo das chuvas

---

## 2. LAYOUT CONCEITUAL DO TERRENO

**Implantacao Proposta:**
- Recuo frontal: 5,00 metros
- Recuos laterais: 3,00 metros (minimo)
- Recuo posterior: 4,00 metros
- Taxa de ocupacao estimada: 40%
- Indice de aproveitamento: ${(0.4 * floorsNum).toFixed(1)}

**Distribuicao do Lote:**
- Area construida: ${Math.round(areaNum * 0.4)} m2
- Area permeavel/jardim: ${Math.round(areaNum * 0.35)} m2
- Circulacao e acessos: ${Math.round(areaNum * 0.15)} m2
- Estacionamento: ${Math.round(areaNum * 0.1)} m2

---

## 3. PLANTA BAIXA ARQUITECTONICA

### Pavimento Terreo (${areaPerFloor} m2)

| Compartimento | Area (m2) | Observacoes |
|--------------|-----------|-------------|
| Sala de Estar | ${livingArea} | Integracao com varanda |
| Cozinha | ${kitchenArea} | Despensa incluida |
| Suite Principal | ${bedroomArea} | Com WC privativo |
${bedroomsNum > 1 ? `| Quartos (${bedroomsNum - 1}x) | ${bedroomArea * (bedroomsNum - 1)} | ${bedroomArea} m2 cada |` : ""}
| Casas de Banho | ${bathroomArea * bathroomsNum} | ${bathroomsNum} unidades |
| Circulacao | ${circulationArea} | Corredores e hall |

${floorsNum > 1 ? `
### Pavimento Superior

| Compartimento | Area (m2) | Observacoes |
|--------------|-----------|-------------|
| Quartos adicionais | ${Math.round(areaPerFloor * 0.5)} | Distribuicao flexivel |
| WC Social | ${bathroomArea} | Compartilhado |
| Varanda/Terracos | ${Math.round(areaPerFloor * 0.15)} | Vista panoramica |
| Circulacao | ${Math.round(areaPerFloor * 0.1)} | Escada e corredor |
` : ""}

---

## 4. CORTES DO EDIFICIO

**Corte Transversal A-A:**
- Pe-direito terreo: 3,00 metros
${floorsNum > 1 ? `- Pe-direito superior: 2,80 metros` : ""}
- Altura total: ${(3.0 + (floorsNum - 1) * 2.8 + 1.5).toFixed(2)} metros (incluindo cobertura)
- Cota de soleira: +0,15 metros (protecao contra aguas pluviais)

**Corte Longitudinal B-B:**
- Estrutura em betao armado
- Laje macica de ${floorsNum > 1 ? "20" : "15"} cm
- Cobertura em telha colonial ou laje impermeabilizada

---

## 5. ALCADOS / ELEVACOES

**Fachada Principal (Frontal):**
- Estilo: ${projectData.style}
- Revestimento: Pintura acrilica sobre reboco ou ceramica
- Esquadrias: Aluminio lacado na cor ${projectData.style.includes("Moderno") ? "preto ou cinza" : "bronze ou madeira"}
- Elementos: ${projectData.style.includes("Moderno") ? "Linhas retas, grandes vidracas, palas horizontais" : "Varandas, balaustradas, cornijas"}

**Fachada Posterior:**
- Integracao com area de lazer
- Portas de correr para varanda
- Protecao solar com brise-soleil ou persianas

**Fachadas Laterais:**
- Janelas estrategicamente posicionadas
- Ventilacao cruzada favorecida

---

## 6. VOLUMETRIA 3D CONCEITUAL

**Forma Geral:**
- Volume principal retangular/quadrado
${floorsNum > 1 ? `- ${floorsNum} volumes sobrepostos com ligeiro recuo no piso superior` : "- Volume unico terreo"}
- Cobertura: ${projectData.style.includes("Moderno") ? "Laje plana com platibanda" : "Telhado de 4 aguas, inclinacao 25%"}

**Elementos Volumetricos:**
- Varanda frontal destacada
- ${parkingNum > 0 ? `Garagem para ${parkingNum} veiculos` : ""}
- Churrasqueira/area gourmet nos fundos

---

## 7. ESTRUTURA BIM PARA REVIT

**Sistema Estrutural:**
- Fundacao: Sapatas isoladas ou radier (conforme estudo geotecnico)
- Pilares: Betao armado 20x30cm ou 25x25cm
- Vigas: Betao armado, vaos maximos de 5,00m
- Lajes: Macica de 12-20cm ou nervurada

**Malha Estrutural:**
- Modulacao: 4,00 x 4,00 metros
- Pilares nos eixos A, B, C x 1, 2, 3, 4
- Vaos livres: 4,00 metros (tipico)

**Materiais Especificados:**
- Betao: C25/30 (fck 25 MPa)
- Aco: CA-50 e CA-60
- Alvenaria: Blocos ceramicos 14x19x29cm
- Cobertura: Estrutura metalica ou madeira tratada

---

## 8. ESTIMATIVA DE AREAS

| Descricao | Area (m2) |
|-----------|-----------|
| Area do Terreno | ${projectData.area} |
| Area Construida Total | ${areaPerFloor * floorsNum} |
| Area Util | ${Math.round(areaPerFloor * floorsNum * 0.85)} |
| Area de Implantacao | ${areaPerFloor} |
| Taxa de Ocupacao | ${Math.round((areaPerFloor / areaNum) * 100)}% |
| Indice de Aproveitamento | ${((areaPerFloor * floorsNum) / areaNum).toFixed(2)} |

---

## 9. RECOMENDACOES TECNICAS

**Sustentabilidade:**
- Captacao de aguas pluviais para reuso
- Paineis solares para aquecimento de agua
- Iluminacao LED em todas as areas
- Ventilacao natural cruzada

**Adaptacao ao Clima Angolano:**
- Paredes com isolamento termico
- Beirais generosos para protecao solar
- Cores claras nas fachadas para reflexao do calor
- Protecao contra humidade na base das paredes

**Infraestruturas:**
- Fossa septica ou ligacao a rede publica
- Reservatorio de agua com capacidade minima de 5.000 litros
- Instalacao electrica dimensionada para ar condicionado
- Portao automatizado

---

**NOTA:** Este estudo previo e uma analise conceitual preliminar. Para prosseguir com o projecto, recomenda-se:
1. Levantamento topografico do terreno
2. Estudo geotecnico
3. Consulta ao plano director municipal
4. Desenvolvimento do projecto de arquitectura completo

**KIXINDE YA NGONGO - Arquitectura e Engenharia**
Contacto: +244 926 899 866 | geral@kixindeyangongo.ao
`
}

export async function POST(req: Request) {
  const { projectData } = await req.json()

  // Generate the report using local fallback (AI Gateway requires credit card setup)
  const fallbackContent = generateFallbackReport(projectData)
  
  // Simulate streaming by sending chunks with delays
  const encoder = new TextEncoder()
  const chunks = fallbackContent.split('\n')
  
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk + '\n'))
        // Small delay to simulate streaming effect
        await new Promise(resolve => setTimeout(resolve, 15))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
