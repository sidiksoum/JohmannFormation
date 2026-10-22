import { useEffect, useState } from 'react'
import { FileText, Download, Printer, Award, QrCode, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { reportCardService } from '@/services/reportCardService'
import { BulletinNotes } from '@/core/types/reportCard'
import { Student } from '@/core/types/student'

interface StudentReportCardProps {
  student: Student
  onOpenReportCard: (b: BulletinNotes) => void
}

export function StudentReportCard({ student, onOpenReportCard }: StudentReportCardProps) {
  const [bulletin, setBulletin] = useState<BulletinNotes | null>(null)

  useEffect(() => {
    reportCardService.getByStudentId(student.id).then(setBulletin)
  }, [student.id])

  if (!bulletin) {
    return (
      <Card variant="clean" className="p-8 text-center text-slate-500">
        <p className="text-sm">Aucun bulletin de notes publié pour le moment.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon Bulletin de Notes Officiel</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Édition officielle certifiée par le Directeur des Études de Johmann Formation (Grand-Lahou)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => onOpenReportCard(bulletin)}
          >
            Consulter & Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <Card variant="clean" className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF9EB] border border-[#FDE68A] flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-[#C59B27]" />
            </div>

            <div className="space-y-1">
              <Badge variant="gold">{bulletin.semestre} // {bulletin.anneeScolaire}</Badge>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Félicitations pour vos résultats !
              </h2>
              <p className="text-xs text-slate-500">
                Filière : <strong className="text-slate-800">{bulletin.filiere}</strong> • {bulletin.classe}
              </p>
              <p className="text-xs text-slate-600 italic pt-1">
                Avis du Conseil : "{bulletin.appreciationConseil}"
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Moyenne S2</span>
              <span className="font-mono font-black text-xl text-[#7A1B29]">
                {bulletin.moyenneSemestrielle.toFixed(2)} / 20
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Rang S2</span>
              <span className="font-mono font-bold text-xl text-slate-800">
                {bulletin.rangSemestre}e / {bulletin.effectifClasse}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Moyenne Annuelle</span>
              <span className="font-mono font-bold text-xl text-emerald-700">
                {bulletin.moyenneAnnuelle} / 20
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Décision</span>
              <span className="font-bold text-xs text-emerald-800 block mt-1">
                Admis(e) en 2e Année
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-slate-700" />
            <span>Document authentifié avec QR Code • Code : <strong className="font-mono text-slate-800">{bulletin.codeVerification}</strong></span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenReportCard(bulletin)}
          >
            Voir la maquette officielle du bulletin
          </Button>
        </div>
      </Card>
    </div>
  )
}
