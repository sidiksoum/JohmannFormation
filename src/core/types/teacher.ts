export type StatutEnseignant = 'PERMANENT' | 'VACATAIRE'

export interface Affectation {
  id: string
  discipline: string
  classe: string
  filiere: string
  semestre: 'S1' | 'S2' | 'ANNUEL'
  coefficient: number
}

export interface Teacher {
  id: string
  nom: string
  prenoms: string
  titre: string // ex: "Dr.", "M.", "Mme"
  statut: StatutEnseignant
  specialite: string
  email: string
  contact: string
  photoUrl: string
  estFormateurPrincipal: boolean
  classePrincipale?: string
  affectations: Affectation[]
}
