import { motion } from 'framer-motion'
import {
  Zap,
  Palette,
  Sparkles,
  Smartphone,
  Cpu,
  Layers,
  ArrowUpRight,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Smartphone,
    title: 'PWA & Mode Hors-Ligne',
    description:
      'Installez l’application sur smartphone, tablette ou ordinateur. Continuez à naviguer et apprendre même sans connexion internet grâce au cache intelligent.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Zap,
    title: 'Vitesse Éclair Vite 8',
    description:
      'Démarrage instantané du serveur et rafraîchissement des modules (HMR) en un claquement de doigts. Zéro latence pendant le développement.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: Palette,
    title: 'Tailwind CSS v4 Natif',
    description:
      'La nouvelle génération de Tailwind CSS avec compilation CSS native et gestion moderne des tokens sans surcharge inutile.',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Sparkles,
    title: 'Framer Motion Fluide',
    description:
      'Animations naturelles fondées sur la physique des ressorts, transitions de mise en page réactives et micro-gestuelles immersives.',
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: Cpu,
    title: 'React 19 & Architecture Moderne',
    description:
      'Exploite les dernières fonctionnalités de React 19 pour des performances de rendu optimisées et un cycle de vie moderne.',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Layers,
    title: 'Design System Modulaire',
    description:
      'Composants ultra-stylés avec CVA, Tailwind-Merge et Clsx. Typage TypeScript complet et icônes vectorielles nettes via Lucide.',
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    iconColor: 'text-violet-400',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Avantages Clés
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Conçu pour la performance et le confort utilisateur
          </h2>
          <p className="text-slate-400 text-base mt-3">
            Découvrez une fondation technique robuste, pensée pour propulser les applications et projets de formation vers les plus hauts standards du web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-7 rounded-3xl relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${feat.gradient} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mb-5 shadow-lg">
                      <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                      <span>{feat.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                    </h3>

                    <p className="text-slate-400 text-sm mt-2.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Prêt à l'emploi</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
