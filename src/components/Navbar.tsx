import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Wifi, WifiOff, Sparkles, CheckCircle2, Menu, X, BookOpen, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { usePWA } from '@/hooks/usePWA'

export function Navbar() {
  const { isOnline, canInstall, isInstalled, installApp } = usePWA()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleInstallClick = async () => {
    if (isInstalled) {
      toast.info("L'application Johmann est déjà installée sur votre système.")
      return
    }
    if (!canInstall) {
      toast.info("Application PWA prête. Vous pouvez aussi l'installer via l'icône de la barre d'adresse de votre navigateur.", {
        duration: 4000,
      })
      return
    }
    const success = await installApp()
    if (success) {
      toast.success("Application installée avec succès !", {
        description: "Retrouvez Johmann Formation sur votre écran d'accueil.",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo_johmann.png"
            alt="Logo Johmann Formation"
            className="w-11 h-11 object-contain shrink-0"
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">Johmann</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 tracking-wide">Formation & Excellence UI/UX</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Fonctionnalités
          </a>
          <a
            href="#playground"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            Playground UI/UX
          </a>
          <a
            href="#stack"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            Stack Technique
          </a>
        </nav>

        {/* Action Controls & Indicators */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Live Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
            }`}
          >
            {isOnline ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span>En ligne</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                <WifiOff className="w-3.5 h-3.5" />
                <span>Hors ligne (PWA)</span>
              </>
            )}
          </div>

          {/* Install PWA Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInstallClick}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
              isInstalled
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-500/20 border-white/20'
            }`}
          >
            {isInstalled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>PWA Installée</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 animate-bounce" />
                <span>Installer PWA</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-white/10 bg-[#090d16]/95 backdrop-blur-xl px-4 py-4 space-y-3"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 hover:text-indigo-400"
            >
              Fonctionnalités
            </a>
            <a
              href="#playground"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 hover:text-pink-400"
            >
              Playground UI/UX
            </a>
            <a
              href="#stack"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 hover:text-purple-400"
            >
              Stack Technique
            </a>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isOnline
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isOnline ? 'Connecté (En ligne)' : 'Hors-ligne (Mode PWA actif)'}</span>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 text-white"
              >
                <Download className="w-4 h-4" />
                {isInstalled ? 'Application Déjà Installée' : 'Installer la PWA'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
