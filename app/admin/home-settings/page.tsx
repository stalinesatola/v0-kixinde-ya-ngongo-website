'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import { AdminHeader } from '@/components/admin-header'

export const dynamic = 'force-dynamic'

export default function HomeSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const [formData, setFormData] = useState({
    showFooter: true,
    showMenu: true,
    showHomeBody: true,
    customColorsEnabled: false,
    accentColor: '#F7A71C',
    bodyBackground: '#ffffff',
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
      await fetchConfig()
    } catch (error) {
      console.error('[v0] Erro ao carregar dados:', error)
      router.push('/admin/login')
    }
  }

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/home-settings')
      if (!response.ok) {
        return
      }
      const data = await response.json()
      if (data.data?.settings) {
        setFormData((prev) => ({
          ...prev,
          ...data.data.settings,
        }))
      }
    } catch (error) {
      console.error('[v0] Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/home-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const responseData = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuração da página inicial salva com sucesso!' })
        setTimeout(() => setMessage({ type: null, text: '' }), 3000)
      } else {
        setMessage({
          type: 'error',
          text: responseData.error?.message || 'Erro ao guardar configuração',
        })
      }
    } catch (error) {
      console.error('[v0] Erro ao salvar configuração:', error)
      setMessage({ type: 'error', text: 'Erro ao guardar configuração' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader title="Configuração da Página Inicial" />
        <div className="p-6">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title="Configuração da Página Inicial" userName={user?.name} />

      <div className="mx-auto max-w-3xl px-6 py-8 w-full">
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
              <p className={`text-sm font-sans ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 border border-border rounded-lg bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-serif">Controle da Página Inicial</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.showMenu}
                    onChange={(e) => setFormData({ ...formData, showMenu: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-sans">Mostrar menu na página inicial</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.showFooter}
                    onChange={(e) => setFormData({ ...formData, showFooter: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-sans">Mostrar rodapé na página inicial</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.showHomeBody}
                    onChange={(e) => setFormData({ ...formData, showHomeBody: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-sans">Mostrar corpo da página inicial</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.customColorsEnabled}
                    onChange={(e) => setFormData({ ...formData, customColorsEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-sans">Ativar cores personalizadas</span>
                </label>
              </div>
            </div>

            {formData.customColorsEnabled && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium font-sans">Cor de destaque</Label>
                  <Input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="mt-1 h-11 w-full p-0"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium font-sans">Cor de fundo do corpo</Label>
                  <Input
                    type="color"
                    value={formData.bodyBackground}
                    onChange={(e) => setFormData({ ...formData, bodyBackground: e.target.value })}
                    className="mt-1 h-11 w-full p-0"
                  />
                </div>
              </div>
            )}

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
      </div>
    </div>
  )
}
