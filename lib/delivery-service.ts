import nodemailer from "nodemailer"

interface DeliveryOptions {
  clientEmail: string
  clientPhone: string
  clientName: string
  pdfBase64: string
  projectType: string
  location: string
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "Geradoria@kixindeyangongo.ao",
    pass: process.env.SMTP_PASS || "",
  },
})

export async function sendProjectEmail(options: DeliveryOptions) {
  try {
    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
      .header { background: #F7A71C; color: #303030; padding: 20px; text-align: center; border-radius: 5px; }
      .content { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
      .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
      .button { display: inline-block; background: #F7A71C; color: #303030; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Estudo Prévio do Seu Projeto</h1>
      </div>
      <div class="content">
        <p>Olá ${options.clientName},</p>
        <p>Obrigado por utilizar o gerador de projetos da KIXINDE YA NGONGO!</p>
        <p>Em anexo, encontra o estudo prévio do seu projeto de <strong>${options.projectType}</strong> em <strong>${options.location}</strong>.</p>
        <p>Este documento contém:</p>
        <ul>
          <li>Análise do Terreno</li>
          <li>Planta Baixa Humanizada</li>
          <li>Alçados do Edifício</li>
          <li>Especificações Técnicas</li>
          <li>Recomendações Profissionais</li>
        </ul>
        <p>Para discutir os próximos passos ou tirar dúvidas, entre em contacto connosco:</p>
        <a href="https://wa.me/244926899866" class="button">Contactar via WhatsApp</a>
        <p>Telefone: +244 926 899 866<br>Email: geral@kixindeyangongo.ao</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 KIXINDE YA NGONGO. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
</html>
    `

    const mailOptions = {
      from: process.env.SMTP_USER || "Geradoria@kixindeyangongo.ao",
      to: options.clientEmail,
      subject: `Estudo Prévio - ${options.projectType} em ${options.location}`,
      html: emailContent,
      attachments: [
        {
          filename: `estudo-previo-${Date.now()}.pdf`,
          content: Buffer.from(options.pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("[v0] Email enviado com sucesso:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("[v0] Erro ao enviar email:", error)
    return { success: false, error: String(error) }
  }
}

export function generateWhatsAppLink(options: DeliveryOptions, pdfUrl: string): string {
  const message = encodeURIComponent(
    `Olá! Gerou-se um estudo prévio para o seu projeto de ${options.projectType} em ${options.location}.\n\nPDF: ${pdfUrl}\n\nKIXINDE YA NGONGO - Arquitectura & Engenharia`
  )
  return `https://wa.me/244${options.clientPhone.replace(/\D/g, "").slice(-9)}?text=${message}`
}

export async function sendWhatsAppNotification(options: DeliveryOptions, pdfUrl: string) {
  try {
    const whatsappLink = generateWhatsAppLink(options, pdfUrl)
    console.log("[v0] Link WhatsApp gerado:", whatsappLink)
    // In a real scenario, this would use WhatsApp Business API
    // For now, we return the link for the client to use
    return { success: true, link: whatsappLink }
  } catch (error) {
    console.error("[v0] Erro ao preparar WhatsApp:", error)
    return { success: false, error: String(error) }
  }
}
