export interface LigneBulletinDiscipline {
  discipline: string
  noteS1: number | null
  noteS2: number | null
  coefficient: number
  totalPondere: number | null // note * coef
  rangS2: number | null
  moyenneAnnuelleDiscipline: number | null
  rangAnnuelDiscipline: number | null
  appreciation: string
  formateurNom: string
}

export interface BulletinNotes {
  id: string
  anneeScolaire: string // "2024-2025"
  semestre: 'Premier Semestre' | 'Deuxième Semestre'
  studentId: string
  matricule: string
  studentNomComplet: string
  dateNaissance: string
  lieuNaissance: string
  sexe: 'M' | 'F'
  nationalite: string
  filiere: string // "Aide - Soignante"
  classe: string // "Première Année"
  effectifClasse: number // 55
  
  // Tableau des disciplines
  disciplines: LigneBulletinDiscipline[]
  
  // Totaux & Synthèse
  totalPoints: number
  totalCoefficients: number
  moyenneSemestrielle: number // sur 20
  rangSemestre: number
  plusForteMoyenne: number
  plusFaibleMoyenne: number
  
  // Rappels & Annuel
  moyenneS1?: number
  rangS1?: number
  moyenneAnnuelle?: number
  rangAnnuel?: number
  
  // Assiduité & Conseil
  heuresAbsenceNonJustifiees: number
  appreciationConseil: string
  decisionFinFormation: string
  formateurPrincipalNom: string
  directeurDesEtudesNom: string // "MEA KOUAKOU FELIX"
  dateEdition: string // "22/04/2025"
  lieuEdition: string // "Grand-Lahou"
  
  // Statut
  statut: 'BROUILLON' | 'VALIDE' | 'PUBLIE' | 'VERROUILLE'
  codeVerification: string
  qrCodeData: string
}
