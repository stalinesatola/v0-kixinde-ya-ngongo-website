import { db } from "./db"

export async function sendTelegramNotification(message: string): Promise<boolean> {
  try {
    const config = await db.getTelegramConfig()
    
    if (!config) {
      return false
    }
    
    if (!config.isActive) {
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
      return false
    }

    return true
  } catch (error) {
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
