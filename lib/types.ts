// Sistema de Tipos para Admin Panel

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

export interface SubscriptionPlan {
  id: string
  name: string // "Free", "Professional", "Enterprise"
  description: string
  price: number // in cents (e.g., 9900 = 99.00)
  currency: "AOA" | "USD" | "EUR"
  billingPeriod: "monthly" | "yearly"
  projectsLimit: number
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethod {
  id: string
  name: string // "Stripe Card", "Bank Transfer", "Paypal"
  type: "stripe" | "bank_transfer" | "paypal" | "cash"
  isActive: boolean
  config: Record<string, any> // Stripe key, bank details, etc
  createdAt: Date
  updatedAt: Date
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: "active" | "inactive" | "cancelled" | "expired"
  startDate: Date
  expiresAt: Date
  paymentMethodId?: string
  autoRenew: boolean
  projectsUsed: number
  createdAt: Date
  updatedAt: Date
}

export interface PaymentTransaction {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  currency: "AOA" | "USD" | "EUR"
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethodId: string
  stripePaymentId?: string
  invoiceUrl?: string
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

export interface TelegramConfig {
  id: string
  botToken: string
  chatId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}
