import { NextResponse } from 'next/server'
import { createErrorResponse, ApiError } from './api-response'

export function handleApiError(error: unknown) {
  const timestamp = new Date().toISOString()
  
  if (error instanceof ApiError) {
    console.error(`[v0-api] ${timestamp} [${error.id}] ${error.code}:`, error.message)
    return NextResponse.json(
      createErrorResponse(error.message, error.code, error.id),
      { status: error.statusCode }
    )
  }

  if (error instanceof SyntaxError) {
    const id = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    console.error(`[v0-api] ${timestamp} [${id}] PARSE_ERROR:`, error.message)
    return NextResponse.json(
      createErrorResponse('Invalid request format', 'PARSE_ERROR', id),
      { status: 400 }
    )
  }

  if (error instanceof TypeError) {
    const id = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    console.error(`[v0-api] ${timestamp} [${id}] TYPE_ERROR:`, error.message)
    return NextResponse.json(
      createErrorResponse('Invalid request data', 'TYPE_ERROR', id),
      { status: 400 }
    )
  }

  const id = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[v0-api] ${timestamp} [${id}] UNKNOWN_ERROR:`, message)
  
  return NextResponse.json(
    createErrorResponse('Internal server error', 'INTERNAL_ERROR', id),
    { status: 500 }
  )
}
