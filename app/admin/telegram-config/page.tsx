'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function TelegramSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const [formData, setFormData] = useState({
    botToken: '',
    chatId: '',
    isActive: true,
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/telegram-config')
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setFormData({
            botToken: data.config.botToken,
            chatId: data.config.chatId,
            isActive: data.config.isActive,
          })
        }
      }
    } catch (error) {
      console.error('[v0] Erro ao carregar config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/telegram-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Configuração Telegram salva com sucesso!',
        })
        setTimeout(() => setMessage({ type: null, text: '' }), 3000)
      } else {
        setMessage({
          type: 'error',
          text: 'Erro ao salvar configuração',
        })
      }
    } catch (error) {
      console.error('[v0] Erro ao salvar:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao salvar configuração',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push('/admin/dashboard')}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">Configuração Telegram</h1>
            <p className="text-muted-foreground mt-1 font-sans">
              Configure notificações automáticas de projetos no Telegram
            </p>
          </div>
        </div>

        {/* Messages */}
        {message.type && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-sans ${
                  message.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6 border border-border rounded-lg bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2 font-sans">Como configurar</h3>
              <ol className="text-sm text-blue-600 space-y-1 font-sans list-decimal list-inside">
                <li>Crie um bot Telegram com BotFather (@BotFather)</li>
                <li>Copie o token do bot</li>
                <li>Inicie uma conversa com o bot e obtenha o ID do chat</li>
                <li>Preencha os dados abaixo</li>
              </ol>
            </div>

            {/* Bot Token */}
            <div>
              <Label className="text-sm font-medium font-sans">Bot Token</Label>
              <Input
                type="password"
                value={formData.botToken}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                placeholder="ex: 123456789:ABCdefGHIjklmnoPQRstuvwxyzABCDeFGhij"
                className="mt-1 font-mono font-sans text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1 font-sans">
                Obtido do BotFather quando cria um novo bot
              </p>
            </div>

            {/* Chat ID */}
            <div>
              <Label className="text-sm font-medium font-sans">ID do Chat</Label>
              <Input
                type="text"
                value={formData.chatId}
                onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                placeholder="ex: -1001234567890 ou 123456789"
                className="mt-1 font-mono font-sans"
              />
              <p className="text-xs text-muted-foreground mt-1 font-sans">
                ID do chat ou canal onde as notificações serão enviadas
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <Label htmlFor="isActive" className="text-sm font-medium font-sans cursor-pointer">
                Ativar Notificações Telegram
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Configuração'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
                className="border-border font-sans flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        {/* Test Section */}
        <div className="mt-8 p-6 border border-border rounded-lg bg-card">
          <h2 className="font-semibold text-foreground mb-4 font-serif">Testar Configuração</h2>
          <p className="text-sm text-muted-foreground mb-4 font-sans">
            Envie uma mensagem de teste para verificar se a configuração está funcionando
          </p>
          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/telegram-test', {
                  method: 'POST',
                })
                if (response.ok) {
                  setMessage({
                    type: 'success',
                    text: 'Mensagem de teste enviada!',
                  })
                  setTimeout(() => setMessage({ type: null, text: '' }), 3000)
                }
              } catch (error) {
                setMessage({
                  type: 'error',
                  text: 'Erro ao enviar mensagem de teste',
                })
              }
            }}
            variant="outline"
            className="border-border font-sans"
          >
            Enviar Teste
          </Button>
        </div>
      </div>
    </div>
  )
}
