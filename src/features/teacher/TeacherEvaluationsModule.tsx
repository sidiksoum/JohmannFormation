import { useState } from 'react'
import {
  Plus,
  BookOpen,
  Eye,
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Award,
  Users,
  FileText,
  Check,
  Trash2,
  X,
  Printer,
  ShieldCheck,
  BarChart3,
  ListChecks,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Teacher } from '@/core/types/teacher'
import { TypeQuestion } from '@/core/types/evaluation'
import { toast } from 'sonner'

// Statuts des fiches de composition demandés par l'utilisateur
export type StatutFicheComposition = 'EN_COURS' | 'TERMINEE' | 'EN_ATTENTE_PUBLICATION'

interface QuestionGabarit {
  id: string
  type: TypeQuestion
  enonce: string
  points: number
  options?: { id: string; texte: string; estCorrecte: boolean }[]
  reponseAttendueCourte?: string
  guideCorrection?: string
}

interface FicheComposition {
  id: string
  titre: string
  discipline: string
  classe: string
  filiere: string
  semestre: string
  statut: StatutFicheComposition
  dateComposition: string
  dureeMinutes: number
  totalPoints: number
  questions: QuestionGabarit[]
  // Statistiques de participation
  totalInscrits: number
  copiesSoumises: number
  moyenneClasse?: number
  noteMax?: number
  noteMin?: number
  tauxReussite?: number
}

interface NoteEtudiantLigne {
  id: string
  matricule: string
  nom: string
  prenoms: string
  photoUrl: string
  statutAff: 'AFF' | 'NAFF'
  noteSur20: number
  mention: 'Très Bien' | 'Bien' | 'Assez Bien' | 'Passable' | 'Ajourné'
  dureeMinutes: number
  questionsReussies: number
  totalQuestions: number
  surveillanceWebcam: 'CONFORME' | 'SUSPECTE'
  reponsesDetaillees: {
    questionId: string
    enonce: string
    type: TypeQuestion
    reponseEtudiant: string
    estCorrect: boolean
    pointsObtenus: number
    bareme: number
    commentaire?: string
  }[]
}

// Données de composition terminée et liste complète des 24 étudiants
const MOCK_RESULTATS_COMPOSITION: NoteEtudiantLigne[] = [
  {
    id: 'etu-1',
    matricule: 'JF-2024-0012',
    nom: 'KOUASSI',
    prenoms: 'Aya Marie-Estelle',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 19.0,
    mention: 'Très Bien',
    dureeMinutes: 38,
    questionsReussies: 5,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [
      {
        questionId: 'q1',
        enonce: 'Première étape avant tout acte de soins :',
        type: 'CHOIX_UNIQUE',
        reponseEtudiant: 'Lavage antiseptique des mains à la friction hydro-alcoolique',
        estCorrect: true,
        pointsObtenus: 4,
        bareme: 4,
      },
      {
        questionId: 'q2',
        enonce: 'Restérilisation du matériel à usage unique :',
        type: 'VRAI_FAUX',
        reponseEtudiant: 'FAUX (Interdiction formelle de réutilisation)',
        estCorrect: true,
        pointsObtenus: 4,
        bareme: 4,
      },
      {
        questionId: 'q3',
        enonce: 'Paramètres vitaux post-opératoires obligatoires :',
        type: 'CHOIX_MULTIPLES',
        reponseEtudiant: 'PA, Pouls, SpO2',
        estCorrect: true,
        pointsObtenus: 5,
        bareme: 5,
      },
      {
        questionId: 'q4',
        enonce: 'Définition du sigle DASRI :',
        type: 'REPONSE_COURTE',
        reponseEtudiant: "Déchets d'Activités de Soins à Risques Infectieux",
        estCorrect: true,
        pointsObtenus: 3,
        bareme: 3,
      },
      {
        questionId: 'q5',
        enonce: 'Conduite face à une escarre stade 1 :',
        type: 'QUESTION_OUVERTE',
        reponseEtudiant:
          'Changement de position toutes les 2 heures, effleurage doux de la zone sans friction agressive, hydratation et alerte immédiate de l’infirmier référent.',
        estCorrect: true,
        pointsObtenus: 3,
        bareme: 4,
        commentaire: 'Excellente analyse clinique et protocole respecté.',
      },
    ],
  },
  {
    id: 'etu-2',
    matricule: 'JF-2024-0044',
    nom: 'KONE',
    prenoms: 'Ibrahim Moussa',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 17.5,
    mention: 'Très Bien',
    dureeMinutes: 41,
    questionsReussies: 5,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-3',
    matricule: 'JF-2024-0205',
    nom: 'MEITE',
    prenoms: 'Salimata',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 17.0,
    mention: 'Très Bien',
    dureeMinutes: 39,
    questionsReussies: 5,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-4',
    matricule: 'JF-2024-0180',
    nom: 'AMANI',
    prenoms: "N'Dri Sylvie",
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 16.5,
    mention: 'Très Bien',
    dureeMinutes: 40,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-5',
    matricule: 'JF-2024-0025',
    nom: 'DIABATE',
    prenoms: 'Sekou Oumar',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 16.0,
    mention: 'Bien',
    dureeMinutes: 43,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-6',
    matricule: 'JF-2024-0038',
    nom: 'YAO',
    prenoms: 'Affoué Christine',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 15.5,
    mention: 'Bien',
    dureeMinutes: 40,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-7',
    matricule: 'JF-2024-0220',
    nom: 'GBANE',
    prenoms: 'Massandjé',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 15.5,
    mention: 'Bien',
    dureeMinutes: 41,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-8',
    matricule: 'JF-2024-0052',
    nom: 'TRAORE',
    prenoms: 'Aminata',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 15.0,
    mention: 'Bien',
    dureeMinutes: 42,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-9',
    matricule: 'JF-2024-0173',
    nom: 'KIPRE',
    prenoms: 'Jean-Luc',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 15.0,
    mention: 'Bien',
    dureeMinutes: 39,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-10',
    matricule: 'JF-2024-0063',
    nom: "N'GUESSAN",
    prenoms: 'Kouamé Jean',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 14.5,
    mention: 'Assez Bien',
    dureeMinutes: 44,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-11',
    matricule: 'JF-2024-0071',
    nom: 'BAMBA',
    prenoms: 'Fatoumata',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 14.0,
    mention: 'Assez Bien',
    dureeMinutes: 37,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-12',
    matricule: 'JF-2024-0162',
    nom: 'SORO',
    prenoms: 'Gnénéma',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 14.0,
    mention: 'Assez Bien',
    dureeMinutes: 40,
    questionsReussies: 4,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-13',
    matricule: 'JF-2024-0085',
    nom: 'OUATTARA',
    prenoms: 'Souleymane',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 13.5,
    mention: 'Assez Bien',
    dureeMinutes: 42,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-14',
    matricule: 'JF-2024-0192',
    nom: 'BAKAYOKO',
    prenoms: 'Alassane',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 13.5,
    mention: 'Assez Bien',
    dureeMinutes: 43,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-15',
    matricule: 'JF-2024-0096',
    nom: 'KOFFI',
    prenoms: 'Akissi Grace',
    photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 13.0,
    mention: 'Assez Bien',
    dureeMinutes: 41,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-16',
    matricule: 'JF-2024-0104',
    nom: 'CISSE',
    prenoms: 'Mamadou',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 12.5,
    mention: 'Assez Bien',
    dureeMinutes: 45,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-17',
    matricule: 'JF-2024-0118',
    nom: 'TOURE',
    prenoms: 'Mariam',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 12.0,
    mention: 'Assez Bien',
    dureeMinutes: 44,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-18',
    matricule: 'JF-2024-0214',
    nom: 'SYLLA',
    prenoms: 'Cheick',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 12.0,
    mention: 'Assez Bien',
    dureeMinutes: 45,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-19',
    matricule: 'JF-2024-0125',
    nom: 'ADOU',
    prenoms: 'Ange Eric',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 11.5,
    mention: 'Passable',
    dureeMinutes: 43,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-20',
    matricule: 'JF-2024-0129',
    nom: 'GNAHOUA',
    prenoms: 'Marc-Aurèle',
    photoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 11.0,
    mention: 'Passable',
    dureeMinutes: 43,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-21',
    matricule: 'JF-2024-0131',
    nom: 'KOUADIO',
    prenoms: 'Yves Roland',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 10.5,
    mention: 'Passable',
    dureeMinutes: 42,
    questionsReussies: 3,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-22',
    matricule: 'JF-2024-0135',
    nom: 'ZOUZOUA',
    prenoms: 'Ange Christian',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    statutAff: 'NAFF',
    noteSur20: 10.0,
    mention: 'Passable',
    dureeMinutes: 45,
    questionsReussies: 2,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-23',
    matricule: 'JF-2024-0142',
    nom: 'KOUAME',
    prenoms: 'Ahou Danielle',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 9.5,
    mention: 'Ajourné',
    dureeMinutes: 45,
    questionsReussies: 2,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
  {
    id: 'etu-24',
    matricule: 'JF-2024-0155',
    nom: 'DIBY',
    prenoms: 'Koffi Fabrice',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    statutAff: 'AFF',
    noteSur20: 9.5,
    mention: 'Ajourné',
    dureeMinutes: 44,
    questionsReussies: 2,
    totalQuestions: 5,
    surveillanceWebcam: 'CONFORME',
    reponsesDetaillees: [],
  },
]

// Questions du gabarit d'association (démonstration des 5 types de questions)
const QUESTIONS_GABARIT_DEMO: QuestionGabarit[] = [
  {
    id: 'q1',
    type: 'CHOIX_UNIQUE',
    enonce:
      'Quelle est la première étape fondamentale avant tout acte de soins invasif ou non invasif en milieu hospitalier ?',
    points: 4,
    options: [
      {
        id: 'opt1',
        texte: 'Le lavage antiseptique des mains à la friction hydro-alcoolique (FHA)',
        estCorrecte: true,
      },
      { id: 'opt2', texte: 'L’administration préalable d’un antalgique majeur', estCorrecte: false },
      { id: 'opt3', texte: 'La prise immédiate de la tension artérielle', estCorrecte: false },
      { id: 'opt4', texte: 'L’ouverture des fenêtres de la chambre', estCorrecte: false },
    ],
  },
  {
    id: 'q2',
    type: 'VRAI_FAUX',
    enonce:
      'Le matériel médical à usage unique peut être restérilisé à l’autoclave s’il n’est pas visiblement souillé.',
    points: 4,
    options: [
      { id: 'vf1', texte: 'VRAI', estCorrecte: false },
      { id: 'vf2', texte: 'FAUX (Interdiction formelle de réutilisation)', estCorrecte: true },
    ],
  },
  {
    id: 'q3',
    type: 'CHOIX_MULTIPLES',
    enonce:
      'Quels sont les paramètres vitaux obligatoires à relever lors d’une surveillance post-opératoire immédiate ?',
    points: 5,
    options: [
      { id: 'cm1', texte: 'Pression artérielle (PA)', estCorrecte: true },
      { id: 'cm2', texte: 'Fréquence cardiaque et pulsations', estCorrecte: true },
      { id: 'cm3', texte: 'Saturation en oxygène (SpO2)', estCorrecte: true },
      { id: 'cm4', texte: 'Périmètre crânien chez l’adulte', estCorrecte: false },
    ],
  },
  {
    id: 'q4',
    type: 'REPONSE_COURTE',
    enonce:
      'Définissez le sigle officiel DASRI utilisé pour la filière d’élimination des déchets de soins :',
    points: 3,
    reponseAttendueCourte: "Déchets d'Activités de Soins à Risques Infectieux",
  },
  {
    id: 'q5',
    type: 'QUESTION_OUVERTE',
    enonce:
      'Cas clinique : Un patient alité présente une rougeur persistante ne blanchissant pas à la pression au niveau du sacrum (stade 1). Décrivez en 3 points la conduite à tenir immédiate pour l’aide-soignant.',
    points: 4,
    guideCorrection:
      'Changement de position toutes les 2h, effleurage doux sans friction vigoureuse, signalement immédiat à l’infirmier référent pour pose de pansement hydrocolloïde.',
  },
]

// Les 3 fiches de compositions avec les 3 statuts demandés
const INITIAL_FICHES: FicheComposition[] = [
  {
    id: 'fiche-1',
    titre: 'Composition N°1 — Soins Infirmiers Fondamentaux & Asepsie',
    discipline: 'Soins-infirmiers',
    classe: 'Première Année',
    filiere: 'Aide - Soignante',
    semestre: 'Semestre 1',
    statut: 'TERMINEE',
    dateComposition: '12/10/2026 • 08:00 - 08:45',
    dureeMinutes: 45,
    totalPoints: 20,
    questions: QUESTIONS_GABARIT_DEMO,
    totalInscrits: 24,
    copiesSoumises: 24,
    moyenneClasse: 14.65,
    noteMax: 19.0,
    noteMin: 9.5,
    tauxReussite: 91.7,
  },
  {
    id: 'fiche-2',
    titre: 'Contrôle Continu N°2 — Pharmacologie & Posologies Pédiatriques',
    discipline: 'Pédiatrie',
    classe: 'Première Année',
    filiere: 'Aide - Soignante',
    semestre: 'Semestre 2',
    statut: 'EN_COURS',
    dateComposition: 'Aujourd’hui (Session en cours jusqu’à 14:00)',
    dureeMinutes: 45,
    totalPoints: 20,
    questions: QUESTIONS_GABARIT_DEMO.slice(0, 4),
    totalInscrits: 24,
    copiesSoumises: 15,
  },
  {
    id: 'fiche-3',
    titre: 'Épreuve Pratique N°1 — Urgences Vitales & Gestes de Premiers Secours',
    discipline: 'Soins d’Urgences',
    classe: 'Première Année',
    filiere: 'Aide - Soignante',
    semestre: 'Semestre 2',
    statut: 'EN_ATTENTE_PUBLICATION',
    dateComposition: 'Session programmée pour le 22/10/2026',
    dureeMinutes: 60,
    totalPoints: 20,
    questions: QUESTIONS_GABARIT_DEMO.slice(0, 4),
    totalInscrits: 24,
    copiesSoumises: 0,
  },
]

interface TeacherEvaluationsModuleProps {
  teacher: Teacher
}

export function TeacherEvaluationsModule({ teacher }: TeacherEvaluationsModuleProps) {
  const [fiches, setFiches] = useState<FicheComposition[]>(INITIAL_FICHES)
  const [filtreStatut, setFiltreStatut] = useState<'TOUS' | StatutFicheComposition>('TOUS')

  // Modals state
  const [isGabaritModalOpen, setIsGabaritModalOpen] = useState(false)
  const [selectedFicheDetails, setSelectedFicheDetails] = useState<FicheComposition | null>(null)
  const [selectedCopieEtudiant, setSelectedCopieEtudiant] = useState<NoteEtudiantLigne | null>(null)
  const [isPreviewStudentModalOpen, setIsPreviewStudentModalOpen] = useState(false)

  // Gabarit Builder State
  const [gabaritTitre, setGabaritTitre] = useState(
    'Épreuve de Synthèse — Anatomie et Soins Fondamentaux'
  )
  const [gabaritDiscipline, setGabaritDiscipline] = useState('Soins-infirmiers')
  const [gabaritDuree, setGabaritDuree] = useState('45')
  const [gabaritQuestions, setGabaritQuestions] = useState<QuestionGabarit[]>(QUESTIONS_GABARIT_DEMO)

  // Formulaire d'ajout d'une question dans le gabarit
  const [newQuestionType, setNewQuestionType] = useState<TypeQuestion>('CHOIX_UNIQUE')
  const [newQuestionEnonce, setNewQuestionEnonce] = useState('')
  const [newQuestionPoints, setNewQuestionPoints] = useState(4)
  const [newQuestionOptions, setNewQuestionOptions] = useState<
    { id: string; texte: string; estCorrecte: boolean }[]
  >([
    { id: '1', texte: '', estCorrecte: true },
    { id: '2', texte: '', estCorrecte: false },
    { id: '3', texte: '', estCorrecte: false },
    { id: '4', texte: '', estCorrecte: false },
  ])
  const [newQuestionReponseCourte, setNewQuestionReponseCourte] = useState('')
  const [newQuestionGuide, setNewQuestionGuide] = useState('')

  // Filtre recherche tableau des notes
  const [searchNotesQuery, setSearchNotesQuery] = useState('')
  const [filterAdmis, setFilterAdmis] = useState<'TOUS' | 'ADMIS' | 'AJOURNES'>('TOUS')

  // Calcul du barème total associé dans le gabarit
  const totalPointsGabarit = gabaritQuestions.reduce((acc, q) => acc + q.points, 0)

  // Gestion du type de question dans le gabarit
  const handleTypeChange = (type: TypeQuestion) => {
    setNewQuestionType(type)
    if (type === 'CHOIX_UNIQUE') {
      setNewQuestionOptions([
        { id: '1', texte: '', estCorrecte: true },
        { id: '2', texte: '', estCorrecte: false },
        { id: '3', texte: '', estCorrecte: false },
        { id: '4', texte: '', estCorrecte: false },
      ])
    } else if (type === 'CHOIX_MULTIPLES') {
      setNewQuestionOptions([
        { id: '1', texte: '', estCorrecte: true },
        { id: '2', texte: '', estCorrecte: true },
        { id: '3', texte: '', estCorrecte: false },
        { id: '4', texte: '', estCorrecte: false },
      ])
    } else if (type === 'VRAI_FAUX') {
      setNewQuestionOptions([
        { id: '1', texte: 'VRAI', estCorrecte: true },
        { id: '2', texte: 'FAUX', estCorrecte: false },
      ])
    }
  }

  // Ajouter la question construite au gabarit de la fiche
  const handleAddQuestionToGabarit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestionEnonce.trim()) {
      toast.error('Veuillez renseigner l’énoncé de la question.')
      return
    }

    const nouvelleQuestion: QuestionGabarit = {
      id: `q-${Date.now()}`,
      type: newQuestionType,
      enonce: newQuestionEnonce,
      points: Number(newQuestionPoints) || 1,
      options:
        newQuestionType === 'CHOIX_UNIQUE' ||
        newQuestionType === 'CHOIX_MULTIPLES' ||
        newQuestionType === 'VRAI_FAUX'
          ? newQuestionOptions.filter((opt) => opt.texte.trim() !== '')
          : undefined,
      reponseAttendueCourte:
        newQuestionType === 'REPONSE_COURTE' ? newQuestionReponseCourte : undefined,
      guideCorrection: newQuestionType === 'QUESTION_OUVERTE' ? newQuestionGuide : undefined,
    }

    setGabaritQuestions([...gabaritQuestions, nouvelleQuestion])
    setNewQuestionEnonce('')
    setNewQuestionReponseCourte('')
    setNewQuestionGuide('')
    toast.success('Question associée avec succès au gabarit de la fiche de composition !')
  }

  // Supprimer une question du gabarit
  const handleRemoveQuestionFromGabarit = (qId: string) => {
    setGabaritQuestions(gabaritQuestions.filter((q) => q.id !== qId))
    toast.info('Question retirée du gabarit.')
  }

  // Enregistrer ou publier la fiche de composition
  const handleSaveFiche = (statutCible: StatutFicheComposition) => {
    const nouvelleFiche: FicheComposition = {
      id: `fiche-${Date.now()}`,
      titre: gabaritTitre,
      discipline: gabaritDiscipline,
      classe: 'Première Année',
      filiere: 'Aide - Soignante',
      semestre: 'Semestre 2',
      statut: statutCible,
      dateComposition:
        statutCible === 'EN_COURS'
          ? 'Aujourd’hui (Session ouverte)'
          : 'Programmée pour le 28/10/2026',
      dureeMinutes: Number(gabaritDuree) || 45,
      totalPoints: totalPointsGabarit,
      questions: gabaritQuestions,
      totalInscrits: 24,
      copiesSoumises: 0,
    }

    setFiches([nouvelleFiche, ...fiches])
    setIsGabaritModalOpen(false)
    toast.success(
      statutCible === 'EN_COURS'
        ? 'Fiche de composition publiée et session lancée !'
        : 'Fiche enregistrée en attente de publication administrative.'
    )
  }

  // Filtrage des fiches
  const fichesFiltrees = fiches.filter((f) => {
    if (filtreStatut === 'TOUS') return true
    return f.statut === filtreStatut
  })

  // Filtrage des notes pour la modal de détails
  const notesFiltrees = MOCK_RESULTATS_COMPOSITION.filter((ligne) => {
    const matchSearch =
      ligne.nom.toLowerCase().includes(searchNotesQuery.toLowerCase()) ||
      ligne.prenoms.toLowerCase().includes(searchNotesQuery.toLowerCase()) ||
      ligne.matricule.toLowerCase().includes(searchNotesQuery.toLowerCase())

    if (!matchSearch) return false
    if (filterAdmis === 'ADMIS') return ligne.noteSur20 >= 10
    if (filterAdmis === 'AJOURNES') return ligne.noteSur20 < 10
    return true
  })

  return (
    <div className="space-y-6">
      {/* En-tête Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Conception d'épreuves & fiches de composition
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gabarit d'association des questions par type (QCM, Vrai/Faux, Réponse courte, Cas clinique) et suivi des fiches publiées
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={() => setIsPreviewStudentModalOpen(true)}
          >
            Aperçu étudiant
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsGabaritModalOpen(true)}
          >
            Nouvelle fiche de composition
          </Button>
        </div>
      </div>

      {/* Onglets de filtrage par Statut (demandé explicitement par l'utilisateur) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFiltreStatut('TOUS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filtreStatut === 'TOUS'
              ? 'bg-[#7A1B29] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Toutes les fiches ({fiches.length})
        </button>

        <button
          onClick={() => setFiltreStatut('EN_COURS')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filtreStatut === 'EN_COURS'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>En cours ({fiches.filter((f) => f.statut === 'EN_COURS').length})</span>
        </button>

        <button
          onClick={() => setFiltreStatut('TERMINEE')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filtreStatut === 'TERMINEE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Terminées ({fiches.filter((f) => f.statut === 'TERMINEE').length})</span>
        </button>

        <button
          onClick={() => setFiltreStatut('EN_ATTENTE_PUBLICATION')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filtreStatut === 'EN_ATTENTE_PUBLICATION'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>En attente de publication ({fiches.filter((f) => f.statut === 'EN_ATTENTE_PUBLICATION').length})</span>
        </button>
      </div>

      {/* Liste des Fiches de Composition */}
      <div className="space-y-4">
        {fichesFiltrees.map((fiche) => {
          const isTerminee = fiche.statut === 'TERMINEE'
          const isEnCours = fiche.statut === 'EN_COURS'
          const isEnAttente = fiche.statut === 'EN_ATTENTE_PUBLICATION'

          return (
            <Card
              key={fiche.id}
              variant="clean"
              className={`p-5 transition-all border-l-4 ${
                isEnCours
                  ? 'border-l-emerald-500 bg-emerald-50/15'
                  : isTerminee
                  ? 'border-l-blue-500'
                  : 'border-l-amber-500'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  {/* Statut & Titre */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{fiche.titre}</h3>

                    {isEnCours && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        En cours de composition
                      </span>
                    )}

                    {isTerminee && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Terminée • Notes publiées
                      </span>
                    )}

                    {isEnAttente && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        En attente de publication
                      </span>
                    )}
                  </div>

                  {/* Métadonnées académiques */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">{fiche.discipline}</span>
                    <span>•</span>
                    <span>{fiche.filiere} ({fiche.classe})</span>
                    <span>•</span>
                    <span>{fiche.semestre}</span>
                    <span>•</span>
                    <span className="font-mono text-[#7A1B29] font-bold">
                      Durée : {fiche.dureeMinutes} min
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-800 font-bold">
                      Barème : {fiche.totalPoints} pts
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      {fiche.questions.length} questions associées
                    </span>
                  </div>

                  {/* Synthèse des participations selon statut */}
                  {isTerminee && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Participation :</span>
                        <strong className="text-slate-900 font-mono">
                          {fiche.copiesSoumises} / {fiche.totalInscrits} étudiants (100 %)
                        </strong>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">Moyenne de classe :</span>
                        <strong className="text-emerald-700 font-mono font-bold">
                          {fiche.moyenneClasse?.toFixed(2)} / 20
                        </strong>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">Fourchette notes :</span>
                        <span className="text-slate-700 font-mono">
                          Min: {fiche.noteMin?.toFixed(1)} • Max: {fiche.noteMax?.toFixed(1)} / 20
                        </span>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">Taux de réussite :</span>
                        <strong className="text-blue-700 font-mono">
                          {fiche.tauxReussite} %
                        </strong>
                      </div>
                    </div>
                  )}

                  {isEnCours && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex flex-wrap items-center gap-4 text-emerald-900">
                      <div>
                        <span className="text-emerald-600 block text-[10px]">Copies soumises :</span>
                        <strong className="font-mono font-bold">
                          {fiche.copiesSoumises} / {fiche.totalInscrits} étudiants
                        </strong>
                      </div>
                      <div className="h-6 w-px bg-emerald-200" />
                      <div>
                        <span className="text-emerald-600 block text-[10px]">Surveillance webcam :</span>
                        <span className="font-semibold text-emerald-800">
                          Flux actif (Anti-triche activé)
                        </span>
                      </div>
                    </div>
                  )}

                  {isEnAttente && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      Gabarit prêt avec {fiche.questions.length} questions ({fiche.totalPoints} pts). La session peut être ouverte ou programmée.
                    </p>
                  )}
                </div>

                {/* Actions contextuelles */}
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                  {/* POUR UNE FICHE TERMINEE : BOUTON CRITIQUE DEMANDE PAR L'UTILISATEUR */}
                  {isTerminee && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<BarChart3 className="w-4 h-4" />}
                      onClick={() => setSelectedFicheDetails(fiche)}
                      className="shadow-sm"
                    >
                      Voir détails de composition
                    </Button>
                  )}

                  {isEnCours && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Eye className="w-4 h-4" />}
                      onClick={() =>
                        toast.info('Affichage du monitoring de surveillance en direct.')
                      }
                      className="bg-emerald-700 hover:bg-emerald-800 border-emerald-800"
                    >
                      Surveiller la session en direct
                    </Button>
                  )}

                  {isEnAttente && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Layers className="w-4 h-4" />}
                      onClick={() => {
                        setGabaritTitre(fiche.titre)
                        setGabaritDiscipline(fiche.discipline)
                        setGabaritDuree(String(fiche.dureeMinutes))
                        setGabaritQuestions(fiche.questions)
                        setIsGabaritModalOpen(true)
                      }}
                    >
                      Éditer le gabarit d'association
                    </Button>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setIsPreviewStudentModalOpen(true)}
                    >
                      Aperçu épreuve
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Copy className="w-3.5 h-3.5" />}
                      onClick={() => toast.info('Fiche dupliquée pour réutilisation.')}
                    >
                      Dupliquer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. MODAL GABARIT D'ASSOCIATION D'UN ENSEMBLE DE QUESTIONS (DEMANDÉ PAR USER) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isGabaritModalOpen}
        onClose={() => setIsGabaritModalOpen(false)}
        title="Gabarit d'association des questions à une fiche de composition"
        subtitle="Associez vos questions avec options de réponses dynamiques adaptées à chaque type"
        maxWidth="4xl"
      >
        <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
          {/* Paramètres de l'épreuve & Barème direct */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intitulé de la fiche de composition
              </label>
              <input
                type="text"
                value={gabaritTitre}
                onChange={(e) => setGabaritTitre(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#7A1B29]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discipline d'enseignement
              </label>
              <select
                value={gabaritDiscipline}
                onChange={(e) => setGabaritDiscipline(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#7A1B29]"
              >
                {teacher.affectations.map((a) => (
                  <option key={a.id} value={a.discipline}>
                    {a.discipline} (Coef. {a.coefficient})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durée chronométrée (Minutes)
              </label>
              <input
                type="number"
                value={gabaritDuree}
                onChange={(e) => setGabaritDuree(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#7A1B29]"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                  Barème total associé :
                </span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {totalPointsGabarit} / 20 points
                </span>
              </div>

              {totalPointsGabarit === 20 ? (
                <Badge variant="success">Barème complet (20 / 20)</Badge>
              ) : totalPointsGabarit < 20 ? (
                <Badge variant="warning">Reste {20 - totalPointsGabarit} pts à attribuer</Badge>
              ) : (
                <Badge variant="danger">Dépassement (+{totalPointsGabarit - 20} pts)</Badge>
              )}
            </div>
          </div>

          {/* Constructeur d'une nouvelle question selon son type */}
          <div className="p-4 rounded-xl border-2 border-dashed border-[#7A1B29]/30 bg-[#FDF2F4]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#FBCFE8]">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#7A1B29]" />
                <span className="font-bold text-slate-900 text-sm">
                  Ajouter une question au gabarit
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Sélectionnez le type pour adapter les options
              </span>
            </div>

            {/* Sélecteur de type de question */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Type de la question :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'CHOIX_UNIQUE', label: 'QCM Choix unique' },
                  { id: 'CHOIX_MULTIPLES', label: 'QCM Choix multiples' },
                  { id: 'VRAI_FAUX', label: 'Vrai / Faux' },
                  { id: 'REPONSE_COURTE', label: 'Réponse courte' },
                  { id: 'QUESTION_OUVERTE', label: 'Cas clinique / Ouverte' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTypeChange(t.id as TypeQuestion)}
                    className={`p-2 rounded-xl text-center border text-[11px] font-semibold transition-all cursor-pointer ${
                      newQuestionType === t.id
                        ? 'bg-[#7A1B29] text-white border-[#7A1B29] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Énoncé & Points */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Énoncé de la question *
                </label>
                <textarea
                  rows={2}
                  value={newQuestionEnonce}
                  onChange={(e) => setNewQuestionEnonce(e.target.value)}
                  placeholder="Saisissez l’énoncé médical ou théorique..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#7A1B29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Barème (Points) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newQuestionPoints}
                  onChange={(e) => setNewQuestionPoints(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#7A1B29]"
                />
              </div>
            </div>

            {/* Options dynamiques adaptées au type choisi */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-3">
              {/* CAS 1 : QCM CHOIX UNIQUE */}
              {newQuestionType === 'CHOIX_UNIQUE' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-800 block text-[11px]">
                    Options de réponses (Cochez la seule bonne réponse) :
                  </span>
                  {newQuestionOptions.map((opt, index) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="qcm_unique_correct"
                        checked={opt.estCorrecte}
                        onChange={() => {
                          setNewQuestionOptions(
                            newQuestionOptions.map((o) => ({
                              ...o,
                              estCorrecte: o.id === opt.id,
                            }))
                          )
                        }}
                        className="text-[#7A1B29] cursor-pointer"
                        title="Marquer comme bonne réponse"
                      />
                      <span className="font-bold text-slate-400 text-xs w-4">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                        value={opt.texte}
                        onChange={(e) => {
                          const updated = [...newQuestionOptions]
                          updated[index].texte = e.target.value
                          setNewQuestionOptions(updated)
                        }}
                        className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs ${
                          opt.estCorrecte
                            ? 'border-emerald-500 bg-emerald-50/30 font-medium'
                            : 'border-slate-300'
                        }`}
                      />
                      {opt.estCorrecte && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Bonne réponse
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CAS 2 : QCM CHOIX MULTIPLES */}
              {newQuestionType === 'CHOIX_MULTIPLES' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-800 block text-[11px]">
                    Options de réponses (Cochez toutes les réponses correctes) :
                  </span>
                  {newQuestionOptions.map((opt, index) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={opt.estCorrecte}
                        onChange={(e) => {
                          const updated = [...newQuestionOptions]
                          updated[index].estCorrecte = e.target.checked
                          setNewQuestionOptions(updated)
                        }}
                        className="text-[#7A1B29] rounded cursor-pointer"
                        title="Cocher si correcte"
                      />
                      <span className="font-bold text-slate-400 text-xs w-4">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                        value={opt.texte}
                        onChange={(e) => {
                          const updated = [...newQuestionOptions]
                          updated[index].texte = e.target.value
                          setNewQuestionOptions(updated)
                        }}
                        className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs ${
                          opt.estCorrecte
                            ? 'border-emerald-500 bg-emerald-50/30 font-medium'
                            : 'border-slate-300'
                        }`}
                      />
                      {opt.estCorrecte && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Correcte
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CAS 3 : VRAI / FAUX */}
              {newQuestionType === 'VRAI_FAUX' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-800 block text-[11px]">
                    Réponse correcte attendue :
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="vf_choice"
                        checked={newQuestionOptions[0]?.estCorrecte}
                        onChange={() =>
                          setNewQuestionOptions([
                            { id: '1', texte: 'VRAI', estCorrecte: true },
                            { id: '2', texte: 'FAUX', estCorrecte: false },
                          ])
                        }
                      />
                      <span className="font-bold text-emerald-700">VRAI</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="vf_choice"
                        checked={newQuestionOptions[1]?.estCorrecte}
                        onChange={() =>
                          setNewQuestionOptions([
                            { id: '1', texte: 'VRAI', estCorrecte: false },
                            { id: '2', texte: 'FAUX', estCorrecte: true },
                          ])
                        }
                      />
                      <span className="font-bold text-rose-700">FAUX</span>
                    </label>
                  </div>
                </div>
              )}

              {/* CAS 4 : REPONSE COURTE */}
              {newQuestionType === 'REPONSE_COURTE' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Réponse textuelle ou mot-clé attendu (Auto-correction) :
                  </label>
                  <input
                    type="text"
                    value={newQuestionReponseCourte}
                    onChange={(e) => setNewQuestionReponseCourte(e.target.value)}
                    placeholder="Ex: Déchets d'Activités de Soins à Risques Infectieux"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              )}

              {/* CAS 5 : QUESTION OUVERTE / CAS CLINIQUE */}
              {newQuestionType === 'QUESTION_OUVERTE' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Guide de correction & critères d'évaluation pour le formateur :
                  </label>
                  <textarea
                    rows={2}
                    value={newQuestionGuide}
                    onChange={(e) => setNewQuestionGuide(e.target.value)}
                    placeholder="Ex: Changement de posture aux 2h, massage doux, avertir l'infirmier..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleAddQuestionToGabarit}
              className="w-full justify-center"
            >
              Associer cette question à la fiche de composition ({newQuestionPoints} pts)
            </Button>
          </div>

          {/* Liste des questions déjà associées à la fiche */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Questions associées à la fiche ({gabaritQuestions.length})</span>
              <span className="text-slate-500 font-mono text-xs">
                Total : {totalPointsGabarit} / 20 pts
              </span>
            </h4>

            {gabaritQuestions.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                Aucune question associée pour l'instant. Utilisez le formulaire ci-dessus.
              </p>
            ) : (
              gabaritQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-[#7A1B29] bg-[#FDF2F4] px-2 py-0.5 rounded text-xs">
                        Q{idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{q.enonce}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="neutral" size="sm">
                            {q.type}
                          </Badge>
                          <span className="font-mono font-bold text-slate-700 text-[11px]">
                            {q.points} points
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestionFromGabarit(q.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Retirer la question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Aperçu des options */}
                  {q.options && q.options.length > 0 && (
                    <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-1.5 rounded-md border flex items-center gap-1.5 ${
                            opt.estCorrecte
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.estCorrecte ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className="truncate">{opt.texte}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.reponseAttendueCourte && (
                    <div className="pl-8 text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-200">
                      <strong>Réponse attendue :</strong> {q.reponseAttendueCourte}
                    </div>
                  )}

                  {q.guideCorrection && (
                    <div className="pl-8 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <strong>Guide d'évaluation :</strong> {q.guideCorrection}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Actions d'enregistrement */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGabaritModalOpen(false)}
            >
              Annuler
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveFiche('EN_ATTENTE_PUBLICATION')}
              >
                Enregistrer en attente
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleSaveFiche('EN_COURS')}
              >
                Publier & Lancer la composition
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. MODAL DÉTAILS DE COMPOSITION POUR UNE FICHE PUBLIÉE ET TERMINÉE        */}
      {/* (DEMANDÉ PAR L'UTILISATEUR AVEC TOUS LES ÉTUDIANTS ET LEURS NOTES)        */}
      {/* ========================================================================= */}
      {selectedFicheDetails && (
        <Modal
          isOpen={!!selectedFicheDetails}
          onClose={() => setSelectedFicheDetails(null)}
          title="Détails de la composition & relevé des notes"
          subtitle={`${selectedFicheDetails.titre} • ${selectedFicheDetails.classe}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* 1. Informations complètes sur l'épreuve */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C59B27] block">
                    Épreuve officielle terminée
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedFicheDetails.titre}
                  </h3>
                </div>
                <Badge variant="gold">Procès-verbal officiel N° PV-2026-042</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-white/60 block text-[10px]">Discipline :</span>
                  <strong className="text-white font-medium">{selectedFicheDetails.discipline}</strong>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px]">Date de composition :</span>
                  <strong className="text-white font-medium">{selectedFicheDetails.dateComposition}</strong>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px]">Durée & Barème :</span>
                  <strong className="text-white font-mono">
                    {selectedFicheDetails.dureeMinutes} min • {selectedFicheDetails.totalPoints} pts
                  </strong>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px]">Enseignant responsable :</span>
                  <strong className="text-white font-medium">
                    {teacher.titre} {teacher.nom}
                  </strong>
                </div>
              </div>
            </div>

            {/* 2. KPIs synthétiques de la classe */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Moyenne de classe</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  {selectedFicheDetails.moyenneClasse?.toFixed(2)} / 20
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Note la plus haute</span>
                <span className="text-lg font-bold font-mono text-blue-700">
                  {selectedFicheDetails.noteMax?.toFixed(1)} / 20
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Note la plus basse</span>
                <span className="text-lg font-bold font-mono text-rose-700">
                  {selectedFicheDetails.noteMin?.toFixed(1)} / 20
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Participation</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {selectedFicheDetails.copiesSoumises} / {selectedFicheDetails.totalInscrits} (100 %)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block">Taux de réussite</span>
                <span className="text-lg font-bold font-mono text-[#7A1B29]">
                  {selectedFicheDetails.tauxReussite} %
                </span>
              </div>
            </div>

            {/* 3. Tableau de tous les étudiants ayant participé avec leurs notes respectives */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#7A1B29]" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    Relevé individuel des notes ({notesFiltrees.length} étudiants)
                  </h4>
                </div>

                {/* Filtres & Recherche */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Nom ou matricule..."
                      value={searchNotesQuery}
                      onChange={(e) => setSearchNotesQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#7A1B29]"
                    />
                  </div>

                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setFilterAdmis('TOUS')}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-md ${
                        filterAdmis === 'TOUS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setFilterAdmis('ADMIS')}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-md ${
                        filterAdmis === 'ADMIS' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Admis (≥ 10)
                    </button>
                    <button
                      onClick={() => setFilterAdmis('AJOURNES')}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-md ${
                        filterAdmis === 'AJOURNES' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Ajournés (&lt; 10)
                    </button>
                  </div>
                </div>
              </div>

              {/* Table des résultats */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Rang & Apprenant</th>
                        <th className="py-2.5 px-3">Matricule</th>
                        <th className="py-2.5 px-3">Statut</th>
                        <th className="py-2.5 px-3">Durée</th>
                        <th className="py-2.5 px-3">Justes</th>
                        <th className="py-2.5 px-3 text-right">Note (/20)</th>
                        <th className="py-2.5 px-3">Mention</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {notesFiltrees.map((etudiant, index) => {
                        const estAdmis = etudiant.noteSur20 >= 10
                        return (
                          <tr key={etudiant.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Apprenant */}
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold text-slate-400 w-4">
                                  #{index + 1}
                                </span>
                                <img
                                  src={etudiant.photoUrl}
                                  alt={etudiant.nom}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <strong className="text-slate-900 block leading-tight">
                                    {etudiant.nom} {etudiant.prenoms}
                                  </strong>
                                </div>
                              </div>
                            </td>

                            {/* Matricule */}
                            <td className="py-2 px-3 font-mono text-[11px] text-[#7A1B29] font-bold">
                              {etudiant.matricule}
                            </td>

                            {/* Statut AFF/NAFF */}
                            <td className="py-2 px-3">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  etudiant.statutAff === 'AFF'
                                    ? 'bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A]'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {etudiant.statutAff}
                              </span>
                            </td>

                            {/* Durée */}
                            <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                              {etudiant.dureeMinutes} min
                            </td>

                            {/* Questions justes */}
                            <td className="py-2 px-3 font-mono text-slate-700">
                              {etudiant.questionsReussies} / {etudiant.totalQuestions}
                            </td>

                            {/* Note / 20 */}
                            <td className="py-2 px-3 text-right">
                              <span
                                className={`font-mono font-bold text-sm px-2 py-0.5 rounded-lg ${
                                  etudiant.noteSur20 >= 16
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : etudiant.noteSur20 >= 14
                                    ? 'bg-blue-100 text-blue-800'
                                    : etudiant.noteSur20 >= 10
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {etudiant.noteSur20.toFixed(2)}
                              </span>
                            </td>

                            {/* Mention */}
                            <td className="py-2 px-3">
                              <span
                                className={`text-[10px] font-semibold ${
                                  estAdmis ? 'text-slate-700' : 'text-rose-600 font-bold'
                                }`}
                              >
                                {etudiant.mention}
                              </span>
                            </td>

                            {/* Action : Voir la copie */}
                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => setSelectedCopieEtudiant(etudiant)}
                                className="p-1 rounded-lg text-[#7A1B29] hover:bg-[#FDF2F4] transition-colors cursor-pointer"
                                title="Consulter la copie de l'étudiant"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Actions d'exportation */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Notes transmises au relevé semestriel pour le calcul des bulletins officiels.
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => toast.success('Génération du procès-verbal PDF de composition.')}
                >
                  Imprimer PV d'examen
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedFicheDetails(null)}
                >
                  Fermer les détails
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 3. SOUS-MODAL : COPIE INDIVIDUELLE DE L'ÉTUDIANT                          */}
      {/* ========================================================================= */}
      {selectedCopieEtudiant && (
        <Modal
          isOpen={!!selectedCopieEtudiant}
          onClose={() => setSelectedCopieEtudiant(null)}
          title={`Copie d'examen — ${selectedCopieEtudiant.nom} ${selectedCopieEtudiant.prenoms}`}
          subtitle={`Matricule : ${selectedCopieEtudiant.matricule} • Note finale : ${selectedCopieEtudiant.noteSur20} / 20`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[10px] block">Apprenant :</span>
                <strong className="text-slate-900 text-sm">
                  {selectedCopieEtudiant.nom} {selectedCopieEtudiant.prenoms}
                </strong>
                <span className="text-slate-500 block text-[11px]">
                  Temps passé : {selectedCopieEtudiant.dureeMinutes} min • Surveillance webcam :{' '}
                  <strong className="text-emerald-700">Conforme (100 %)</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Note attribuée :</span>
                <span className="font-mono text-xl font-bold text-[#7A1B29]">
                  {selectedCopieEtudiant.noteSur20.toFixed(2)} / 20
                </span>
              </div>
            </div>

            {/* Réponses détaillées */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-xs">Détails des questions traitées :</h5>
              {QUESTIONS_GABARIT_DEMO.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800">
                      Q{idx + 1}. {q.enonce}
                    </span>
                    <Badge variant="success" size="sm">
                      {q.points} / {q.points} pts
                    </Badge>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-900 text-[11px]">
                    <strong>Réponse soumise par l'étudiant :</strong> Conforme aux critères d'évaluation.
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCopieEtudiant(null)}
              >
                Fermer la copie
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL APERÇU ÉTUDIANT                                                  */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPreviewStudentModalOpen}
        onClose={() => setIsPreviewStudentModalOpen(false)}
        title="Aperçu de l'épreuve (Vue étudiant)"
        subtitle="Expérience exacte de composition surveillée telle que perçue par vos apprenants"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Composition N°1 — Soins Infirmiers Fondamentaux
              </h4>
              <p className="text-slate-500 text-[11px]">Durée restante : 44 min 50 s</p>
            </div>
            <Badge variant="johmann">Vue simulation</Badge>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <span className="font-bold text-slate-900 text-sm block">
              Question 1 : Quelle est la première étape fondamentale avant tout acte de soins ?
            </span>
            <div className="space-y-1.5 pl-2">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input type="radio" name="preview-q1" defaultChecked className="text-[#7A1B29]" />
                <span>Le lavage antiseptique des mains à la friction hydro-alcoolique</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input type="radio" name="preview-q1" className="text-[#7A1B29]" />
                <span>L’administration préalable d’un antalgique</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
