export interface FetchOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds
const DEFAULT_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchOptions
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(
          errorData.error?.message || `HTTP ${response.status}`
        )
        console.warn(`[v0-fetch] Attempt ${attempt + 1}/${retries + 1} failed:`, error.message)
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
          continue
        }
        lastError = error
        break
      }

      return response
    } catch (error) {
      clearTimeout(0)
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn(`[v0-fetch] Network error on attempt ${attempt + 1}/${retries + 1}`)
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn(`[v0-fetch] Timeout on attempt ${attempt + 1}/${retries + 1}`)
      }

      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error('Failed to fetch after retries')
}

export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()
  return data
}
