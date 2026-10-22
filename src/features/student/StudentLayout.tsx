import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Clock,
  Award,
  CreditCard,
  FileText,
  LogOut,
  User,
  X,
  Receipt,
  Calendar,
  Phone,
} from 'lucide-react'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { Badge } from '@/components/ui/Badge'
import { StudentDashboard } from './StudentDashboard'
import { StudentExamRoom } from './StudentExamRoom'
import { StudentGrades } from './StudentGrades'
import { StudentTuition } from './StudentTuition'
import { StudentReportCard } from './StudentReportCard'
import { OfficialReceiptModal } from '@/features/common/OfficialReceiptModal'
import { OfficialReportCardModal } from '@/features/common/OfficialReportCardModal'
import { studentService } from '@/services/studentService'
import { Student } from '@/core/types/student'
import { Versement } from '@/core/types/tuition'
import { BulletinNotes } from '@/core/types/reportCard'
import { MOCK_STUDENTS } from '@/services/mockData'
import { usePWA } from '@/hooks/usePWA'

interface StudentLayoutProps {
  onLogout: () => void
  onNavigateHome: () => void
}

type StudentTab = 'dashboard' | 'exam' | 'grades' | 'tuition' | 'reportCard'

export function StudentLayout({ onLogout, onNavigateHome }: StudentLayoutProps) {
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard')
  const [student, setStudent] = useState<Student>(MOCK_STUDENTS[0])
  const [activeReceipt, setActiveReceipt] = useState<Versement | null>(null)
  const [activeReportCard, setActiveReportCard] = useState<BulletinNotes | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { isOnline } = usePWA()

  useEffect(() => {
    const saved = localStorage.getItem('johmann_session')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.role === 'STUDENT' && parsed.identifiantOuMatricule) {
          studentService.getByMatricule(parsed.identifiantOuMatricule).then((s) => {
            if (s) setStudent(s)
          })
        }
      } catch {}
    }
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Espace', fullLabel: 'Mon espace', icon: LayoutDashboard },
    { id: 'exam', label: 'Épreuves', fullLabel: 'Composer en ligne', icon: Clock },
    { id: 'grades', label: 'Notes', fullLabel: 'Mes notes', icon: Award },
    { id: 'tuition', label: 'Scolarité', fullLabel: 'Scolarité et reçus', icon: CreditCard },
    { id: 'reportCard', label: 'Bulletin', fullLabel: 'Bulletin officiel', icon: FileText },
  ] as const

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Sidebar Desktop (Écrans larges) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          <div className="p-5 border-b border-slate-100">
            <HeaderBrand taille="sm" onClick={onNavigateHome} />
            <div className="mt-3 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-medium">
              Portail apprenant • Johmann
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7A1B29] text-white shadow-sm shadow-[#7A1B29]/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.fullLabel}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Student card info */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 flex items-center gap-3">
            <img
              src={student.photoUrl}
              alt={student.nom}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div className="text-xs overflow-hidden">
              <span className="font-bold text-slate-900 block truncate">
                {student.nom} {student.prenoms}
              </span>
              <span className="text-[10px] font-mono text-[#7A1B29] block">{student.matricule}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <HeaderBrand taille="sm" afficherDetails={false} masquerTexteMobile={true} onClick={onNavigateHome} />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider hidden lg:block">
              Espace étudiant • {student.filiere} ({student.classe})
            </span>
          </div>

          {/* Tablet Horizontal Tab Bar (Visible sur tablettes md/lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive ? 'bg-[#7A1B29] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick user avatar button that opens the student identity and tuition modal */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl bg-slate-50 hover:bg-[#FDF2F4] border border-slate-200 hover:border-[#FBCFE8] transition-all cursor-pointer group"
              title="Consulter ma fiche d'identité et ma scolarité"
              aria-label="Profil étudiant et scolarité"
            >
              <img
                src={student.photoUrl}
                alt={student.nom}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:border-[#7A1B29]"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#7A1B29] leading-tight">
                  {student.prenoms.split(' ')[0]}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  {student.matricule}
                </span>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
              title="Déconnexion"
              aria-label="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <StudentDashboard
              student={student}
              onNavigateTab={(tab) => setActiveTab(tab as StudentTab)}
            />
          )}
          {activeTab === 'exam' && (
            <StudentExamRoom
              student={student}
              onExamFinished={() => setActiveTab('grades')}
            />
          )}
          {activeTab === 'grades' && <StudentGrades student={student} />}
          {activeTab === 'tuition' && (
            <StudentTuition
              student={student}
              onOpenReceipt={(v) => setActiveReceipt(v)}
            />
          )}
          {activeTab === 'reportCard' && (
            <StudentReportCard
              student={student}
              onOpenReportCard={(b) => setActiveReportCard(b)}
            />
          )}
        </main>
      </div>

      {/* MENU DE NAVIGATION HORIZONTALE PARFAIT MOBILE (Bottom Navigation Bar Native) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#7A1B29] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#FDF2F4] text-[#7A1B29]' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#7A1B29] mt-0.5" />}
            </button>
          )
        })}
      </nav>

      {/* Global Modals for Receipts and Report Cards */}
      <OfficialReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        versement={activeReceipt}
      />

      <OfficialReportCardModal
        isOpen={!!activeReportCard}
        onClose={() => setActiveReportCard(null)}
        bulletin={activeReportCard}
      />

      {/* MODAL FICHE PROFIL & SCOLARITÉ (Déclenchée par l'icône profil) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#7A1B29] to-[#54121C] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/10 text-[#C59B27]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-white">
                    Fiche d'identité & scolarité
                  </h3>
                  <p className="text-[11px] text-white/80">
                    Cabinet Johmann Formation • Grand-Lahou
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps Modal */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Carte Identité Étudiant */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={student.photoUrl}
                  alt={student.nom}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
                />
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">
                      {student.nom} {student.prenoms}
                    </h2>
                  </div>

                  <div className="mt-1">
                    <Badge variant={student.statut === 'AFF' ? 'gold' : 'neutral'}>
                      {student.statut === 'AFF' ? 'Affecté État (AFF)' : 'Non affecté (NAFF)'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 font-medium">
                    Filière : <strong className="text-slate-900">{student.filiere}</strong> • {student.classe}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs font-mono text-slate-600">
                    <span className="font-bold text-[#7A1B29] bg-[#FDF2F4] px-2 py-0.5 rounded border border-[#FBCFE8]">
                      Matricule : {student.matricule}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Année Académique : {student.anneeAcademique}</span>
                  </div>
                </div>
              </div>

              {/* Bloc Situation de Scolarité */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Situation de Scolarité :
                  </span>
                  <Badge variant={student.scolarite.aJour ? 'success' : 'danger'}>
                    {student.scolarite.aJour ? 'À Jour' : 'Échéance en cours'}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                      {student.scolarite.totalPaye.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-slate-500 font-mono text-sm">
                      {' '}/ {student.scolarite.totalDu.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    {Math.round((student.scolarite.totalPaye / student.scolarite.totalDu) * 100)} % Réglé
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((student.scolarite.totalPaye / student.scolarite.totalDu) * 100))}%`,
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    setIsProfileModalOpen(false)
                    setActiveTab('tuition')
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#7A1B29] bg-[#FDF2F4] hover:bg-[#F9E2E6] border border-[#FBCFE8] transition-colors cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Voir l'historique de mes reçus →</span>
                </button>
              </div>

              {/* Informations Personnelles Complémentaires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Né(e) le : <strong className="text-slate-800">{student.dateNaissance}</strong></span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact : <strong className="text-slate-800">{student.contact}</strong></span>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false)
                  onLogout()
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>

              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
