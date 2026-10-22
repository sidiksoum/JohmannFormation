import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Smartphone,
  Flame,
  Star,
  Activity,
  Layers,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { usePWA } from '@/hooks/usePWA'

type TabType = 'toasts' | 'confetti' | 'pwa' | 'components'

export function InteractivePlayground() {
  const [activeTab, setActiveTab] = useState<TabType>('toasts')
  const { isOnline, canInstall, isInstalled, installApp } = usePWA()

  // Confetti Presets
  const triggerFireworks = () => {
    const duration = 2.5 * 1000
    const end = Date.now() + duration

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      if (Date.now() > end) {
        return clearInterval(interval)
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#ec4899', '#38bdf8', '#eab308', '#a855f7'],
      })
    }, 200)

    toast.info('🎆 Feu d’artifice déclenché !', {
      description: 'Rafales aléatoires réparties sur l’écran.',
    })
  }

  const triggerStars = () => {
    confetti({
      particleCount: 80,
      spread: 120,
      shapes: ['star'],
      colors: ['#fde047', '#fbbf24', '#f59e0b', '#ffffff'],
      scalar: 1.2,
      origin: { y: 0.6 },
    })

    toast.success('⭐ Étoiles d’or propulsées !', {
      description: 'Particules sous forme d’étoiles géométriques.',
    })
  }

  const triggerSideCannons = () => {
    const end = Date.now() + 1.5 * 1000
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#6366f1', '#a855f7'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ec4899', '#38bdf8'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  // Toast Presets
  const showSuccessToast = () => {
    toast.success('Module validé avec succès !', {
      description: 'Votre progression a été enregistrée dans la mémoire locale.',
    })
  }

  const showInfoToast = () => {
    toast.info('Mise à jour disponible', {
      description: 'Johmann Formation v2.0 est prête pour l’installation.',
    })
  }

  const showWarningToast = () => {
    toast.warning('Connexion limitée détectée', {
      description: 'Le mode cache PWA maintient vos cours accessibles hors-ligne.',
    })
  }

  const showActionToast = () => {
    toast('Action requise', {
      description: 'Voulez-vous synchroniser les données maintenant ?',
      action: {
        label: 'Synchroniser',
        onClick: () => {
          toast.success('Données synchronisées !')
          triggerStars()
        },
      },
    })
  }

  const showPromiseToast = () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000))
    toast.promise(promise, {
      loading: 'Vérification du Service Worker PWA...',
      success: 'Service Worker opérationnel et à jour !',
      error: 'Erreur lors de la vérification.',
    })
  }

  return (
    <section id="playground" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Laboratoire Interactif
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Testez la puissance de la stack en direct
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Interagissez avec les micro-animations, les notifications toasts Sonner,
            les effets de particules et les mécanismes PWA.
          </p>
        </div>

        {/* Tab navigation headers */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl glass-panel border border-white/10 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('toasts')}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'toasts' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'toasts' && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Bell className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Toasts Sonner</span>
            </button>

            <button
              onClick={() => setActiveTab('confetti')}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'confetti' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'confetti' && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Canvas Confetti</span>
            </button>

            <button
              onClick={() => setActiveTab('pwa')}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'pwa' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'pwa' && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Smartphone className="w-4 h-4 relative z-10" />
              <span className="relative z-10">PWA & Offline</span>
            </button>

            <button
              onClick={() => setActiveTab('components')}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'components' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'components' && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Layers className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Design System</span>
            </button>
          </div>
        </div>

        {/* Tab contents */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'toasts' && (
              <motion.div
                key="toasts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-400" />
                    Notifications Toast Ultra-Fluides (Sonner)
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Sonner propose des micro-interactions haptiques visuelles, supporte les actions interactives,
                    les promesses asynchrones et l’empilement dynamique.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={showSuccessToast}
                    className="p-4 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Toast Succès</span>
                  </button>

                  <button
                    onClick={showInfoToast}
                    className="p-4 rounded-2xl bg-sky-950/30 hover:bg-sky-900/40 border border-sky-500/30 text-sky-300 font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <Info className="w-5 h-5 text-sky-400" />
                    <span>Toast Information</span>
                  </button>

                  <button
                    onClick={showWarningToast}
                    className="p-4 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>Toast Avertissement</span>
                  </button>

                  <button
                    onClick={showActionToast}
                    className="p-4 rounded-2xl bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span>Toast avec Action interactive</span>
                  </button>

                  <button
                    onClick={showPromiseToast}
                    className="p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span>Toast avec Promesse Asynchrone</span>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'confetti' && (
              <motion.div
                key="confetti"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    Moteur de Particules & Gamification (Canvas Confetti)
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Idéal pour féliciter les apprenants lors de la réussite d’un module ou de l’obtention d’une certification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={triggerFireworks}
                    className="p-6 rounded-2xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30 text-white text-left transition-all cursor-pointer"
                  >
                    <Flame className="w-6 h-6 text-pink-400 mb-3" />
                    <h4 className="font-bold text-sm">Feu d'Artifice Continu</h4>
                    <p className="text-slate-400 text-xs mt-1">Explosion de fusées multicolores étalée dans le temps.</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={triggerStars}
                    className="p-6 rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/30 text-white text-left transition-all cursor-pointer"
                  >
                    <Star className="w-6 h-6 text-amber-400 mb-3" />
                    <h4 className="font-bold text-sm">Pluie d'Étoiles Dorées</h4>
                    <p className="text-slate-400 text-xs mt-1">Formes customisées pour l'attribution de trophées.</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={triggerSideCannons}
                    className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-sky-600/20 border border-indigo-500/30 text-white text-left transition-all cursor-pointer"
                  >
                    <Sparkles className="w-6 h-6 text-indigo-400 mb-3" />
                    <h4 className="font-bold text-sm">Canons Latéraux</h4>
                    <p className="text-slate-400 text-xs mt-1">Jets croisés depuis les bords gauche et droit.</p>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeTab === 'pwa' && (
              <motion.div
                key="pwa"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    Progressive Web App (PWA) & État Hors-Ligne
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    L'application se comporte comme une application native : installable sur Windows, Mac, Android, iOS.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Diagnostics Réseau & Cache
                    </span>

                    <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                      <span className="text-slate-300">Statut Réseau</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full ${
                          isOnline
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isOnline ? 'Connecté (Online)' : 'Hors-ligne (Offline PWA)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                      <span className="text-slate-300">Mode Standalone (Installé)</span>
                      <span className="text-slate-200 font-mono">
                        {isInstalled ? 'Oui (Fenêtre native)' : 'Non (Navigateur web)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                      <span className="text-slate-300">Invite d'installation</span>
                      <span className="text-slate-200 font-mono">
                        {canInstall ? 'Prête à installer' : 'Déjà installée ou gérée par navigateur'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-300">Service Worker</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Vite-PWA AutoUpdate actif
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Tester l'installation PWA</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        Sur Google Chrome, Edge ou mobile, cliquez ci-dessous pour intégrer l’application
                        directement à votre système d'exploitation avec icône dédiée sur le bureau.
                      </p>
                    </div>

                    <button
                      onClick={installApp}
                      className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{isInstalled ? 'Application Déjà Installée' : 'Installer Johmann Formation (PWA)'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'components' && (
              <motion.div
                key="components"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sky-400" />
                    Composants du Design System (Tailwind v4 + CVA + Clsx)
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Exemple de variantes de boutons, badges, cartes glassmorphiques et micro-interactions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl glass-panel space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Variante Primaire</span>
                    <button className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors">
                      Bouton Primaire
                    </button>
                  </div>

                  <div className="p-4 rounded-xl glass-panel space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Variante Gradient</span>
                    <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-medium text-xs transition-opacity">
                      Bouton Dégradé
                    </button>
                  </div>

                  <div className="p-4 rounded-xl glass-panel space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Variante Outline Glass</span>
                    <button className="w-full py-2.5 rounded-lg border border-white/20 hover:bg-white/10 text-white font-medium text-xs transition-colors">
                      Bouton Vitré
                    </button>
                  </div>

                  <div className="p-4 rounded-xl glass-panel space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Badge Pills</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Nouveau
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Certifié
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        Pro
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
