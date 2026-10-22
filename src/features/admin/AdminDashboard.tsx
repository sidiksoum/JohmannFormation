import { useEffect, useState } from 'react'
import {
  Users,
  CreditCard,
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download,
  Calendar,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { studentService } from '@/services/studentService'
import { tuitionService } from '@/services/tuitionService'
import { evaluationService } from '@/services/evaluationService'
import { Student } from '@/core/types/student'
import { Versement } from '@/core/types/tuition'
import { CopieEtudiant } from '@/core/types/evaluation'

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void
  onOpenReceipt: (v: Versement) => void
}

export function AdminDashboard({ onNavigateTab, onOpenReceipt }: AdminDashboardProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [versements, setVersements] = useState<Versement[]>([])
  const [copies, setCopies] = useState<CopieEtudiant[]>([])

  useEffect(() => {
    studentService.getAll().then(setStudents)
    tuitionService.getAll().then(setVersements)
    evaluationService.getAllCopies().then(setCopies)
  }, [])

  const totalAttendu = students.reduce((acc, s) => acc + s.scolarite.totalDu, 0)
  const totalEncaisse = students.reduce((acc, s) => acc + s.scolarite.totalPaye, 0)
  const resteARecouvrer = totalAttendu - totalEncaisse
  const tauxRecouvrement = totalAttendu > 0 ? Math.round((totalEncaisse / totalAttendu) * 100) : 0

  const effectifAFF = students.filter((s) => s.statut === 'AFF').length
  const effectifNAFF = students.filter((s) => s.statut === 'NAFF').length

  const alertesSurveillance = copies.flatMap((c) =>
    c.captures.filter((cap) => cap.statut === 'SUSPECTE')
  )

  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tableau de Bord Central</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilotage stratégique, financier et académique • Johmann Formation (Grand-Lahou)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="johmann" size="md">
            Année 2024-2025
          </Badge>
          <Badge variant="gold" size="md">
            Deuxième Semestre
          </Badge>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          titre="Effectif Apprenants"
          valeur={`${students.length} inscrits`}
          description={`${effectifAFF} Affectés d'État • ${effectifNAFF} Non Affectés`}
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-700"
          badgeText="100% Validé"
          badgeVariant="success"
        />

        <StatCard
          titre="Trésorerie Scolarité"
          valeur={`${(totalEncaisse / 1000000).toFixed(2)} M FCFA`}
          description={`Reste à recouvrer : ${(resteARecouvrer / 1000).toLocaleString('fr-FR')} k`}
          icon={CreditCard}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          badgeText={`${tauxRecouvrement}% Encaissé`}
          badgeVariant="success"
        />

        <StatCard
          titre="Évaluations en Ligne"
          valeur="1 Session Active"
          description="Contrôle Continu N°2 Soins Infirmiers"
          icon={BookOpen}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-700"
          badgeText="Surveillance On"
          badgeVariant="johmann"
        />

        <StatCard
          titre="Alertes Anti-Triche"
          valeur={`${alertesSurveillance.length} à réviser`}
          description="Captures webcam nécessitant arbitrage"
          icon={AlertTriangle}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
          badgeText="Loi 2013-450"
          badgeVariant="warning"
        />
      </div>

      {/* Financial Bar & Quick Actions */}
      <Card variant="clean" className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Taux Global de Recouvrement des Droits de Scolarité</span>
              <span className="font-mono font-bold text-[#7A1B29]">{tauxRecouvrement}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#7A1B29] rounded-full transition-all duration-500"
                style={{ width: `${tauxRecouvrement}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Encaissé : <strong className="text-slate-800">{totalEncaisse.toLocaleString('fr-FR')} FCFA</strong></span>
              <span>Attendu : <strong className="text-slate-800">{totalAttendu.toLocaleString('fr-FR')} FCFA</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('tuition')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            >
              Enregistrer un Versement
            </button>
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2 rounded-xl bg-[#7A1B29] hover:bg-[#631420] text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              Importer Fichier Excel
            </button>
          </div>
        </div>
      </Card>

      {/* Two columns layout : Recent Payments & Proctoring alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tuition Receipts */}
        <Card variant="clean" className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Derniers Versements & Reçus Émis</h3>
              <p className="text-[11px] text-slate-500">Numérotation automatique et traçabilité</p>
            </div>
            <button
              onClick={() => onNavigateTab('tuition')}
              className="text-xs text-[#7A1B29] font-semibold hover:underline cursor-pointer"
            >
              Voir tous
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {versements.slice(0, 4).map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{v.studentNomComplet}</span>
                    <span className="font-mono text-[10px] text-slate-400">{v.matricule}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tranche {v.numeroTranche} • {v.datePaiement} via <strong className="text-slate-700">{v.modePaiement}</strong>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <span className="font-bold font-mono text-emerald-700 block">
                      {v.montant.toLocaleString('fr-FR')} F
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{v.numeroRecu}</span>
                  </div>

                  <button
                    onClick={() => onOpenReceipt(v)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#7A1B29] hover:bg-slate-50 transition-colors"
                    title="Voir et imprimer le reçu officiel"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Proctoring & Surveillance alerts */}
        <Card variant="clean" className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Surveillance Anti-Triche en Direct</h3>
              <p className="text-[11px] text-slate-500">Captures webcams horodatées à vérifier</p>
            </div>
            <button
              onClick={() => onNavigateTab('evaluations')}
              className="text-xs text-[#7A1B29] font-semibold hover:underline cursor-pointer"
            >
              Galerie complète
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900">DIABATE Sekou Oumar (JF-2024-0025)</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Anomalie : Changement d'onglet répété pendant l'évaluation de Soins Infirmiers.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">Capture à 09:40:11 • Statut : En arbitrage</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('evaluations')}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-medium shrink-0 cursor-pointer"
              >
                Statuer
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700">Évaluation Soins Infirmiers : <strong>98% de conformité webcam</strong></span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">48/49 conformes</span>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 italic">
              Conformément à la loi ivoirienne 2013-450 sur la protection des données personnelles, une capture suspecte
              n'invalide pas automatiquement l'épreuve sans décision motivée de l'administration.
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
