import { useEffect, useState } from 'react'
import { CheckCircle, Award, Eye, ShieldCheck, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { evaluationService } from '@/services/evaluationService'
import { CopieEtudiant } from '@/core/types/evaluation'
import { Student } from '@/core/types/student'

interface StudentGradesProps {
  student: Student
}

export function StudentGrades({ student }: StudentGradesProps) {
  const [copies, setCopies] = useState<CopieEtudiant[]>([])

  useEffect(() => {
    evaluationService.getCompletedByStudent(student.id).then(setCopies)
  }, [student.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mes Évaluations & Notes Publiées</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique de vos épreuves, scores détaillés et statut de conformité de la surveillance photo
          </p>
        </div>

        <Badge variant="johmann" size="md">
          {student.filiere} • {student.classe}
        </Badge>
      </div>

      <div className="space-y-4">
        {copies.map((c) => (
          <Card key={c.id} variant="clean" className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Contrôle Continu N°2 — Soins Infirmiers</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Soumis le {c.dateSoumission} • Durée : {Math.round(c.dureeEcouleeSecondes / 60)} minutes
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="font-mono font-bold text-lg text-emerald-700">
                      {c.noteSur20} / 20
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">
                      <strong>{c.bonnesReponses}</strong> bonnes réponses sur 4 questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right space-y-2">
                <div className="flex items-center sm:justify-end gap-1.5 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Surveillance Photo Conforme</span>
                </div>
                <Badge variant="success">Note Officielle Publiée</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
