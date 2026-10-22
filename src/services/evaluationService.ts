import { Evaluation, CopieEtudiant, StatutSurveillanceCapture } from '@/core/types/evaluation'
import { MOCK_EVALUATIONS, MOCK_COPIES } from './mockData'

class EvaluationService {
  private evaluations: Evaluation[] = [...MOCK_EVALUATIONS]
  private copies: CopieEtudiant[] = [...MOCK_COPIES]

  async getAll(): Promise<Evaluation[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.evaluations]), 150))
  }

  async getOpenForStudent(classe: string): Promise<Evaluation[]> {
    return new Promise((resolve) => {
      const list = this.evaluations.filter(
        (e) => e.statut === 'LANCEE' && (e.classe === classe || !e.classe)
      )
      resolve(list)
    })
  }

  async getCompletedByStudent(studentId: string): Promise<CopieEtudiant[]> {
    return new Promise((resolve) => {
      const list = this.copies.filter((c) => c.studentId === studentId)
      resolve(list)
    })
  }

  async getAllCopies(): Promise<CopieEtudiant[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.copies]), 150))
  }

  async updateSurveillanceStatut(
    copieId: string,
    captureId: string,
    nouveauStatut: StatutSurveillanceCapture,
    remarque: string
  ): Promise<boolean> {
    const copie = this.copies.find((c) => c.id === copieId)
    if (!copie) return false
    const cap = copie.captures.find((p) => p.id === captureId)
    if (!cap) return false
    cap.statut = nouveauStatut
    cap.remarque = remarque
    return true
  }

  async submitCopie(copie: Omit<CopieEtudiant, 'id'>): Promise<CopieEtudiant> {
    const newCopie: CopieEtudiant = {
      ...copie,
      id: `copie-${Date.now()}`,
    }
    this.copies.unshift(newCopie)
    return newCopie
  }
}

export const evaluationService = new EvaluationService()
