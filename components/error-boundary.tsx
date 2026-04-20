'use client'

import React, { ReactNode } from 'react'
import { useNotification } from '@/hooks/useNotification'
import { errorLogger } from '@/lib/error-logger'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null, hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = errorLogger.error(
      'React Error Boundary caught error',
      { componentStack: errorInfo.componentStack },
      error
    )
    console.error(`Error Boundary [${errorId}]:`, error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.resetError) || (
          <ErrorBoundaryDefault error={this.state.error} onReset={this.resetError} />
        )
      )
    }

    return this.props.children
  }
}

function ErrorBoundaryDefault({
  error,
  onReset,
}: {
  error: Error
  onReset: () => void
}) {
  const notify = useNotification()

  React.useEffect(() => {
    notify.error(
      'Algo correu mal. A página foi recarregada automaticamente.',
      'ERR-BOUNDARY'
    )
  }, [notify])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-4 font-serif">
          Algo correu mal
        </h1>

        <p className="text-muted-foreground text-center mb-6 font-sans">
          Desculpe, ocorreu um erro inesperado. Tente recarregar a página ou contacte-nos.
        </p>

        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <p className="text-xs font-mono text-muted-foreground break-words">
            {error.message}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onReset}
            className="flex-1 bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="flex-1 border-border font-sans"
          >
            Ir para home
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4 font-sans">
          Se o problema persistir, contacte: info@kixindeyangongo.ao
        </p>
      </div>
    </div>
  )
}
