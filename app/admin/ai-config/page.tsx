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
    systemPrompt: 'You are a helpful assistant for architectural projects.',
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
    try {
      const response = await fetch('/api/admin/ai-config')
      if (response.ok) {
        const data = await response.json()
        if (data.data?.config) {
          setFormData(data.data.config)
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
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Configuração de IA salva com sucesso!',
        })
        setTimeout(() => setMessage({ type: null, text: '' }), 3000)
      } else {
        const errorText = responseData.error?.message || 'Erro desconhecido'
        setMessage({
          type: 'error',
          text: `Erro ao salvar: ${errorText}`,
        })
      }
    } catch (error) {
      console.error('[v0] Erro ao salvar:', error)
      setMessage({
        type: 'error',
        text: `Erro ao salvar configuração`,
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
        <div className="p-6 border border-border rounded-lg bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Provider Section */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-serif">Provedor de IA</h3>
              
              <div className="space-y-4">
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
                    <option value="v0">V0 (Vercel AI)</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium font-sans">Modelo</Label>
                  <Input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder={formData.provider === 'v0' ? 'ex: gpt-5-mini' : formData.provider === 'openai' ? 'ex: gpt-4-mini' : 'ex: claude-opus'}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    {formData.provider === 'v0' && 'Modelos disponíveis via Vercel AI Gateway: gpt-5-mini, claude-opus, etc'}
                    {formData.provider === 'openai' && 'Modelos OpenAI: gpt-4-mini, gpt-4, gpt-3.5-turbo, etc'}
                    {formData.provider === 'anthropic' && 'Modelos Anthropic: claude-opus, claude-sonnet, claude-haiku, etc'}
                    {formData.provider === 'groq' && 'Modelos Groq: mixtral-8x7b-32768, llama2-70b-4096, etc'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium font-sans">API Key</Label>
                  <Input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder={formData.provider === 'v0' ? 'Vercel AI Gateway usa VERCEL_API_KEY' : 'Cole aqui a sua API key'}
                    className="mt-1 font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    {formData.provider === 'v0' 
                      ? 'V0 usa a Vercel AI Gateway (zero-config). A API key será usada automaticamente se configurada em variáveis de ambiente.'
                      : 'Será encriptada e não será exibida novamente'}
                  </p>
                </div>
              </div>
            </div>

            {/* Behavior Section */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4 font-serif">Comportamento</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium font-sans">System Prompt</Label>
                  <Textarea
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    placeholder="Instruções para a IA..."
                    className="mt-1 min-h-[100px] font-sans text-sm"
                  />
                </div>

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
                    <span className="font-mono text-sm w-12 text-right">{formData.temperature.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium font-sans">Comprimento Máximo (Tokens)</Label>
                  <Input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    placeholder="1000"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="border-t border-border pt-6">
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
          <Button
            onClick={async () => {
              setTesting(true)
              try {
                const response = await fetch('/api/admin/ai-test', {
                  method: 'POST',
                })
                const data = await response.json()
                
                if (response.ok) {
                  setMessage({
                    type: 'success',
                    text: 'Teste bem-sucedido! Provedor respondendo.',
                  })
                  setTimeout(() => setMessage({ type: null, text: '' }), 4000)
                } else {
                  const errorText = data.error?.message || 'Erro desconhecido'
                  setMessage({
                    type: 'error',
                    text: `Erro no teste: ${errorText}`,
                  })
                }
              } catch (error) {
                setMessage({
                  type: 'error',
                  text: 'Erro ao testar',
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
