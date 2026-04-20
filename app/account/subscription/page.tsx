import dynamic from 'next/dynamic'

const SubscriptionAccountContent = dynamic(
  () => import('@/components/subscription-account-content').then(mod => ({ default: mod.SubscriptionAccountContent })),
  { ssr: false }
)

export default function SubscriptionPage() {
  return <SubscriptionAccountContent />
}
