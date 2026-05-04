'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, X, Loader2 } from 'lucide-react'

interface AIChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatWidget({ isOpen, onClose }: AIChatWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversationId] = useState<string>('')
  const [chatInput, setChatInput] = useState<string>('')

  // useChat hook MUST be called at top level unconditionally
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          conversationId,
        },
      }),
    }),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!isOpen) return null

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedInput = chatInput.trim()
    if (!trimmedInput) return

    await sendMessage({ text: trimmedInput })
    setChatInput('')
  }

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-card border border-border rounded-lg shadow-2xl flex flex-col z-50 h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Assistente de IA</h3>
        <Button onClick={onClose} variant="ghost" size="icon" className="h-6 w-6">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <p>Olá! Como posso te ajudar?</p>
          </div>
        )}
        
        {messages.map((message) => {
          try {
            // Extract text from UIMessage parts
            const messageText = message.parts
              ?.filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join('') || ''

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#F7A71C] text-[#303030]'
                      : 'bg-secondary text-foreground'
                  } font-sans text-sm break-words`}
                >
                  {messageText || 'Mensagem vazia'}
                </div>
              </div>
            )
          } catch (e) {
            console.error('[v0] Erro ao renderizar mensagem:', e)
            return (
              <div key={message.id} className="text-xs text-red-500">
                Erro ao renderizar mensagem
              </div>
            )
          }
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-foreground px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Digitando...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-border p-4 flex gap-2">
        <Input
          value={chatInput}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setChatInput(event.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="text-sm"
        />
        <Button
          type="submit"
          disabled={isLoading || !chatInput.trim()}
          size="icon"
          className="bg-[#F7A71C] text-[#303030] hover:bg-[#E09A1A]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
