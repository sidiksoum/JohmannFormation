import { Printer, Download, QrCode } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { BulletinNotes } from '@/core/types/reportCard'

interface OfficialReportCardModalProps {
  isOpen: boolean
  onClose: () => void
  bulletin: BulletinNotes | null
}

export function OfficialReportCardModal({ isOpen, onClose, bulletin }: OfficialReportCardModalProps) {
  if (!bulletin) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulletin Officiel de Notes"
      subtitle={`${bulletin.semestre} • Année ${bulletin.anneeScolaire}`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Actions bar */}
        <div className="flex justify-end gap-2 no-print">
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Imprimer
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handlePrint}>
            Télécharger PDF
          </Button>
        </div>

        {/* Printable Bulletin Document (Reproduction fidèle de la maquette d'État) */}
        <div className="bg-white border-2 border-slate-400 p-6 md:p-8 text-slate-900 shadow-md font-sans print-area max-w-4xl mx-auto text-xs relative">
          {/* Filigrane discret du logo officiel au centre */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <img src="/logo_johmann.png" alt="Filigrane Johmann" className="w-80 h-80 object-contain" />
          </div>

          {/* En-tête officiel République de Côte d'Ivoire & Ministère */}
          <div className="flex items-start justify-between border-b border-slate-300 pb-3">
            {/* Logo officiel gauche */}
            <div className="flex items-center gap-2">
              <img
                src="/logo_johmann.png"
                alt="Logo Johmann Formation"
                className="w-13 h-13 object-contain shrink-0"
              />
              <div className="text-[10px] leading-tight">
                <span className="font-bold text-[#7A1B29] block uppercase">Johmann Formation</span>
                <span className="text-slate-500 block">Cabinet Agréé par l'État</span>
              </div>
            </div>

            {/* Titre central ministériel */}
            <div className="text-center flex-1 px-4">
              <p className="text-[10px] font-medium text-slate-700 uppercase">
                Ministère de l'Enseignement Technique, de la Formation Professionnelle et de l'Apprentissage
              </p>
              <p className="text-[10px] text-slate-500">Direction des Établissements Privés</p>
              <h2 className="text-base font-black tracking-tight text-[#7A1B29] mt-0.5 uppercase">
                Johmann Formation
              </h2>
              <div className="inline-block bg-[#FDF2F4] text-[#7A1B29] text-[11px] font-bold px-3 py-0.5 rounded-full border border-[#FBCFE8] mt-1">
                Bulletin du {bulletin.semestre} // {bulletin.anneeScolaire}
              </div>
            </div>

            {/* Devise nationale droite */}
            <div className="text-right text-[10px]">
              <span className="font-bold text-slate-800 block">République de Côte d'Ivoire</span>
              <span className="text-slate-500 italic block">Union - Discipline - Travail</span>
            </div>
          </div>

          {/* Fiche d'identification de l'étudiant */}
          <div className="my-3 p-3 bg-slate-50 border border-slate-300 rounded-lg grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
            <div>
              <span className="text-slate-500">Étudiant(e) :</span> <strong className="font-bold text-slate-900">{bulletin.studentNomComplet}</strong>
            </div>
            <div>
              <span className="text-slate-500">Matricule :</span> <strong className="font-mono font-bold text-[#7A1B29]">{bulletin.matricule}</strong>
            </div>
            <div>
              <span className="text-slate-500">Lieu de Naissance :</span> <span className="font-medium">{bulletin.lieuNaissance}</span>
            </div>
            <div>
              <span className="text-slate-500">Filière :</span> <strong className="font-bold text-slate-800">{bulletin.filiere}</strong>
            </div>
            <div>
              <span className="text-slate-500">Né(e) le :</span> <span className="font-medium">{bulletin.dateNaissance}</span> ({bulletin.sexe})
            </div>
            <div>
              <span className="text-slate-500">Effectif de la classe :</span> <span className="font-bold">{bulletin.effectifClasse} élèves</span>
            </div>
            <div>
              <span className="text-slate-500">Nationalité :</span> <span className="font-medium">{bulletin.nationalite}</span>
            </div>
            <div>
              <span className="text-slate-500">Classe :</span> <strong className="text-[#C59B27] font-bold">« {bulletin.classe} »</strong>
            </div>
          </div>

          {/* Tableau Officiel des Disciplines */}
          <div className="overflow-x-auto border border-slate-400">
            <table className="w-full text-[10px] border-collapse text-center">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-400 text-slate-800">
                  <th className="py-1 px-2 text-left border-r border-slate-300">Disciplines</th>
                  <th className="py-1 px-1 border-r border-slate-300">M.S1</th>
                  <th className="py-1 px-1 border-r border-slate-300">M.S2</th>
                  <th className="py-1 px-1 border-r border-slate-300">Coef</th>
                  <th className="py-1 px-1 border-r border-slate-300">Total</th>
                  <th className="py-1 px-1 border-r border-slate-300">Rang</th>
                  <th className="py-1 px-1 border-r border-slate-300">M.An</th>
                  <th className="py-1 px-1 border-r border-slate-300">Rg An</th>
                  <th className="py-1 px-2 border-r border-slate-300 text-left">Appréciations</th>
                  <th className="py-1 px-2 text-left">Formateur / Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {bulletin.disciplines.map((row, idx) => (
                  <tr key={row.discipline} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="py-1 px-2 text-left font-semibold text-slate-900 border-r border-slate-300">
                      {row.discipline}
                    </td>
                    <td className="py-1 px-1 font-mono border-r border-slate-300">{row.noteS1?.toFixed(1) || '—'}</td>
                    <td className="py-1 px-1 font-mono font-bold text-slate-900 border-r border-slate-300">{row.noteS2?.toFixed(1) || '—'}</td>
                    <td className="py-1 px-1 font-mono font-bold border-r border-slate-300">{row.coefficient}</td>
                    <td className="py-1 px-1 font-mono border-r border-slate-300">{row.totalPondere?.toFixed(1) || '—'}</td>
                    <td className="py-1 px-1 font-mono border-r border-slate-300">{row.rangS2 ? `${row.rangS2}e` : '—'}</td>
                    <td className="py-1 px-1 font-mono border-r border-slate-300">{row.moyenneAnnuelleDiscipline?.toFixed(2) || '—'}</td>
                    <td className="py-1 px-1 font-mono border-r border-slate-300">{row.rangAnnuelDiscipline ? `${row.rangAnnuelDiscipline}e` : '—'}</td>
                    <td className="py-1 px-2 text-left italic text-slate-600 border-r border-slate-300">{row.appreciation}</td>
                    <td className="py-1 px-2 text-left font-medium text-slate-800">{row.formateurNom}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-200 font-bold border-t-2 border-slate-400 text-slate-900">
                  <td className="py-1.5 px-2 text-left border-r border-slate-300">Totaux</td>
                  <td className="border-r border-slate-300">—</td>
                  <td className="border-r border-slate-300">—</td>
                  <td className="font-mono border-r border-slate-300">{bulletin.totalCoefficients}</td>
                  <td className="font-mono border-r border-slate-300">{bulletin.totalPoints.toFixed(1)}</td>
                  <td colSpan={5} className="py-1 px-3 text-right">
                    <span className="text-xs">Moy. Semestrielle : </span>
                    <strong className="text-sm font-mono text-[#7A1B29] font-black">{bulletin.moyenneSemestrielle.toFixed(2)}/20</strong>
                    <span className="ml-3 text-xs">Rang : </span>
                    <strong className="text-sm font-mono text-[#7A1B29] font-black">{bulletin.rangSemestre}e / {bulletin.effectifClasse}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Synthèse inférieure & Visas */}
          <div className="mt-3 grid grid-cols-3 gap-2 border border-slate-400 p-2.5 bg-slate-50 text-[10px] rounded-lg">
            {/* Colonne 1 : Assiduité & Moyennes extrêmes */}
            <div className="border-r border-slate-300 pr-2 space-y-1">
              <div>
                <span className="text-slate-500">Absences non justifiées :</span> <strong>{bulletin.heuresAbsenceNonJustifiees} Heure(s)</strong>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500">Plus forte moyenne :</span> <strong className="font-mono">{bulletin.plusForteMoyenne.toFixed(2)}/20</strong>
              </div>
              <div>
                <span className="text-slate-500">Plus faible moyenne :</span> <strong className="font-mono">{bulletin.plusFaibleMoyenne.toFixed(2)}/20</strong>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500">Moy. 1er Sem :</span> <strong className="font-mono">{bulletin.moyenneS1}/20</strong> (Rang: {bulletin.rangS1}e)
              </div>
              <div>
                <span className="text-slate-500">Moyenne Annuelle :</span> <strong className="font-mono text-[#7A1B29]">{bulletin.moyenneAnnuelle}/20</strong> (Rang: {bulletin.rangAnnuel}e)
              </div>
            </div>

            {/* Colonne 2 : Conseil de Formation */}
            <div className="border-r border-slate-300 px-2 space-y-1">
              <span className="font-bold text-slate-800 uppercase block">Appréciation du Conseil :</span>
              <p className="italic text-slate-700 bg-white p-1.5 rounded border border-slate-200 min-h-[45px]">
                "{bulletin.appreciationConseil}"
              </p>
              <div className="mt-1">
                <span className="text-slate-500">Décision de fin de formation :</span>
                <p className="font-bold text-emerald-800">{bulletin.decisionFinFormation}</p>
              </div>
              <p className="text-slate-600 pt-1 text-[9px]">Formateur Principal : <strong>{bulletin.formateurPrincipalNom}</strong></p>
            </div>

            {/* Colonne 3 : Visas & Cachet Officiel */}
            <div className="pl-2 flex flex-col justify-between text-right">
              <div>
                <span className="text-[10px] text-slate-500 block">{bulletin.lieuEdition}, le {bulletin.dateEdition}</span>
                <span className="font-bold text-slate-800 block uppercase mt-0.5">Le Directeur des Études</span>
                <p className="font-bold text-[#7A1B29] text-xs mt-1">{bulletin.directeurDesEtudesNom}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-[9px] text-slate-500 text-left">
                  <QrCode className="w-8 h-8 text-slate-800 shrink-0" />
                  <span>Authentifié QR Code METFP</span>
                </div>
                <div className="border-2 border-dashed border-[#7A1B29]/40 rounded px-2 py-1 text-center">
                  <span className="text-[8px] font-bold text-[#7A1B29] block">JOHMANN</span>
                  <span className="text-[7px] text-slate-500 block">VISA DIRECTION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page officiel du Cabinet */}
          <div className="mt-3 pt-2 border-t border-slate-300 text-center text-[9px] text-slate-500 leading-tight">
            <p className="font-semibold text-slate-700">
              Cabinet de Formation Agréé par l'État à Grand-Lahou Décision N° 2012-1425 / METFP / CAB / DEP
            </p>
            <p>Quartier populaire derrière le stade au sein de l'Établissement EL ITRATOU TAHIRA</p>
            <p className="text-[#7A1B29] font-medium font-mono">
              Contact : 07 59 56 11 50 / 07 08 37 01 01 / 01 40 07 15 08 / 01 03 33 81 33 • JOHMANN FORMATION
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
