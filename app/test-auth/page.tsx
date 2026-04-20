'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    try {
      console.log("[v0] TEST PAGE - iniciando testes")
      
      // Test 1: Check backend
      const testRes = await fetch('/api/auth/test')
      const testData = await testRes.json()
      console.log("[v0] TEST PAGE - backend check:", testData)
      
      // Test 2: Try login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@kixindeyangongo.ao',
          password: 'demo123'
        })
      })
      const loginData = await loginRes.json()
      console.log("[v0] TEST PAGE - login response:", loginData)

      setTestResults({
        backend: testData,
        login: { status: loginRes.status, data: loginData }
      })
    } catch (error) {
      console.error("[v0] TEST PAGE - error:", error)
      setTestResults({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Autenticação</h1>
        
        <Button 
          onClick={runTests} 
          disabled={loading}
          className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] mb-8"
        >
          {loading ? 'A Testar...' : 'Executar Testes'}
        </Button>

        {testResults && (
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="whitespace-pre-wrap break-words text-sm overflow-auto max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-600">
            Abra a consola do navegador (F12) para ver os logs detalhados do teste.
          </p>
        </div>
      </div>
    </div>
  )
}
