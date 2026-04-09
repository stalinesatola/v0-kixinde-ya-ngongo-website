// Geometry calculation utilities for terrain area and perimeter

export type TerrainShape = "triangle" | "quadrilateral" | "lshape" | "trapezoid" | "polygon"

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
