'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { SubscriptionPlan } from '@/lib/types'

export default function PricingPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        const activePlans = data.plans.filter((p: SubscriptionPlan) => p.isActive)
        setPlans(activePlans)
      }
    } catch (error) {
      console.error('[v0] Erro ao carregar planos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    setProcessingId(planId)
    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll redirect to checkout page or handle locally
      const plan = plans.find(p => p.id === planId)
      if (plan) {
        router.push(`/checkout?planId=${planId}`)
      }
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-[73px]">
        <p className="text-muted-foreground font-sans">Carregando planos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-[73px]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">
            Planos de Subscrição
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
            Escolha o plano perfeito para suas necessidades de projetos arquitetónicos
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isPopular = plan.projectsLimit === 50
            return (
              <div
                key={plan.id}
                className={`rounded-xl border-2 transition-all ${
                  isPopular
                    ? 'border-[#F7A71C] bg-card shadow-lg scale-105'
                    : 'border-border bg-card hover:border-[#F7A71C]'
                }`}
              >
                {isPopular && (
                  <div className="px-4 py-2 bg-[#F7A71C]/10 border-b border-[#F7A71C] text-center">
                    <span className="text-sm font-semibold text-[#F7A71C] font-sans">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-foreground mb-2 font-serif">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm font-sans">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#F7A71C] font-serif">
                        {(plan.price / 100).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground font-sans">
                        {plan.currency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 font-sans">
                      por {plan.billingPeriod === 'monthly' ? 'mês' : 'ano'}
                    </p>
                  </div>

                  {/* Projects Limit */}
                  <div className="mb-8 p-4 bg-secondary rounded-lg">
                    <p className="text-lg font-semibold text-foreground font-sans">
                      {plan.projectsLimit === 999 ? 'Projectos Ilimitados' : `${plan.projectsLimit} Projectos`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      por período de faturação
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#F7A71C] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground font-sans">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={processingId !== null}
                    className={`w-full h-11 font-sans font-semibold ${
                      isPopular
                        ? 'bg-[#F7A71C] text-[#303030] hover:bg-[#d99116]'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {processingId === plan.id ? 'Processando...' : 'Escolher Plano'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 pt-20 border-t border-border">
          <h2 className="text-2xl font-bold text-center text-foreground mb-12 font-serif">
            Perguntas Frequentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-foreground mb-2 font-sans">
                Posso fazer upgrade?
              </h3>
              <p className="text-muted-foreground text-sm font-sans">
                Sim, você pode fazer upgrade ou downgrade a qualquer momento. Será feito um ajuste proporcional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 font-sans">
                Existe período de avaliação?
              </h3>
              <p className="text-muted-foreground text-sm font-sans">
                Sim, o plano Free oferece 3 projectos mensais para experimentar sem custo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 font-sans">
                Como funciona o billing?
              </h3>
              <p className="text-muted-foreground text-sm font-sans">
                Cobramos no início de cada período. Você receberá uma fatura por email.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 font-sans">
                Qual é a política de reembolso?
              </h3>
              <p className="text-muted-foreground text-sm font-sans">
                Oferecemos reembolsos de 30 dias se não estiver satisfeito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
