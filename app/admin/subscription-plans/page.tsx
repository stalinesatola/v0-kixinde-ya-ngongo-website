'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Edit2, Trash2, Check } from 'lucide-react'
import type { SubscriptionPlan } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function SubscriptionPlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    price: 0,
    currency: 'AOA',
    billingPeriod: 'monthly',
    projectsLimit: 10,
    features: [],
    isActive: true,
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('[v0] Erro ao carregar planos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingId ? 'PUT' : 'POST'
    const endpoint = editingId 
      ? `/api/admin/subscription-plans/${editingId}`
      : '/api/admin/subscription-plans'

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchPlans()
        resetForm()
      }
    } catch (error) {
      console.error('[v0] Erro ao salvar plano:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que quer deletar este plano?')) return

    try {
      const response = await fetch(`/api/admin/subscription-plans/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPlans()
      }
    } catch (error) {
      console.error('[v0] Erro ao deletar plano:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'AOA',
      billingPeriod: 'monthly',
      projectsLimit: 10,
      features: [],
      isActive: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setFormData(plan)
    setEditingId(plan.id)
    setShowForm(true)
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-serif">Planos de Subscrição</h1>
              <p className="text-muted-foreground mt-1 font-sans">Gerencie planos e preços</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 border border-border rounded-lg bg-card">
            <h2 className="text-xl font-bold mb-6 text-foreground font-serif">
              {editingId ? 'Editar Plano' : 'Criar Novo Plano'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium font-sans">Nome do Plano</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Professional"
                    className="mt-1 font-sans"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium font-sans">Projectos Limite</Label>
                  <Input
                    type="number"
                    value={formData.projectsLimit || 10}
                    onChange={(e) => setFormData({ ...formData, projectsLimit: parseInt(e.target.value) })}
                    className="mt-1 font-sans"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium font-sans">Descrição</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ex: Perfeito para profissionais"
                  className="mt-1 font-sans"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium font-sans">Preço</Label>
                  <Input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    placeholder="ex: 9900 (99.00)"
                    className="mt-1 font-sans"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium font-sans">Moeda</Label>
                  <select
                    value={formData.currency || 'AOA'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground font-sans"
                  >
                    <option value="AOA">AOA</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium font-sans">Período de Billing</Label>
                  <select
                    value={formData.billingPeriod || 'monthly'}
                    onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground font-sans"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Salvar Plano
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-border font-sans"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 border border-border rounded-lg bg-card hover:border-[#F7A71C]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-serif">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-sans">{plan.description}</p>
                </div>
                {!plan.isActive && (
                  <span className="px-2 py-1 bg-red-500/10 text-red-600 text-xs rounded font-sans">
                    Inactivo
                  </span>
                )}
              </div>

              <div className="mb-4 pt-4 border-t border-border">
                <p className="text-2xl font-bold text-[#F7A71C] font-serif">
                  {(plan.price / 100).toFixed(2)} {plan.currency}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  por {plan.billingPeriod === 'monthly' ? 'mês' : 'ano'}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-2 font-sans">
                  {plan.projectsLimit} Projectos
                </p>
                {plan.features.length > 0 && (
                  <ul className="space-y-1">
                    {plan.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="text-xs text-muted-foreground font-sans">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(plan)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border font-sans"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(plan.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 font-sans"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Deletar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4 font-sans">Nenhum plano criado ainda</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
            >
              Criar Primeiro Plano
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
