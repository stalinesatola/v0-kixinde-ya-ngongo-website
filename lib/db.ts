import { User, Project, Subscription, ProjectLog, Session, SubscriptionPlan, PaymentMethod, UserSubscription, PaymentTransaction, TelegramConfig } from "./types"
import crypto from "crypto"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { promisify } from "util"

// Singleton Supabase client — criado uma vez, reutilizado em todas as chamadas
let _supabaseInstance: SupabaseClient | null = null
function getSupabaseClient(): SupabaseClient {
  if (!_supabaseInstance) {
    _supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    )
  }
  return _supabaseInstance
}

const scryptAsync = promisify(crypto.scrypt)

// Supabase Database Layer
class Database {
  private getSupabase(): SupabaseClient {
    return getSupabaseClient()
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
      return null
    }
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()
      
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
      return []
    }
  }

  // Projects
  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

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
      
      return null
    }
  }

  async createSubscription(subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">): Promise<Subscription> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

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
      
      return null
    }
  }

  async createSubscriptionPlan(plan: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

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
      
      return null
    }
  }

  async createUserSubscription(subscription: Omit<UserSubscription, "id" | "createdAt" | "updatedAt">): Promise<UserSubscription> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

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
      
      return null
    }
  }

  async createPaymentMethod(method: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">): Promise<PaymentMethod> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

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
      const id = crypto.randomUUID()

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
      // Get the most recent config, regardless of isActive status
      // This allows testing even if the config is temporarily disabled
      const { data, error } = await supabase
        .from("telegram_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        return null
      }

      // Convert snake_case DB columns to camelCase for app use
      const config: TelegramConfig = {
        id: data.id,
        botToken: data.bot_token,
        chatId: data.chat_id,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
      return config
    } catch (error) {
      return null
    }
  }

  async createTelegramConfig(config: Omit<TelegramConfig, "id" | "createdAt" | "updatedAt">): Promise<TelegramConfig> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

      const { data, error } = await supabase
        .from("telegram_config")
        .insert([{
          id,
          bot_token: config.botToken,
          chat_id: config.chatId,
          is_active: config.isActive ?? true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) {
   criar config Telegram:", error.message)
        throw error
      }
      
      // Convert snake_case to camelCase
      return {
        id: data.id,
        botToken: data.bot_token,
        chatId: data.chat_id,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
 criar config Telegram:", error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  async updateTelegramConfig(id: string, updates: Partial<TelegramConfig>): Promise<TelegramConfig | null> {
    try {
      const supabase = this.getSupabase()
      
      // Convert camelCase to snake_case for DB
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }
      if (updates.botToken !== undefined) dbUpdates.bot_token = updates.botToken
      if (updates.chatId !== undefined) dbUpdates.chat_id = updates.chatId
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
      
      const { data, error } = await supabase
        .from("telegram_config")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single()

      if (error) {
   atualizar config Telegram:", error.message)
        throw error
      }
      
      // Convert snake_case to camelCase
      return {
        id: data.id,
        botToken: data.bot_token,
        chatId: data.chat_id,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
 atualizar config Telegram:", error instanceof Error ? error.message : String(error))
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
      
      return []
    }
  }

  async addLog(log: Omit<ProjectLog, "id" | "timestamp">): Promise<ProjectLog> {
    try {
      const supabase = this.getSupabase()
      const id = crypto.randomUUID()

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
      const id = crypto.randomUUID()
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

  // Utility — hashing seguro com scrypt (Node.js nativo)
  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex")
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer
    return `${salt}:${derivedKey.toString("hex")}`
  }

  async comparePassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const [salt, hash] = storedHash.split(":")
      if (!salt || !hash) return false
      const derivedKey = await scryptAsync(password, salt, 64) as Buffer
      const candidateHash = derivedKey.toString("hex")
      // Comparação em tempo constante para evitar timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(candidateHash, "hex")
      )
    } catch {
      return false
    }
  }

  // AI Config - Using Supabase
  async getAIConfig(): Promise<any | null> {
    try {
      const supabase = this.getSupabase()

      const { data, error } = await supabase
        .from("ai_config")
        .select("*")
        .eq("is_active", true)
        .single()

      if (error) {
   ativa encontrada")
        return null
      }

 do Supabase")
      return data
    } catch (error) {
      
      return null
    }
  }

  async createAIConfig(config: any): Promise<any> {
    try {
 com config:", JSON.stringify(config))
      const supabase = this.getSupabase()

      const { data, error } = await supabase
        .from("ai_config")
        .insert([config])
        .select()
        .single()

      if (error) {
   criar config IA:", error.message, error.code)
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (!data) {
        throw new Error("No data returned from insert")
      }

      return data
    } catch (error) {
      throw error
    }
  }

  async updateAIConfig(id: string, updates: any): Promise<any> {
    try {
      const supabase = this.getSupabase()

      const { data, error } = await supabase
        .from("ai_config")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (!data) {
        throw new Error("No data returned from update")
      }

      return data
    } catch (error) {
      throw error
    }
  }

  // AI Conversations
  async createConversation(userId: string, data: any): Promise<any> {
    try {
      const supabase = this.getSupabase()

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
      return conv
    } catch (error) {
      throw error
    }
  }

  async getConversations(userId: string): Promise<any[]> {
    try {
      const supabase = this.getSupabase()

      const { data, error } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      
      return []
    }
  }

  // AI Messages
  async createMessage(data: any): Promise<any> {
    try {
      const supabase = this.getSupabase()

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
      const supabase = this.getSupabase()

      const { data, error } = await supabase
        .from("ai_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      
      return []
    }
  }
}

// Export singleton instance
export const db = new Database()
