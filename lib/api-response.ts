export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    id: string
    timestamp: string
  }
  meta?: {
    timestamp: string
    version: string
  }
}

export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  }
}

export function createErrorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  id?: string
): ApiResponse<null> {
  const errorId = id || `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()
  
  console.error(`[v0-api-error] ${timestamp} [${errorId}] ${code}: ${message}`)
  
  return {
    success: false,
    error: {
      message,
      code,
      id: errorId,
      timestamp,
    },
  }
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500,
    public id?: string
  ) {
    super(message)
    this.id = id || `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
