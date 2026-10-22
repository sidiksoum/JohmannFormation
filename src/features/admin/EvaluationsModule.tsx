import { useState, useEffect } from 'react'
import {
  BookOpen,
  Camera,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Lock,
  Eye,
  ShieldAlert,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { evaluationService } from '@/services/evaluationService'
import { Evaluation, CopieEtudiant, StatutSurveillanceCapture } from '@/core/types/evaluation'
import { toast } from 'sonner'

export function EvaluationsModule() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [copies, setCopies] = useState<CopieEtudiant[]>([])
  const [selectedCopie, setSelectedCopie] = useState<CopieEtudiant | null>(null)
  const [activeTab, setActiveTab] = useState<'sessions' | 'proctoring'>('proctoring')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [eList, cList] = await Promise.all([
      evaluationService.getAll(),
      evaluationService.getAllCopies(),
    ])
    setEvaluations(eList)
    setCopies(cList)
  }

  const handleStatuerCapture = async (
    copieId: string,
    captureId: string,
    statut: StatutSurveillanceCapture
  ) => {
    await evaluationService.updateSurveillanceStatut(
      copieId,
      captureId,
      statut,
      `Décision de l'administration : ${statut}`
    )
    toast.success(`Statut de la capture mis à jour en : ${statut}`)
    loadData()
    if (selectedCopie) {
      const updated = copies.find((c) => c.id === copieId)
      setSelectedCopie(updated || null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Évaluations & Surveillance Anti-Triche</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation des sujets, lancement chronométré et galerie de surveillance webcam conforme loi ivoirienne 2013-450
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('proctoring')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'proctoring' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revue Anti-Triche Webcam
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'sessions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cycle de Vie des Épreuves
          </button>
        </div>
      </div>

      {activeTab === 'proctoring' ? (
        /* Galerie de Surveillance Photo */
        <div className="space-y-5">
          <Card variant="subtle" className="p-4 border-blue-200 bg-blue-50/50">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-blue-900">Protocole de Surveillance Éthique :</strong> Les captures d’écran et de webcam
                sont prises à intervalles aléatoires horodatés avec accord préalable de l’étudiant.
                Une anomalie (éclairage, absence ponctuelle de visage ou changement d’onglet) n’invalide pas automatiquement
                l’épreuve sans validation motivée de l’administration.
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {copies.map((copie) => (
              <Card key={copie.id} variant="clean" className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{copie.studentNomComplet}</span>
                      <span className="text-[11px] font-mono text-[#7A1B29]">{copie.matricule}</span>
                    </div>

                    <Badge
                      variant={
                        copie.statutSurveillance === 'VALIDE'
                          ? 'success'
                          : copie.statutSurveillance === 'EN_REVISION'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {copie.statutSurveillance === 'VALIDE'
                        ? 'Surveillance Validée'
                        : copie.statutSurveillance === 'EN_REVISION'
                        ? 'Arbitrage Requis'
                        : 'Rejetée'}
                    </Badge>
                  </div>

                  <div className="py-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span>Note obtenue : <strong className="text-slate-900 font-mono font-bold">{copie.noteSur20}/20</strong></span>
                    <span>Durée : <strong className="text-slate-700 font-mono">{Math.round(copie.dureeEcouleeSecondes / 60)} min</strong></span>
                    <span>Soumise à : <strong className="text-slate-700">{copie.dateSoumission}</strong></span>
                  </div>

                  {/* Galerie Photos Horodatées de l'étudiant */}
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Captures Webcam Horodatées ({copie.captures.length})
                    </span>

                    <div className="grid grid-cols-2 gap-2.5">
                      {copie.captures.map((cap) => (
                        <div
                          key={cap.id}
                          className={`p-2 rounded-xl border ${
                            cap.statut === 'SUSPECTE'
                              ? 'border-amber-300 bg-amber-50/50'
                              : 'border-slate-200 bg-slate-50'
                          } space-y-2`}
                        >
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-200 h-28">
                            <img
                              src={cap.captureUrl}
                              alt="Capture surveillance"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-slate-900/80 text-white px-1.5 py-0.5 rounded">
                              {cap.horodatage}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 text-[10px] truncate max-w-[120px]">{cap.remarque || 'Conforme'}</span>
                            <Badge
                              variant={
                                cap.statut === 'CONFORME'
                                  ? 'success'
                                  : cap.statut === 'SUSPECTE'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {cap.statut}
                            </Badge>
                          </div>

                          {/* Quick decision buttons */}
                          <div className="flex gap-1 pt-1">
                            <button
                              onClick={() => handleStatuerCapture(copie.id, cap.id, 'CONFORME')}
                              className="flex-1 py-1 rounded text-[10px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                            >
                              Conforme
                            </button>
                            <button
                              onClick={() => handleStatuerCapture(copie.id, cap.id, 'SUSPECTE')}
                              className="flex-1 py-1 rounded text-[10px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer"
                            >
                              Suspect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Évaluation Soins Infirmiers S2</span>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedCopie(copie)}
                  >
                    Examiner Copie & Réponses
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Cycle de vie des Épreuves */
        <div className="space-y-4">
          {evaluations.map((ev) => (
            <Card key={ev.id} variant="clean" className="p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{ev.titre}</h3>
                  <Badge variant={ev.statut === 'LANCEE' ? 'success' : 'neutral'}>
                    {ev.statut}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Matière : <strong className="text-slate-800">{ev.discipline}</strong> • Enseignant : {ev.enseignantNom} • Durée : {ev.dureeMinutes} min
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Créneau : {ev.dateDebut} au {ev.dateFin} • Barème : {ev.totalPoints} pts
                </p>
              </div>

              <div className="flex items-center gap-2">
                {ev.statut === 'LANCEE' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Lock className="w-4 h-4" />}
                    onClick={() => toast.info('Épreuve clôturée.')}
                  >
                    Clôturer la Session
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Play className="w-4 h-4" />}
                    onClick={() => toast.success('Épreuve lancée avec succès.')}
                  >
                    Lancer l'Épreuve
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detail Copie Étudiant */}
      {selectedCopie && (
        <Modal
          isOpen={!!selectedCopie}
          onClose={() => setSelectedCopie(null)}
          title="Détail des Réponses de l'Étudiant"
          subtitle={`${selectedCopie.studentNomComplet} (${selectedCopie.matricule})`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 block">Note Attribuée :</span>
                <span className="font-mono text-xl font-bold text-[#7A1B29]">{selectedCopie.noteSur20} / 20</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Bonnes réponses :</span>
                <span className="font-bold text-emerald-700">{selectedCopie.bonnesReponses} validées</span>
              </div>
            </div>

            <div className="space-y-3">
              {selectedCopie.reponses.map((rep, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-slate-800 block mb-1">Question {idx + 1}</span>
                  {rep.reponseTexte ? (
                    <div>
                      <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100">"{rep.reponseTexte}"</p>
                      {rep.remarqueCorrecteur && (
                        <p className="text-[11px] text-emerald-700 mt-1">Commentaire correcteur : {rep.remarqueCorrecteur}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-emerald-700 font-semibold">Réponse objective QCM sélectionnée avec succès (+{rep.pointsObtenus} pts)</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
