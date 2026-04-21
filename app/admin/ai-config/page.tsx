'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { AdminHeader } from '@/components/admin-header'

export const dynamic = 'force-dynamic'

export default function AIConfigPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const [formData, setFormData] = useState({
    provider: 'openai',
    model: 'gpt-4-mini',
    apiKey: '',
    systemPrompt: 'You are a helpful assistant for architectural projects. Help users with their questions about building design, materials, and construction.',
    isActive: true,
    temperature: 0.7,
    maxTokens: 1000,
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/admin/user')
      if (!response.ok) {
        router.push('/admin/login')
        return
      }
      const data = await response.json()
      setUser(data.user)
      fetchConfig()
    } catch (err) {
      console.error('[v0] Erro ao carregar dados:', err)
      router.push('/admin/login')
    }
  }

  const fetchConfig = async () => {

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    console.log('[v0] Carregando configuração de IA...')
    try {
      const response = await fetch('/api/admin/ai-config')
      console.log('[v0] Resposta fetchConfig:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Config carregada:', data)
        if (data.data?.config) {
          setFormData({
            provider: data.data.config.provider || 'openai',
            model: data.data.config.model || 'gpt-4-mini',
            apiKey: '', // Nunca retornar chave por segurança
            systemPrompt: data.data.config.system_prompt || formData.systemPrompt,
            isActive: data.data.config.is_active !== false,
            temperature: data.data.config.temperature || 0.7,
            maxTokens: data.data.config.max_tokens || 1000,
          })
        }
      } else {
        console.error('[v0] Erro ao carregar config:', response.statusText)
      }
    } catch (error) {
      console.error('[v0] Exceção ao carregar config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    console.log('[v0] Iniciando gravação de configuração IA')

    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('[v0] Resposta da API:', response.status)
      const responseData = await response.json()

      if (response.ok) {
        console.log('[v0] Configuração IA guardada com sucesso')
        setMessage({
          type: 'success',
          text: 'Configuração de IA salva com sucesso!',
        })
        setTimeout(() => setMessage({ type: null, text: '' }), 3000)
      } else {
        const errorText = responseData.error?.message || 'Erro desconhecido'
        const errorId = responseData.error?.id || ''
        setMessage({
          type: 'error',
          text: `Erro ao salvar: ${errorText}${errorId ? ` (ID: ${errorId})` : ''}`,
        })
      }
    } catch (error) {
      console.error('[v0] Exceção ao salvar:', error)
      setMessage({
        type: 'error',
        text: `Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader title="Configuração de IA" />
        <div className="p-6">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title="Configuração de IA" userName={user?.name} />
      
      <div className="mx-auto max-w-3xl px-6 py-8 w-full">
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
        <div className="p-6 border border-border rounded-lg bg-card space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Provider Section */}
            <div className="border-b border-border pb-6">
              <h2 className="font-semibold text-lg text-foreground mb-4 font-serif">Provedor de IA</h2>
              
              <div className="space-y-4">
                {/* Provider */}
                <div>
                  <Label className="text-sm font-medium font-sans">Provedor</Label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground font-sans"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="groq">Groq</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    Qual provedor de IA utilizar para as respostas
                  </p>
                </div>

                {/* Model */}
                <div>
                  <Label className="text-sm font-medium font-sans">Modelo</Label>
                  <Input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="ex: gpt-4-mini, claude-opus, mixtral-8x7b-32768"
                    className="mt-1 font-mono font-sans text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    ID do modelo a usar. Ex: gpt-4-mini, claude-3-sonnet, etc
                  </p>
                </div>

                {/* API Key */}
                <div>
                  <Label className="text-sm font-medium font-sans">API Key</Label>
                  <Input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Cole aqui a sua API key"
                    className="mt-1 font-mono font-sans text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    API key do provedor. Será encriptada e não será exibida novamente
                  </p>
                </div>
              </div>
            </div>

            {/* Behavior Section */}
            <div className="border-b border-border pb-6">
              <h2 className="font-semibold text-lg text-foreground mb-4 font-serif">Comportamento</h2>
              
              <div className="space-y-4">
                {/* System Prompt */}
                <div>
                  <Label className="text-sm font-medium font-sans">System Prompt</Label>
                  <Textarea
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    placeholder="Instruções para a IA..."
                    className="mt-1 min-h-[120px] font-sans text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    Instruções que definem o comportamento e contexto da IA
                  </p>
                </div>

                {/* Temperature */}
                <div>
                  <Label className="text-sm font-medium font-sans">Criatividade (Temperatura)</Label>
                  <div className="mt-1 flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="font-mono text-sm font-sans w-12 text-right">{formData.temperature.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-sans">
                    0 = Determinístico (sempre igual), 1 = Criativo (variável)
                  </p>
                </div>

                {/* Max Tokens */}
                <div>
                  <Label className="text-sm font-medium font-sans">Comprimento Máximo (Tokens)</Label>
                  <Input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    placeholder="1000"
                    className="mt-1 font-sans"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    Comprimento máximo das respostas (1 token ≈ 4 caracteres)
                  </p>
                </div>
              </div>
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
                Ativar Chat de IA
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-border">
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
          <h2 className="font-semibold text-lg text-foreground mb-2 font-serif">Testar Configuração</h2>
          <p className="text-sm text-muted-foreground mb-4 font-sans">
            Teste a conexão com o provedor de IA
          </p>
          <Button
            onClick={async () => {
              setTesting(true)
              console.log('[v0] Testando configuração IA...')
              try {
                const response = await fetch('/api/admin/ai-test', {
                  method: 'POST',
                })
                console.log('[v0] Resposta teste:', response.status)
                const data = await response.json()
                
                if (response.ok) {
                  setMessage({
                    type: 'success',
                    text: 'Teste de IA bem-sucedido! Provedor respondendo corretamente.',
                  })
                  setTimeout(() => setMessage({ type: null, text: '' }), 4000)
                } else {
                  const errorText = data.error?.message || 'Erro desconhecido'
                  const errorId = data.error?.id || ''
                  setMessage({
                    type: 'error',
                    text: `Erro no teste: ${errorText}${errorId ? ` (ID: ${errorId})` : ''}`,
                  })
                }
              } catch (error) {
                console.error('[v0] Exceção ao testar:', error)
                setMessage({
                  type: 'error',
                  text: `Erro ao testar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                })
              } finally {
                setTesting(false)
              }
            }}
            disabled={testing}
            variant="outline"
            className="border-border font-sans"
          >
            {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {testing ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </div>
      </div>
    </div>
  )
}
