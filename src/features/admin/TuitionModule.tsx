import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  PlusCircle,
  Download,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { tuitionService } from '@/services/tuitionService'
import { studentService } from '@/services/studentService'
import { Versement } from '@/core/types/tuition'
import { Student } from '@/core/types/student'
import { toast } from 'sonner'

interface TuitionModuleProps {
  onOpenReceipt: (v: Versement) => void
}

export function TuitionModule({ onOpenReceipt }: TuitionModuleProps) {
  const [versements, setVersements] = useState<Versement[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false)

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [montant, setMontant] = useState('50000')
  const [tranche, setTranche] = useState('3')
  const [modePaiement, setModePaiement] = useState<'ESPECES' | 'WAVE' | 'ORANGE_MONEY' | 'VIREMENT'>('WAVE')
  const [reference, setReference] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [vList, sList] = await Promise.all([tuitionService.getAll(), studentService.getAll()])
    setVersements(vList)
    setStudents(sList)
    if (sList.length > 0 && !selectedStudentId) {
      setSelectedStudentId(sList[1].id) // Default to someone who has remaining balance
    }
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const student = students.find((s) => s.id === selectedStudentId)
    if (!student) return

    const montantNum = Number(montant)
    const nouveauReste = Math.max(0, student.scolarite.resteAPayer - montantNum)

    const newV = await tuitionService.addVersement({
      studentId: student.id,
      matricule: student.matricule,
      studentNomComplet: `${student.nom} ${student.prenoms}`,
      classe: student.classe,
      filiere: student.filiere,
      numeroTranche: Number(tranche),
      montant: montantNum,
      datePaiement: new Date().toLocaleDateString('fr-FR'),
      modePaiement: modePaiement,
      referenceTransaction: reference || `REF-${Date.now().toString().slice(-6)}`,
      agentEncaissement: 'M. MEA KOUAKOU FELIX',
      resteDuApresVersement: nouveauReste,
    })

    // Update local student remaining
    student.scolarite.totalPaye += montantNum
    student.scolarite.resteAPayer = nouveauReste
    student.scolarite.aJour = nouveauReste === 0

    setIsNewPaymentModalOpen(false)
    loadData()
    toast.success(`Versement enregistré ! Reçu ${newV.numeroRecu} généré.`)
    onOpenReceipt(newV)
  }

  const filteredVersements = versements.filter(
    (v) =>
      v.studentNomComplet.toLowerCase().includes(search.toLowerCase()) ||
      v.matricule.toLowerCase().includes(search.toLowerCase()) ||
      v.numeroRecu.toLowerCase().includes(search.toLowerCase())
  )

  const impayes = students.filter((s) => !s.scolarite.aJour)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scolarité & Trésorerie</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Échéancier jusqu'à 8 versements, émission de reçus de caisse PDF numérotés et suivi des impayés
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsNewPaymentModalOpen(true)}
        >
          Enregistrer un Versement
        </Button>
      </div>

      {/* Impayés Alert Banner */}
      {impayes.length > 0 && (
        <Card variant="subtle" className="p-4 border-amber-200 bg-amber-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900">
                  {impayes.length} étudiant(s) avec des échéances de scolarité en attente
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Total des créances restantes à recouvrer :{' '}
                  <strong className="text-amber-800 font-mono">
                    {impayes.reduce((acc, s) => acc + s.scolarite.resteAPayer, 0).toLocaleString('fr-FR')} FCFA
                  </strong>
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Relance automatique par SMS / Email déclenchée.')}
            >
              Relancer par SMS
            </Button>
          </div>
        </Card>
      )}

      {/* Filter toolbar */}
      <Card variant="clean" className="p-4">
        <Input
          placeholder="Rechercher par numéro de reçu (ex: REC-2024), nom d'étudiant ou matricule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Versements Table */}
      <Card variant="clean" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">N° Reçu Officiel</th>
                <th className="py-3 px-4">Étudiant & Matricule</th>
                <th className="py-3 px-4">Tranche</th>
                <th className="py-3 px-4">Montant Versé</th>
                <th className="py-3 px-4">Mode / Référence</th>
                <th className="py-3 px-4">Date & Agent</th>
                <th className="py-3 px-4 text-right">Actions Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVersements.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#7A1B29]">
                    {v.numeroRecu}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{v.studentNomComplet}</span>
                    <span className="font-mono text-[11px] text-slate-400">{v.matricule} • {v.filiere}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                      Tranche {v.numeroTranche}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-700 block">
                      {v.montant.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Reste dû : {v.resteDuApresVersement.toLocaleString('fr-FR')} F
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={v.modePaiement === 'WAVE' ? 'info' : 'neutral'}>
                      {v.modePaiement}
                    </Badge>
                    {v.referenceTransaction && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {v.referenceTransaction}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-medium block">{v.datePaiement}</span>
                    <span className="text-[10px] text-slate-400">{v.agentEncaissement}</span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => onOpenReceipt(v)}
                    >
                      Imprimer Reçu
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Nouveau Versement */}
      <Modal
        isOpen={isNewPaymentModalOpen}
        onClose={() => setIsNewPaymentModalOpen(false)}
        title="Enregistrement d'un Versement de Scolarité"
        subtitle="Génération automatique du reçu officiel PDF numéroté"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sélectionnez l'Étudiant
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7A1B29]"
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom} {s.prenoms} ({s.matricule}) — Reste dû : {s.scolarite.resteAPayer.toLocaleString('fr-FR')} FCFA
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Montant Versé (FCFA)"
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
              className="font-mono font-bold"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro de Tranche
              </label>
              <select
                value={tranche}
                onChange={(e) => setTranche(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7A1B29]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
                  <option key={t} value={t}>
                    Tranche N° {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mode de Paiement
              </label>
              <select
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7A1B29]"
              >
                <option value="WAVE">WAVE Côte d'Ivoire</option>
                <option value="ORANGE_MONEY">Orange Money</option>
                <option value="ESPECES">Espèces au Guichet</option>
                <option value="VIREMENT">Virement Bancaire</option>
              </select>
            </div>

            <Input
              label="Référence Transaction / Bordereau"
              placeholder="ex: WV-87612345"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Valider l'Encaissement & Émettre le Reçu PDF
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
