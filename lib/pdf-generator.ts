import { jsPDF } from "jspdf"
import { generateArchitecturalVisualization, svgToDataUrl } from "./image-generator"

interface ProjectPDFData {
  name: string
  email: string
  phone: string
  projectType: string
  style: string
  location: string
  area: string
  dimensions: string
  coordinates: string
  floors: string
  bedrooms: string
  bathrooms: string
  parking: string
  notes: string
  generatedContent?: string
  imageUrl?: string
}

export async function generateProjectPDF(data: ProjectPDFData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  // Colors
  const primaryColor = [247, 167, 28] // #F7A71C
  const darkColor = [48, 48, 48] // #303030
  const lightColor = [243, 243, 243] // #F3F3F3

  let currentY = margin

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(24)
  doc.text("ESTUDO PRÉVIO DO PROJETO", margin, 15)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, margin, 25)

  currentY = 50

  // Client Information
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 35, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("INFORMAÇÕES DO CLIENTE", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.text(`Nome: ${data.name}`, margin + 5, currentY + 15)
  doc.text(`Email: ${data.email}`, margin + 5, currentY + 22)
  doc.text(`Telefone: ${data.phone}`, margin + 5, currentY + 29)

  currentY += 40

  // Project Overview
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 50, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("VISÃO GERAL DO PROJETO", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const projectInfo = [
    `Tipo: ${data.projectType}`,
    `Estilo: ${data.style}`,
    `Localização: ${data.location}`,
    `Área do Terreno: ${data.area} m²`,
  ]

  projectInfo.forEach((info, index) => {
    doc.text(info, margin + 5, currentY + 15 + index * 7)
  })

  currentY += 55

  // Add architectural visualization image
  try {
    const svg = generateArchitecturalVisualization({
      projectType: data.projectType,
      area: data.area,
      floors: data.floors,
      style: data.style,
    })
    
    // Convert SVG to data URL and add to PDF
    const svgBlob = new Blob([svg], { type: "image/svg+xml" })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    // Add image to PDF with a reasonable height
    if (currentY + 80 < pageHeight - 20) {
      doc.addImage(svgUrl, "SVG", margin, currentY, contentWidth, 70)
      currentY += 75
    } else {
      doc.addPage()
      currentY = margin
      doc.addImage(svgUrl, "SVG", margin, currentY, contentWidth, 70)
      currentY += 75
    }
  } catch (error) {
    console.error("[v0] Erro ao adicionar imagem ao PDF:", error)
  }

  // Land Details
  if (currentY + 50 > pageHeight - 20) {
    doc.addPage()
    currentY = margin
  }

  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 50, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("DADOS DO TERRENO", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const landInfo = [
    `Dimensões: ${data.dimensions || "Não informado"}`,
    `Coordenadas: ${data.coordinates || "Não informado"}`,
    `Observações: ${data.notes || "Nenhuma"}`,
  ]

  landInfo.forEach((info, index) => {
    const lines = doc.splitTextToSize(info, contentWidth - 10)
    doc.text(lines, margin + 5, currentY + 15 + index * 10)
  })

  currentY += 55

  // Project Specifications
  if (currentY + 35 > pageHeight - 20) {
    doc.addPage()
    currentY = margin
  }

  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 35, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("ESPECIFICAÇÕES", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const specs = [
    `Andares: ${data.floors} | Quartos: ${data.bedrooms} | Casas de Banho: ${data.bathrooms} | Estacionamento: ${data.parking}`,
  ]

  specs.forEach((spec, index) => {
    const lines = doc.splitTextToSize(spec, contentWidth - 10)
    doc.text(lines, margin + 5, currentY + 15 + index * 10)
  })

  currentY += 40

  // Recommendations Section
  if (currentY + 40 > pageHeight - 20) {
    doc.addPage()
    currentY = margin
  }

  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 40, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("RECOMENDAÇÕES", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const recommendations = [
    "✓ Análise de orientação solar e ventilação natural",
    "✓ Estudo de acessibilidade ao terreno",
    "✓ Avaliação de impacto ambiental",
    "✓ Recomendações de materiais sustentáveis",
  ]
  recommendations.forEach((rec, index) => {
    doc.text(rec, margin + 10, currentY + 15 + index * 7)
  })

  return doc
}

export async function generateProjectPDF(data: ProjectPDFData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  // Colors
  const primaryColor = [247, 167, 28] // #F7A71C
  const darkColor = [48, 48, 48] // #303030
  const lightColor = [243, 243, 243] // #F3F3F3

  let currentY = margin

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(24)
  doc.text("ESTUDO PRÉVIO DO PROJETO", margin, 15)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, margin, 25)

  currentY = 50

  // Client Information
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 35, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("INFORMAÇÕES DO CLIENTE", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.text(`Nome: ${data.name}`, margin + 5, currentY + 15)
  doc.text(`Email: ${data.email}`, margin + 5, currentY + 22)
  doc.text(`Telefone: ${data.phone}`, margin + 5, currentY + 29)

  currentY += 40

  // Project Overview
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 50, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("VISÃO GERAL DO PROJETO", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const projectInfo = [
    `Tipo: ${data.projectType}`,
    `Estilo: ${data.style}`,
    `Localização: ${data.location}`,
    `Área do Terreno: ${data.area} m²`,
  ]

  projectInfo.forEach((info, index) => {
    doc.text(info, margin + 5, currentY + 15 + index * 7)
  })

  currentY += 55

  // Land Details
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 50, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("DADOS DO TERRENO", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const landInfo = [
    `Dimensões: ${data.dimensions || "Não informado"}`,
    `Coordenadas: ${data.coordinates || "Não informado"}`,
    `Observações: ${data.notes || "Nenhuma"}`,
  ]

  landInfo.forEach((info, index) => {
    const lines = doc.splitTextToSize(info, contentWidth - 10)
    doc.text(lines, margin + 5, currentY + 15 + index * 10)
  })

  currentY += 55

  // Project Specifications
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, currentY, contentWidth, 35, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFontSize(12)
  doc.text("ESPECIFICAÇÕES", margin + 5, currentY + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  const specs = [
    `Andares: ${data.floors} | Quartos: ${data.bedrooms} | Casas de Banho: ${data.bathrooms} | Estacionamento: ${data.parking}`,
  ]

  specs.forEach((spec, index) => {
    const lines = doc.splitTextToSize(spec, contentWidth - 10)
    doc.text(lines, margin + 5, currentY + 15 + index * 10)
  })

  // Add new page if needed
  if (currentY > pageHeight - 60) {
    doc.addPage()
    currentY = margin
  } else {
    currentY += 40
  }

  // Generated Content / Recommendations
  if (doc.internal.pages.length === 1 && currentY < pageHeight - 40) {
    doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
    doc.rect(margin, currentY, contentWidth, pageHeight - currentY - margin, "F")
    doc.setFont("helvetica", "bold")
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFontSize(12)
    doc.text("RECOMENDAÇÕES", margin + 5, currentY + 7)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(10)
    const recommendations = [
      "✓ Análise de orientação solar e ventilação natural",
      "✓ Estudo de acessibilidade ao terreno",
      "✓ Avaliação de impacto ambiental",
      "✓ Recomendações de materiais sustentáveis",
    ]
    recommendations.forEach((rec, index) => {
      doc.text(rec, margin + 10, currentY + 15 + index * 7)
    })
  }

  return doc
}
