import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const maxDuration = 30

interface DeliveryRequest {
  name: string
  email: string
  phone: string
  projectType: string
  projectSubType?: string
  location: string
  area: string
  generatedContent?: string
}

// Cria o transporter SMTP a partir das variáveis de ambiente
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body: DeliveryRequest = await req.json()

    // Validação dos campos obrigatórios
    if (!body.email || !body.name || !body.phone) {
      return NextResponse.json(
        { error: "Email, nome e telefone são obrigatórios" },
        { status: 400 }
      )
    }

    const projectLabel = `${body.projectType}${body.projectSubType ? ` — ${body.projectSubType}` : ""}`

    // Link WhatsApp para o cliente
    const whatsappMessage = encodeURIComponent(
      `Olá ${body.name}! O seu estudo prévio de ${projectLabel} em ${body.location} foi gerado com sucesso pela KIXINDE YA NGONGO. Descarregue o PDF no portal para consultar todos os detalhes. Estamos disponíveis para esclarecimentos!`
    )
    const whatsappLink = `https://wa.me/244${body.phone.replace(/\D/g, "").slice(-9)}?text=${whatsappMessage}`

    // Tentativa de envio de email via SMTP
    let emailSent = false
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter()

        const summarySection = body.generatedContent
          ? `<details><summary><strong>Ver resumo do estudo</strong></summary><pre style="font-size:12px;padding:12px;background:#f5f5f5;border-radius:4px;white-space:pre-wrap;">${body.generatedContent.substring(0, 2000)}...</pre></details>`
          : ""

        await transporter.sendMail({
          from: `"KIXINDE YA NGONGO" <${process.env.SMTP_USER}>`,
          to: body.email,
          subject: `✅ Estudo Prévio — ${projectLabel} em ${body.location}`,
          html: `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:#F7A71C;padding:24px 32px;text-align:center;">
        <h1 style="color:#303030;margin:0;font-size:22px;font-weight:900;letter-spacing:1px;">KIXINDE YA NGONGO</h1>
        <p style="color:#303030;margin:4px 0 0;font-size:13px;">Arquitectura · Engenharia · Inteligência Artificial</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:32px;">
        <h2 style="color:#303030;margin:0 0 16px;font-size:18px;">Estudo Prévio Gerado com Sucesso!</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;">Olá <strong>${body.name}</strong>,</p>
        <p style="color:#555;font-size:14px;line-height:1.6;">O seu estudo prévio de <strong>${projectLabel}</strong> para o terreno em <strong>${body.location}</strong> (área: ${body.area} m²) foi gerado com sucesso.</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#f9f9f9;border-radius:8px;padding:16px;">
          <tr><td style="font-size:13px;color:#888;padding:4px 0;">Tipo de Projecto</td><td style="font-size:13px;font-weight:700;color:#303030;text-align:right;">${projectLabel}</td></tr>
          <tr><td style="font-size:13px;color:#888;padding:4px 0;">Localização</td><td style="font-size:13px;font-weight:700;color:#303030;text-align:right;">${body.location}</td></tr>
          <tr><td style="font-size:13px;color:#888;padding:4px 0;">Área do Terreno</td><td style="font-size:13px;font-weight:700;color:#303030;text-align:right;">${body.area} m²</td></tr>
        </table>

        ${summarySection}

        <p style="color:#555;font-size:14px;line-height:1.6;margin-top:20px;">Aceda ao portal para descarregar o PDF completo com todos os detalhes do estudo.</p>

        <div style="text-align:center;margin:24px 0;">
          <a href="https://wa.me/244926899866" style="display:inline-block;background:#F7A71C;color:#303030;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:700;font-size:14px;">Falar com a Nossa Equipa</a>
        </div>

        <p style="color:#aaa;font-size:12px;border-top:1px solid #eee;padding-top:16px;margin-top:16px;">
          KIXINDE YA NGONGO — Arquitectura & Engenharia<br>
          📞 +244 926 899 866 | ✉️ geral@kixindeyangongo.ao
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
        })

        emailSent = true
        console.log("[v0] Email enviado com sucesso para:", body.email)
      } catch (emailErr) {
        console.warn("[v0] Falha no envio de email (SMTP não configurado ou erro):", emailErr instanceof Error ? emailErr.message : emailErr)
      }
    } else {
      console.log("[v0] SMTP não configurado — email não enviado. Configure SMTP_USER e SMTP_PASS nas variáveis de ambiente.")
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? `Email enviado com sucesso para ${body.email}`
        : "SMTP não configurado. O estudo foi gerado — descarregue o PDF manualmente.",
      whatsappLink,
    })
  } catch (error) {
    console.error("[v0] Erro no endpoint de envio:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    )
  }
}
