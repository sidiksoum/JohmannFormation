import { useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  MessageSquare,
  LogOut,
  Wifi,
  LayoutGrid,
  X,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { TeacherDashboard } from './TeacherDashboard'
import { TeacherEvaluationsModule } from './TeacherEvaluationsModule'
import { TeacherGradingModule } from './TeacherGradingModule'
import { TeacherAppreciationsModule } from './TeacherAppreciationsModule'
import { Teacher } from '@/core/types/teacher'
import { MOCK_TEACHERS } from '@/services/mockData'
import { usePWA } from '@/hooks/usePWA'

interface TeacherLayoutProps {
  onLogout: () => void
  onNavigateHome: () => void
}

type TeacherTab = 'dashboard' | 'evaluations' | 'grading' | 'appreciations'

export function TeacherLayout({ onLogout, onNavigateHome }: TeacherLayoutProps) {
  const [activeTab, setActiveTab] = useState<TeacherTab>('dashboard')
  const [teacher] = useState<Teacher>(MOCK_TEACHERS[0])
  const [isMenuGroupingModalOpen, setIsMenuGroupingModalOpen] = useState(false)
  const { isOnline } = usePWA()

  const navItems = [
    {
      id: 'dashboard',
      label: 'Studio pédagogique',
      shortLabel: 'Studio',
      icon: LayoutDashboard,
      desc: 'Tableau de bord des classes et devoirs',
    },
    {
      id: 'evaluations',
      label: '1. Conception d’épreuves',
      shortLabel: 'Épreuves',
      icon: BookOpen,
      desc: 'Création de sujets QCM et rédactionnels',
    },
    {
      id: 'grading',
      label: '2. Saisie et correction',
      shortLabel: 'Notes',
      icon: CheckSquare,
      desc: 'Grille de notation hors-ligne et notes',
    },
    {
      id: 'appreciations',
      label: '3. Appréciations du bulletin',
      shortLabel: 'Appréciations',
      icon: MessageSquare,
      desc: 'Commentaires officiels pour le METFPA',
    },
  ] as const

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col xl:flex-row">
      {/* 1. SIDEBAR DESKTOP (Uniquement sur écrans larges xl+) */}
      <aside className="hidden xl:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          <div className="p-5 border-b border-slate-100">
            <HeaderBrand taille="sm" onClick={onNavigateHome} />
            <div className="mt-3 px-2 py-1 rounded-lg bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A] text-[10px] font-bold">
              Espace formateur enseignant • Johmann
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
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Profile Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 flex items-center gap-3">
            <img
              src={teacher.photoUrl}
              alt={teacher.nom}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="text-xs overflow-hidden">
              <span className="font-bold text-slate-900 block truncate">
                {teacher.titre} {teacher.nom} {teacher.prenoms}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">{teacher.specialite}</span>
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
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* ICON DE REGROUPEMENT DES MENUS SUR MOBILE (< md) */}
              <button
                onClick={() => setIsMenuGroupingModalOpen(true)}
                className="md:hidden p-2 rounded-xl bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A] hover:bg-[#FDF0D0] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Regroupement des modules formateur"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-xs font-bold">Modules</span>
              </button>

              <div className="xl:hidden">
                <HeaderBrand taille="sm" afficherDetails={false} masquerTexteMobile={true} onClick={onNavigateHome} />
              </div>

              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider hidden xl:block">
                Johmann Formation • Studio enseignant et pédagogie
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.nom}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="text-xs hidden md:block">
                  <span className="font-bold text-slate-800 block leading-tight">{teacher.nom}</span>
                  <span className="text-[10px] text-slate-400">{teacher.specialite}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="xl:hidden p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. MENU DE NAVIGATION HORIZONTALE SUR TABLETTE & ÉCRANS MOYENS (md à xl) */}
          <div className="hidden md:flex xl:hidden overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50 gap-1.5 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7A1B29] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.shortLabel}</span>
                </button>
              )
            })}
          </div>
        </header>

        {/* MODAL DE REGROUPEMENT DES MENUS SUR MOBILE */}
        {isMenuGroupingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#7A1B29]" />
                  <h3 className="font-bold text-slate-900 text-sm">Modules formateur</h3>
                </div>
                <button
                  onClick={() => setIsMenuGroupingModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMenuGroupingModalOpen(false)
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#7A1B29] text-white'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <div>
                          <span className="font-bold text-xs block">{item.label}</span>
                          <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter du studio</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <TeacherDashboard
              teacher={teacher}
              onNavigateTab={(tab) => setActiveTab(tab as TeacherTab)}
            />
          )}
          {activeTab === 'evaluations' && <TeacherEvaluationsModule teacher={teacher} />}
          {activeTab === 'grading' && <TeacherGradingModule />}
          {activeTab === 'appreciations' && <TeacherAppreciationsModule teacher={teacher} />}
        </main>
      </div>
    </div>
  )
}

