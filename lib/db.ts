import { User, Project, Subscription, ProjectLog, Session, SubscriptionPlan, PaymentMethod, UserSubscription, PaymentTransaction, TelegramConfig } from "./types"
import crypto from "crypto"

// Force reparse - Supabase Database Layer
class Database {
  private getSupabase() {
    const { createClient } = require("@supabase/supabase-js")
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    )
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single()

      if (error) return null
      return data as User
    } catch (error) {
      console.error("[v0] Erro ao obter utilizador:", error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      if (error) return null
      return data as User
    } catch (error) {
      console.error("[v0] Erro ao obter utilizador por email:", error)
      return null
    }
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      const supabase = this.getSupabase()
      const id = `user-${Date.now()}`
      
      const { data, error } = await supabase
        .from("users")
        .insert([{
          id,
          ...user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error("[v0] Erro ao criar utilizador:", error)
      throw error
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) return null
      return data as User
    } catch (error) {
      console.error("[v0] Erro ao atualizar utilizador:", error)
      return null
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase.from("users").select("*")

      if (error) return []
      return data as User[]
    } catch (error) {
      console.error("[v0] Erro ao obter utilizadores:", error)
      return []
    }
  }

  // Projects
  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    try {
      const supabase = this.getSupabase()
      const id = `proj-${Date.now()}`

      const { data, error } = await supabase
        .from("projects")
        .insert([{
          id,
          ...project,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      // Log creation
      await this.addLog({
        userId: project.userId,
        projectId: id,
        action: "created",
        details: `Projecto criado: ${project.projectName}`,
      })

      return data as Project
    } catch (error) {
      console.error("[v0] Erro ao criar projecto:", error)
      throw error
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

      if (error) return null
      return data as Project
    } catch (error) {
      console.error("[v0] Erro ao obter projecto:", error)
      return null
    }
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("userId", userId)

      if (error) return []
      return data as Project[]
    } catch (error) {
      console.error("[v0] Erro ao obter projectos do utilizador:", error)
      return []
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("projects")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) return null
      return data as Project
    } catch (error) {
      console.error("[v0] Erro ao atualizar projecto:", error)
      return null
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const supabase = this.getSupabase()
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) return false
      return true
    } catch (error) {
      console.error("[v0] Erro ao eliminar projecto:", error)
      return false
    }
  }

  // Subscriptions
  async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("userId", userId)
        .single()

      if (error) return null
      return data as Subscription
    } catch (error) {
      console.error("[v0] Erro ao obter subscrição:", error)
      return null
    }
  }

  async createSubscription(subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">): Promise<Subscription> {
    try {
      const supabase = this.getSupabase()
      const id = `sub-${Date.now()}`

      const { data, error } = await supabase
        .from("subscriptions")
        .insert([{
          id,
          ...subscription,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as Subscription
    } catch (error) {
      console.error("[v0] Erro ao criar subscrição:", error)
      throw error
    }
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("isActive", true)

      if (error) return []
      return data as SubscriptionPlan[]
    } catch (error) {
      console.error("[v0] Erro ao obter planos:", error)
      return []
    }
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", id)
        .single()

      if (error) return null
      return data as SubscriptionPlan
    } catch (error) {
      console.error("[v0] Erro ao obter plano:", error)
      return null
    }
  }

  async createSubscriptionPlan(plan: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan> {
    try {
      const supabase = this.getSupabase()
      const id = `plan-${Date.now()}`

      const { data, error } = await supabase
        .from("subscription_plans")
        .insert([{
          id,
          ...plan,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as SubscriptionPlan
    } catch (error) {
      console.error("[v0] Erro ao criar plano:", error)
      throw error
    }
  }

  async updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("subscription_plans")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) return null
      return data as SubscriptionPlan
    } catch (error) {
      console.error("[v0] Erro ao atualizar plano:", error)
      return null
    }
  }

  // User Subscriptions
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("userId", userId)
        .eq("status", "active")
        .single()

      if (error) return null

      // Verificar se não expirou
      if (new Date() > new Date(data.expiresAt)) {
        await this.updateUserSubscription(data.id, { status: "expired" })
        return null
      }

      return data as UserSubscription
    } catch (error) {
      console.error("[v0] Erro ao obter subscrição do utilizador:", error)
      return null
    }
  }

  async createUserSubscription(subscription: Omit<UserSubscription, "id" | "createdAt" | "updatedAt">): Promise<UserSubscription> {
    try {
      const supabase = this.getSupabase()
      const id = `usub-${Date.now()}`

      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert([{
          id,
          ...subscription,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as UserSubscription
    } catch (error) {
      console.error("[v0] Erro ao criar subscrição do utilizador:", error)
      throw error
    }
  }

  async updateUserSubscription(id: string, updates: Partial<UserSubscription>): Promise<UserSubscription | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) return null
      return data as UserSubscription
    } catch (error) {
      console.error("[v0] Erro ao atualizar subscrição do utilizador:", error)
      return null
    }
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("isActive", true)

      if (error) return []
      return data as PaymentMethod[]
    } catch (error) {
      console.error("[v0] Erro ao obter métodos de pagamento:", error)
      return []
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("id", id)
        .single()

      if (error) return null
      return data as PaymentMethod
    } catch (error) {
      console.error("[v0] Erro ao obter método de pagamento:", error)
      return null
    }
  }

  async createPaymentMethod(method: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">): Promise<PaymentMethod> {
    try {
      const supabase = this.getSupabase()
      const id = `pm-${Date.now()}`

      const { data, error } = await supabase
        .from("payment_methods")
        .insert([{
          id,
          ...method,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as PaymentMethod
    } catch (error) {
      console.error("[v0] Erro ao criar método de pagamento:", error)
      throw error
    }
  }

  // Payment Transactions
  async createPaymentTransaction(transaction: Omit<PaymentTransaction, "id" | "createdAt" | "updatedAt">): Promise<PaymentTransaction> {
    try {
      const supabase = this.getSupabase()
      const id = `trans-${Date.now()}`

      const { data, error } = await supabase
        .from("payment_transactions")
        .insert([{
          id,
          ...transaction,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as PaymentTransaction
    } catch (error) {
      console.error("[v0] Erro ao criar transação de pagamento:", error)
      throw error
    }
  }

  async getPaymentTransactions(userId: string): Promise<PaymentTransaction[]> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("userId", userId)

      if (error) return []
      return data as PaymentTransaction[]
    } catch (error) {
      console.error("[v0] Erro ao obter transações de pagamento:", error)
      return []
    }
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("payment_transactions")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) return null
      return data as PaymentTransaction
    } catch (error) {
      console.error("[v0] Erro ao atualizar transação de pagamento:", error)
      return null
    }
  }

  // Telegram Config
  async getTelegramConfig(): Promise<TelegramConfig | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("telegram_config")
        .select("*")
        .eq("isActive", true)
        .single()

      if (error) {
        console.log("[v0] Nenhuma config Telegram ativa encontrada")
        return null
      }

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
      const id = `tg-${Date.now()}`

      const { data, error } = await supabase
        .from("telegram_config")
        .insert([{
          id,
          ...config,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro Supabase ao criar config Telegram:", error.message)
        throw error
      }
      return data as TelegramConfig
    } catch (error) {
      console.error("[v0] Exceção ao criar config Telegram:", error instanceof Error ? error.message : String(error))
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
      const { data, error } = await supabase
        .from("telegram_config")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro Supabase ao atualizar config Telegram:", error.message)
        throw error
      }
      return data as TelegramConfig
    } catch (error) {
      console.error("[v0] Exceção ao atualizar config Telegram:", error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  // Logs
  async getLogs(userId?: string): Promise<ProjectLog[]> {
    try {
      const supabase = this.getSupabase()
      let query = supabase.from("project_logs").select("*")

      if (userId) {
        query = query.eq("userId", userId)
      }

      const { data, error } = await query

      if (error) return []
      return data as ProjectLog[]
    } catch (error) {
      console.error("[v0] Erro ao obter logs:", error)
      return []
    }
  }

  async addLog(log: Omit<ProjectLog, "id" | "timestamp">): Promise<ProjectLog> {
    try {
      const supabase = this.getSupabase()
      const id = `log-${Date.now()}`

      const { data, error } = await supabase
        .from("project_logs")
        .insert([{
          id,
          ...log,
          timestamp: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as ProjectLog
    } catch (error) {
      console.error("[v0] Erro ao adicionar log:", error)
      throw error
    }
  }

  // Sessions
  async createSession(userId: string): Promise<Session> {
    try {
      const supabase = this.getSupabase()
      const id = `sess-${Date.now()}`
      const token = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from("sessions")
        .insert([{
          id,
          userId,
          token,
          expiresAt: expiresAt.toISOString(),
          createdAt: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error
      return data as Session
    } catch (error) {
      console.error("[v0] Erro ao criar sessão:", error)
      throw error
    }
  }

  async getSession(token: string): Promise<Session | null> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("token", token)
        .single()

      if (error) return null

      // Verificar se não expirou
      if (new Date() > new Date(data.expiresAt)) {
        await supabase.from("sessions").delete().eq("token", token)
        return null
      }

      return data as Session
    } catch (error) {
      console.error("[v0] Erro ao obter sessão:", error)
      return null
    }
  }

  async deleteSession(token: string): Promise<boolean> {
    try {
      const supabase = this.getSupabase()
      const { error } = await supabase.from("sessions").delete().eq("token", token)

      if (error) return false
      return true
    } catch (error) {
      console.error("[v0] Erro ao eliminar sessão:", error)
      return false
    }
  }

  // Utility
  hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex")
  }

  comparePassword(password: string, hash: string): boolean {
    // Always hash the input password and compare with stored hash
    const hashed = this.hashPassword(password)
    const isValid = hashed === hash
    console.log("[v0] comparePassword - comparing:", isValid, `"${hashed}" vs "${hash}"`)
    return isValid
  }

  // AI Config - Using Supabase
  async getAIConfig(): Promise<any | null> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("ai_config")
        .select("*")
        .eq("is_active", true)
        .single()

      if (error) {
        console.log("[v0] Nenhuma config IA ativa encontrada")
        return null
      }

      console.log("[v0] Config IA recuperada do Supabase")
      return data
    } catch (error) {
      console.error("[v0] Erro ao obter config IA:", error)
      return null
    }
  }

  async createAIConfig(config: any): Promise<any> {
    try {
      console.log("[v0] createAIConfig iniciando com config:", JSON.stringify(config))
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("ai_config")
        .insert([config])
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro Supabase ao criar config IA:", error.message, error.code)
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (!data) {
        console.error("[v0] Nenhum dado retornado após inserir")
        throw new Error("No data returned from insert")
      }

      console.log("[v0] Config IA criada no Supabase com ID:", data.id)
      return data
    } catch (error) {
      console.error("[v0] Exceção ao criar config IA:", error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  async updateAIConfig(id: string, updates: any): Promise<any | null> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("ai_config")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro ao atualizar config IA:", error)
        return null
      }

      console.log("[v0] Config IA atualizada no Supabase")
      return data
    } catch (error) {
      console.log("[v0] Exceção ao atualizar config IA:", error)
      return null
    }
  }

  // AI Conversations
  async createConversation(userId: string, data: any): Promise<any> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data: conv, error } = await supabase
        .from("ai_conversations")
        .insert([{
          user_id: userId,
          title: data.title || 'New Conversation',
          is_archived: false,
        }])
        .select()
        .single()

      if (error) throw error
      console.log("[v0] Conversa criada:", conv.id)
      return conv
    } catch (error) {
      console.error("[v0] Erro ao criar conversa:", error)
      throw error
    }
  }

  async getConversations(userId: string): Promise<any[]> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[v0] Erro ao obter conversas:", error)
      return []
    }
  }

  // AI Messages
  async createMessage(data: any): Promise<any> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data: msg, error } = await supabase
        .from("ai_messages")
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return msg
    } catch (error) {
      console.error("[v0] Erro ao criar mensagem:", error)
      throw error
    }
  }

  async getMessages(conversationId: string): Promise<any[]> {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      )

      const { data, error } = await supabase
        .from("ai_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[v0] Erro ao obter mensagens:", error)
      return []
    }
  }
}

// Export singleton instance
export const db = new Database()
