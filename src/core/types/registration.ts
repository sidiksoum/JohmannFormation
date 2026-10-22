export type StatutDemande = 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE'

export type FiliereJohmann =
  | 'Aide-soignante'
  | 'Auxiliaire en pharmacie'
  | 'Caissière spécialisée'

export interface DemandeInscription {
  id: string
  reference: string // ex: DEM-2024-0012
  dateDemande: string
  nom: string
  prenoms: string
  genre: 'F' | 'M'
  dateNaissance: string
  lieuNaissance: string
  telephone: string
  whatsapp: string
  email?: string
  villeResidence: string
  filiereSouhaitee: FiliereJohmann
  niveauEtudeActuel: string // ex: 3ème achevée, Terminale, BAC
  dernierEtablissement: string
  statutCandidat: 'NON_AFFECTE' // Candidat non affecté de l'État
  pieceIdentiteNumero?: string
  motivation?: string
  statut: StatutDemande
  decisionDate?: string
  decisionPar?: string
  remarquesAdmin?: string
}
