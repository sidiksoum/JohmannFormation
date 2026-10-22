export type TypeQuestion =
  | 'CHOIX_UNIQUE'
  | 'CHOIX_MULTIPLES'
  | 'VRAI_FAUX'
  | 'REPONSE_COURTE'
  | 'QUESTION_OUVERTE'

export type StatutEvaluation =
  | 'BROUILLON'    // Enseignant
  | 'VALIDEE'      // Administration
  | 'LANCEE'       // Admin ou enseignant (ouverte aux étudiants)
  | 'CLOTUREE'     // Automatique ou manuelle
  | 'CORRIGEE'     // Enseignant
  | 'PUBLIEE'      // Enseignant ou admin (notes visibles)

export type StatutSurveillanceCapture = 'CONFORME' | 'SUSPECTE' | 'ANNULEE'

export interface QuestionOption {
  id: string
  texte: string
  estCorrecte: boolean
}

export interface Question {
  id: string
  type: TypeQuestion
  enonce: string
  points: number
  imageUrl?: string
  options?: QuestionOption[]
  reponseAttendueCourte?: string
  guideCorrection?: string
}

export interface PhotoSurveillance {
  id: string
  etudiantId: string
  horodatage: string
  captureUrl: string
  statut: StatutSurveillanceCapture
  remarque?: string
  anomalieDetectee?: 'VISAGE_ABSENT' | 'CHANGEMENT_ONGLET' | 'IMAGE_SOMBRE' | 'MULTI_VISAGES'
}

export interface Evaluation {
  id: string
  titre: string // ex: "Contrôle N°1 - Soins Infirmiers"
  discipline: string
  classe: string
  filiere: string
  semestre: 'S1' | 'S2'
  type: 'DEVOIR' | 'COMPOSITION' | 'EXAMEN'
  enseignantId: string
  enseignantNom: string
  statut: StatutEvaluation
  dateDebut: string
  dateFin: string
  dureeMinutes: number
  totalPoints: number // Barème libre (converti sur 20)
  ordreAleatoire: boolean
  questions: Question[]
  surveillanceActive: boolean
}

export interface ReponseEtudiant {
  questionId: string
  reponseTexte?: string
  optionIdsSelectionnees?: string[]
  pointsObtenus?: number
  estCorrect?: boolean
  remarqueCorrecteur?: string
}

export interface CopieEtudiant {
  id: string
  evaluationId: string
  studentId: string
  matricule: string
  studentNomComplet: string
  dateSoumission: string
  dureeEcouleeSecondes: number
  statut: 'SOUMISE' | 'EN_COURS' | 'CORRIGEE'
  noteSurTotal: number
  noteSur20: number
  bonnesReponses: number
  mauvaisesReponses: number
  statutSurveillance: 'VALIDE' | 'EN_REVISION' | 'REJETE'
  captures: PhotoSurveillance[]
  reponses: ReponseEtudiant[]
}
