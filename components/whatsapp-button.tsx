"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/244923000000?text=Olá! Gostaria de mais informações sobre os serviços da KIXINDE YA NGONGO."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#ffffff] shadow-lg hover:bg-[#20b858] transition-all hover:scale-110"
      aria-label="Contactar pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
