import { UserSession } from '@/core/types/auth'
import { studentService } from './studentService'
import { teacherService } from './teacherService'

class AuthService {
  private currentSession: UserSession | null = null

  constructor() {
    const saved = localStorage.getItem('johmann_session')
    if (saved) {
      try {
        this.currentSession = JSON.parse(saved)
      } catch {
        this.currentSession = null
      }
    }
  }

  getCurrentSession(): UserSession | null {
    return this.currentSession
  }

  async loginStudent(matricule: string): Promise<UserSession | null> {
    const student = await studentService.getByMatricule(matricule)
    if (!student) return null

    const session: UserSession = {
      id: student.id,
      role: 'STUDENT',
      nomComplet: `${student.nom} ${student.prenoms}`,
      identifiantOuMatricule: student.matricule,
      email: student.email,
      avatarUrl: student.photoUrl,
      classeOuDepartement: student.classe,
    }
    this.currentSession = session
    localStorage.setItem('johmann_session', JSON.stringify(session))
    return session
  }

  async loginTeacher(identifiant: string, _motDePasse: string): Promise<UserSession | null> {
    const teachers = await teacherService.getAll()
    const teacher = teachers.find(
      (t) => t.email.toLowerCase() === identifiant.toLowerCase() || t.nom.toLowerCase() === identifiant.toLowerCase()
    ) || teachers[0] // Fallback to first teacher for demo

    const session: UserSession = {
      id: teacher.id,
      role: 'TEACHER',
      nomComplet: `${teacher.titre} ${teacher.nom} ${teacher.prenoms}`,
      identifiantOuMatricule: teacher.email,
      email: teacher.email,
      avatarUrl: teacher.photoUrl,
      classeOuDepartement: teacher.specialite,
    }
    this.currentSession = session
    localStorage.setItem('johmann_session', JSON.stringify(session))
    return session
  }

  async loginAdmin(identifiant: string, _motDePasse: string): Promise<UserSession | null> {
    const session: UserSession = {
      id: 'admin-principal',
      role: 'ADMIN',
      nomComplet: 'M. MEA KOUAKOU FELIX',
      identifiantOuMatricule: identifiant || 'admin.direction',
      email: 'direction@johmann.edu.ci',
      classeOuDepartement: 'Direction des Études & Administration Centrale',
    }
    this.currentSession = session
    localStorage.setItem('johmann_session', JSON.stringify(session))
    return session
  }

  logout(): void {
    this.currentSession = null
    localStorage.removeItem('johmann_session')
  }
}

export const authService = new AuthService()
