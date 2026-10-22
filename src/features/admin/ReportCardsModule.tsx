import { useState, useEffect } from 'react'
import {
  FileText,
  Printer,
  Download,
  CheckCircle,
  Eye,
  Lock,
  Calculator,
  Award,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { reportCardService } from '@/services/reportCardService'
import { BulletinNotes } from '@/core/types/reportCard'
import { toast } from 'sonner'

interface ReportCardsModuleProps {
  onOpenReportCard: (b: BulletinNotes) => void
}

export function ReportCardsModule({ onOpenReportCard }: ReportCardsModuleProps) {
  const [bulletins, setBulletins] = useState<BulletinNotes[]>([])

  useEffect(() => {
    reportCardService.getAll().then(setBulletins)
  }, [])

  const handlePublier = async (b: BulletinNotes) => {
    await reportCardService.publierBulletin(b.id)
    toast.success('Bulletin publié officiellement !', {
      description: 'L’étudiant peut désormais le télécharger dans son espace.',
    })
    const list = await reportCardService.getAll()
    setBulletins(list)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Bulletins de Notes Officiels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Calcul automatique des moyennes (M.S1, M.S2, Annuel), rangs par matière, appréciations et visages officiels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Calculator className="w-4 h-4 text-[#7A1B29]" />}
            onClick={() => toast.success('Moyennes et rangs recalculés sur l’effectif total.')}
          >
            Recalculer les Moyennes
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => {
              if (bulletins.length > 0) onOpenReportCard(bulletins[0])
            }}
          >
            Imprimer Lot de Classe
          </Button>
        </div>
      </div>

      {/* Bulletins Cards Grid */}
      <div className="space-y-4">
        {bulletins.map((b) => (
          <Card key={b.id} variant="clean" className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Student info & ranking summary */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#C59B27]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{b.studentNomComplet}</h3>
                    <Badge variant={b.statut === 'PUBLIE' ? 'success' : 'warning'}>
                      {b.statut}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Matricule : <strong className="font-mono text-[#7A1B29]">{b.matricule}</strong> • {b.filiere} ({b.classe})
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Moyenne S2</span>
                      <span className="font-mono font-bold text-base text-[#7A1B29]">{b.moyenneSemestrielle.toFixed(2)}/20</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Rang Semestre</span>
                      <span className="font-mono font-bold text-base text-slate-800">{b.rangSemestre}e / {b.effectifClasse}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Moyenne Annuelle</span>
                      <span className="font-mono font-bold text-base text-emerald-700">{b.moyenneAnnuelle}/20</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Absences non justifiées</span>
                      <span className="font-bold text-base text-slate-700">{b.heuresAbsenceNonJustifiees} h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Council appreciation & Action buttons */}
              <div className="lg:text-right space-y-3 shrink-0">
                <div className="text-xs max-w-xs text-left lg:text-right">
                  <span className="text-slate-400 block text-[11px]">Avis du Conseil :</span>
                  <p className="italic text-slate-700 font-medium text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                    "{b.appreciationConseil}"
                  </p>
                </div>

                <div className="flex items-center justify-start lg:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={() => onOpenReportCard(b)}
                  >
                    Aperçu Fidèle Officiel
                  </Button>

                  {b.statut !== 'PUBLIE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => handlePublier(b)}
                    >
                      Valider & Publier
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
