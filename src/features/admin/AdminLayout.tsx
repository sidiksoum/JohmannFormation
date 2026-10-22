import React, { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  GraduationCap,
  FileCheck2,
  FileText,
  Inbox,
  LogOut,
  Wifi,
  LayoutGrid,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { AdminDashboard } from './AdminDashboard'
import { StudentsModule } from './StudentsModule'
import { TuitionModule } from './TuitionModule'
import { TeachersModule } from './TeachersModule'
import { EvaluationsModule } from './EvaluationsModule'
import { ReportCardsModule } from './ReportCardsModule'
import { RegistrationRequestsModule } from './RegistrationRequestsModule'
import { OfficialReceiptModal } from '@/features/common/OfficialReceiptModal'
import { OfficialReportCardModal } from '@/features/common/OfficialReportCardModal'
import { Versement } from '@/core/types/tuition'
import { BulletinNotes } from '@/core/types/reportCard'
import { usePWA } from '@/hooks/usePWA'

interface AdminLayoutProps {
  onLogout: () => void
  onNavigateHome: () => void
}

type AdminTab =
  | 'dashboard'
  | 'students'
  | 'tuition'
  | 'teachers'
  | 'evaluations'
  | 'reportCards'
  | 'requests'

export function AdminLayout({ onLogout, onNavigateHome }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [isMenuGroupingModalOpen, setIsMenuGroupingModalOpen] = useState(false)
  const [activeReceipt, setActiveReceipt] = useState<Versement | null>(null)
  const [activeReportCard, setActiveReportCard] = useState<BulletinNotes | null>(null)
  const { isOnline } = usePWA()

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', shortLabel: 'Dashboard', icon: LayoutDashboard, desc: 'Indicateurs clés et trésorerie' },
    { id: 'students', label: '1. Étudiants et imports', shortLabel: 'Étudiants', icon: Users, desc: 'Base apprenants et imports Excel' },
    { id: 'tuition', label: '2. Scolarité et reçus', shortLabel: 'Scolarité', icon: CreditCard, desc: 'Versements et reçus numérotés' },
    { id: 'teachers', label: '3. Enseignants et cours', shortLabel: 'Enseignants', icon: GraduationCap, desc: 'Affectations et disciplines' },
    { id: 'evaluations', label: '4. Épreuves et surveillance', shortLabel: 'Épreuves', icon: FileCheck2, desc: 'Revue anti-triche webcam' },
    { id: 'reportCards', label: '5. Bulletins officiels', shortLabel: 'Bulletins', icon: FileText, desc: 'Calcul des moyennes et visas' },
    { id: 'requests', label: '6. Demandes d’inscription', shortLabel: 'Demandes', icon: Inbox, desc: 'Candidatures non affectés et admission' },
  ] as const

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col xl:flex-row">
      {/* 1. SIDEBAR DESKTOP (Uniquement sur écrans larges xl+) */}
      <aside className="hidden xl:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          <div className="p-5 border-b border-slate-100">
            <HeaderBrand taille="sm" onClick={onNavigateHome} />
            <div className="mt-3 px-2 py-1 rounded-lg bg-[#FDF2F4] text-[#7A1B29] border border-[#FBCFE8] text-[10px] font-bold">
              Administration centrale • Pilotage
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

        {/* Profil Directeur */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-3 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-slate-900 block leading-tight">M. MEA KOUAKOU F.</span>
              <span className="text-[10px] text-slate-500">Directeur des Études</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#7A1B29]" />
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
                className="md:hidden p-2 rounded-xl bg-[#FDF2F4] text-[#7A1B29] border border-[#FBCFE8] hover:bg-[#F9E2E6] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Regroupement des modules"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-xs font-bold">Modules</span>
              </button>

              <div className="xl:hidden">
                <HeaderBrand taille="sm" afficherDetails={false} masquerTexteMobile={true} onClick={onNavigateHome} />
              </div>

              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider hidden xl:block">
                Johmann Formation • Centre de pilotage stratégique
              </span>
            </div>

            <div className="flex items-center gap-3">
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

        {/* MODAL / DRAWER DE REGROUPEMENT DES MENUS SUR MOBILE */}
        {isMenuGroupingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-[#7A1B29]" />
                  <h3 className="font-bold text-slate-900 text-sm">Modules d'administration</h3>
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
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter de l'administration</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sub-module View Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
              onOpenReceipt={(v) => setActiveReceipt(v)}
            />
          )}
          {activeTab === 'students' && <StudentsModule />}
          {activeTab === 'tuition' && (
            <TuitionModule onOpenReceipt={(v) => setActiveReceipt(v)} />
          )}
          {activeTab === 'teachers' && <TeachersModule />}
          {activeTab === 'evaluations' && <EvaluationsModule />}
          {activeTab === 'reportCards' && (
            <ReportCardsModule onOpenReportCard={(b) => setActiveReportCard(b)} />
          )}
          {activeTab === 'requests' && <RegistrationRequestsModule />}
        </main>
      </div>

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
    </div>
  )
}
