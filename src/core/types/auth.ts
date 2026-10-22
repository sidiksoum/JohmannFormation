export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface UserSession {
  id: string
  role: UserRole
  nomComplet: string
  identifiantOuMatricule: string
  email?: string
  avatarUrl?: string
  classeOuDepartement?: string
}
