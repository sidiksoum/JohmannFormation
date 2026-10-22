import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Versement } from '@/core/types/tuition'

interface OfficialReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  versement: Versement | null
}

export function OfficialReceiptModal({ isOpen, onClose, versement }: OfficialReceiptModalProps) {
  if (!versement) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reçu de Caisse Officiel"
      subtitle={`Numéro : ${versement.numeroRecu}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex justify-end gap-2 no-print">
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Imprimer le Reçu
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handlePrint}>
            Télécharger PDF
          </Button>
        </div>

        {/* Printable Official Receipt Area */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-8 text-slate-900 shadow-sm print-area">
          {/* Header */}
          <div className="border-b-2 border-[#7A1B29] pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo_johmann.png"
                alt="Logo Johmann Formation"
                className="w-13 h-13 object-contain shrink-0"
              />
              <div>
                <h2 className="font-extrabold text-lg tracking-tight text-[#7A1B29]">JOHMANN FORMATION</h2>
                <p className="text-[11px] text-slate-600 font-medium">Cabinet de Formation Agréé par l'État à Grand-Lahou</p>
                <p className="text-[10px] text-slate-500">Décision N° 2012-1425 / METFP / CAB / DEP</p>
                <p className="text-[10px] text-slate-500">Quartier populaire derrière le stade • Contact : 07 59 56 11 50</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-[#FDF2F4] text-[#7A1B29] font-mono font-bold text-xs px-3 py-1.5 rounded-lg border border-[#FBCFE8]">
                {versement.numeroRecu}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Date : <span className="font-semibold text-slate-800">{versement.datePaiement}</span></p>
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-center my-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Attestation Officielle d'Encaissement</span>
            <h1 className="text-2xl font-black text-[#7A1B29] tracking-tight mt-1">
              REÇU DE SCOLARITÉ
            </h1>
          </div>

          {/* Student & Payment details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Nom & Prénoms :</span>
              <span className="font-bold text-sm text-slate-900">{versement.studentNomComplet}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Matricule Étudiant :</span>
              <span className="font-mono font-bold text-sm text-[#7A1B29]">{versement.matricule}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Filière de Formation :</span>
              <span className="font-semibold text-slate-800">{versement.filiere}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Classe / Niveau :</span>
              <span className="font-semibold text-slate-800">{versement.classe}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="my-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase block tracking-wider">
                Versement Tranche N° {versement.numeroTranche}
              </span>
              <p className="text-xs text-slate-600 mt-0.5">Mode de règlement : <strong className="font-bold text-slate-800">{versement.modePaiement}</strong> {versement.referenceTransaction ? `(Réf : ${versement.referenceTransaction})` : ''}</p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold font-mono text-emerald-700">
                {versement.montant.toLocaleString('fr-FR')} FCFA
              </span>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Solde restant dû : <strong className="text-slate-900">{versement.resteDuApresVersement.toLocaleString('fr-FR')} FCFA</strong>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 text-xs">
            <div>
              <span className="text-slate-500 block">Agent Caissier :</span>
              <span className="font-bold text-slate-800 mt-1 block">{versement.agentEncaissement}</span>
              <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>Paiement certifié & enregistré</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-500 block">Cachet & Signature de la Direction :</span>
              <div className="mt-2 inline-block border-2 border-dashed border-[#7A1B29]/30 rounded-xl px-4 py-3 text-center">
                <span className="text-[10px] font-bold text-[#7A1B29] uppercase tracking-wider block">JOHMANN FORMATION</span>
                <span className="text-[9px] text-slate-500 block">Direction des Études</span>
                <ShieldCheck className="w-5 h-5 mx-auto text-[#7A1B29] mt-1 opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
