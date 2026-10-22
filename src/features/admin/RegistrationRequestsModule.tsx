import React, { useState, useEffect } from 'react'
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  MessageCircle,
  GraduationCap,
  Calendar,
  MapPin,
  FileText,
  Printer,
  X,
  ExternalLink,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { registrationService } from '@/services/registrationService'
import { DemandeInscription, StatutDemande } from '@/core/types/registration'
import { toast } from 'sonner'

export function RegistrationRequestsModule() {
  const [demandes, setDemandes] = useState<DemandeInscription[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatut, setSelectedStatut] = useState<string>('ALL')
  const [selectedFiliere, setSelectedFiliere] = useState<string>('ALL')
  const [selectedDemande, setSelectedDemande] = useState<DemandeInscription | null>(null)
  const [adminNote, setAdminNote] = useState('')

  const loadData = async () => {
    const list = await registrationService.getAll()
    setDemandes(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUpdateStatus = async (id: string, newStatut: StatutDemande) => {
    const res = await registrationService.updateStatus(id, newStatut, adminNote)
    if (res) {
      toast.success(
        newStatut === 'VALIDEE'
          ? `Candidature ${res.reference} validée avec succès !`
          : `Candidature ${res.reference} rejetée.`
      )
      setSelectedDemande(res)
      setAdminNote('')
      loadData()
    }
  }

  // Filtrage
  const filteredDemandes = demandes.filter((d) => {
    const matchSearch =
      d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.telephone.includes(searchTerm) ||
      d.villeResidence.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatut = selectedStatut === 'ALL' || d.statut === selectedStatut
    const matchFiliere = selectedFiliere === 'ALL' || d.filiereSouhaitee === selectedFiliere

    return matchSearch && matchStatut && matchFiliere
  })

  // KPIs
  const total = demandes.length
  const enAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE').length
  const validees = demandes.filter((d) => d.statut === 'VALIDEE').length
  const rejetees = demandes.filter((d) => d.statut === 'REJETEE').length

  return (
    <div className="space-y-6">
      {/* En-tête du module */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Demandes d'inscription
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Examen et validation des candidatures spontanées pour les apprenants non affectés de l'État
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            leftIcon={<Inbox className="w-3.5 h-3.5" />}
          >
            <span>Actualiser ({demandes.length})</span>
          </Button>
        </div>
      </div>

      {/* Cartes d'indicateurs KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Total demandes</span>
              <span className="text-2xl font-black font-mono text-slate-900">{total}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-700 block">En attente</span>
              <span className="text-2xl font-black font-mono text-amber-600">{enAttente}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 block">Validées</span>
              <span className="text-2xl font-black font-mono text-emerald-600">{validees}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-700 block">Rejetées</span>
              <span className="text-2xl font-black font-mono text-rose-600">{rejetees}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de filtres et recherche */}
      <Card className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, réf, téléphone, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none bg-white font-medium text-slate-700"
            >
              <option value="ALL">Tous les statuts ({total})</option>
              <option value="EN_ATTENTE">En attente ({enAttente})</option>
              <option value="VALIDEE">Validées ({validees})</option>
              <option value="REJETEE">Rejetées ({rejetees})</option>
            </select>

            <select
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none bg-white font-medium text-slate-700"
            >
              <option value="ALL">Toutes les filières</option>
              <option value="Aide-soignante">Aide-soignante</option>
              <option value="Auxiliaire en pharmacie">Auxiliaire en pharmacie</option>
              <option value="Caissière spécialisée">Caissière spécialisée</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table des candidatures */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Réf. & Date</th>
                <th className="py-3 px-4">Candidat</th>
                <th className="py-3 px-4">Filière souhaitée</th>
                <th className="py-3 px-4">Contact & WhatsApp</th>
                <th className="py-3 px-4">Niveau & Ville</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDemandes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Aucune demande d'inscription trouvée pour ces critères.
                  </td>
                </tr>
              ) : (
                filteredDemandes.map((dem) => {
                  return (
                    <tr key={dem.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#7A1B29] block">
                          {dem.reference}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dem.dateDemande}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                            {dem.prenoms.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {dem.nom} {dem.prenoms}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Genre : {dem.genre === 'F' ? 'Féminin' : 'Masculin'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {dem.filiereSouhaitee}
                        </span>
                        <span className="text-[10px] text-slate-400">Non affecté</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-mono text-slate-700 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{dem.telephone}</span>
                          </div>
                          {dem.whatsapp && (
                            <a
                              href={`https://wa.me/225${dem.whatsapp.replace(/\s+/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-medium block">{dem.niveauEtudeActuel}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dem.villeResidence}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {dem.statut === 'EN_ATTENTE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        )}
                        {dem.statut === 'VALIDEE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Validée</span>
                          </span>
                        )}
                        {dem.statut === 'REJETEE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>Rejetée</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDemande(dem)}
                        >
                          <span>Voir détails</span>
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Détails & Traitement d'une demande */}
      {selectedDemande && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header modal */}
            <div className="bg-gradient-to-r from-[#7A1B29] to-[#922233] text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-200 block">
                  Dossier {selectedDemande.reference} • Non affecté
                </span>
                <h3 className="text-xl font-bold mt-0.5">
                  {selectedDemande.nom} {selectedDemande.prenoms}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDemande(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Statut actuel */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Statut de la demande
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedDemande.statut === 'EN_ATTENTE' && 'Dossier en attente d’arbitrage'}
                    {selectedDemande.statut === 'VALIDEE' && 'Candidature acceptée & validée'}
                    {selectedDemande.statut === 'REJETEE' && 'Candidature refusée'}
                  </span>
                  {selectedDemande.decisionDate && (
                    <span className="text-[10px] text-slate-500 block">
                      Par {selectedDemande.decisionPar} le {selectedDemande.decisionDate}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    onClick={() => handleUpdateStatus(selectedDemande.id, 'VALIDEE')}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Valider</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-rose-700 hover:bg-rose-50 border-rose-200"
                    onClick={() => handleUpdateStatus(selectedDemande.id, 'REJETEE')}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Rejeter</span>
                  </Button>
                </div>
              </div>

              {/* Détails du candidat */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Filière souhaitée
                  </span>
                  <span className="font-bold text-[#7A1B29] text-sm">
                    {selectedDemande.filiereSouhaitee}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Date de dépôt
                  </span>
                  <span className="font-medium text-slate-800">{selectedDemande.dateDemande}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Date & lieu de naissance
                  </span>
                  <span className="font-medium text-slate-800">
                    {selectedDemande.dateNaissance} à {selectedDemande.lieuNaissance}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Pièce d'identité
                  </span>
                  <span className="font-medium text-slate-800">
                    {selectedDemande.pieceIdentiteNumero || 'Non renseignée'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Téléphone
                  </span>
                  <span className="font-mono font-medium text-slate-800">
                    {selectedDemande.telephone}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/225${selectedDemande.whatsapp.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{selectedDemande.whatsapp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Niveau actuel
                  </span>
                  <span className="font-medium text-slate-800">
                    {selectedDemande.niveauEtudeActuel}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Dernier établissement
                  </span>
                  <span className="font-medium text-slate-800">
                    {selectedDemande.dernierEtablissement}
                  </span>
                </div>
              </div>

              {selectedDemande.motivation && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                    Motivation de l'apprenant
                  </span>
                  <p className="text-slate-700 italic">"{selectedDemande.motivation}"</p>
                </div>
              )}

              {/* Remarques administratives */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block text-[11px]">
                  Remarques administratives & motifs de décision :
                </label>
                <textarea
                  rows={2}
                  value={adminNote || selectedDemande.remarquesAdmin || ''}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Ajouter une consigne pour la scolarité ou motif..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  <span>Imprimer la fiche</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDemande(null)}
                >
                  <span>Fermer</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
