import React, { useState } from 'react'
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  GraduationCap,
  Sparkles,
  Building,
  Printer,
  Calendar,
  MapPin,
  Stethoscope,
  Pill,
  Calculator,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { registrationService } from '@/services/registrationService'
import { DemandeInscription, FiliereJohmann } from '@/core/types/registration'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [filiere, setFiliere] = useState<FiliereJohmann>('Aide-soignante')
  const [nom, setNom] = useState('')
  const [prenoms, setPrenoms] = useState('')
  const [genre, setGenre] = useState<'F' | 'M'>('F')
  const [dateNaissance, setDateNaissance] = useState('')
  const [lieuNaissance, setLieuNaissance] = useState('Grand-Lahou')
  const [telephone, setTelephone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [villeResidence, setVilleResidence] = useState('Grand-Lahou')
  const [niveauEtudeActuel, setNiveauEtudeActuel] = useState('Terminale D')
  const [dernierEtablissement, setDernierEtablissement] = useState('')
  const [pieceIdentiteNumero, setPieceIdentiteNumero] = useState('')
  const [motivation, setMotivation] = useState('')
  const [declarationHonneur, setDeclarationHonneur] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdDemande, setCreatedDemande] = useState<DemandeInscription | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nom.trim() || !prenoms.trim() || !telephone.trim()) {
      toast.error('Veuillez renseigner votre nom, prénoms et numéro de téléphone.')
      return
    }

    if (!declarationHonneur) {
      toast.error('Veuillez cocher la déclaration sur l’honneur.')
      return
    }

    setIsSubmitting(true)
    try {
      const demande = await registrationService.create({
        nom: nom.trim().toUpperCase(),
        prenoms: prenoms.trim(),
        genre,
        dateNaissance: dateNaissance || '15/06/2005',
        lieuNaissance: lieuNaissance.trim() || 'Grand-Lahou',
        telephone: telephone.trim(),
        whatsapp: whatsapp.trim() || telephone.trim(),
        email: email.trim() || undefined,
        villeResidence: villeResidence.trim() || 'Grand-Lahou',
        filiereSouhaitee: filiere,
        niveauEtudeActuel: niveauEtudeActuel.trim(),
        dernierEtablissement: dernierEtablissement.trim() || 'Lycée Moderne Grand-Lahou',
        statutCandidat: 'NON_AFFECTE',
        pieceIdentiteNumero: pieceIdentiteNumero.trim() || undefined,
        motivation: motivation.trim() || undefined,
      })

      setCreatedDemande(demande)
      toast.success(`Demande N° ${demande.reference} enregistrée avec succès !`)
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
    } catch {
      toast.error('Erreur lors de l’enregistrement de votre demande.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const resetForm = () => {
    setCreatedDemande(null)
    setNom('')
    setPrenoms('')
    setTelephone('')
    setWhatsapp('')
    setEmail('')
    setMotivation('')
    setDeclarationHonneur(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header du modal */}
        <div className="bg-gradient-to-r from-[#7A1B29] to-[#922233] text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[#FEF9EB] text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
              <span>Candidats non affectés • Session 2024-2025</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Demande d'inscription en ligne
            </h2>
            <p className="text-xs text-white/80">
              Cabinet Johmann Formation • Agréé METFPA Décision N° 2012-1425 / METFP / CAB / DEP
            </p>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Écran de confirmation de soumission */}
        {createdDemande ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Demande enregistrée avec succès</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Votre dossier de pré-inscription pour candidat non affecté a été transmis à la direction des études de Johmann Formation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#FDE68A] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100 text-xs">
                <span className="text-slate-500 font-medium">Référence du dossier</span>
                <span className="font-mono font-black text-base text-[#7A1B29]">{createdDemande.reference}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Candidat(e)</span>
                  <span className="font-bold text-slate-800">
                    {createdDemande.nom} {createdDemande.prenoms}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Filière demandée</span>
                  <span className="font-bold text-[#7A1B29]">{createdDemande.filiereSouhaitee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Téléphone / WhatsApp</span>
                  <span className="font-mono text-slate-800">{createdDemande.telephone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Statut candidature</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    En attente d'examen
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#7A1B29]" />
                <span>Pièces à fournir lors de votre confirmation physique à Grand-Lahou :</span>
              </span>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Une photocopie de votre pièce d'identité ou extrait d'acte de naissance</li>
                <li>Deux (2) photos d'identité couleur récentes de même tirage</li>
                <li>Une photocopie du dernier diplôme ou relevé de notes / certificat de scolarité</li>
                <li>Le premier versement des frais de scolarité (au bureau de scolarité)</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                <span>Imprimer le récépissé</span>
              </Button>
              <Button
                variant="primary"
                onClick={resetForm}
                className="w-full sm:w-auto"
              >
                <span>Terminer</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Formulaire de pré-inscription */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* 1. Choix de la filière */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Filière de formation agréée souhaitée *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'Aide-soignante',
                    titre: 'Aide-soignante',
                    secteur: 'Santé & Clinique',
                    icon: Stethoscope,
                  },
                  {
                    id: 'Auxiliaire en pharmacie',
                    titre: 'Auxiliaire en pharmacie',
                    secteur: 'Officine',
                    icon: Pill,
                  },
                  {
                    id: 'Caissière spécialisée',
                    titre: 'Caissière spécialisée',
                    secteur: 'Commerce & Caisse',
                    icon: Calculator,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  const isSelected = filiere === item.id
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFiliere(item.id as FiliereJohmann)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#7A1B29] bg-[#FDF2F4] text-[#7A1B29] ring-2 ring-[#7A1B29]/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                          {item.secteur}
                        </span>
                      </div>
                      <span className="font-bold text-xs">{item.titre}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. État civil du candidat */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Identité du candidat *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: KOUASSI"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Prénoms *</label>
                  <input
                    type="text"
                    required
                    value={prenoms}
                    onChange={(e) => setPrenoms(e.target.value)}
                    placeholder="Ex: Aya Marie-Estelle"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Genre *</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as 'F' | 'M')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none bg-white"
                  >
                    <option value="F">Féminin (F)</option>
                    <option value="M">Masculin (M)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    value={lieuNaissance}
                    onChange={(e) => setLieuNaissance(e.target.value)}
                    placeholder="Ex: Grand-Lahou, Dabou, etc."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Numéro de pièce / extrait</label>
                  <input
                    type="text"
                    value={pieceIdentiteNumero}
                    onChange={(e) => setPieceIdentiteNumero(e.target.value)}
                    placeholder="CNI, Passeport, ou Extrait"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Coordonnées & Contact */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                3. Contacts & Localisation *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Téléphone d'appel *</label>
                  <input
                    type="tel"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Ex: 07 59 12 34 56"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Pour alertes convocation"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ville de résidence</label>
                  <input
                    type="text"
                    value={villeResidence}
                    onChange={(e) => setVilleResidence(e.target.value)}
                    placeholder="Ex: Grand-Lahou, Dabou, Fresco..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Adresse email (facultatif)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: candidat@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Niveau académique */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                4. Cursus scolaire antérieur
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Niveau d'études atteint</label>
                  <input
                    type="text"
                    value={niveauEtudeActuel}
                    onChange={(e) => setNiveauEtudeActuel(e.target.value)}
                    placeholder="Ex: 3ème achevée, Terminale, BAC"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dernier établissement</label>
                  <input
                    type="text"
                    value={dernierEtablissement}
                    onChange={(e) => setDernierEtablissement(e.target.value)}
                    placeholder="Ex: Lycée Moderne Grand-Lahou"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Motivation ou remarques</label>
                <textarea
                  rows={2}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Expliquez brièvement pourquoi vous choisissez cette filière..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7A1B29] focus:outline-none"
                />
              </div>
            </div>

            {/* Déclaration d'honneur */}
            <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#FDE68A] flex items-start gap-2.5">
              <input
                type="checkbox"
                id="declaration"
                checked={declarationHonneur}
                onChange={(e) => setDeclarationHonneur(e.target.checked)}
                className="mt-0.5 rounded text-[#7A1B29] focus:ring-[#7A1B29] cursor-pointer"
              />
              <label htmlFor="declaration" className="text-xs text-slate-700 cursor-pointer select-none">
                Je certifie sur l’honneur l’exactitude de ces informations et postule en qualité de <strong>candidat non affecté de l’État</strong> auprès du cabinet Johmann Formation à Grand-Lahou.
              </label>
            </div>

            {/* Actions du formulaire */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                <span>Annuler</span>
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                <span>{isSubmitting ? 'Transmission...' : 'Envoyer ma demande'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
