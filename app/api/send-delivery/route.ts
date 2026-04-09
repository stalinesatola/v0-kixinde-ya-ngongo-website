import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

interface DeliveryRequest {
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  area: string
  pdfContent: string
}

export async function POST(req: NextRequest) {
  try {
    const body: DeliveryRequest = await req.json()

    console.log("[v0] Recebido pedido de envio para:", body.email)

    // Validate required fields
    if (!body.email || !body.name || !body.phone) {
      return NextResponse.json(
        { error: "Email, nome e telefone são obrigatórios" },
        { status: 400 }
      )
    }

    // In a real scenario with actual email service:
    // 1. Convert pdfContent to base64 if needed
    // 2. Send via email service (Resend, SendGrid, SMTP, etc.)
    // 3. Return WhatsApp link for client

    // For now, we return success with the WhatsApp link
    const whatsappMessage = encodeURIComponent(
      `Olá ${body.name}! O seu estudo prévio de ${body.projectType} em ${body.location} foi gerado com sucesso! Descarregue o PDF para análise detalhada. KIXINDE YA NGONGO - Arquitectura & Engenharia`
    )

    const whatsappLink = `https://wa.me/244${body.phone.replace(/\D/g, "").slice(-9)}?text=${whatsappMessage}`

    console.log("[v0] WhatsApp link gerado:", whatsappLink)

    // Log that email would be sent (in production, actually send it)
    console.log("[v0] Email seria enviado para:", body.email)
    console.log("[v0] Assunto: Estudo Prévio - ${body.projectType} em ${body.location}")

    return NextResponse.json({
      success: true,
      message: "Estudo prévio pronto para envio",
      whatsappLink,
      email: body.email,
    })
  } catch (error) {
    console.error("[v0] Erro no endpoint de envio:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    )
  }
}
