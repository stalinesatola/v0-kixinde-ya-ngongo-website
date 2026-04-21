import { db } from "./db"

export async function sendTelegramNotification(message: string): Promise<boolean> {
  try {
    console.log("[v0] sendTelegramNotification - iniciando")
    const config = await db.getTelegramConfig()
    console.log("[v0] Config obtida:", config ? "sim" : "não")
    
    if (!config) {
      console.log("[v0] Telegram não configurado - config é null")
      return false
    }
    
    if (!config.isActive) {
      console.log("[v0] Telegram não ativado")
      return false
    }

    console.log("[v0] Preparando requisição para Telegram...")
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
    console.log("[v0] URL:", url.substring(0, 50) + "...")
    console.log("[v0] Chat ID:", config.chatId)

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    console.log("[v0] Resposta Telegram:", response.status, response.statusText)
    
    if (!response.ok) {
      const responseText = await response.text()
      console.error("[v0] Erro ao enviar Telegram:", response.statusText, "Body:", responseText)
      return false
    }

    const data = await response.json()
    console.log("[v0] Resposta Telegram OK:", data)
    return true
  } catch (error) {
    console.error("[v0] Erro ao enviar notificação Telegram:", error)
    if (error instanceof Error) {
      console.error("[v0] Mensagem de erro:", error.message)
      console.error("[v0] Stack:", error.stack)
    }
    return false
  }
}

export function formatProjectNotification(project: any): string {
  return `
✨ <b>Novo Projeto Criado!</b>

📋 <b>${project.projectName}</b>
📍 Local: ${project.location}
📐 Área: ${project.area}m²
🏠 Tipo: ${project.projectType}${project.projectSubType ? ` - ${project.projectSubType}` : ""}
🎨 Estilo: ${project.style || "Não especificado"}

👤 Cliente: ${project.clientName}
📧 Email: ${project.clientEmail}
📱 Telefone: ${project.clientPhone}

#projeto #arquitetura #gerado
  `.trim()
}
