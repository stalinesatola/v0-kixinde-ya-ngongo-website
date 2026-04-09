"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PolygonCanvas } from "@/components/polygon-canvas"
import { 
  calculateTriangleArea, 
  calculateQuadrilateralArea, 
  calculateLShapeArea,
  calculateTrapezoidArea,
  calculatePolygonAreaFromCoordinates,
  formatNumber,
  type TriangleData,
  type QuadrilateralData,
  type LShapeData,
  type TrapezoidData,
  type Point
} from "@/lib/geometry-utils"

type IrregularShape = "triangle" | "quadrilateral" | "lshape" | "trapezoid" | "polygon"

interface IrregularTerrainCalculatorProps {
  onCalculation: (area: string, perimeter: string) => void
}

const shapeOptions: { value: IrregularShape; label: string; icon: string; description: string }[] = [
  { value: "triangle", label: "Triangulo", icon: "△", description: "3 lados" },
  { value: "quadrilateral", label: "Quadrilatero", icon: "◇", description: "4 lados + diagonal" },
  { value: "trapezoid", label: "Trapezio", icon: "⬡", description: "Bases + altura" },
  { value: "lshape", label: "Forma em L", icon: "⌐", description: "2 rectangulos" },
  { value: "polygon", label: "Poligono", icon: "⬢", description: "Desenhar no mapa" },
]

export function IrregularTerrainCalculator({ onCalculation }: IrregularTerrainCalculatorProps) {
  const [selectedShape, setSelectedShape] = useState<IrregularShape>("triangle")
  
  // Triangle inputs
  const [triangleData, setTriangleData] = useState<TriangleData>({ sideA: 0, sideB: 0, sideC: 0 })
  
  // Quadrilateral inputs
  const [quadData, setQuadData] = useState<QuadrilateralData>({ sideA: 0, sideB: 0, sideC: 0, sideD: 0, diagonal: 0 })
  
  // L-Shape inputs
  const [lshapeData, setLshapeData] = useState<LShapeData>({ width1: 0, length1: 0, width2: 0, length2: 0 })
  
  // Trapezoid inputs
  const [trapezoidData, setTrapezoidData] = useState<TrapezoidData>({ baseTop: 0, baseBottom: 0, height: 0, sideLeft: 0, sideRight: 0 })
  
  // Polygon inputs (coordinate-based)
  const [polygonPoints, setPolygonPoints] = useState<Point[]>([])
  const [polygonResult, setPolygonResult] = useState<{
    area: number
    perimeter: number
    isValid: boolean
    isConvex: boolean
    hasSelfIntersection: boolean
  } | null>(null)
  
  // Calculated results
  const [result, setResult] = useState<{ area: number; perimeter: number } | null>(null)
  const [error, setError] = useState<string>("")

  // Calculate based on selected shape
  useEffect(() => {
    setError("")
    let calcResult: { area: number; perimeter: number } | null = null
    
    switch (selectedShape) {
      case "triangle":
        if (triangleData.sideA > 0 && triangleData.sideB > 0 && triangleData.sideC > 0) {
          calcResult = calculateTriangleArea(triangleData)
          if (!calcResult) {
            setError("Os lados nao formam um triangulo valido")
          }
        }
        break
        
      case "quadrilateral":
        if (quadData.sideA > 0 && quadData.sideB > 0 && quadData.sideC > 0 && quadData.sideD > 0 && quadData.diagonal > 0) {
          calcResult = calculateQuadrilateralArea(quadData)
          if (!calcResult) {
            setError("Os valores nao formam um quadrilatero valido")
          }
        }
        break
        
      case "lshape":
        if (lshapeData.width1 > 0 && lshapeData.length1 > 0 && lshapeData.width2 > 0 && lshapeData.length2 > 0) {
          calcResult = calculateLShapeArea(lshapeData)
        }
        break
        
      case "trapezoid":
        if (trapezoidData.baseTop > 0 && trapezoidData.baseBottom > 0 && trapezoidData.height > 0) {
          calcResult = calculateTrapezoidArea(trapezoidData)
        }
        break
        
      case "polygon":
        if (polygonPoints.length >= 3) {
          const polyResult = calculatePolygonAreaFromCoordinates(polygonPoints)
          setPolygonResult(polyResult)
          if (polyResult && polyResult.isValid) {
            calcResult = { area: polyResult.area, perimeter: polyResult.perimeter }
          } else if (polyResult?.hasSelfIntersection) {
            setError("O poligono tem lados que se cruzam. Ajuste os pontos.")
          }
        }
        break
    }
    
    setResult(calcResult)
    
    if (calcResult) {
      onCalculation(formatNumber(calcResult.area), formatNumber(calcResult.perimeter))
    }
  }, [selectedShape, triangleData, quadData, lshapeData, trapezoidData, polygonPoints, onCalculation])

  const parseInput = (value: string): number => {
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }

  return (
    <div className="space-y-6">
      {/* Shape Selection */}
      <div>
        <Label className="mb-3 block text-sm font-medium font-sans">Seleccione a Forma do Terreno</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {shapeOptions.map((shape) => (
            <button
              key={shape.value}
              type="button"
              onClick={() => setSelectedShape(shape.value)}
              className={`flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-all font-sans ${
                selectedShape === shape.value
                  ? "border-[#F7A71C] bg-[#F7A71C]/10 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-[#F7A71C]/40"
              }`}
            >
              <span className="text-2xl">{shape.icon}</span>
              <span>{shape.label}</span>
              <span className="text-xs text-muted-foreground">{shape.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Input Fields */}
      <div className="rounded-lg border border-border p-5 bg-secondary/20">
        <h4 className="font-semibold mb-4 font-sans text-foreground">
          Medidas do {shapeOptions.find(s => s.value === selectedShape)?.label}
        </h4>
        
        {selectedShape === "triangle" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-sans">Lado A (m)</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="ex: 15" 
                value={triangleData.sideA || ""} 
                onChange={(e) => setTriangleData(prev => ({ ...prev, sideA: parseInput(e.target.value) }))}
                className="font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-sans">Lado B (m)</Label>
              <Input 
                type="number"
                step="0.01" 
                placeholder="ex: 20" 
                value={triangleData.sideB || ""} 
                onChange={(e) => setTriangleData(prev => ({ ...prev, sideB: parseInput(e.target.value) }))}
                className="font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-sans">Lado C (m)</Label>
              <Input 
                type="number"
                step="0.01" 
                placeholder="ex: 25" 
                value={triangleData.sideC || ""} 
                onChange={(e) => setTriangleData(prev => ({ ...prev, sideC: parseInput(e.target.value) }))}
                className="font-sans"
              />
            </div>
          </div>
        )}

        {selectedShape === "quadrilateral" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Lado A (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 15" 
                  value={quadData.sideA || ""} 
                  onChange={(e) => setQuadData(prev => ({ ...prev, sideA: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Lado B (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 20" 
                  value={quadData.sideB || ""} 
                  onChange={(e) => setQuadData(prev => ({ ...prev, sideB: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Lado C (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 18" 
                  value={quadData.sideC || ""} 
                  onChange={(e) => setQuadData(prev => ({ ...prev, sideC: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Lado D (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 22" 
                  value={quadData.sideD || ""} 
                  onChange={(e) => setQuadData(prev => ({ ...prev, sideD: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-sans">Diagonal (m) - Meca uma diagonal interna</Label>
              <Input 
                type="number"
                step="0.01" 
                placeholder="ex: 25" 
                value={quadData.diagonal || ""} 
                onChange={(e) => setQuadData(prev => ({ ...prev, diagonal: parseInput(e.target.value) }))}
                className="font-sans"
              />
              <p className="text-xs text-muted-foreground">A diagonal e usada para dividir o terreno em 2 triangulos e calcular a area com precisao</p>
            </div>
          </div>
        )}

        {selectedShape === "trapezoid" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Base Superior (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 15" 
                  value={trapezoidData.baseTop || ""} 
                  onChange={(e) => setTrapezoidData(prev => ({ ...prev, baseTop: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Base Inferior (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 25" 
                  value={trapezoidData.baseBottom || ""} 
                  onChange={(e) => setTrapezoidData(prev => ({ ...prev, baseBottom: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Altura (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 20" 
                  value={trapezoidData.height || ""} 
                  onChange={(e) => setTrapezoidData(prev => ({ ...prev, height: parseInput(e.target.value) }))}
                  className="font-sans"
                />
                <p className="text-xs text-muted-foreground">Distancia perpendicular entre as bases</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Lado Esquerdo (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 22" 
                  value={trapezoidData.sideLeft || ""} 
                  onChange={(e) => setTrapezoidData(prev => ({ ...prev, sideLeft: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-sans">Lado Direito (m)</Label>
                <Input 
                  type="number"
                  step="0.01" 
                  placeholder="ex: 22" 
                  value={trapezoidData.sideRight || ""} 
                  onChange={(e) => setTrapezoidData(prev => ({ ...prev, sideRight: parseInput(e.target.value) }))}
                  className="font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {selectedShape === "lshape" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-sans mb-2">O terreno em L e composto por dois rectangulos. Insira as medidas de cada um:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h5 className="font-medium mb-3 text-sm font-sans">Rectangulo Principal</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-sans">Largura (m)</Label>
                    <Input 
                      type="number"
                      step="0.01" 
                      placeholder="ex: 20" 
                      value={lshapeData.width1 || ""} 
                      onChange={(e) => setLshapeData(prev => ({ ...prev, width1: parseInput(e.target.value) }))}
                      className="font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-sans">Comprimento (m)</Label>
                    <Input 
                      type="number"
                      step="0.01" 
                      placeholder="ex: 30" 
                      value={lshapeData.length1 || ""} 
                      onChange={(e) => setLshapeData(prev => ({ ...prev, length1: parseInput(e.target.value) }))}
                      className="font-sans"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h5 className="font-medium mb-3 text-sm font-sans">Extensao (Braco do L)</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-sans">Largura (m)</Label>
                    <Input 
                      type="number"
                      step="0.01" 
                      placeholder="ex: 10" 
                      value={lshapeData.width2 || ""} 
                      onChange={(e) => setLshapeData(prev => ({ ...prev, width2: parseInput(e.target.value) }))}
                      className="font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-sans">Comprimento (m)</Label>
                    <Input 
                      type="number"
                      step="0.01" 
                      placeholder="ex: 15" 
                      value={lshapeData.length2 || ""} 
                      onChange={(e) => setLshapeData(prev => ({ ...prev, length2: parseInput(e.target.value) }))}
                      className="font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedShape === "polygon" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-sans mb-2">
              Desenhe o seu terreno clicando no canvas abaixo. Cada clique adiciona um vertice. 
              As coordenadas estao em metros.
            </p>
            <PolygonCanvas 
              points={polygonPoints} 
              onPointsChange={setPolygonPoints}
              width={450}
              height={320}
            />
            {polygonResult && (
              <div className="space-y-2">
                {polygonResult.hasSelfIntersection && (
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-600 font-sans">
                      Aviso: O poligono tem lados que se cruzam. Ajuste os pontos para um calculo correcto.
                    </p>
                  </div>
                )}
                <div className="flex gap-4 text-xs text-muted-foreground font-sans">
                  <span>Vertices: {polygonPoints.length}</span>
                  <span>Tipo: {polygonResult.isConvex ? "Convexo" : "Concavo"}</span>
                  <span>Estado: {polygonResult.isValid ? "Valido" : "Invalido"}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400 font-sans">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="rounded-lg bg-[#F7A71C]/5 border border-[#F7A71C]/30 p-5">
          <h4 className="font-semibold mb-4 font-sans text-foreground flex items-center gap-2">
            <span className="text-[#F7A71C]">Resultados do Calculo</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background border-2 border-[#F7A71C]/50">
              <Label className="text-xs font-medium text-muted-foreground font-sans">Area Total</Label>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#F7A71C] font-serif">{formatNumber(result.area)}</span>
                <span className="text-sm font-semibold text-[#F7A71C] font-sans">m2</span>
              </div>
              <p className="text-xs text-[#F7A71C]/80 mt-2 font-sans">Calculado automaticamente</p>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border">
              <Label className="text-xs font-medium text-muted-foreground font-sans">Perimetro</Label>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-foreground font-serif">{formatNumber(result.perimeter)}</span>
                <span className="text-sm font-medium text-muted-foreground font-sans">m</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-sans">Soma de todos os lados</p>
            </div>
          </div>
          
          {/* Formula explanation */}
          <div className="mt-4 p-3 rounded-lg bg-background border border-border">
            <p className="text-xs text-muted-foreground font-sans">
              {selectedShape === "triangle" && "Formula de Heron: A = sqrt(s(s-a)(s-b)(s-c)), onde s = perimetro/2"}
              {selectedShape === "quadrilateral" && "Divisao em 2 triangulos usando a diagonal + Formula de Heron"}
              {selectedShape === "trapezoid" && "Formula: A = (base1 + base2) x altura / 2"}
              {selectedShape === "lshape" && "Soma das areas dos 2 rectangulos: A1 + A2"}
              {selectedShape === "polygon" && "Formula Shoelace: A = (1/2)|sum(xi*yi+1 - xi+1*yi)| - Precisa para poligonos convexos e concavos"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
