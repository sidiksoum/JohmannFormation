import { BookOpen, CreditCard, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Student } from '@/core/types/student'

interface StudentDashboardProps {
  student: Student
  onNavigateTab: (tab: string) => void
}

export function StudentDashboard({ student, onNavigateTab }: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Salutation compacte sur mobile pour libérer l'espace d'apprentissage */}
      <div className="md:hidden pb-1 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">
            Bonjour, {student.prenoms} 👋
          </h1>
          <p className="text-xs text-slate-500">
            {student.filiere} • {student.classe}
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-[#7A1B29] bg-[#FDF2F4] px-2 py-0.5 rounded-lg border border-[#FBCFE8]">
          {student.matricule}
        </span>
      </div>

      {/* Student ID Card (Visible uniquement sur tablettes et écrans larges md+, masqué sur mobile car accessible via l'icône profil) */}
      <Card variant="clean" className="hidden md:block p-6 border-l-4 border-l-[#7A1B29]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student.photoUrl}
              alt={student.nom}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {student.nom} {student.prenoms}
                </h1>
                <Badge variant={student.statut === 'AFF' ? 'gold' : 'neutral'}>
                  {student.statut === 'AFF' ? 'Affecté de l’État (AFF)' : 'Non affecté (NAFF)'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 mt-1">
                Filière : <strong className="text-slate-900">{student.filiere}</strong> • {student.classe}
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                <span className="text-[#7A1B29] font-bold">Matricule : {student.matricule}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Année académique : {student.anneeAcademique}</span>
              </div>
            </div>
          </div>

          <div className="sm:text-right space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 block">Situation de scolarité :</span>
            <div className="flex sm:justify-end items-center gap-2">
              <span className="font-bold text-sm text-slate-900 font-mono">
                {student.scolarite.totalPaye.toLocaleString('fr-FR')} / {student.scolarite.totalDu.toLocaleString('fr-FR')} FCFA
              </span>
              <Badge variant={student.scolarite.aJour ? 'success' : 'danger'}>
                {student.scolarite.aJour ? 'À jour' : 'Échéance en cours'}
              </Badge>
            </div>
            <button
              onClick={() => onNavigateTab('tuition')}
              className="text-xs text-[#7A1B29] font-semibold hover:underline block cursor-pointer"
            >
              Voir l'historique de mes reçus →
            </button>
          </div>
        </div>
      </Card>

      {/* Action shortcuts / Ongoing notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Évaluation Ouverte */}
        <Card variant="clean" className="p-5 flex flex-col justify-between border-2 border-emerald-200 bg-emerald-50/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Clock className="w-5 h-5" />
              </div>
              <Badge variant="success">Épreuve ouverte</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Contrôle continu N°2 — Soins infirmiers</h3>
            <p className="text-xs text-slate-500 mt-1">
              Durée : 45 min • Barème : 20 pts • Surveillance webcam requise
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full mt-4 justify-between"
            onClick={() => onNavigateTab('exam')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            <span>Démarrer l'épreuve</span>
          </Button>
        </Card>

        {/* Dernier Bulletin Officiel */}
        <Card variant="clean" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-[#7A1B29]">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant="gold">Validé et signé</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Bulletin du deuxième semestre</h3>
            <p className="text-xs text-slate-500 mt-1">
              Moyenne : <strong className="font-mono text-emerald-700 font-bold">15.49 / 20</strong> • Rang : 2e / 55
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4 justify-between"
            onClick={() => onNavigateTab('reportCard')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            <span>Télécharger mon bulletin PDF</span>
          </Button>
        </Card>

        {/* Mes Reçus de Caisse */}
        <Card variant="clean" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                <CreditCard className="w-5 h-5" />
              </div>
              <Badge variant="success">4 reçus émis</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Versements de scolarité</h3>
            <p className="text-xs text-slate-500 mt-1">
              Total acquitté : <strong className="font-mono font-bold text-slate-800">350 000 FCFA</strong> (Solde soldé)
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4 justify-between"
            onClick={() => onNavigateTab('tuition')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            <span>Mes reçus officiels</span>
          </Button>
        </Card>
      </div>
    </div>
  )
}
