import { motion } from 'framer-motion'
import { Sparkles, Zap, ArrowRight, ShieldCheck, Smartphone } from 'lucide-react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

export function Hero() {
  const triggerConfetti = () => {
    // Launch multi-burst celebration
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#6366f1', '#a855f7', '#ec4899'],
    })
    fire(0.2, {
      spread: 60,
      colors: ['#38bdf8', '#818cf8', '#c084fc'],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })

    toast.success('🎉 Effet Confetti Déclenché !', {
      description: 'Bibliothèque canvas-confetti avec micro-interactions réactives.',
    })
  }

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Radiant ambient glow spheres */}
      <div className="glow-ambient w-96 h-96 bg-indigo-600 top-0 left-1/4" />
      <div className="glow-ambient w-80 h-80 bg-purple-600 top-20 right-1/4" />
      <div className="glow-ambient w-72 h-72 bg-pink-600 bottom-0 left-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-8 shadow-inner shadow-indigo-500/20"
        >
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Architecture Ultra-Premium • React 19 + Tailwind v4 + PWA</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="hidden sm:inline-block text-slate-300">Prêt pour la production</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]"
        >
          L'Excellence du Code.{' '}
          <span className="text-gradient-primary">
            L'Expérience UI/UX Ultime.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
        >
          Bienvenue dans votre nouvel environnement de travail pour{' '}
          <strong className="text-white font-semibold">Johmann Formation</strong>. Équipé des technologies
          modernes les plus avancées : PWA installable et hors-ligne, animations Framer Motion,
          Tailwind CSS v4 et notifications réactives.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={triggerConfetti}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-white/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Célébrer (Confetti UI)</span>
          </motion.button>

          <motion.a
            href="#playground"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl glass-panel hover:bg-slate-800/80 text-white font-semibold text-sm border border-white/10 transition-all cursor-pointer"
          >
            <span>Explorer le Playground</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </motion.a>
        </motion.div>

        {/* Highlights / Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="glass-card p-4 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Vite 8 & HMR</span>
            </div>
            <p className="text-white font-semibold text-sm">Démarrage instantané</p>
            <p className="text-slate-400 text-xs mt-0.5">Moins de 50ms par reload</p>
          </div>

          <div className="glass-card p-4 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-pink-400 mb-1">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">PWA Intégrée</span>
            </div>
            <p className="text-white font-semibold text-sm">Offline & Standalone</p>
            <p className="text-slate-400 text-xs mt-0.5">Installable bureau & mobile</p>
          </div>

          <div className="glass-card p-4 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Tailwind CSS v4</span>
            </div>
            <p className="text-white font-semibold text-sm">Moteur ultra-léger</p>
            <p className="text-slate-400 text-xs mt-0.5">Sans fichier de config lourd</p>
          </div>

          <div className="glass-card p-4 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">TypeScript</span>
            </div>
            <p className="text-white font-semibold text-sm">Typage Strict</p>
            <p className="text-slate-400 text-xs mt-0.5">Qualité de code maximale</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
