import { useState } from 'react'
import {
  FileSpreadsheet,
  Save,
  CheckCircle,
  Clock,
  UserCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

export function TeacherGradingModule() {
  const [grades, setGrades] = useState([
    { id: '1', matricule: 'JF-2024-0012', nom: 'KOUASSI Aya Marie-Estelle', statutPresence: 'PRESENT', noteAuto: 14, noteManuelle: 4, total: 18, appreciation: 'Excellent travail' },
    { id: '2', matricule: 'JF-2024-0025', nom: 'DIABATE Sekou Oumar', statutPresence: 'PRESENT', noteAuto: 10, noteManuelle: 2, total: 12, appreciation: 'Ensemble convenable' },
    { id: '3', matricule: 'JF-2024-0038', nom: 'YAO Affoué Christine', statutPresence: 'PRESENT', noteAuto: 12, noteManuelle: 3, total: 15, appreciation: 'Bonne analyse' },
    { id: '4', matricule: 'JF-2024-0044', nom: 'KONE Ibrahim Moussa', statutPresence: 'ABSENT_NJ', noteAuto: 0, noteManuelle: 0, total: 0, appreciation: 'Absent non justifié' },
  ])

  const handleGradeChange = (id: string, newManualNote: number) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const tot = Math.min(20, g.noteAuto + newManualNote)
          return { ...g, noteManuelle: newManualNote, total: tot }
        }
        return g
      })
    )
  }

  const handleSaveGrades = () => {
    toast.success('Grille de notes enregistrée avec succès !', {
      description: 'Les notes sont synchronisées et prêtes pour la validation administrative.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saisie & Correction des Notes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Correction manuelle motivée des questions ouvertes, distinction des absents et synchronisation hors-ligne
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
            onClick={() => toast.info('Importation de la grille de notes depuis Excel.')}
          >
            Importer Grille Excel
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSaveGrades}
          >
            Enregistrer les Notes
          </Button>
        </div>
      </div>

      {/* Course context bar */}
      <Card variant="subtle" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 text-sm">Contrôle Continu N°2 — Soins Infirmiers</span>
          <p className="text-slate-500">Classe : Aide-Soignante 1ère Année • Semestre 2 • Barème : 20 pts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Auto-correction QCM active</Badge>
          <Badge variant="johmann">Questions ouvertes : 6 pts</Badge>
        </div>
      </Card>

      {/* Grading Table */}
      <Card variant="clean" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Étudiant & Matricule</th>
                <th className="py-3 px-4">Présence</th>
                <th className="py-3 px-4">Auto QCM (/14)</th>
                <th className="py-3 px-4">Correction Manuelle (/6)</th>
                <th className="py-3 px-4">Note Finale (/20)</th>
                <th className="py-3 px-4">Observation Correcteur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{g.nom}</span>
                    <span className="font-mono text-[11px] text-[#7A1B29]">{g.matricule}</span>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={g.statutPresence}
                      onChange={(e) => {
                        const val = e.target.value
                        setGrades((prev) =>
                          prev.map((item) => (item.id === g.id ? { ...item, statutPresence: val } : item))
                        )
                      }}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="PRESENT">Présent</option>
                      <option value="ABSENT_J">Absent Justifié</option>
                      <option value="ABSENT_NJ">Absent Non Justifié</option>
                      <option value="DISPENSE">Dispensé</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {g.statutPresence === 'PRESENT' ? `${g.noteAuto} pts` : '—'}
                  </td>

                  <td className="py-3 px-4">
                    {g.statutPresence === 'PRESENT' ? (
                      <input
                        type="number"
                        min="0"
                        max="6"
                        step="0.5"
                        value={g.noteManuelle}
                        onChange={(e) => handleGradeChange(g.id, Number(e.target.value))}
                        className="w-16 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900 focus:border-[#7A1B29]"
                      />
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold text-sm ${
                        g.total >= 10 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {g.statutPresence === 'PRESENT' ? `${g.total.toFixed(1)} / 20` : 'ABS'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={g.appreciation}
                      onChange={(e) => {
                        const val = e.target.value
                        setGrades((prev) =>
                          prev.map((item) => (item.id === g.id ? { ...item, appreciation: val } : item))
                        )
                      }}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 placeholder:text-slate-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
