// Geometry calculation utilities for terrain area and perimeter

export type TerrainShape = "triangle" | "quadrilateral" | "lshape" | "trapezoid" | "polygon" | "coordinates"

// Point interface for coordinate-based calculations
export interface Point {
  x: number
  y: number
}

export interface TriangleData {
  sideA: number
  sideB: number
  sideC: number
}

export interface QuadrilateralData {
  sideA: number
  sideB: number
  sideC: number
  sideD: number
  diagonal: number // One diagonal to split into two triangles
}

export interface LShapeData {
  // Main rectangle
  width1: number
  length1: number
  // Extension rectangle
  width2: number
  length2: number
}

export interface TrapezoidData {
  baseTop: number
  baseBottom: number
  height: number
  sideLeft: number
  sideRight: number
}

export interface PolygonData {
  sides: number[]
}

export interface CoordinatePolygonData {
  points: Point[]
}

// Heron's Formula for triangle area
export function calculateTriangleArea(data: TriangleData): { area: number; perimeter: number } | null {
  const { sideA, sideB, sideC } = data
  
  // Validate triangle inequality
  if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
    return null // Not a valid triangle
  }
  
  const perimeter = sideA + sideB + sideC
  const s = perimeter / 2 // Semi-perimeter
  
  // Heron's formula: A = sqrt(s(s-a)(s-b)(s-c))
  const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC))
  
  return { area, perimeter }
}

// Quadrilateral area using two triangles (requires one diagonal)
export function calculateQuadrilateralArea(data: QuadrilateralData): { area: number; perimeter: number } | null {
  const { sideA, sideB, sideC, sideD, diagonal } = data
  
  // Split into two triangles using the diagonal
  // Triangle 1: sideA, sideB, diagonal
  // Triangle 2: sideC, sideD, diagonal
  
  const triangle1 = calculateTriangleArea({ sideA, sideB, sideC: diagonal })
  const triangle2 = calculateTriangleArea({ sideA: sideC, sideB: sideD, sideC: diagonal })
  
  if (!triangle1 || !triangle2) {
    return null
  }
  
  const area = triangle1.area + triangle2.area
  const perimeter = sideA + sideB + sideC + sideD
  
  return { area, perimeter }
}

// L-Shape area (two rectangles combined)
export function calculateLShapeArea(data: LShapeData): { area: number; perimeter: number } | null {
  const { width1, length1, width2, length2 } = data
  
  if (width1 <= 0 || length1 <= 0 || width2 <= 0 || length2 <= 0) {
    return null
  }
  
  // Area = sum of two rectangles
  const area = (width1 * length1) + (width2 * length2)
  
  // Perimeter calculation depends on how rectangles connect
  // Assuming L-shape where width2 connects to length1
  const perimeter = 2 * length1 + 2 * width1 + 2 * length2 + 2 * width2 - 2 * Math.min(width2, length1)
  
  return { area, perimeter }
}

// Trapezoid area
export function calculateTrapezoidArea(data: TrapezoidData): { area: number; perimeter: number } | null {
  const { baseTop, baseBottom, height, sideLeft, sideRight } = data
  
  if (baseTop <= 0 || baseBottom <= 0 || height <= 0) {
    return null
  }
  
  // Area = (1/2) * (base1 + base2) * height
  const area = 0.5 * (baseTop + baseBottom) * height
  const perimeter = baseTop + baseBottom + sideLeft + sideRight
  
  return { area, perimeter }
}

// Polygon area using Shoelace formula (requires coordinates)
// This is a simplified version using just sides - estimates based on regular polygon
export function calculatePolygonPerimeter(data: PolygonData): { perimeter: number; sidesCount: number } | null {
  const { sides } = data
  
  if (sides.length < 3) {
    return null
  }
  
  const perimeter = sides.reduce((sum, side) => sum + side, 0)
  
  return { perimeter, sidesCount: sides.length }
}

// Rectangle area (simple case)
export function calculateRectangleArea(width: number, length: number): { area: number; perimeter: number } | null {
  if (width <= 0 || length <= 0) {
    return null
  }
  
  return {
    area: width * length,
    perimeter: 2 * (width + length)
  }
}

// Parse dimension string and extract numbers
export function parseDimensions(input: string): number[] {
  const cleanedInput = input
    .replace(/m/gi, '')
    .replace(/metros?/gi, '')
    .trim()
  
  const numbers = cleanedInput
    .split(/[,;x×X\s]+/)
    .map(s => parseFloat(s.trim().replace(',', '.')))
    .filter(n => !isNaN(n) && n > 0)
  
  return numbers
}

// Format number for display
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals)
}

// ============================================
// ADVANCED POLYGON CALCULATIONS (Shoelace Formula)
// ============================================

// Calculate distance between two points
export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// Shoelace formula for polygon area (works for convex and concave polygons)
// Points must be ordered (clockwise or counter-clockwise)
export function calculatePolygonAreaFromCoordinates(points: Point[]): { 
  area: number
  perimeter: number
  isValid: boolean
  isConvex: boolean
  hasSelfIntersection: boolean
} | null {
  if (points.length < 3) {
    return null
  }
  
  // Check for self-intersection
  const hasSelfIntersection = checkSelfIntersection(points)
  
  // Calculate area using Shoelace formula
  // A = (1/2) * |sum of (x_i * y_{i+1} - x_{i+1} * y_i)|
  let sum = 0
  const n = points.length
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    sum += points[i].x * points[j].y
    sum -= points[j].x * points[i].y
  }
  
  const area = Math.abs(sum) / 2
  
  // Calculate perimeter
  let perimeter = 0
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    perimeter += calculateDistance(points[i], points[j])
  }
  
  // Check if polygon is convex
  const isConvex = checkConvexity(points)
  
  return {
    area,
    perimeter,
    isValid: !hasSelfIntersection && area > 0,
    isConvex,
    hasSelfIntersection
  }
}

// Check if polygon is convex
function checkConvexity(points: Point[]): boolean {
  const n = points.length
  if (n < 3) return false
  
  let sign = 0
  
  for (let i = 0; i < n; i++) {
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
    
    // Cross product
    const cross = (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x)
    
    if (cross !== 0) {
      if (sign === 0) {
        sign = cross > 0 ? 1 : -1
      } else if ((cross > 0 ? 1 : -1) !== sign) {
        return false // Concave
      }
    }
  }
  
  return true
}

// Check if two line segments intersect
function segmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  const ccw = (A: Point, B: Point, C: Point): boolean => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x)
  }
  
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
}

// Check if polygon has self-intersection
function checkSelfIntersection(points: Point[]): boolean {
  const n = points.length
  
  for (let i = 0; i < n; i++) {
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    
    for (let j = i + 2; j < n; j++) {
      // Skip adjacent edges
      if (j === (i + n - 1) % n) continue
      
      const p3 = points[j]
      const p4 = points[(j + 1) % n]
      
      if (segmentsIntersect(p1, p2, p3, p4)) {
        return true
      }
    }
  }
  
  return false
}

// Get centroid of polygon
export function getPolygonCentroid(points: Point[]): Point {
  let cx = 0, cy = 0
  const n = points.length
  
  for (const point of points) {
    cx += point.x
    cy += point.y
  }
  
  return { x: cx / n, y: cy / n }
}

// Scale points to fit within a given canvas size
export function scalePointsToCanvas(
  points: Point[], 
  canvasWidth: number, 
  canvasHeight: number, 
  padding: number = 20
): Point[] {
  if (points.length === 0) return []
  
  // Find bounds
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  
  for (const p of points) {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
  }
  
  const dataWidth = maxX - minX || 1
  const dataHeight = maxY - minY || 1
  
  const availableWidth = canvasWidth - padding * 2
  const availableHeight = canvasHeight - padding * 2
  
  const scale = Math.min(availableWidth / dataWidth, availableHeight / dataHeight)
  
  // Center offset
  const offsetX = padding + (availableWidth - dataWidth * scale) / 2
  const offsetY = padding + (availableHeight - dataHeight * scale) / 2
  
  return points.map(p => ({
    x: (p.x - minX) * scale + offsetX,
    y: (p.y - minY) * scale + offsetY
  }))
}

// Convert canvas coordinates back to real coordinates
export function canvasToRealCoordinates(
  canvasPoint: Point,
  realPoints: Point[],
  canvasPoints: Point[],
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 20
): Point {
  if (realPoints.length === 0) {
    // No existing points, use direct mapping
    return {
      x: canvasPoint.x,
      y: canvasPoint.y
    }
  }
  
  // Find real bounds
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  
  for (const p of realPoints) {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
  }
  
  const dataWidth = maxX - minX || 100
  const dataHeight = maxY - minY || 100
  
  const availableWidth = canvasWidth - padding * 2
  const availableHeight = canvasHeight - padding * 2
  
  const scale = Math.min(availableWidth / dataWidth, availableHeight / dataHeight)
  
  const offsetX = padding + (availableWidth - dataWidth * scale) / 2
  const offsetY = padding + (availableHeight - dataHeight * scale) / 2
  
  return {
    x: (canvasPoint.x - offsetX) / scale + minX,
    y: (canvasPoint.y - offsetY) / scale + minY
  }
}
