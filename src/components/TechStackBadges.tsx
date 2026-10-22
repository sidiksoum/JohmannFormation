import { motion } from 'framer-motion'
import {
  Code2,
  Cpu,
  Palette,
  Smartphone,
  Sparkles,
  BellRing,
  Package,
  Layers,
  Wand2,
} from 'lucide-react'

interface TechItem {
  name: string
  version: string
  description: string
  category: string
  icon: typeof Code2
  color: string
  badgeBg: string
}

const TECH_STACK: TechItem[] = [
  {
    name: 'React',
    version: 'v19.2',
    description: 'Le standard mondial avec React Server Components et optimisations de rendu de nouvelle génération.',
    category: 'Framework Core',
    icon: Code2,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
  },
  {
    name: 'Vite',
    version: 'v8.3',
    description: 'Le bundler le plus rapide du web, propulsé par Rolldown et le Hot Module Replacement instantané.',
    category: 'Build & Bundling',
    icon: Cpu,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
  },
  {
    name: 'Tailwind CSS',
    version: 'v4.3',
    description: 'Architecture CSS repensée à zéro avec import direct natif et compilation ultra-véloce.',
    category: 'Styling & Design',
    icon: Palette,
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
  },
  {
    name: 'Vite PWA Plugin',
    version: 'v2.0',
    description: 'Support complet Progressive Web App, manifest, gestion du cache Workbox et installation autonome.',
    category: 'PWA & Offline',
    icon: Smartphone,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  },
  {
    name: 'Framer Motion',
    version: 'v14.2',
    description: 'Moteur d’animations fluide basé sur la physique naturelle, transitions de pages et micro-interactions.',
    category: 'Animations UI',
    icon: Sparkles,
    color: 'text-pink-400',
    badgeBg: 'bg-pink-500/10 border-pink-500/20 text-pink-300',
  },
  {
    name: 'Lucide React',
    version: 'v1.57',
    description: 'Collection d’icônes vectorielles ultra-propres et cohérentes, standards des dashboards modernes.',
    category: 'Iconographie',
    icon: Wand2,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  },
  {
    name: 'Sonner',
    version: 'v2.0',
    description: 'Le système de toast notification le plus élégant, empilable et fluide du marché.',
    category: 'Notifications',
    icon: BellRing,
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
  },
  {
    name: 'Canvas Confetti',
    version: 'v1.9',
    description: 'Particules de célébration haute performance pour dynamiser l’engagement et la gamification.',
    category: 'Gamification',
    icon: Package,
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
  },
  {
    name: 'Clsx + Tailwind-Merge + CVA',
    version: 'Latest',
    description: 'Trio moderne pour la gestion sémantique des classes conditionnelles et des variantes de composants.',
    category: 'Design System Primitives',
    icon: Layers,
    color: 'text-violet-400',
    badgeBg: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
  },
]

export function TechStackBadges() {
  return (
    <section id="stack" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Stack Technique Installée
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Toutes les meilleures bibliothèques UI/UX
          </h2>
          <p className="text-slate-400 text-base mt-3">
            Chaque dépendance a été sélectionnée avec soin pour offrir une fluidité extrême,
            un design raffiné et un confort de développement inégalé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_STACK.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-slate-800/80 border border-white/10 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>
                      {item.version}
                    </span>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Vérifié & Opérationnel</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
