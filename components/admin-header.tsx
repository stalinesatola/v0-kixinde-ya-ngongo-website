'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Home } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  title: string
  userName?: string
  showHome?: boolean
}

export function AdminHeader({ title, userName, showHome = true }: AdminHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      console.log('[v0] Iniciando logout...')
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      
      if (!response.ok) {
        console.error('[v0] Erro ao fazer logout:', response.statusText)
        return
      }

      console.log('[v0] Logout bem-sucedido, redirecionando...')
      router.push('/admin/login')
    } catch (err) {
      console.error('[v0] Exceção ao fazer logout:', err)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {showHome && (
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Ir para dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-foreground font-serif">{title}</h1>
            {userName && (
              <p className="text-xs text-muted-foreground font-sans mt-1">
                Utilizador: {userName}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="outline"
          className="border-border font-sans gap-2"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </Button>
      </div>
    </header>
  )
}
