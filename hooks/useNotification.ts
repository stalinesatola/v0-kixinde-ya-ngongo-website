'use client'

import { toast } from 'sonner'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'promise'

export interface NotificationOptions {
  duration?: number
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function useNotification() {
  const notify = {
    success: (message: string, options?: NotificationOptions) => {
      console.log('[v0-notify] Success:', message)
      return toast.success(message, {
        duration: options?.duration || 3000,
        description: options?.description,
        action: options?.action,
      })
    },

    error: (message: string, errorId?: string, options?: NotificationOptions) => {
      const id = errorId || `err-${Date.now()}`
      console.error('[v0-notify] Error [' + id + ']:', message)
      return toast.error(message, {
        duration: options?.duration || 5000,
        description: options?.description || `Error ID: ${id}`,
        action: options?.action,
      })
    },

    warning: (message: string, options?: NotificationOptions) => {
      console.warn('[v0-notify] Warning:', message)
      return toast.warning(message, {
        duration: options?.duration || 4000,
        description: options?.description,
        action: options?.action,
      })
    },

    info: (message: string, options?: NotificationOptions) => {
      console.info('[v0-notify] Info:', message)
      return toast.info(message, {
        duration: options?.duration || 3000,
        description: options?.description,
        action: options?.action,
      })
    },

    loading: (message: string) => {
      console.log('[v0-notify] Loading:', message)
      return toast.loading(message)
    },

    dismiss: (toastId: string | number) => {
      toast.dismiss(toastId)
    },

    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string
        error: string
      }
    ) => {
      console.log('[v0-notify] Promise:', messages.loading)
      return toast.promise(promise, messages)
    },
  }

  return notify
}
