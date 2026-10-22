export type StatutAffectation = 'AFF' | 'NAFF' // Affecté / Non Affecté par l'État
export type Sexe = 'M' | 'F'

export interface Student {
  id: string
  matricule: string
  nom: string
  prenoms: string
  dateNaissance: string
  lieuNaissance: string
  sexe: Sexe
  nationalite: string
  filiere: string // ex: "Aide - Soignante", "Auxiliaire en Pharmacie", "Caissière"
  classe: string // ex: "Aide-Soignante 1ère Année"
  anneeAcademique: string // ex: "2024-2025"
  statut: StatutAffectation
  etablissementOrigine: string
  contact: string
  email: string
  photoUrl: string
  scolarite: {
    totalDu: number // en FCFA
    totalPaye: number
    resteAPayer: number
    nombreVersements: number
    aJour: boolean
  }
}
