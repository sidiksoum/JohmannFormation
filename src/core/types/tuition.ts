export type ModePaiement = 'ESPECES' | 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'VIREMENT' | 'CHEQUE'
export type StatutVersement = 'VALIDE' | 'ANNULE'

export interface Versement {
  id: string
  numeroRecu: string // ex: "REC-2024-0045"
  studentId: string
  matricule: string
  studentNomComplet: string
  classe: string
  filiere: string
  numeroTranche: number // 1 à 8
  montant: number // FCFA
  datePaiement: string
  modePaiement: ModePaiement
  referenceTransaction?: string
  agentEncaissement: string
  statut: StatutVersement
  motifAnnulation?: string
  dateAnnulation?: string
  resteDuApresVersement: number
}

export interface TarifScolarite {
  filiere: string
  statut: 'AFF' | 'NAFF'
  montantInscription: number
  montantScolariteAnnuelle: number
  nombreTranchesMax: number
}
