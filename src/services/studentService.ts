import { Student } from '@/core/types/student'
import { MOCK_STUDENTS } from './mockData'

class StudentService {
  private students: Student[] = [...MOCK_STUDENTS]

  async getAll(): Promise<Student[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.students]), 200))
  }

  async getByMatricule(matricule: string): Promise<Student | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.students.find(
          (s) => s.matricule.trim().toUpperCase() === matricule.trim().toUpperCase()
        )
        resolve(found || null)
      }, 150)
    })
  }

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: `etu-${Date.now()}`,
    }
    this.students.unshift(newStudent)
    return newStudent
  }

  async importFromExcel(data: Partial<Student>[]): Promise<{ importedCount: number; errors: string[] }> {
    const errors: string[] = []
    let imported = 0

    for (const item of data) {
      if (!item.matricule || !item.nom || !item.prenoms) {
        errors.push(`Ligne invalide : matricule ou nom manquant.`)
        continue
      }
      const existing = this.students.find((s) => s.matricule === item.matricule)
      if (existing) {
        errors.push(`Doublon ignoré pour le matricule ${item.matricule}.`)
        continue
      }
      this.students.push({
        id: `etu-${Date.now()}-${Math.random()}`,
        matricule: item.matricule,
        nom: item.nom,
        prenoms: item.prenoms,
        dateNaissance: item.dateNaissance || '01/01/2004',
        lieuNaissance: item.lieuNaissance || 'Grand-Lahou',
        sexe: item.sexe || 'F',
        nationalite: item.nationalite || 'Ivoirienne',
        filiere: item.filiere || 'Aide - Soignante',
        classe: item.classe || 'Première Année',
        anneeAcademique: '2024-2025',
        statut: item.statut || 'AFF',
        etablissementOrigine: item.etablissementOrigine || 'Lycée Moderne Grand-Lahou',
        contact: item.contact || '07 00 00 00 00',
        email: item.email || `${item.matricule.toLowerCase()}@johmann.edu.ci`,
        photoUrl: item.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        scolarite: {
          totalDu: 350000,
          totalPaye: 0,
          resteAPayer: 350000,
          nombreVersements: 0,
          aJour: false,
        },
      })
      imported++
    }

    return { importedCount: imported, errors }
  }
}

export const studentService = new StudentService()
