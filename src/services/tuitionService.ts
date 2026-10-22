import { Versement } from '@/core/types/tuition'
import { MOCK_VERSEMENTS } from './mockData'

class TuitionService {
  private versements: Versement[] = [...MOCK_VERSEMENTS]

  async getAll(): Promise<Versement[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.versements]), 150))
  }

  async getByMatricule(matricule: string): Promise<Versement[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = this.versements.filter(
          (v) => v.matricule.trim().toUpperCase() === matricule.trim().toUpperCase() && v.statut === 'VALIDE'
        )
        resolve(list)
      }, 100)
    })
  }

  async addVersement(data: Omit<Versement, 'id' | 'numeroRecu' | 'statut'>): Promise<Versement> {
    const nextNum = String(this.versements.length + 1).padStart(4, '0')
    const annee = new Date().getFullYear()
    const newVersement: Versement = {
      ...data,
      id: `vers-${Date.now()}`,
      numeroRecu: `REC-${annee}-${nextNum}`,
      statut: 'VALIDE',
    }
    this.versements.unshift(newVersement)
    return newVersement
  }

  async annulerVersement(id: string, motif: string): Promise<boolean> {
    const target = this.versements.find((v) => v.id === id)
    if (!target) return false
    target.statut = 'ANNULE'
    target.motifAnnulation = motif
    target.dateAnnulation = new Date().toLocaleDateString('fr-FR')
    return true
  }
}

export const tuitionService = new TuitionService()
