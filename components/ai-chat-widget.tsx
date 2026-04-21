'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, X, MessageCircle, Loader2 } from 'lucide-react'

interface AIChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatWidget({ isOpen, onClose }: AIChatWidgetProps) {
  const [conversationId, setConversationId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  let chatHook: any
  try {
    chatHook = useChat({
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
  } catch (e) {
    console.error('[v0] Erro ao inicializar chat:', e)
    setError('Erro ao inicializar chat')
    chatHook = {
      messages: [],
      input: '',
      handleInputChange: () => {},
      handleSubmit: () => {},
      isLoading: false,
      status: 'error',
    }
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading, status } = chatHook

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  if (!isOpen) return null

  if (error) {
    return (
      <div className="fixed bottom-20 right-6 w-96 bg-card border border-destructive rounded-lg shadow-2xl flex flex-col z-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Erro</h3>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-6 w-6">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-6 w-96 max-h-[600px] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#F7A71C]" />
          <h3 className="font-semibold text-foreground font-serif">Assistente IA</h3>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground font-sans">
              Olá! Como posso ajudar com seu projeto?
            </p>
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
                  } font-sans text-sm`}
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
            <div className="bg-secondary text-foreground px-4 py-2 rounded-lg flex items-center gap-2 font-sans text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Respondendo...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Digite sua pergunta..."
            disabled={isLoading}
            className="flex-1 bg-card border-border font-sans text-sm"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
