'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle, CreditCard, Calendar, Zap } from 'lucide-react'
import type { UserSubscription, SubscriptionPlan, PaymentTransaction } from '@/lib/types'

export default function SubscriptionAccountPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setShowSuccess(!!searchParams.get('success'))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
          setPlan(data.plan)
          setTransactions(data.transactions || [])
        } else if (response.status === 401) {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('[v0] Erro ao carregar subscrição:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-[73px]">
        <p className="text-muted-foreground font-sans">Carregando...</p>
      </div>
    )
  }

  if (!subscription || !plan) {
    return (
      <div className="min-h-screen bg-background pt-[73px]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2 font-serif">Sem Subscrição Ativa</h1>
            <p className="text-muted-foreground mb-6 font-sans">
              Você não tem uma subscrição ativa no momento.
            </p>
            <Button
              onClick={() => router.push('/pricing')}
              className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
            >
              Ver Planos Disponíveis
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isActive = subscription.status === 'active' && new Date() < new Date(subscription.expiresAt)
  const daysUntilExpiry = Math.ceil(
    (new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-background pt-[73px]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-700 font-sans">Pagamento confirmado!</p>
                <p className="text-sm text-green-600 mt-1 font-sans">
                  Sua subscrição foi ativada com sucesso.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Subscription */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="p-8 border border-border rounded-lg bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-serif">Sua Subscrição</h2>

              <div className="space-y-6">
                {/* Plan Info */}
                <div>
                  <p className="text-sm text-muted-foreground font-sans mb-2">Plano Ativo</p>
                  <p className="text-3xl font-bold text-[#F7A71C] font-serif">{plan.name}</p>
                  <p className="text-muted-foreground font-sans mt-1">{plan.description}</p>
                </div>

                {/* Status */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <>
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="font-semibold text-green-600 font-sans">Ativo</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="font-semibold text-red-600 font-sans">Expirado</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-sans">
                    {isActive
                      ? `Expira em ${daysUntilExpiry} dias`
                      : 'Sua subscrição expirou. Renove para continuar usando.'}
                  </p>
                </div>

                {/* Features */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4 font-sans">Funcionalidades Incluídas</h3>
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#F7A71C]" />
                        <span className="text-sm text-foreground font-sans">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-[#F7A71C]" />
                <span className="text-sm text-muted-foreground font-sans">Projectos Usados</span>
              </div>
              <p className="text-3xl font-bold text-foreground font-serif">
                {subscription.projectsUsed} / {plan.projectsLimit === 999 ? '∞' : plan.projectsLimit}
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[#F7A71C]" />
                <span className="text-sm text-muted-foreground font-sans">Período Atual</span>
              </div>
              <p className="text-sm text-foreground font-sans">
                {new Date(subscription.startDate).toLocaleDateString('pt-PT')} a{' '}
                {new Date(subscription.expiresAt).toLocaleDateString('pt-PT')}
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-[#F7A71C]" />
                <span className="text-sm text-muted-foreground font-sans">Preço</span>
              </div>
              <p className="text-2xl font-bold text-[#F7A71C] font-serif">
                {(plan.price / 100).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-sans">
                por {plan.billingPeriod === 'monthly' ? 'mês' : 'ano'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-12 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push('/pricing')}
            className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans"
          >
            Upgrade de Plano
          </Button>
          <Button
            variant="outline"
            className="border-border font-sans"
          >
            Cancelar Subscrição
          </Button>
        </div>

        {/* Transactions */}
        {transactions.length > 0 && (
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-bold text-foreground mb-4 font-serif">Histórico de Pagamentos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-sans">Data</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-sans">Descrição</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-sans">Valor</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-sans">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trans) => (
                    <tr key={trans.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-3 px-4 font-sans">
                        {new Date(trans.createdAt).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="py-3 px-4 font-sans">Pagamento - {plan.name}</td>
                      <td className="py-3 px-4 font-semibold text-foreground font-sans">
                        {(trans.amount / 100).toFixed(2)} {trans.currency}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold font-sans ${
                            trans.status === 'completed'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}
                        >
                          {trans.status === 'completed' ? 'Completo' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
