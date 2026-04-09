"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, RotateCcw, Plus } from "lucide-react"
import { 
  Point, 
  scalePointsToCanvas, 
  calculatePolygonAreaFromCoordinates,
  formatNumber 
} from "@/lib/geometry-utils"

interface PolygonCanvasProps {
  points: Point[]
  onPointsChange: (points: Point[]) => void
  width?: number
  height?: number
}

export function PolygonCanvas({ 
  points, 
  onPointsChange, 
  width = 400, 
  height = 300 
}: PolygonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  
  // Scale factor for converting canvas to real coordinates (1 unit = 1 meter)
  const SCALE = 5 // pixels per meter
  const PADDING = 30

  // Convert real coordinates to canvas coordinates
  const realToCanvas = useCallback((point: Point): Point => {
    const offsetX = PADDING
    const offsetY = PADDING
    return {
      x: point.x * SCALE + offsetX,
      y: point.y * SCALE + offsetY
    }
  }, [])

  // Convert canvas coordinates to real coordinates
  const canvasToReal = useCallback((canvasPoint: Point): Point => {
    return {
      x: Math.round((canvasPoint.x - PADDING) / SCALE * 10) / 10,
      y: Math.round((canvasPoint.y - PADDING) / SCALE * 10) / 10
    }
  }, [])

  // Draw the polygon
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#e5e5e5"
    ctx.lineWidth = 0.5
    const gridSize = SCALE * 5 // 5 meters per grid line
    
    for (let x = PADDING; x < width - PADDING; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, PADDING)
      ctx.lineTo(x, height - PADDING)
      ctx.stroke()
    }
    for (let y = PADDING; y < height - PADDING; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(PADDING, y)
      ctx.lineTo(width - PADDING, y)
      ctx.stroke()
    }

    // Draw axis labels
    ctx.fillStyle = "#888"
    ctx.font = "10px sans-serif"
    for (let i = 0; i <= Math.floor((width - PADDING * 2) / gridSize); i++) {
      ctx.fillText(`${i * 5}m`, PADDING + i * gridSize - 8, height - 10)
    }
    for (let i = 0; i <= Math.floor((height - PADDING * 2) / gridSize); i++) {
      ctx.fillText(`${i * 5}m`, 5, height - PADDING - i * gridSize + 4)
    }

    if (points.length === 0) {
      // Draw hint
      ctx.fillStyle = "#999"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Clique para adicionar pontos", width / 2, height / 2)
      ctx.textAlign = "start"
      return
    }

    const canvasPoints = points.map(realToCanvas)

    // Draw polygon fill
    if (canvasPoints.length >= 3) {
      ctx.beginPath()
      ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y)
      for (let i = 1; i < canvasPoints.length; i++) {
        ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y)
      }
      ctx.closePath()
      
      // Check validity for fill color
      const result = calculatePolygonAreaFromCoordinates(points)
      if (result?.hasSelfIntersection) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)" // Red for invalid
      } else {
        ctx.fillStyle = "rgba(247, 167, 28, 0.15)" // Orange for valid
      }
      ctx.fill()
    }

    // Draw edges
    ctx.strokeStyle = "#F7A71C"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y)
    for (let i = 1; i < canvasPoints.length; i++) {
      ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y)
    }
    if (canvasPoints.length >= 3) {
      ctx.closePath()
    }
    ctx.stroke()

    // Draw edge lengths
    ctx.fillStyle = "#666"
    ctx.font = "11px sans-serif"
    for (let i = 0; i < canvasPoints.length; i++) {
      const j = (i + 1) % canvasPoints.length
      if (j === 0 && canvasPoints.length < 3) continue
      
      const p1 = points[i]
      const p2 = points[j]
      const cp1 = canvasPoints[i]
      const cp2 = canvasPoints[j]
      
      const midX = (cp1.x + cp2.x) / 2
      const midY = (cp1.y + cp2.y) / 2
      const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      
      ctx.fillStyle = "#fff"
      ctx.fillRect(midX - 18, midY - 8, 36, 16)
      ctx.fillStyle = "#333"
      ctx.textAlign = "center"
      ctx.fillText(`${formatNumber(distance, 1)}m`, midX, midY + 4)
    }
    ctx.textAlign = "start"

    // Draw points
    canvasPoints.forEach((cp, i) => {
      ctx.beginPath()
      ctx.arc(cp.x, cp.y, hoverIndex === i ? 8 : 6, 0, Math.PI * 2)
      ctx.fillStyle = hoverIndex === i ? "#d99116" : "#F7A71C"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Point label
      ctx.fillStyle = "#303030"
      ctx.font = "bold 10px sans-serif"
      ctx.fillText(`P${i + 1}`, cp.x + 10, cp.y - 10)
    })

  }, [points, width, height, hoverIndex, realToCanvas])

  useEffect(() => {
    draw()
  }, [draw])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if clicking on existing point
    const canvasPoints = points.map(realToCanvas)
    for (let i = 0; i < canvasPoints.length; i++) {
      const cp = canvasPoints[i]
      const dist = Math.sqrt(Math.pow(x - cp.x, 2) + Math.pow(y - cp.y, 2))
      if (dist < 10) {
        return // Clicked on existing point, don't add new one
      }
    }
    
    // Add new point
    const realPoint = canvasToReal({ x, y })
    if (realPoint.x >= 0 && realPoint.y >= 0) {
      onPointsChange([...points, realPoint])
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if clicking on a point to drag
    const canvasPoints = points.map(realToCanvas)
    for (let i = 0; i < canvasPoints.length; i++) {
      const cp = canvasPoints[i]
      const dist = Math.sqrt(Math.pow(x - cp.x, 2) + Math.pow(y - cp.y, 2))
      if (dist < 10) {
        setIsDragging(true)
        setDragIndex(i)
        return
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (isDragging && dragIndex !== null) {
      const realPoint = canvasToReal({ x, y })
      if (realPoint.x >= 0 && realPoint.y >= 0) {
        const newPoints = [...points]
        newPoints[dragIndex] = realPoint
        onPointsChange(newPoints)
      }
    } else {
      // Check hover
      const canvasPoints = points.map(realToCanvas)
      let found = false
      for (let i = 0; i < canvasPoints.length; i++) {
        const cp = canvasPoints[i]
        const dist = Math.sqrt(Math.pow(x - cp.x, 2) + Math.pow(y - cp.y, 2))
        if (dist < 10) {
          setHoverIndex(i)
          found = true
          break
        }
      }
      if (!found) setHoverIndex(null)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragIndex(null)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setDragIndex(null)
    setHoverIndex(null)
  }

  const removeLastPoint = () => {
    if (points.length > 0) {
      onPointsChange(points.slice(0, -1))
    }
  }

  const clearPoints = () => {
    onPointsChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-sans">
          Clique para adicionar pontos, arraste para mover
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeLastPoint}
            disabled={points.length === 0}
            className="h-8"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Desfazer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearPoints}
            disabled={points.length === 0}
            className="h-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Limpar
          </Button>
        </div>
      </div>
      
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair"
          style={{ display: "block" }}
        />
      </div>
      
      {points.length > 0 && (
        <div className="text-xs text-muted-foreground font-mono">
          Coordenadas: {points.map((p, i) => `P${i + 1}(${p.x}, ${p.y})`).join(" → ")}
        </div>
      )}
    </div>
  )
}
