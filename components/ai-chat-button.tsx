'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { AIChatWidget } from './ai-chat-widget'

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] z-40 flex items-center justify-center"
        title="Abrir assistente IA"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Widget */}
      <AIChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
