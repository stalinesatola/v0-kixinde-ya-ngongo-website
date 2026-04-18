"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult("Testando login...")
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: "admin@kixindeyangongo.ao", 
          password: "demo123" 
        }),
      })

      const data = await response.json()
      setResult(`Status: ${response.status}\n${JSON.stringify(data, null, 2)}\n\nCookies: ${document.cookie}`)
    } catch (error) {
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Teste de Login</h1>
        <Button onClick={testLogin} disabled={loading} className="w-full mb-4">
          {loading ? "Testando..." : "Testar Login"}
        </Button>
        <pre className="bg-card border border-border p-4 rounded whitespace-pre-wrap break-words text-sm">
          {result}
        </pre>
      </div>
    </div>
  )
}
