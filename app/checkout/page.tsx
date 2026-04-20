'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Lock, Check } from 'lucide-react'
import type { SubscriptionPlan } from '@/lib/types'

export default function CheckoutPage() {
  const router = useRouter()
  const [planId, setPlanId] = useState<string | null>(null)
  
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get('planId')
    setPlanId(id)
  }, [])

  useEffect(() => {
    if (!planId) {
      router.push('/pricing')
      return
    }

    const fetchPlan = async () => {
      try {
        const response = await fetch('/api/admin/subscription-plans')
        if (response.ok) {
          const data = await response.json()
          const selectedPlan = data.plans.find((p: SubscriptionPlan) => p.id === planId)
          if (selectedPlan) {
            setPlan(selectedPlan)
          }
        }
      } catch (error) {
        console.error('[v0] Erro ao carregar plano:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [planId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          paymentMethod: 'card',
          cardData: formData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/pricing?success=true&subscriptionId=${data.subscriptionId}`)
      } else {
        alert('Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('[v0] Erro ao processar:', error)
      alert('Erro ao processar pagamento')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-[73px]">
        <p className="text-muted-foreground font-sans">Carregando...</p>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background pt-[73px]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Button onClick={() => router.push('/pricing')} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Planos
          </Button>
          <p className="mt-6 text-muted-foreground font-sans">Plano não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-[73px]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Button
          onClick={() => router.push('/pricing')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Planos
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-24 p-6 border border-border rounded-lg bg-card">
              <h2 className="font-semibold text-foreground mb-4 font-serif">Resumo da Encomenda</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground font-sans">Plano</p>
                  <p className="font-semibold text-foreground font-sans">{plan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-sans">Projectos</p>
                  <p className="font-semibold text-foreground font-sans">
                    {plan.projectsLimit === 999 ? 'Ilimitados' : plan.projectsLimit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-sans">Período</p>
                  <p className="font-semibold text-foreground font-sans">
                    {plan.billingPeriod === 'monthly' ? 'Mensal' : 'Anual'}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-muted-foreground font-sans">Subtotal</span>
                  <span className="font-semibold text-foreground font-sans">
                    {(plan.price / 100).toFixed(2)} {plan.currency}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-muted-foreground font-sans">IVA (0%)</span>
                  <span className="font-semibold text-foreground font-sans">0.00</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-foreground font-sans">Total</span>
                  <span className="text-2xl font-bold text-[#F7A71C] font-serif">
                    {(plan.price / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex gap-2 text-sm text-green-700">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="font-sans">Pagamento seguro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 font-serif">
                  Informação de Pagamento
                </h2>

                <div className="space-y-4 p-6 border border-border rounded-lg bg-card">
                  <div>
                    <Label className="text-sm font-medium font-sans">Nome no Cartão</Label>
                    <Input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      placeholder="João Silva"
                      required
                      disabled={processing}
                      className="mt-1 font-sans"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium font-sans">Número do Cartão</Label>
                    <Input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').substring(0, 16)
                        setFormData({ ...formData, cardNumber: value })
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      required
                      disabled={processing}
                      className="mt-1 font-mono font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium font-sans">Validade</Label>
                      <Input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                        disabled={processing}
                        className="mt-1 font-sans"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium font-sans">CVV</Label>
                      <Input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={3}
                        required
                        disabled={processing}
                        className="mt-1 font-sans"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground font-sans mb-4">
                      Seus dados de pagamento são processados de forma segura através de Stripe.
                    </p>
                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold h-11"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {processing ? 'Processando...' : 'Confirmar Pagamento'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
