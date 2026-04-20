import { db } from "./db"

export async function sendTelegramNotification(message: string): Promise<boolean> {
  try {
    const config = await db.getTelegramConfig()
    if (!config || !config.isActive) {
      console.log("[v0] Telegram não configurado")
      return false
    }

    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Erro ao enviar Telegram:", response.statusText)
      return false
    }

    console.log("[v0] Notificação Telegram enviada com sucesso")
    return true
  } catch (error) {
    console.error("[v0] Erro ao enviar notificação Telegram:", error)
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
