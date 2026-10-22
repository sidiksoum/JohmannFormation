import { BookOpen, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Teacher } from '@/core/types/teacher'

interface TeacherDashboardProps {
  teacher: Teacher
  onNavigateTab: (tab: string) => void
}

export function TeacherDashboard({ teacher, onNavigateTab }: TeacherDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Studio Pédagogique Enseignant</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bienvenue, <strong className="text-slate-800">{teacher.titre} {teacher.nom} {teacher.prenoms}</strong> • Spécialité : {teacher.specialite}
          </p>
        </div>

        <Badge variant={teacher.estFormateurPrincipal ? 'gold' : 'johmann'} size="md">
          {teacher.estFormateurPrincipal ? 'Formateur Principal de Classe' : 'Enseignant Permanent'}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          titre="Matières Assignées"
          valeur={`${teacher.affectations.length} cours`}
          description="Aide-Soignante Première Année"
          icon={BookOpen}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-700"
          badgeText="Semestre 2"
          badgeVariant="neutral"
        />

        <StatCard
          titre="Copies à Corriger"
          valeur="2 en attente"
          description="Contrôle Continu N°2 Soins Infirmiers"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
          badgeText="Questions Ouvertes"
          badgeVariant="warning"
        />

        <StatCard
          titre="Appréciations Bulletin"
          valeur="96% saisies"
          description="48/50 étudiants commentés"
          icon={CheckCircle}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          badgeText="Prêt pour Visa"
          badgeVariant="success"
        />
      </div>

      {/* Mes Disciplines Assignées */}
      <Card variant="clean" className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Mes Classes & Disciplines d'Enseignement</h3>
            <p className="text-xs text-slate-500">Périmètre strict d'affectation et de saisie des notes</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('evaluations')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Créer un Devoir / QCM
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {teacher.affectations.map((aff) => (
            <div key={aff.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1B29]">
                Semestre {aff.semestre}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{aff.discipline}</h4>
              <p className="text-xs text-slate-500">{aff.classe}</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-400">Coefficient :</span>
                <span className="font-mono font-bold text-slate-800">{aff.coefficient}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
