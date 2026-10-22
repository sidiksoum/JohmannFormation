import { useState, useEffect } from 'react'
import {
  UserCheck,
  BookOpen,
  Plus,
  Shield,
  Layers,
  Phone,
  Mail,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { teacherService } from '@/services/teacherService'
import { Teacher } from '@/core/types/teacher'
import { toast } from 'sonner'

export function TeachersModule() {
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    teacherService.getAll().then(setTeachers)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Enseignants & Affectations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Règle de cloisonnement : Enseignant + Discipline + Classe + Semestre = Droits ciblés de saisie
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => toast.info('Ajout d’un formateur ou vacataire.')}
        >
          Nouvel Enseignant
        </Button>
      </div>

      {/* Teachers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teachers.map((t) => (
          <Card key={t.id} variant="clean" className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={t.photoUrl}
                    alt={t.nom}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {t.titre} {t.nom} {t.prenoms}
                      </h3>
                      {t.estFormateurPrincipal && (
                        <Badge variant="gold" size="sm">
                          Formateur Principal
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-[#7A1B29] font-medium block">{t.specialite}</span>
                    <Badge variant={t.statut === 'PERMANENT' ? 'johmann' : 'neutral'} size="sm" className="mt-1">
                      {t.statut}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="py-2.5 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {t.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {t.contact}
                </span>
              </div>

              {/* Affectations Disciplines */}
              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Disciplines Assignées ({t.affectations.length})
                </span>
                <div className="space-y-1.5">
                  {t.affectations.map((aff) => (
                    <div
                      key={aff.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{aff.discipline}</span>
                        <span className="text-[10px] text-slate-400 block">{aff.classe} • Semestre : {aff.semestre}</span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        Coef. {aff.coefficient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <Button variant="outline" size="sm">
                Modifier Affectations
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
