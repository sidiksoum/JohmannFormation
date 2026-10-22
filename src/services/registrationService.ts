import { DemandeInscription, StatutDemande } from '@/core/types/registration'
import { MOCK_REGISTRATION_REQUESTS } from './mockData'

const STORAGE_KEY = 'johmann_registration_requests'

class RegistrationService {
  private getStore(): DemandeInscription[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REGISTRATION_REQUESTS))
      return [...MOCK_REGISTRATION_REQUESTS]
    }
    try {
      return JSON.parse(raw)
    } catch {
      return [...MOCK_REGISTRATION_REQUESTS]
    }
  }

  private saveStore(items: DemandeInscription[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }

  async getAll(): Promise<DemandeInscription[]> {
    return this.getStore()
  }

  async getById(id: string): Promise<DemandeInscription | null> {
    const items = this.getStore()
    return items.find((d) => d.id === id) || null
  }

  async create(data: Omit<DemandeInscription, 'id' | 'reference' | 'dateDemande' | 'statut'>): Promise<DemandeInscription> {
    const items = this.getStore()
    const nextSeq = items.length + 1
    const reference = `DEM-2024-${String(nextSeq).padStart(3, '0')}`
    const now = new Date()
    const dateDemande = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    const nouvelleDemande: DemandeInscription = {
      ...data,
      id: `dem-${Date.now()}`,
      reference,
      dateDemande,
      statut: 'EN_ATTENTE',
    }

    const updated = [nouvelleDemande, ...items]
    this.saveStore(updated)
    return nouvelleDemande
  }

  async updateStatus(
    id: string,
    statut: StatutDemande,
    remarquesAdmin?: string,
    decisionPar: string = 'M. MEA KOUAKOU FELIX'
  ): Promise<DemandeInscription | null> {
    const items = this.getStore()
    const index = items.findIndex((d) => d.id === id)
    if (index === -1) return null

    const now = new Date()
    const decisionDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    items[index] = {
      ...items[index],
      statut,
      decisionDate,
      decisionPar,
      remarquesAdmin: remarquesAdmin || items[index].remarquesAdmin,
    }

    this.saveStore(items)
    return items[index]
  }

  async getStats() {
    const items = this.getStore()
    const total = items.length
    const enAttente = items.filter((d) => d.statut === 'EN_ATTENTE').length
    const validees = items.filter((d) => d.statut === 'VALIDEE').length
    const rejetees = items.filter((d) => d.statut === 'REJETEE').length

    return {
      total,
      enAttente,
      validees,
      rejetees,
    }
  }
}

export const registrationService = new RegistrationService()
