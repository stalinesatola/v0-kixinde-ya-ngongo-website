import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minha Subscrição - Kixinde Ya Ngongo',
  description: 'Gerencie sua subscrição e plano',
}

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-background pt-[73px] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4 font-serif">Subscrição</h1>
        <p className="text-muted-foreground font-sans">
          A página de subscrição está sendo carregada...
        </p>
      </div>
    </div>
  )
}
