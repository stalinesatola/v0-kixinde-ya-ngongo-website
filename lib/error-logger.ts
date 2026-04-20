export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warning' | 'info'
  message: string
  context?: Record<string, any>
  stack?: string
  url?: string
  userAgent?: string
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100

  log(
    level: 'error' | 'warning' | 'info',
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): string {
    const id = `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()

    const errorLog: ErrorLog = {
      id,
      timestamp,
      level,
      message,
      context,
      stack: error?.stack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }

    this.logs.push(errorLog)

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log to console
    const prefix = `[v0-${level.toUpperCase()}] [${id}] ${timestamp}`
    if (level === 'error') {
      console.error(prefix, message, context, error)
    } else if (level === 'warning') {
      console.warn(prefix, message, context)
    } else {
      console.info(prefix, message, context)
    }

    return id
  }

  error(message: string, context?: Record<string, any>, error?: Error): string {
    return this.log('error', message, context, error)
  }

  warning(message: string, context?: Record<string, any>): string {
    return this.log('warning', message, context)
  }

  info(message: string, context?: Record<string, any>): string {
    return this.log('info', message, context)
  }

  getLogs(): ErrorLog[] {
    return [...this.logs]
  }

  getErrorLogs(): ErrorLog[] {
    return this.logs.filter(log => log.level === 'error')
  }

  clear(): void {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const errorLogger = new ErrorLogger()

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorLogger.error(
      'Uncaught error',
      { filename: event.filename, lineno: event.lineno, colno: event.colno },
      event.error
    )
  })

  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.error(
      'Unhandled promise rejection',
      {},
      event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    )
  })
}
