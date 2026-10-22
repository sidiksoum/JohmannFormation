import { useEffect, useState } from 'react'
import { CreditCard, Download, CheckCircle, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { tuitionService } from '@/services/tuitionService'
import { Versement } from '@/core/types/tuition'
import { Student } from '@/core/types/student'

interface StudentTuitionProps {
  student: Student
  onOpenReceipt: (v: Versement) => void
}

export function StudentTuition({ student, onOpenReceipt }: StudentTuitionProps) {
  const [versements, setVersements] = useState<Versement[]>([])

  useEffect(() => {
    tuitionService.getByMatricule(student.matricule).then(setVersements)
  }, [student.matricule])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Situation de Scolarité & Reçus Officiels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi transparent des versements effectués et téléchargement de vos attestations de caisse numérotées
          </p>
        </div>

        <Badge variant={student.scolarite.aJour ? 'success' : 'warning'} size="md">
          {student.scolarite.aJour ? 'Scolarité Totalement Soldée' : 'Échéance en cours'}
        </Badge>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card variant="clean" className="p-5 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Montant Total de la Scolarité
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {student.scolarite.totalDu.toLocaleString('fr-FR')} FCFA
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Tarif Filière {student.filiere}</span>
        </Card>

        <Card variant="clean" className="p-5 text-center border-emerald-200 bg-emerald-50/20">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Total Déjà Acquitté
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
            {student.scolarite.totalPaye.toLocaleString('fr-FR')} FCFA
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block">{versements.length} versements enregistrés</span>
        </Card>

        <Card variant="clean" className="p-5 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Reste à Recouvrer
          </span>
          <span className="text-2xl font-bold font-mono text-[#7A1B29] mt-1 block">
            {student.scolarite.resteAPayer.toLocaleString('fr-FR')} FCFA
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {student.scolarite.resteAPayer === 0 ? 'Aucun impayé' : 'À régler selon l’échéancier'}
          </span>
        </Card>
      </div>

      {/* Receipts Table */}
      <Card variant="clean" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Historique de vos Reçus de Caisse</h3>
          <span className="text-xs text-slate-500">Document officiel infalsifiable</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">N° Reçu</th>
                <th className="py-3 px-4">Tranche</th>
                <th className="py-3 px-4">Montant Versé</th>
                <th className="py-3 px-4">Date de Paiement</th>
                <th className="py-3 px-4">Mode & Réf</th>
                <th className="py-3 px-4 text-right">Téléchargement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {versements.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#7A1B29]">
                    {v.numeroRecu}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700">Tranche N° {v.numeroTranche}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    {v.montant.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {v.datePaiement}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="neutral">{v.modePaiement}</Badge>
                    {v.referenceTransaction && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {v.referenceTransaction}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3.5 h-3.5 text-[#7A1B29]" />}
                      onClick={() => onOpenReceipt(v)}
                    >
                      Télécharger Reçu PDF
                    </Button>
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
