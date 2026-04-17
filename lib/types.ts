# Sistema de Tipos para Admin Panel

export interface User {
  id: string
  email: string
  password: string // hashed
  name: string
  role: "admin" | "user"
  company?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: "free" | "professional" | "enterprise"
  status: "active" | "inactive" | "cancelled"
  projectsLimit: number
  projectsUsed: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  userId: string
  projectName: string // Ex: PROJEC. CASA T3 NATALINO MANUEL - CAMAMA - 09042026
  projectType: string
  projectSubType?: string
  location: string
  area: number
  perimeter: number
  terrainShape: string
  clientName: string
  clientEmail: string
  clientPhone: string
  architecturalStyle: string
  floors: number
  bedrooms: number
  bathrooms: number
  parking: number
  terrain: {
    dimensions?: string
    coordinates?: string
    irregularData?: Record<string, any>
  }
  generatedContent: string
  pdfUrl?: string
  imageUrl?: string
  status: "draft" | "generated" | "approved" | "archived"
  createdAt: Date
  updatedAt: Date
}

export interface ProjectLog {
  id: string
  userId: string
  projectId: string
  action: "created" | "updated" | "generated" | "downloaded" | "shared"
  details: string
  timestamp: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}
