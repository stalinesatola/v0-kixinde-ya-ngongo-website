import { User, Project, Subscription, ProjectLog, Session, SubscriptionPlan, PaymentMethod, UserSubscription, PaymentTransaction, TelegramConfig } from "./types"
import crypto from "crypto"

// In-memory database for MVP
class Database {
  private users: Map<string, User> = new Map()
  private projects: Map<string, Project> = new Map()
  private subscriptions: Map<string, Subscription> = new Map()
  private subscriptionPlans: Map<string, SubscriptionPlan> = new Map()
  private paymentMethods: Map<string, PaymentMethod> = new Map()
  private userSubscriptions: Map<string, UserSubscription> = new Map()
  private paymentTransactions: Map<string, PaymentTransaction> = new Map()
  private telegramConfig: Map<string, TelegramConfig> = new Map()
  private logs: ProjectLog[] = []
  private sessions: Map<string, Session> = new Map()

  // Initialize with demo data
  constructor() {
    this.initializeDemoData()
  }

  private initializeDemoData() {
    // Create demo admin user
    const adminUser: User = {
      id: "admin-001",
      email: "admin@kixindeyangongo.ao",
      password: this.hashPassword("demo123"), // In production, use proper hashing
      name: "Admin KIXINDE",
      role: "admin",
      company: "KIXINDE YA NGONGO",
      phone: "+244 926 899 866",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(adminUser.id, adminUser)

    // Create demo subscription plans
    const freePlan: SubscriptionPlan = {
      id: "plan-free",
      name: "Free",
      description: "Para experimentar",
      price: 0,
      currency: "AOA",
      billingPeriod: "monthly",
      projectsLimit: 3,
      features: ["3 projectos por mês", "Suporte por email"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptionPlans.set(freePlan.id, freePlan)

    const professionalPlan: SubscriptionPlan = {
      id: "plan-pro",
      name: "Professional",
      description: "Para profissionais",
      price: 9900, // 99.00
      currency: "AOA",
      billingPeriod: "monthly",
      projectsLimit: 50,
      features: ["50 projectos por mês", "Suporte prioritário", "Exportar PDF"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptionPlans.set(professionalPlan.id, professionalPlan)

    const enterprisePlan: SubscriptionPlan = {
      id: "plan-enterprise",
      name: "Enterprise",
      description: "Para empresas",
      price: 29900, // 299.00
      currency: "AOA",
      billingPeriod: "monthly",
      projectsLimit: 999,
      features: ["Projectos ilimitados", "Suporte 24/7", "API access", "Custom branding"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptionPlans.set(enterprisePlan.id, enterprisePlan)

    // Create admin subscription
    const adminSubscription: UserSubscription = {
      id: "user-sub-001",
      userId: "admin-001",
      planId: "plan-enterprise",
      status: "active",
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      autoRenew: true,
      projectsUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.userSubscriptions.set(adminSubscription.id, adminSubscription)

    // Create demo subscription for backward compatibility
    const adminSubscription2: Subscription = {
      id: "sub-001",
      userId: "admin-001",
      plan: "enterprise",
      status: "active",
      projectsLimit: 999,
      projectsUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptions.set(adminSubscription2.id, adminSubscription2)
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const id = `user-${Date.now()}`
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(id, newUser)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null
    const updated = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updated)
    return updated
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }

  // Projects
  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const id = `proj-${Date.now()}`
    const newProject: Project = {
      ...project,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.projects.set(id, newProject)

    // Log creation
    this.logs.push({
      id: `log-${Date.now()}`,
      userId: project.userId,
      projectId: id,
      action: "created",
      details: `Projecto criado: ${project.projectName}`,
      timestamp: new Date(),
    })

    return newProject
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter((p) => p.userId === userId)
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const project = this.projects.get(id)
    if (!project) return null
    const updated = { ...project, ...updates, updatedAt: new Date() }
    this.projects.set(id, updated)
    return updated
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id)
  }

  // Subscriptions
  async getSubscription(userId: string): Promise<Subscription | null> {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId) return sub
    }
    return null
  }

  async createSubscription(subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">): Promise<Subscription> {
    const id = `sub-${Date.now()}`
    const newSubscription: Subscription = {
      ...subscription,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptions.set(id, newSubscription)
    return newSubscription
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values())
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlans.get(id) || null
  }

  async createSubscriptionPlan(plan: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan> {
    const id = `plan-${Date.now()}`
    const newPlan: SubscriptionPlan = {
      ...plan,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptionPlans.set(id, newPlan)
    return newPlan
  }

  async updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const plan = this.subscriptionPlans.get(id)
    if (!plan) return null
    const updated = { ...plan, ...updates, updatedAt: new Date() }
    this.subscriptionPlans.set(id, updated)
    return updated
  }

  // User Subscriptions
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    for (const sub of this.userSubscriptions.values()) {
      if (sub.userId === userId && sub.status === "active") {
        if (new Date() > sub.expiresAt) {
          sub.status = "expired"
          continue
        }
        return sub
      }
    }
    return null
  }

  async createUserSubscription(subscription: Omit<UserSubscription, "id" | "createdAt" | "updatedAt">): Promise<UserSubscription> {
    const id = `usub-${Date.now()}`
    const newSubscription: UserSubscription = {
      ...subscription,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.userSubscriptions.set(id, newSubscription)
    return newSubscription
  }

  async updateUserSubscription(id: string, updates: Partial<UserSubscription>): Promise<UserSubscription | null> {
    const sub = this.userSubscriptions.get(id)
    if (!sub) return null
    const updated = { ...sub, ...updates, updatedAt: new Date() }
    this.userSubscriptions.set(id, updated)
    return updated
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values()).filter(m => m.isActive)
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod | null> {
    return this.paymentMethods.get(id) || null
  }

  async createPaymentMethod(method: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">): Promise<PaymentMethod> {
    const id = `pm-${Date.now()}`
    const newMethod: PaymentMethod = {
      ...method,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.paymentMethods.set(id, newMethod)
    return newMethod
  }

  // Payment Transactions
  async createPaymentTransaction(transaction: Omit<PaymentTransaction, "id" | "createdAt" | "updatedAt">): Promise<PaymentTransaction> {
    const id = `trans-${Date.now()}`
    const newTransaction: PaymentTransaction = {
      ...transaction,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.paymentTransactions.set(id, newTransaction)
    return newTransaction
  }

  async getPaymentTransactions(userId: string): Promise<PaymentTransaction[]> {
    return Array.from(this.paymentTransactions.values()).filter(t => t.userId === userId)
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    const trans = this.paymentTransactions.get(id)
    if (!trans) return null
    const updated = { ...trans, ...updates, updatedAt: new Date() }
    this.paymentTransactions.set(id, updated)
    return updated
  }

  // Telegram Config - Now using Supabase
  async getTelegramConfig(): Promise<TelegramConfig | null> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("telegram_config")
        .select("*")
        .eq("isActive", true)
        .single()

      if (error) {
        console.log("[v0] Nenhuma config Telegram ativa encontrada")
        return null
      }

      console.log("[v0] Config Telegram recuperada do Supabase")
      return data as TelegramConfig
    } catch (error) {
      console.error("[v0] Erro ao obter config Telegram:", error)
      return null
    }
  }

  async createTelegramConfig(config: Omit<TelegramConfig, "id" | "createdAt" | "updatedAt">): Promise<TelegramConfig> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("telegram_config")
        .insert([{
          botToken: config.botToken,
          chatId: config.chatId,
          isActive: config.isActive !== false,
        }])
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro ao criar config Telegram:", error)
        throw error
      }

      console.log("[v0] Config Telegram criada no Supabase")
      return data as TelegramConfig
    } catch (error) {
      console.error("[v0] Exceção ao criar config:", error)
      throw error
    }
  }

  async updateTelegramConfig(id: string, updates: Partial<TelegramConfig>): Promise<TelegramConfig | null> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const updateData: Record<string, any> = {}
      if (updates.botToken) updateData.botToken = updates.botToken
      if (updates.chatId) updateData.chatId = updates.chatId
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive

      const { data, error } = await supabase
        .from("telegram_config")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro ao atualizar config Telegram:", error)
        return null
      }

      console.log("[v0] Config Telegram atualizada no Supabase")
      return data as TelegramConfig
    } catch (error) {
      console.error("[v0] Exceção ao atualizar config:", error)
      return null
    }
  }

  // Logs
  async getLogs(userId?: string): Promise<ProjectLog[]> {
    if (userId) {
      return this.logs.filter((log) => log.userId === userId)
    }
    return this.logs
  }

  async addLog(log: Omit<ProjectLog, "id" | "timestamp">): Promise<ProjectLog> {
    const newLog: ProjectLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date(),
    }
    this.logs.push(newLog)
    return newLog
  }

  // Sessions
  async createSession(userId: string): Promise<Session> {
    const id = `sess-${Date.now()}`
    const token = crypto.randomBytes(32).toString("hex")
    const session: Session = {
      id,
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    }
    this.sessions.set(token, session)
    return session
  }

  async getSession(token: string): Promise<Session | null> {
    const session = this.sessions.get(token)
    if (!session) return null
    if (new Date() > session.expiresAt) {
      this.sessions.delete(token)
      return null
    }
    return session
  }

  async deleteSession(token: string): Promise<boolean> {
    return this.sessions.delete(token)
  }

  // Utility
  private hashPassword(password: string): string {
    // In production, use bcrypt
    return crypto.createHash("sha256").update(password).digest("hex")
  }

  comparePassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash
  }
}

// Export singleton instance
export const db = new Database()
