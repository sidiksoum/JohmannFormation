import { useState } from 'react'
import { Save, CheckCircle2, MessageSquare, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Teacher } from '@/core/types/teacher'
import { toast } from 'sonner'

interface TeacherAppreciationsModuleProps {
  teacher: Teacher
}

export function TeacherAppreciationsModule({ teacher }: TeacherAppreciationsModuleProps) {
  const [appreciations, setAppreciations] = useState([
    { matricule: 'JF-2024-0012', nom: 'KOUASSI Aya Marie-Estelle', moyenne: 16.0, appreciation: 'Très bon travail, rigoureuse en pratique clinique et assidue.' },
    { matricule: 'JF-2024-0025', nom: 'DIABATE Sekou Oumar', moyenne: 12.5, appreciation: 'Ensemble convenable. Peut mieux faire en approfondissant les cours théoriques.' },
    { matricule: 'JF-2024-0038', nom: 'YAO Affoué Christine', moyenne: 15.0, appreciation: 'Bonne participation en atelier pratique et sens de l’écoute développé.' },
    { matricule: 'JF-2024-0044', nom: 'KONE Ibrahim Moussa', moyenne: 9.5, appreciation: 'Résultats insuffisants. Manque de régularité dans le travail personnel.' },
  ])

  const handleSave = () => {
    toast.success('Appréciations enregistrées !', {
      description: 'Elles sont automatiquement injectées sur les bulletins de notes officiels.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appréciations pour le Bulletin Officiel</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vos remarques et votre signature apparaîtront automatiquement sur chaque bulletin semestriel de l’étudiant
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          Valider les Appréciations
        </Button>
      </div>

      <Card variant="subtle" className="p-4 text-xs flex items-center justify-between border-amber-200 bg-amber-50/40">
        <div className="flex items-center gap-2 text-amber-900">
          <Award className="w-4 h-4 text-[#C59B27]" />
          <span>Discipline sélectionnée : <strong>Soins-infirmiers (Aide-Soignante 1ère Année)</strong></span>
        </div>
        <span className="text-slate-500">Formateur référent : <strong>{teacher.titre} {teacher.nom} {teacher.prenoms}</strong></span>
      </Card>

      <div className="space-y-3">
        {appreciations.map((app, idx) => (
          <Card key={app.matricule} variant="clean" className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{app.nom}</span>
                <span className="font-mono text-[11px] text-[#7A1B29]">{app.matricule}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Moyenne Discipline :</span>
                <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {app.moyenne.toFixed(1)} / 20
                </span>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Appréciation du Formateur pour le Bulletin :
              </label>
              <textarea
                rows={2}
                value={app.appreciation}
                onChange={(e) => {
                  const val = e.target.value
                  setAppreciations((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, appreciation: val } : item))
                  )
                }}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#7A1B29] focus:bg-white transition-all"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
