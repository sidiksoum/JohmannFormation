import React, { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Upload,
  UserPlus,
  Filter,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { studentService } from '@/services/studentService'
import { Student } from '@/core/types/student'
import { toast } from 'sonner'

export function StudentsModule() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('ALL')
  const [filterFiliere, setFilterFiliere] = useState<string>('ALL')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importReport, setImportReport] = useState<{ imported: number; errors: string[] } | null>(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    const list = await studentService.getAll()
    setStudents(list)
  }

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prenoms.toLowerCase().includes(search.toLowerCase()) ||
      s.matricule.toLowerCase().includes(search.toLowerCase())

    const matchStatut = filterStatut === 'ALL' || s.statut === filterStatut
    const matchFiliere = filterFiliere === 'ALL' || s.filiere === filterFiliere

    return matchSearch && matchStatut && matchFiliere
  })

  // Simulate Excel file import
  const handleSimulateExcelImport = async () => {
    setIsImporting(true)
    const simulatedExcelRows = [
      {
        matricule: 'JF-2024-0089',
        nom: 'BAMBA',
        prenoms: 'Mariam Fatou',
        dateNaissance: '19/07/2004',
        lieuNaissance: 'Grand-Lahou',
        sexe: 'F' as const,
        nationalite: 'Ivoirienne',
        filiere: 'Aide - Soignante',
        classe: 'Première Année',
        statut: 'AFF' as const,
        contact: '07 12 34 56 78',
        email: 'mariam.bamba@johmann.edu.ci',
      },
      {
        matricule: 'JF-2024-0012', // Doublon intentionnel pour le rapport
        nom: 'KOUASSI',
        prenoms: 'Aya Marie-Estelle',
      },
      {
        matricule: 'JF-2024-0090',
        nom: 'TOURE',
        prenoms: 'Lassina',
        dateNaissance: '12/12/2003',
        lieuNaissance: 'Abidjan',
        sexe: 'M' as const,
        nationalite: 'Ivoirienne',
        filiere: 'Auxiliaire en Pharmacie',
        classe: 'Première Année',
        statut: 'NAFF' as const,
        contact: '05 99 88 77 66',
        email: 'lassina.toure@johmann.edu.ci',
      },
    ]

    const result = await studentService.importFromExcel(simulatedExcelRows)
    setIsImporting(false)
    setImportReport({ imported: result.importedCount, errors: result.errors })
    loadStudents()
    toast.success(`Import terminé : ${result.importedCount} étudiant(s) ajouté(s).`)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Référentiel des Étudiants</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Base unique unifiée, statuts d'affectation (AFF/NAFF) et importateur Excel avec contrôle d'intégrité
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Upload className="w-4 h-4 text-emerald-700" />}
            onClick={() => {
              setImportReport(null)
              setIsImportModalOpen(true)
            }}
          >
            Importer depuis Excel
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => toast.info('Formulaire de création manuelle d’étudiant.')}
          >
            Nouvel Étudiant
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card variant="clean" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Rechercher par nom, prénom ou matricule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Statut État :</span>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#7A1B29]"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="AFF">AFF (Affecté de l'État)</option>
              <option value="NAFF">NAFF (Non Affecté)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filière :</span>
            <select
              value={filterFiliere}
              onChange={(e) => setFilterFiliere(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#7A1B29]"
            >
              <option value="ALL">Toutes les filières</option>
              <option value="Aide - Soignante">Aide - Soignante</option>
              <option value="Auxiliaire en Pharmacie">Auxiliaire en Pharmacie</option>
              <option value="Caissière Spécialisée">Caissière Spécialisée</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card variant="clean" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Photo & Identité</th>
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Filière & Classe</th>
                <th className="py-3 px-4">Statut État</th>
                <th className="py-3 px-4">Scolarité</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.photoUrl}
                        alt={s.nom}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {s.nom} {s.prenoms}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Né(e) le {s.dateNaissance} à {s.lieuNaissance}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#7A1B29]">
                    {s.matricule}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{s.filiere}</span>
                    <span className="text-[11px] text-slate-500">{s.classe}</span>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={s.statut === 'AFF' ? 'gold' : 'neutral'}>
                      {s.statut === 'AFF' ? 'Affecté (AFF)' : 'Non Affecté (NAFF)'}
                    </Badge>
                  </td>

                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-slate-800">
                        {s.scolarite.totalPaye.toLocaleString('fr-FR')} / {s.scolarite.totalDu.toLocaleString('fr-FR')} F
                      </span>
                      <div>
                        <Badge variant={s.scolarite.aJour ? 'success' : 'danger'}>
                          {s.scolarite.aJour ? 'À jour' : `Reste ${s.scolarite.resteAPayer.toLocaleString('fr-FR')} F`}
                        </Badge>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-[#7A1B29] hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
                    >
                      Voir Fiche
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Fiche Étudiant Complète */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Fiche Individuelle Étudiant"
          subtitle={`Matricule : ${selectedStudent.matricule}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={selectedStudent.photoUrl}
                alt={selectedStudent.nom}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudent.nom} {selectedStudent.prenoms}
                  </h3>
                  <Badge variant={selectedStudent.statut === 'AFF' ? 'gold' : 'neutral'}>
                    {selectedStudent.statut === 'AFF' ? 'Statut AFF' : 'Statut NAFF'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filière : <strong className="text-slate-800">{selectedStudent.filiere}</strong> • {selectedStudent.classe}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Email : {selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-400 block text-[11px]">Date & Lieu de Naissance</span>
                <span className="font-semibold text-slate-800">{selectedStudent.dateNaissance} à {selectedStudent.lieuNaissance}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-400 block text-[11px]">Sexe & Nationalité</span>
                <span className="font-semibold text-slate-800">{selectedStudent.sexe === 'F' ? 'Féminin' : 'Masculin'} • {selectedStudent.nationalite}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-400 block text-[11px]">Établissement d'Origine</span>
                <span className="font-semibold text-slate-800">{selectedStudent.etablissementOrigine}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-400 block text-[11px]">Téléphone / Contact d'Urgence</span>
                <span className="font-semibold font-mono text-slate-800">{selectedStudent.contact}</span>
              </div>
            </div>

            {/* Scolarité status box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Situation Financière & Scolarité
              </span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Total Dû</span>
                  <span className="font-mono font-bold text-slate-900">{selectedStudent.scolarite.totalDu.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Total Versé</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedStudent.scolarite.totalPaye.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Reste à Payer</span>
                  <span className="font-mono font-bold text-[#7A1B29]">{selectedStudent.scolarite.resteAPayer.toLocaleString('fr-FR')} F</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Import Excel */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importation des Étudiants depuis Excel"
        subtitle="Contrôle des doublons, validation des formats et rapport d'erreurs"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <FileSpreadsheet className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-800">
              Déposez votre fichier de classe Excel (.xlsx, .xls, .csv)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Colonnes requises : Matricule, Nom, Prénoms, Date Naiss, Sexe, Statut (AFF/NAFF), Contact.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleSimulateExcelImport}
              isLoading={isImporting}
            >
              Simuler l'analyse & l'import d'un fichier classe
            </Button>
          </div>

          {/* Import report */}
          {importReport && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Rapport d'analyse de l'import :</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>{importReport.imported} nouvel(s) étudiant(s) validé(s) et injecté(s).</span>
              </div>
              {importReport.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5 text-amber-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
