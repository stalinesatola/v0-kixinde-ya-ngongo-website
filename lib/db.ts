import { User, Project, Subscription, ProjectLog, Session } from "./types"
import crypto from "crypto"

// In-memory database for MVP
class Database {
  private users: Map<string, User> = new Map()
  private projects: Map<string, Project> = new Map()
  private subscriptions: Map<string, Subscription> = new Map()
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

    // Create demo subscription
    const adminSubscription: Subscription = {
      id: "sub-001",
      userId: "admin-001",
      plan: "enterprise",
      status: "active",
      projectsLimit: 999,
      projectsUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.subscriptions.set(adminSubscription.id, adminSubscription)
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
